
import * as React from 'react';

import { initStore, initialState } from './reducers/store';

describe("Web Client", () => {
    it("should initialize store", () => {
        expect(initStore().getState()).toEqual(initialState);
    });
});
