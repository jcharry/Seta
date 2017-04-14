/*
 * NotSupported.jsx
 * Copyright (C) 2017 jamiecharry <jamiecharry@Jamies-Air-2.home>
 *
 * Distributed under terms of the MIT license.
 */
import React from 'react';

class NotSupported extends React.Component {
    render() {
        return (
            <div className='not-supported full-page-fixed background-green'>
                <div style={{margin: '10vh 30vw'}}>
                <h1>SORRY!</h1>
                <p style={{fontSize: '14pt'}}>I know it's rough, but this project is in it's early prototyping days, and I don't want you to get the wrong idea about it.  I haven't fully tested it for compatability with browsers other than <em style={{color: 'orange'}}>Chrome</em>, so please come back using <em style={{color: 'orange'}}>Chrome</em> and you can play to your hearts content.</p>
                 </div>
            </div>
        );
    }
}

export default NotSupported;
