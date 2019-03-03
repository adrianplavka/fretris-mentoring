
import * as Redux from 'redux';

import * as Action from '../actions/playground';

export interface PlaygroundState {
    score: number;
    pause: bool;
}

export const PlaygroundInitialState: PlaygroundState = {
    score: 0, pause: false
};

export function PlaygroundReducer(state = PlaygroundInitialState, action: Redux.AnyAction) {
    switch (action.type) {
        case Action.PLAYGROUND_SCORE:
            return { ...state, score: action.payload };
        case Action.PLAYGROUND_PAUSE:
            return { ...state, pause: action.payload };
        default:
            return state;
    }
}


