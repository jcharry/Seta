/*
 * PopupPanel.jsx
 * Copyright (C) 2017 jamiecharry <jamiecharry@Jamies-Air-2.home>
 *
 * Distributed under terms of the MIT license.
 */
import React from 'react';
import closeImg from 'images/Close-Filled-48.png';

class PopupPanel extends React.Component {
    render() {
        const { handleClose } = this.props;
        return (
            <div className='popup-panel'>
                <img className='close-btn' onClick={handleClose} src={closeImg} alt='close button' />
                {this.props.children}
            </div>
        );
    }
}

export default PopupPanel;
