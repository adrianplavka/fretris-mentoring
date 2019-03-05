
import * as Redux from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createLogger } from 'redux-logger';
import { AppState, AppReducer, AppInitialState } from './app';
import { PlaygroundState, PlaygroundReducer, PlaygroundInitialState } from './playground';

import { isDevMode } from '../utils/dev';

export interface RootState {
    app: AppState,
    playground: PlaygroundState
};

export const initialState: RootState = {
    app: AppInitialState,
    playground: PlaygroundInitialState
};

// Initialize the Redux store 
// (w/ Redux Dev Tools & logger, if in development mode).
export const initStore = (): Redux.Store<RootState> => {
    return Redux.createStore(
        Redux.combineReducers<RootState>({ app: AppReducer, playground: PlaygroundReducer }),
        isDevMode
            ? composeWithDevTools(Redux.applyMiddleware(createLogger()))
            : undefined
    );
};

export const store = initStore();
