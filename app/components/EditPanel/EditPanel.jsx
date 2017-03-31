/*
 * EditPanel.jsx
 * Copyright (C) 2017 jamiecharry <jamiecharry@Jamies-Air-2.home>
 *
 * Distributed under terms of the MIT license.
 */
import React from 'react';
import { connect } from 'react-redux';
import * as actions from 'actions';

class EditPanel extends React.Component {
    constructor(props) {
        super(props);
        const { selectedObject, gameObjects } = this.props;
        this.state = {
            text: gameObjects[selectedObject].text
        };

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        const { dispatch, selectedObject } = this.props;
        dispatch(actions.updateGameObject(selectedObject, {text: e.target.value}));
        this.setState({
            text: e.target.value
        });
    }

    render() {
        return (
            <div className='edit-panel'>
                <h2>Text</h2>
                <input type='text' onChange={this.handleChange} value={this.state.text} />
            </div>
        );
    }
}

export default connect(state => ({
    selectedObject: state.selectedObject,
    gameObjects: state.gameObjects
}))(EditPanel);
