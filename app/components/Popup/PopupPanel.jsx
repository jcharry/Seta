/*
 * PopupPanel.jsx
 * Copyright (C) 2017 jamiecharry <jamiecharry@Jamies-Air-2.home>
 *
 * Distributed under terms of the MIT license.
 */
import React from 'react';
import CloseButton from 'components/CloseButton';

class PopupPanel extends React.Component {
    render() {
        const { handleClose } = this.props;
        return (
            <div className='popup-panel'>
                <CloseButton onClick={handleClose} />
                {this.props.children}
            </div>
        );
    }
}

export default PopupPanel;
