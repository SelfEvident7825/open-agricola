import { ALL_ANIMAL_KEYS, type AnimalKey } from './animals';
type ZoneCapacity = {
    capacity: number;
    reservedCapacity?: Partial<Record<AnimalKey, number>>;
};
/** Some capacity can only be occupied by a particular species. */
export const animalZoneCapacity = (zone: ZoneCapacity, counts: Partial<Record<AnimalKey, number>>): number => Math.max(0, zone.capacity - ALL_ANIMAL_KEYS.reduce((sum, animal) => sum + Math.max(0, (zone.reservedCapacity?.[animal] ?? 0) - (counts[animal] ?? 0)), 0));
