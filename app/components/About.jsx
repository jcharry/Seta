/*
 * About.jsx
 * Copyright (C) 2017 jamiecharry <jamiecharry@Jamies-Air-2.home>
 *
 * Distributed under terms of the MIT license.
 */
import React from 'react';

class About extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <div className='about'>
                <ul>
                    <a href="https://icons8.com/web-app/11737/Pencil">Pencil icon credits</a>
                    <a href="https://icons8.com/web-app/11705/Delete">Delete icon credits</a>
                    <a href="https://icons8.com/web-app/19718/Close-Window">Close window icon credits</a>
                    <a href="https://icons8.com/web-app/37839/Add-Filled">Add filled icon credits</a>
                    <a href="https://icons8.com/web-app/2362/Sensor">Sensor icon credits</a>
                    <a href="https://icons8.com/web-app/982/Generic-Text">Generic text icon credits</a>
                    <a href="https://icons8.com/web-app/20407/Mechanical-Spring">Mechanical spring icon credits</a>
                    <a href="https://icons8.com/web-app/646/Help">Help icon credits</a>


                </ul>
            </div>
        );
    }
}

export default About;
