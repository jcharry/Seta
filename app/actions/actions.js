// import axios from 'axios';

export const addBody = body => ({
    type: 'ADD_BODY',
    body
});
export const removeBody = id => ({
    type: 'REMOVE_BODY',
    id
});

export const clearBodies = () => ({
    type: 'CLEAR_BODIES'
});

export const setIsPlaying = status => ({
    type: 'SET_IS_PLAYING',
    isPlaying: status
});

export const toggleIsPlaying = () => ({
    type: 'TOGGLE_IS_PLAYING'
});

export const setSelectedObject = id => ({
    type: 'SET_SELECTED_OBJECT',
    id
});

export const clearSelectedObject = () => ({
    type: 'CLEAR_SELECTED_OBJECT'
});

export const startLoading = function() {
    return {
        type: 'START_LOADING'
    };
};

export const stopLoading = function() {
    return {
        type: 'STOP_LOADING'
    };
};

export const setPrimativesPanelSelection = id => ({
    type: 'SET_PRIMATIVES_PANEL_SELECTION',
    id
});

export const needsRestart = shouldRestart => ({
    type: 'NEEDS_RESTART',
    shouldRestart
});

export const addGameState = id => ({
    type: 'ADD_GAME_STATE',
    id
});
export const needsNewGameState = needsNewState => ({
    type: 'NEEDS_NEW_GAME_STATE',
    needsNewState
});

export const activateGameState = id => ({
    type: 'ACTIVATE_GAME_STATE',
    id
});
