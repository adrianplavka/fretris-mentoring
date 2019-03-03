
export const PLAYGROUND_SCORE = 'PLAYGROUND_SCORE';
export const PLAYGROUND_PAUSE = 'PLAYGROUND_PAUSE';

export const setScore = (score: number) => {
    return {
        type: PLAYGROUND_SCORE,
        payload: score
    };
};

export const setPause = (pause: bool) => {
    return {
        type: PLAYGROUND_PAUSE,
        payload: pause
    };
};
