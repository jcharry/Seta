/*
 * Main.jsx
 * Copyright (C) 2017 jamiecharry <jamiecharry@Jamies-Air-2.home>
 *
 * Distributed under terms of the MIT license.
 */
import React from 'react';
import MenuPanel from 'components/MenuPanel/MenuPanel';
// import TextEditor from './TextEditor';
import GamePanel from 'components/GamePanel/GamePanel';
import PrimativesPanel from 'components/PrimativesPanel/PrimativesPanel';
import PropertiesPanel from 'components/PropertiesPanel/PropertiesPanel';

class Main extends React.Component {
    render() {
        return (
            <div className='main'>
                <div className='top'>
                    <MenuPanel />
                </div>
                <div className='bottom'>
                    <PrimativesPanel />
                    <GamePanel />
                    <PropertiesPanel />
                    {/* <TextEditor /> */}
                </div>
            </div>
        );
    }
}

export default Main;
