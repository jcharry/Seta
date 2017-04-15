/*
 * GettingStarted.jsx
 * Copyright (C) 2017 jamiecharry <jamiecharry@172-16-225-148.DYNAPOOL.NYU.EDU>
 *
 * Distributed under terms of the MIT license.
 */
import React from 'react';
import { Link } from 'react-router';

export default props => {
        return (
            <div className='getting-started'>
                <div className='full-page-fixed background-green'></div>
                <div className='content'>
                    <h1>Getting Started</h1>
                    <p>Watch this video to get a quick tour of the editor.</p>
                    <div className='video-wrapper'>
                        <video width='100%' src={require('../images/SetaTutorial.mov')} controls></video>
                    </div>
                </div>
            </div>
        );
}

