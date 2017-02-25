export const gameStatesReducer = (state = {}, action) => {
    switch (action.type) {
        case 'ADD_GAME_STATE': {
            const newState = {};
            Object.keys(state).forEach(id => {
                newState[id] = false;
            });
            newState[action.id] = true;
            return newState;
        }
        case 'ACTIVATE_GAME_STATE': {
            const newState = {};
            Object.keys(state).forEach(id => {
                newState[id] = (action.id === id);
            });
            return newState;
            // return Object.keys(state).map(id => {
            //     const newState = { ...gameState };
            //     if (gameState.id === action.id) {
            //         newState.active = true;
            //     } else {
            //         newState.active = false;
            //     }
            //     return newState;
            // });
        }
        default:
            return state;
    }
};

export const bodiesReducer = (state = {}, action) => {
    switch (action.type) {
        case 'ADD_BODY':
            return {
                ...state,
                [action.body.id]: action.body
            };
        case 'REMOVE_BODY': {
            const newState = {};
            console.log(state);
            let counter = 0;
            Object.keys(state).forEach(key => {
                console.log(counter++);
                if (parseInt(key, 10) !== action.id) {
                    newState[state[key].id] = state[key];
                }
            });
            console.log('new state', newState);
            return newState;
        }
        case 'CLEAR_BODIES': {
            return {};
        }
        default:
            return state;
    }
};

export const isPlayingReducer = (state = false, action) => {
    switch (action.type) {
        case 'SET_IS_PLAYING':
            return action.isPlaying;
        case 'TOGGLE_IS_PLAYING':
            return !state;
        default:
            return state;
    }
};

export const primativesPanelSelectionReducer = (state = '', action) => {
    switch (action.type) {
        case 'SET_PRIMATIVES_PANEL_SELECTION':
            return action.id;
        default:
            return state;
    }
};

export const selectedObjectReducer = (state = -1, action) => {
    switch (action.type) {
        case 'SET_SELECTED_OBJECT':
            return action.id;
        case 'CLEAR_SELECTED_OBJECT':
            return -1;
        default:
            return state;
    }
};

export const loadingReducer = (state = false, action) => {
    switch (action.type) {
        case 'START_LOADING':
            return true;
        case 'STOP_LOADING':
            return false;
        default:
            return state;
    }
};

export const needsRestartReducer = (state = false, action) => {
    switch (action.type) {
        case 'NEEDS_RESTART':
            return action.shouldRestart;
        default:
            return state;
    }
};

export const needsNewGameStateReducer = (state = false, action) => {
    switch (action.type) {
        case 'NEEDS_NEW_GAME_STATE':
            return action.needsNewState;
        default:
            return state;
    }
};
export const propertiesPanelNeedsRefreshReducer = (state = false, action) => {
    switch (action.type) {
        case 'PROPERTIES_PANEL_NEEDS_REFRESH':
            return action.needsRefresh;
        default:
            return state;
    }
};
