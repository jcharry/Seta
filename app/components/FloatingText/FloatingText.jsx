/*
 * FloatingText.jsx
 * Copyright (C) 2017 jamiecharry <jamiecharry@Jamies-Air-2.home>
 *
 * Distributed under terms of the MIT license.
 */
import React from 'react';

class FloatingText extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        const { text } = this.props;
        return (
            <div className='floating-text'>
                <p>{text}</p>
            </div>
        );
    }
}

export default FloatingText;
