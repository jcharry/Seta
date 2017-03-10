/*
 * Select.jsx
 * Copyright (C) 2017 jamiecharry <jamiecharry@Jamies-Air-2.home>
 *
 * Distributed under terms of the MIT license.
 */
import React from 'react';

class Select extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        const { value } = this.props;
        return (
            <input type='select' value={value} />
        );
    }
}

export default Select;
