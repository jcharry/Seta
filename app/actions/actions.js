// import axios from 'axios';

export const addBody = body => ({
    type: 'ADD_OBJECT',
    body
});
export const addGameObject = obj => ({
    type: 'ADD_OBJECT',
    obj
});

export const removeBody = id => ({
    type: 'REMOVE_BODY',
    id
});

export const removeGameObject = id => ({
    type: 'REMOVE_OBJECT',
    id
});

export const updateGameObject = (id, properties) => ({
    type: 'UPDATE_GAME_OBJECT',
    id,
    properties
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

export const clearPrimativesPanelSelection = () => ({
    type: 'CLEAR_PRIMATIVES_PANEL_SELECTION'
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
export const propertiesPanelNeedsRefresh = needsRefresh => ({
    type: 'PROPERTIES_PANEL_NEEDS_REFRESH',
    needsRefresh
});

export const closeStylePanel = () => ({
    type: 'CLOSE_STYLE_PANEL'
});
export const openStylePanel = () => ({
    type: 'OPEN_STYLE_PANEL'
});
export const closeBehaviorPanel = () => ({
    type: 'CLOSE_BEHAVIOR_PANEL'
});
export const openBehaviorPanel = () => ({
    type: 'OPEN_BEHAVIOR_PANEL'
});

// TODO: Compress behavior actions to one action
export const addCollisionBehavior = (id, collision) => ({
    type: 'ADD_COLLISION_BEHAVIOR',
    id,
    behavior: collision
});

export const addControlBehavior = (id, control) => ({
    type: 'ADD_CONTROL_BEHAVIOR',
    id,
    behavior: control
});

export const removeBehavior = (gameState, id) => ({
    type: 'REMOVE_BEHAVIOR',
    gameState,
    id
});

export const addScore = score => ({
    type: 'ADD_SCORE',
    score
});

export const resetScore = () => ({
    type: 'RESET_SCORE'
});
export const changeFollowBody = (gameState, id) => ({
    type: 'CHANGE_FOLLOW_BODY',
    gameState,
    id
});
export const clearFollowBody = gameState => ({
    type: 'CLEAR_FOLLOW_BODY',
    gameState
});

export const deselectAll = () =>
    dispatch => {
        dispatch(setSelectedObject(-1));
        dispatch(setPrimativesPanelSelection(''));
        dispatch(setIsPlaying(false));
        dispatch(closeBehaviorPanel());
        dispatch(closeStylePanel());
    };

export const addFloatingText = textObj => ({
    type: 'ADD_FLOATING_TEXT',
    textObj
});
export const removeFloatingText = id => ({
    type: 'REMOVE_FLOATING_TEXT',
    id
});

export const updateFloatingText = (id, text) => ({
    type: 'UPDATE_FLOATING_TEXT',
    id,
    text
});
