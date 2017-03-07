/*
 * InteractionPanel.jsx
 * Copyright (C) 2017 jamiecharry <jamiecharry@Jamies-Air-2.home>
 *
 * Distributed under terms of the MIT license.
 */
import React from 'react';
import { connect } from 'react-redux';

import * as actions from 'actions';

import closeImg from 'images/Close-Filled-48.png';
import ScoreSelect from 'components/InteractionPanel/ScoreSelect';

import CollisionEvent from 'models/CollisionEvent';

class InteractionPanel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            collision: {
                obj: -1,
                action: 'score',
                score: -1,
                triggerState: -1,
                resolution: ''
            },
            control: {

            }
        };

        this.collisionActions = [
            'destroy',
            'score',
            'trigger state'
        ];

        this.handleClose = this.handleClose.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleAddCollision = this.handleAddCollision.bind(this);
    }

    handleClose() {
        const { dispatch } = this.props;
        dispatch(actions.closeInteractionPanel());
    }

    handleChange(e) {
        switch (e.target.name) {
            case 'new-collision-obj':

                this.setState({
                    collision: {
                        ...this.state.collision,
                        obj: e.target.value
                    }
                });
                break;
            case 'new-collision-action':
                this.setState({
                    collision: {
                        ...this.state.collision,
                        action: e.target.value
                    }
                });
                break;
            case 'score':
                this.setState({
                    collision: {
                        ...this.state.collision,
                        score: e.target.value
                    }
                });
                break;
            default:
                break;
        }
    }

    handleAddCollision() {
        const { dispatch, selectedObject } = this.props;

        let resolution;
        switch (this.state.collision.action) {
            case 'score':
                resolution = this.state.collision.score;
                break;
            case 'trigger state':
                resolution = this.state.collision.triggerState;
                break;
            default:
                console.warn('something isnt right');
                return;
        }

        const collision = new CollisionEvent(selectedObject, this.state.collision.obj, this.state.collision.action, resolution);
        dispatch(actions.addCollisionBehavior(collision));
    }

    render() {
        const { interactionPanelOpen, gameObjects, selectedObject } = this.props;
        const { collision, control } = this.state;
        let clsName = 'interaction-panel';
        if (interactionPanelOpen) {
            clsName += ' visible';
        } else {
            clsName += ' hidden';
        }

        const renderCollisionInputs = () => {
            switch (collision.action) {
                case 'score':
                    return <ScoreSelect value={this.state.collision.score} handleChange={this.handleChange} />;
                case 'destroy':
                    return <div />;
                case 'move':
                    return <div />;
                case 'rotate':
                    return <div />;
                case 'trigger state':
                    return <div />;
                default:
                    return <div />;
            }
        };

        return (
            <div className={clsName}>
                <img className='close-btn' onClick={this.handleClose} src={closeImg} alt='close button' />
                <div className='collisions'>
                    <h2>Collisions</h2>
                    <div className='new'>
                        <p><span>NEW:</span></p>
                        <p>hits</p>
                        <select value={this.state.collision.obj} onChange={this.handleChange} name='new-collision-obj'>
                            {[<option value={-1} key='null'>None</option>].concat(Object.keys(gameObjects).filter(key => {
                                const gameObject = gameObjects[key];
                                if (gameObject.type !== 'body') {
                                    return false;
                                }
                                if (gameObject.id === selectedObject) {
                                    return false;
                                }
                                return gameObject.type === 'body';
                            }).map(key => {
                                const body = gameObjects[key];
                                return <option value={body.id} key={key}>{`${body.id}: ${body.label}`}</option>;
                            }))}
                        </select>
                        <p>causes</p>
                        <select value={this.state.collision.action} onChange={this.handleChange} name='new-collision-action'>
                            {this.collisionActions.map(actionType => <option key={actionType}>{actionType}</option>)}
                        </select>
                        {renderCollisionInputs()}
                        <button onClick={this.handleAddCollision}>Add</button>
                    </div>
                </div>
                <div className='controls'>
                    <h2>Controls</h2>
                    <div className='new' />
                </div>
            </div>
        );
    }
}

InteractionPanel.propTypes = {
    selectedObject: React.PropTypes.number.isRequired,
    dispatch: React.PropTypes.func.isRequired,
    interactionPanelOpen: React.PropTypes.bool.isRequired,
    gameObjects: React.PropTypes.object.isRequired
};

export default connect(state => ({
    selectedObject: state.selectedObject,
    interactionPanelOpen: state.interactionPanelOpen,
    gameObjects: state.gameObjects
}))(InteractionPanel);
