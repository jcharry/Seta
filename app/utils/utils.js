/*
 * utils.js
 * Copyright (C) 2017 jamiecharry <jamiecharry@172-16-227-158.DYNAPOOL.NYU.EDU>
 *
 * Distributed under terms of the MIT license.
 */
import * as Constants from 'models/Constants';
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

// FIXME: Not flexible enough
export const truncateValue = function(property, value) {
    switch (Constants.PropertyMap[property]) {
        case 'OBJECT': {
            return Object.keys(value).reduce((acc, curr) => {
                let v = parseFloat(value[curr], 10);
                if (Constants.PropertyDecimalTruncations[property]) {
                    v = Number(v.toFixed(Constants.PropertyDecimalTruncations[property]));
                }
                acc[curr] = v;
                return acc;
            }, {});
        }
        case 'PRIMATIVE': {
            let v = parseFloat(value, 10);
            if (Constants.PropertyDecimalTruncations[property]) {
                return Number(v.toFixed(Constants.PropertyDecimalTruncations[property]));
            }
            return v;
        }
        case 'BOUNDS':
            break;
    }
    return value;
}
