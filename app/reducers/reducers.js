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

export const behaviorPanelOpenReducer = (state = false, action) => {
    switch (action.type) {
        case 'TOGGLE_BEHAVIOR_PANEL':
            return !state;
        case 'OPEN_BEHAVIOR_PANEL':
            return true;
        case 'CLOSE_BEHAVIOR_PANEL':
            return false;
        default:
            return state;
    }
};

// TODO: Prevent duplicate behaviors
export const behaviorsReducer = (state = {}, action) => {
    switch (action.type) {
        case 'ADD_GAME_STATE': {
            return {
                ...state,
                [action.id]: []
            };
        }
        case 'ADD_CONTROL_BEHAVIOR':
        case 'ADD_COLLISION_BEHAVIOR': {
            return {
                ...state,
                [action.id]: state[action.id].concat(action.behavior)
            };
        }
        case 'REMOVE_BEHAVIOR': {
            return {
                ...state,
                [action.gameState]: state[action.gameState].filter(behavior => !(behavior.id === action.id))
            };
        }
        default:
            return state;
    }
};

export const scoreReducer = (state = 0, action) => {
    switch (action.type) {
        case 'ADD_SCORE':
            return state + action.score;
        case 'RESET_SCORE':
            return 0;
        default:
            return state;
    }
};

export const followBodiesReducer = (state = {}, action) => {
    switch (action.type) {
        case 'CHANGE_FOLLOW_BODY': {
            let gs = action.gameState;
            let currFollow = state[gs];
            let follow;
            if (currFollow === action.id) {
                follow = -1;
            } else {
                follow = action.id;
            }
            return {
                ...state,
                [action.gameState]: follow
            };
        }
        case 'CLEAR_FOLLOW_BODY': {
            return {
                ...state,
                [action.gameState]: -1
            };
        }
        default:
            return state;
    }
};
