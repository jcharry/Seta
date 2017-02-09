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
