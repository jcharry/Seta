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
                let stateToActivate = action.id;
                if (typeof stateToActivate === 'number') {
                    stateToActivate = Number(stateToActivate).toString();
                }
                newState[id] = (stateToActivate === id);
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
        case 'UPDATE_GAME_OBJECT': {
            let newState = Object.keys(state).reduce((acc, curr) => {
                acc[curr] = state[curr];

                // Find object that matches passed in id
                if (parseInt(curr, 10) === action.id) {
                    Object.keys(action.properties).forEach(key => {
                        let p = action.properties[key];
                        if (p && acc[curr][key]) {
                            acc[curr][key] = action.properties[key];
                        }
                    });
                }
                return acc;
            }, {});
            console.log(newState);
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
        case 'CLEAR_PRIMATIVES_PANEL_SELECTION':
            return '';
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

export const stylePanelOpenReducer = (state = false, action) => {
    switch (action.type) {
        case 'TOGGLE_STYLE_PANEL':
            return !state;
        case 'OPEN_STYLE_PANEL':
            return true;
        case 'CLOSE_STYLE_PANEL':
            return false;
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
            const gs = action.gameState;
            const currFollow = state[gs];
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

export const floatingTextReducer = (state = {}, action) => {
    switch (action.type) {
        case 'ADD_FLOATING_TEXT': {
            const newState = { ...state };
            newState[action.textObj.id] = action.textObj;
            return newState;
        }
        case 'REMOVE_FLOATING_TEXT': {
            return Object.keys(state).reduce((acc, curr) => {
                if (action.id !== parseInt(curr, 10)) {
                    acc[curr] = state[curr];  //eslint-disable-line
                }
                return acc;
            }, {});
        }
        case 'UPDATE_FLOATING_TEXT': {
            return Object.keys(state).reduce((acc, curr) => {
                acc[curr] = state[curr];            //eslint-disable-line
                if (action.id === parseInt(curr, 10)) {
                    acc[curr].text = action.text;   //eslint-disable-line
                }
                return acc;
            }, {});
        }
        default:
            return state;
    }
};
