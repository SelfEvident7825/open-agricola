import { describe, expect, it } from 'vitest';
import { installOfficialCardRegistry } from './card-environment';
import { classicMinors, classicOccupations } from '../catalog';
import { getCardEffect } from '../card-effects';
import { createInitialState, normalizeState } from '../../session/state-bootstrap';
import { getExchangeCatalog, executeExchangeBatch, validateExchangeBatch } from '../../actions/effects/exchange';
import { normalizeFutureSchedule } from '../../actions/future-schedule';
import { breed } from '../../actions/effects/breed';
import { countOccupations } from '../helpers/prerequisites';
import { availableWorkers, familySize } from '../../domain/player';
import { computeAnimalZones, canAccommodateAnimalTotals, enforceAnimalCapacity } from '../../domain/animal-zones';
import { getAssignedAnimalsByType, subtractAnimalsFromBoard } from '../../domain/animals';
import { getCardStack } from '../helpers/card-state';
import type { Resource, ActionFlow, ScoreCategoryResult } from '../../contract/types';
installOfficialCardRegistry();
const cards = [...classicMinors, ...classicOccupations];
const id = (n: number) => cards.find(c => c.id.startsWith(`OLD_E${n}_`))!.id;
const setup = (numbers: number[] = []) => {
    const state = createInitialState(42, { playerCount: 4, gameEdition: 'classic', ordinaryCardDeckSeed: 42 });
    const player = state.players[0]!;
    for (const p of state.players) {
        p.minorPlayed = [];
        p.occupationPlayed = [];
        p.improvements = [];
        p.cardStates = {};
        for (const k of Object.keys(p.resources))
            p.resources[k as keyof Resource] = 0;
    }
    for (const n of numbers) {
        const card = id(n);
        (classicOccupations.some(c => c.id === card) ? player.occupationPlayed : player.minorPlayed).push(card);
    }
    return { state, player };
};
const flowGains = (flow: ActionFlow | void): Partial<Resource> => {
    if (!flow)
        return {};
    if (flow.type === 'leaf')
        return flow.actionId === 'gain' ? flow.params as Partial<Resource> : {};
    const result: Partial<Resource> = {};
    for (const child of flow.children)
        for (const [key, value] of Object.entries(flowGains(child)))
            result[key as keyof Resource] = (result[key as keyof Resource] ?? 0) + (value ?? 0);
    return result;
};
const score = (n: number, configure: (data: ReturnType<typeof setup>) => void, categories: ScoreCategoryResult[] = []) => {
    const data = setup([n]);
    configure(data);
    return getCardEffect(id(n))!.computeBonusScore!(data.state, data.player, { categories });
};
describe('classic E printed rules — four-player states', () => {
    it('all 126 old E identities are playable, with unique ids and preserved artwork', () => {
        const deck = cards.filter(c => c.deck === 'E');
        expect(deck).toHaveLength(126);
        expect(new Set(deck.map(c => c.id)).size).toBe(126);
        for (const c of deck) {
            expect(c.implemented, c.id).toBe(true);
            expect(c.artUrl, c.id).toMatch(/^\/card-art\/classic\/E/);
        }
    });
    const future: Array<[
        number,
        number,
        number[],
        Partial<Resource>
    ]> = [
        [24, 11, [12, 13, 14], { food: 2 }], [31, 8, [9, 11, 13], { food: 1 }], [43, 6, [8, 9, 10, 11, 12, 13, 14], { food: 1 }],
        [45, 9, [10, 12, 14], { wood: 1 }], [46, 8, [11, 14], { grain: 1 }], [48, 3, [4, 5, 6], { reed: 1 }],
        [57, 10, [11, 12, 13, 14], { food: 1 }], [187, 12, [13, 14], { clay: 1 }],
        [201, 3, [8, 12], { cattle: 1 }], [204, 12, [13, 14], { sheep: 1 }], [205, 11, [12, 13, 14], { reed: 1 }],
    ];
    it.each(future)('E%i schedules only future printed rounds from round %i', (n, round, rounds, resources) => {
        const { state, player } = setup([n]);
        state.round = round;
        getCardEffect(id(n))!.onBuy!(state, player);
        const entries = state.pendingFutureMeeples.flatMap(request => normalizeFutureSchedule(state.round, request));
        expect(entries.map(e => e.round)).toEqual(rounds);
        for (const e of entries)
            expect(e.resources).toEqual(resources);
    });
    const exchanges: Array<[
        number,
        'anytime' | 'harvest' | 'bake-bread',
        Partial<Resource>,
        Partial<Resource>
    ]> = [
        [17, 'anytime', { grain: 1 }, { food: 2 }], [158, 'anytime', { wood: 1 }, { food: 1 }], [209, 'anytime', { stone: 1 }, { food: 2 }],
        [185, 'anytime', { clay: 2 }, { stone: 1 }], [185, 'anytime', { clay: 3 }, { stone: 2 }],
        [186, 'anytime', { clay: 2 }, { sheep: 1 }], [186, 'anytime', { clay: 2 }, { reed: 1 }], [186, 'anytime', { clay: 3 }, { boar: 1 }], [186, 'anytime', { clay: 3 }, { stone: 1 }], [186, 'anytime', { clay: 4 }, { cattle: 1 }],
        [171, 'anytime', { wood: 3 }, { stone: 1 }], [171, 'anytime', { reed: 2 }, { clay: 1 }], [171, 'anytime', { stone: 2 }, { wood: 1 }],
        [183, 'harvest', { reed: 1 }, { food: 3 }], [214, 'harvest', { clay: 1 }, { food: 2 }], [154, 'harvest', { grain: 1 }, { food: 3 }],
        [20, 'anytime', { sheep: 1 }, { food: 1 }], [20, 'anytime', { boar: 1 }, { food: 2 }], [20, 'anytime', { cattle: 1 }, { food: 3 }], [20, 'anytime', { vegetable: 1 }, { food: 2 }],
        [20, 'bake-bread', { grain: 1 }, { food: 2 }], [27, 'bake-bread', { grain: 1 }, { food: 3 }], [14, 'bake-bread', { grain: 1 }, { food: 5 }],
    ];
    it.each(exchanges)('E%i %s pays %j and receives %j', (n, window, paid, gained) => {
        const { state, player } = setup([n]);
        if (window === 'harvest')
            state.roundPhase = 'harvest';
        Object.assign(player.resources, paid);
        const recipe = getExchangeCatalog({ state, player, windows: [window] }).find(t => t.sourceId === id(n) && JSON.stringify(t.from) === JSON.stringify(paid) && JSON.stringify(t.to) === JSON.stringify(gained));
        expect(recipe).toBeDefined();
        const entry = { trade: recipe!.trade, count: 1, ...(window === 'harvest' ? { harvestRound: state.round } : {}) };
        const result = executeExchangeBatch({ state, player, entries: [entry], reorganizeAnimals: false });
        expect(result.type).toBe('ok');
        for (const key of Object.keys(paid))
            expect(player.resources[key as keyof Resource]).toBe(0);
        expect(player.resources).toMatchObject(gained);
        expect(validateExchangeBatch({ state, player, entries: [entry] })).toBe(false);
    });
    it.each([183, 214, 154])('E%i permits at most one harvest exchange and no work-time exchange', n => {
        const { state, player } = setup([n]);
        Object.assign(player.resources, { reed: 3, clay: 3, grain: 3 });
        expect(getExchangeCatalog({ state, player, windows: ['anytime'] }).filter(e => e.sourceId === id(n))).toHaveLength(0);
        state.roundPhase = 'harvest';
        const recipe = getExchangeCatalog({ state, player, windows: ['harvest'] }).find(e => e.sourceId === id(n))!;
        expect(validateExchangeBatch({ state, player, entries: [{ trade: recipe.trade, count: 2, harvestRound: state.round }] })).toBe(false);
    });
    it.each([[4, 0], [5, 1], [6, 3], [7, 5], [8, 7], [9, 9], [12, 9]])('E197 counts %i improvements for %i points', (count, points) => {
        expect(score(197, ({ player }) => { player.minorPlayed = Array.from({ length: count }, (_, i) => 'fixture-' + i); })).toBe(points);
    });
    it.each([[6, 1], [7, 2], [8, 3], [9, 4], [10, 4]])('E23 scores %i fenced spaces at the old threshold', (tiles, points) => {
        expect(score(23, ({ player }) => { player.pastures = [{ id: 'yard', tiles: Array.from({ length: tiles }, (_, i) => ({ row: Math.floor(i / 5), col: i % 5 })), animalType: null, animalCount: 0 }]; })).toBe(points);
    });
    it.each([[21, 'stone', 5, 5], [172, 'stone', 5, 5], [177, 'wood', 5, 5], [177, 'clay', 5, 0], [28, 'clay', 2, 1], [28, 'stone', 2, 2], [173, 'stone', 2, 3], [173, 'wood', 2, 0]] as const)('E%i scores %s rooms', (n, houseType, rooms, expected) => {
        expect(score(n, ({ player }) => { player.houseType = houseType; player.rooms = rooms; })).toBe(expected);
    });
    it('E170 accepts ties in all three animals; a single lost animal comparison removes the bonus', () => {
        expect(score(170, () => { })).toBe(3);
        expect(score(170, ({ state }) => { state.players[1]!.resources.boar = 1; })).toBe(0);
    });
    it('E165 cancels category losses but not unused-space or begging penalties', () => {
        const categories = ['fields', 'pastures', 'grains', 'vegetables', 'sheeps', 'boars', 'cattles', 'empty', 'begging'].map(key => ({ key, total: -1 })) as ScoreCategoryResult[];
        expect(score(165, () => { }, categories)).toBe(7);
    });
    it('E148 counts as two occupations for requirements and E174 scores both if played later', () => {
        const { state, player } = setup([174]);
        getCardEffect(id(174))!.onBuy!(state, player);
        player.occupationPlayed.push(id(148));
        expect(countOccupations(player)).toBe(3);
        expect(getCardEffect(id(174))!.computeBonusScore!(state, player, { categories: [] })).toBe(2);
    });
    it('E184 has the old eight-item shop order, with reed bought first', () => {
        const { state, player } = setup([184]);
        getCardEffect(id(184))!.onBuy!(state, player);
        expect(getCardStack(player, id(184))).toEqual(['vegetable', 'reed', 'clay', 'wood', 'vegetable', 'stone', 'grain', 'reed']);
    });
    it.each([[3, 1], [4, 2], [7, 2]])('E203 breeds from %i sheep into %i offspring per breeding phase', (sheep, count) => {
        const { state, player } = setup([203]);
        player.resources.sheep = sheep;
        player.resources.boar = 2;
        player.pastures = [{ id: 'breed', tiles: [{ row: 0, col: 1 }, { row: 0, col: 2 }], animalType: null, animalCount: 0 }];
        expect(breed(state, player, { sourceCard: 'harvest' }).breedSummary.resources).toEqual({ sheep: count, boar: 1 });
        player.resources.sheep = 4;
        expect(breed(state, player, { sourceCard: 'test-card', animalTypes: ['sheep'] }).breedSummary.resources).toEqual({ sheep: 2 });
    });
    it.each([9, 10, 11, 12, 13])('E198 holds one offspring only in rounds 10/12 (round %i)', round => {
        const { state, player } = setup([198]);
        state.round = round;
        state.players[1]!.workers[2]!.isActive = true;
        state.players[2]!.workers[2]!.isActive = true;
        state.players[2]!.workers[3]!.isActive = true;
        getCardEffect(id(198))!.onWorkStart!(state, player);
        expect(state.players.map(p => availableWorkers(state, p).length)).toEqual([2, [10, 12].includes(round) ? 2 : 3, [10, 12].includes(round) ? 3 : 4, 2]);
        expect(state.players.map(familySize)).toEqual([2, 3, 4, 2]);
        getCardEffect(id(198))!.onReturnHome!(state, player);
        expect(state.players.map(p => availableWorkers(state, p).length)).toEqual([2, 3, 4, 2]);
    });
    it.each([[2, 0], [3, 1], [4, 1], [5, 2], [8, 2]])('E51 real harvest yields food for %i sheep', (sheep, food) => {
        const { state, player } = setup([51]);
        player.resources.sheep = sheep;
        expect(flowGains(getCardEffect(id(51))!.onHarvestFieldPhase!(state, player)).food ?? 0).toBe(food);
        expect(getCardEffect(id(51))!.onAfterReap).toBeUndefined();
    });
    it('E53 counts assigned sheep and cattle, including a mixed pasture', () => {
        const { state, player } = setup([53, 216]);
        player.pastures = [{ id: 'mix', tiles: [{ row: 0, col: 1 }, { row: 0, col: 2 }, { row: 0, col: 3 }], animalType: null, animalCount: 5, animalCounts: { sheep: 3, cattle: 2 } }];
        expect(flowGains(getCardEffect(id(53))!.onHarvestFieldPhase!(state, player))).toEqual({ food: 2 });
    });
    it('E29 additional capacity is sheep-only in pastures and unfenced stables', () => {
        const { state, player } = setup([29]);
        player.pastures = [{ id: 'yard', tiles: [{ row: 0, col: 1 }], animalType: null, animalCount: 0 }];
        player.stableTiles = [{ row: 2, col: 2 }];
        expect(canAccommodateAnimalTotals(state, player, { sheep: 7 })).toBe(true);
        expect(canAccommodateAnimalTotals(state, player, { boar: 5 })).toBe(false);
        expect(canAccommodateAnimalTotals(state, player, { boar: 4 })).toBe(true);
    });
    it('E58 mixed cage combines with E59 and reserves E29 extra capacity for sheep', () => {
        const { state, player } = setup([58, 59, 29]);
        const zone = computeAnimalZones(player, state).find(z => z.cardId === id(58))!;
        expect(zone).toMatchObject({ capacity: 6, reservedCapacity: { sheep: 2 }, allowedAnimalType: null });
        expect(canAccommodateAnimalTotals(state, player, { sheep: 2, boar: 3, cattle: 2 })).toBe(true);
        expect(canAccommodateAnimalTotals(state, player, { boar: 6, cattle: 1 })).toBe(false);
    });
    it('E216 persists mixed animals through normalization, capacity enforcement and payment', () => {
        const { state, player } = setup([216]);
        player.resources.sheep = 2;
        player.resources.boar = 1;
        player.resources.cattle = 1;
        player.pastures = [{ id: 'mix', tiles: [{ row: 0, col: 1 }, { row: 0, col: 2 }], animalType: null, animalCount: 4, animalCounts: { sheep: 2, boar: 1, cattle: 1 } }];
        enforceAnimalCapacity(player, state);
        expect(getAssignedAnimalsByType(player)).toMatchObject({ sheep: 2, boar: 1, cattle: 1 });
        const restored = normalizeState(JSON.parse(JSON.stringify(state)));
        expect(restored.players[0]!.pastures[0]!.animalCounts).toEqual({ sheep: 2, boar: 1, cattle: 1 });
        subtractAnimalsFromBoard(player, { sheep: 2, boar: 1 }, state);
        expect(player.resources).toMatchObject({ sheep: 0, boar: 0, cattle: 1 });
        expect(player.pastures[0]).toMatchObject({ animalType: 'cattle', animalCount: 1 });
    });
    it('E208 has no revised immediate stable-building reward', () => { expect(getCardEffect(id(208))!.onBuy).toBeUndefined(); });
});
import { playerBoard } from '../../domain/player-board';
import { computeHarvestFeedingRequirement } from '../../actions/helpers/harvest-feeding-requirement';
describe('classic E — feeding and fencing capacities', () => {
    it.each([[2, 0, 4], [3, 0, 5], [4, 0, 6], [5, 0, 7], [3, 1, 5], [5, 1, 7], [5, 2, 7]])('E181 feeds %i family members (%i newborns) for %i food', (size, newborns, food) => {
        const { state, player } = setup([181]);
        player.workers.forEach((w, i) => { w.isActive = i < size; w.isNewborn = i >= size - newborns && i < size; });
        expect(computeHarvestFeedingRequirement(state, player)).toBe(food);
    });
    it('E217 awards all tied players, with Academic counting twice', () => {
        const { state, player } = setup([217]);
        player.occupationPlayed.push(id(148));
        state.players[1]!.occupationPlayed = [id(147), id(148)];
        state.players[2]!.occupationPlayed = [id(147)];
        expect(getCardEffect(id(217))!.computeSharedPostScore!(state, player)).toEqual([{ playerId: player.id, score: 3 }, { playerId: state.players[1]!.id, score: 3 }]);
    });
    it.each([[5, 4], [6, 3], [8, 3], [9, 2], [11, 2], [12, 1], [14, 0]])('E217 played in round %i grants %i wood', (round, wood) => {
        const { state, player } = setup([217]);
        state.round = round;
        expect(flowGains(getCardEffect(id(217))!.onBuy!(state, player)).wood ?? 0).toBe(wood);
    });
    it('E216 and E29 preserve four sheep and two boars when another pasture is fenced', () => {
        const { state, player } = setup([216, 29]);
        player.resources.wood = 20;
        player.resources.sheep = 4;
        player.resources.boar = 2;
        const edges = ['H-0-1', 'H-0-2', 'H-1-1', 'H-1-2', 'V-0-1', 'V-0-3'];
        player.fenceSegments = edges.map(edge => ({ edge, type: 'fence', source: { kind: 'own', ownerPlayerId: player.id } }));
        player.pastures = [{ id: 'old', tiles: [{ row: 0, col: 1 }, { row: 0, col: 2 }], animalType: null, animalCount: 6, animalCounts: { sheep: 4, boar: 2 } }];
        const before = JSON.stringify(state);
        const result = playerBoard(state, 0).farmyard.canBuildFence({ edges: [...edges, 'H-1-3', 'H-0-3', 'V-0-4'], options: { preserveAnimalTotals: true } });
        expect(result.ok, result.ok ? '' : result.error.code).toBe(true);
        if (!result.ok)
            return;
        expect(result.player.resources).toMatchObject({ sheep: 4, boar: 2 });
        expect(result.player.pastures.find(p => p.tiles?.length === 2)?.animalCounts).toEqual({ sheep: 4, boar: 2 });
        expect(JSON.stringify(state)).toBe(before);
    });
});
