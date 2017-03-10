/*
 * StatePanel.jsx
 * Copyright (C) 2017 jamiecharry <jamiecharry@Jamies-Air-2.home>
 *
 * Distributed under terms of the MIT license.
 */
import React from 'react';
import { connect } from 'react-redux';
// import GameState from 'components/GamePanel/GameState';
import * as actions from 'actions';

class StatePanel extends React.Component {
    constructor(props) {
        super(props);
        this.addGameState = this.addGameState.bind(this);
        this.switchGameState = this.switchGameState.bind(this);
    }

    addGameState() {
        const { dispatch } = this.props;
        dispatch(actions.needsNewGameState(true));
    }

    switchGameState(id) {
        const { dispatch } = this.props;
        dispatch(actions.activateGameState(id));
    }

    render() {
        const { gameStates, isPlaying } = this.props;

        const renderStateButtons = () => Object.keys(gameStates).map(id => {
            let clsName = 'game-state-button';
            if (gameStates[id]) {
                clsName += ' active';
            }
            return <button onClick={() => { this.switchGameState(id); }} className={clsName} key={id}>world: {id}</button>;
        });

        let clsName = 'state-panel';
        if (isPlaying) {
            clsName += ' inactive';
        }
        return (
            <div className={clsName}>
                <h2>Worlds</h2>
                {renderStateButtons()}
                <button onClick={this.addGameState}>Add</button>
            </div>
        );
    }
}

StatePanel.propTypes = {
    dispatch: React.PropTypes.func.isRequired,
    gameStates: React.PropTypes.object.isRequired,
    isPlaying: React.PropTypes.bool.isRequired
};

export default connect(state => ({
    gameStates: state.gameStates,
    isPlaying: state.isPlaying
}))(StatePanel);
