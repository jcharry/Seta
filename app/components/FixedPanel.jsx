/*
 * FixedPanel.jsx
 * Copyright (C) 2017 jamiecharry <jamiecharry@Jamies-Air-2.home>
 *
 * Distributed under terms of the MIT license.
 */
import React from 'react';

class FixedPanel extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        const { visible, style } = this.props;
        let s = {
            ...style,
            position: 'fixed',
            visibility: visible ? 'visible' : 'hidden',
            zIndex: 200
        }
        return (
            <div style={s} className='fixed-panel'>
                {this.props.children}
            </div>

        );
    }
}

export default FixedPanel;
