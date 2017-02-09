/*
 * GameContainer.jsx
 * Copyright (C) 2017 jamiecharry <jamiecharry@Jamies-Air-2.home>
 *
 * Distributed under terms of the MIT license.
 */
import React from 'react';
import GameCanvas from 'components/GamePanel/GameCanvas';

class GameContainer extends React.Component {
    componentDidMount() {
        console.log('game container mounted');
    }

    render() {
        return (
            <div className='game-container'>
                <GameCanvas />
            </div>
        );
    }
}

export default GameContainer;
