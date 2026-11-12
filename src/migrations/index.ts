import * as migration_20261110_181818_initial from './20261110_181818_initial';

export const migrations = [
  {
    up: migration_20261110_181818_initial.up,
    down: migration_20261110_181818_initial.down,
    name: '20261110_181818_initial'
  },
];
