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
        const { gameStates } = this.props;

        const renderStateButtons = () => Object.keys(gameStates).map(id => {
            let clsName = 'game-state-button';
            if (gameStates[id]) {
                clsName += ' active';
            }
            return <button onClick={() => { this.switchGameState(id); }} className={clsName} key={id}>State: {id}</button>;
        });

        return (
            <div className='state-panel'>
                <h2>States</h2>
                {renderStateButtons()}
                <button onClick={this.addGameState}>Add</button>
            </div>
        );
    }
}

StatePanel.propTypes = {
    dispatch: React.PropTypes.func.isRequired,
    gameStates: React.PropTypes.object.isRequired
};

export default connect(state => ({
    gameStates: state.gameStates
}))(StatePanel);
