ALTER TABLE rooms ADD COLUMN game_edition TEXT NOT NULL DEFAULT 'revised' CHECK (game_edition IN ('revised', 'classic'));
