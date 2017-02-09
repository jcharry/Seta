/* global window */
import * as redux from 'redux';
import thunk from 'redux-thunk';

import { loadingReducer, selectedObjectReducer, isPlayingReducer, bodiesReducer } from '../reducers/reducers';

const configure = (initialState = {}) => {
    const reducer = redux.combineReducers({
        isLoading: loadingReducer,
        selectedObject: selectedObjectReducer,
        isPlaying: isPlayingReducer,
        bodies: bodiesReducer
    });

    const store = redux.createStore(reducer, initialState, redux.compose(
        redux.applyMiddleware(thunk),
        window.devToolsExtension ? window.devToolsExtension() : f => f
    ));

    // TODO: Don't forget to remove this later! Purely for dev reasons
    window.store = store;
    return store;
};

export default configure;
