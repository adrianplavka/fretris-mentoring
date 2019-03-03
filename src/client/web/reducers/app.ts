
import * as Redux from 'redux';

import * as Action from '../actions/app';

export interface AppState {
    context: "Auth" | "SoloPlayground" | "DuoPlayground";
    username: str;
    id: str;
}

export const AppInitialState: AppState = {
    context: "Auth",
    username: "",
    id: ""
};

export function AppReducer(state = AppInitialState, action: Redux.AnyAction) {
    switch (action.type) {
        case Action.CONTEXT_AUTH:
            return { ...state, context: "Auth" };
        case Action.CONTEXT_PLAYGROUND_SOLO:
            return { ...state, context: "SoloPlayground" };
        case Action.CONTEXT_PLAYGROUND_DUO:
            return { ...state, context: "DuoPlayground", username: action.payload.username, id: action.payload.id };
        default:
            return state;
    }
}
