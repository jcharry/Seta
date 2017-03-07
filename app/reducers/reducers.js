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

export const gameObjectsReducer = (state = {}, action) => {
    switch (action.type) {
        case 'ADD_OBJECT':
            return {
                ...state,
                [action.obj.id]: action.obj
            };
        case 'REMOVE_OBJECT': {
            return Object.keys(state).reduce((acc, key) => {
                // Ignore object that matches key we wnat to remove
                if (parseInt(key, 10) === action.id) {
                    return acc;
                }

                // Copy over state
                acc[key] = state[key];  //eslint-disable-line
                return acc;
            }, {});
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

export const interactionPanelOpenReducer = (state = false, action) => {
    switch (action.type) {
        case 'TOGGLE_INTERACTION_PANEL':
            return !state;
        case 'OPEN_INTERACTION_PANEL':
            return true;
        case 'CLOSE_INTERACTION_PANEL':
            return false;
        default:
            return state;
    }
};

export const behaviorsReducer = (state = [], action) => {
    switch (action.type) {
        case 'ADD_COLLISION_BEHAVIOR':
            return [
                ...state,
                action.collision
            ];
        default:
            return state;
    }
};
