/*
 * PlacementCanvas.jsx
 * Copyright (C) 2017 jamiecharry <jamiecharry@Jamies-Air-2.home>
 *
 * Distributed under terms of the MIT license.
 */
import React from 'react';

class PlacementCanvas extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <div className='placement-canvas'>
                <canvas ref={elt => { this.canvas = elt; }} id='placement-canvas' />
            </div>

        );
    }
}

export default PlacementCanvas;
