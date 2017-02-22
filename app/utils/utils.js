/*
 * utils.js
 * Copyright (C) 2017 jamiecharry <jamiecharry@172-16-227-158.DYNAPOOL.NYU.EDU>
 *
 * Distributed under terms of the MIT license.
 */
export const clone = function(obj) {
    return JSON.parse(JSON.stringify(obj));
};
