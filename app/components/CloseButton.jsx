/*
 * CloseButton.jsx
 * Copyright (C) 2017 jamiecharry <jamiecharry@Jamies-Air-2.home>
 *
 * Distributed under terms of the MIT license.
 */
import React from 'react';
import closeImg from 'images/Close-Filled-48.png';

function CloseButton(props) {
    return (
        <img className='close-btn' onClick={props.onClick} src={closeImg} alt='close button' />
    );
}

export default CloseButton;
