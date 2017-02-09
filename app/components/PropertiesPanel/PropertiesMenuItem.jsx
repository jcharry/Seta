/*
 * PropertiesMenuItem.jsx
 * Copyright (C) 2017 jamiecharry <jamiecharry@Jamies-Air-2.home>
 *
 * Distributed under terms of the MIT license.
 */
import React from 'react';

class PropertiesMenuItem extends React.Component {
    render() {
        const { label, value } = this.props;
        return (
            <div className='properties-menu-item'>
                <p>{label}</p>
            </div>
        );
    }
}

export default PropertiesMenuItem;
