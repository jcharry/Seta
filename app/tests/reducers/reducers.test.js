/* global describe it beforeEach */
import expect from 'expect';
import * as reducers from 'app/reducers/reducers';

import df from 'deep-freeze-strict';

describe('Reducers', () => {
    it('should add body', () => {
        const action = {
            type: 'ADD_BODY',
            body: {
                id: 12,
                mass: 1,
                pos: 2
            }
        };

        const newState = reducers.bodiesReducer(df({}), df(action));

        expect(Object.keys(newState).length).toEqual(1);
        expect(newState[12].mass).toEqual(1);
    });

    it('should remove body', () => {
        const state = {
            7: { id: 7, mass: 1, pos: 2 },
            3: { id: 3, mass: 1, pos: 2 },
            12: { id: 12, mass: 1, pos: 2 }
        };

        const action = {
            type: 'REMOVE_BODY',
            id: 3
        };

        console.log(state);
        const newState = reducers.bodiesReducer(df(state), df(action));
        console.log(newState);
        expect(newState[3]).toNotExist();
    });
});
