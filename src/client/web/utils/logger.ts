
import { isDevMode } from './dev';

// Simple logging for in development mode.
export const log = (ctx: str, msg: str): void => {
    isDevMode ? console.log("<>", "@", ctx, ">", msg) : null;
};
