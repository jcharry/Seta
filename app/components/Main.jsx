/*
 * Main.jsx
 * Copyright (C) 2017 jamiecharry <jamiecharry@Jamies-Air-2.home>
 *
 * Distributed under terms of the MIT license.
 */
import React from 'react';
import MenuBar from 'components/MenuBar/MenuBar';
// import TextEditor from './TextEditor';
import GameContainer from 'components/GamePanel/GameContainer';
import ObjectsMenu from 'components/ObjectsPanel/ObjectsMenu';
import PropertiesMenu from 'components/PropertiesPanel/PropertiesMenu';

class Main extends React.Component {
    render() {
        return (
            <div className='main'>
                <div className='top'>
                    <MenuBar />
                </div>
                <div className='bottom'>
                    <ObjectsMenu />
                    <GameContainer />
                    <PropertiesMenu />
                    {/* <TextEditor /> */}
                </div>
            </div>
        );
    }
}

export default Main;
