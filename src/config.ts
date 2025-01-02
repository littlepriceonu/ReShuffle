/**
 * Example for how you may want to setup your configuration.
 */

// ! BRICKS ANY VUE FILE WHEN IMPORTED 
// do NOT use (dont ask me why something about not being initilized)

import { setupConfig } from './main';

export const cfg = setupConfig({
    queue: <{id: string}[]>[],
});

export function useConfig() {
    return cfg.value;
}