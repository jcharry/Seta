/*
 * utils.js
 * Copyright (C) 2017 jamiecharry <jamiecharry@172-16-227-158.DYNAPOOL.NYU.EDU>
 *
 * Distributed under terms of the MIT license.
 */
export const clone = function(obj) {
    return JSON.parse(JSON.stringify(obj));
};

export const getActiveGameState = function(gameStates) {
    const keys = Object.keys(gameStates);
    for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        if (gameStates[key] === true) {
            if (typeof key === 'string') {
                key = parseInt(key, 10);
            }
            return key;
        }
    }

    return -1;
};
