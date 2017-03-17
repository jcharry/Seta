/* TODO: This component is a mess */

import React from 'react';
import { connect } from 'react-redux';

import * as actions from 'actions';
import * as utils from 'utils/utils';

import closeImg from 'images/Close-Filled-48.png';
import ScoreSelect from 'components/BehaviorPanel/ScoreSelect';
import DestroySelect from 'components/BehaviorPanel/DestroySelect';

import deleteImg from 'images/Delete-50-black.png';

import CollisionEvent from 'models/CollisionEvent';
import ControlEvent from 'models/ControlEvent';

class BehaviorPanel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            follow: false,
            collision: {
                obj: '-1',
                action: 'score',
                score: '-1',
                triggerState: '-1',
                destroy: '-1',
                resolution: ''
            },
            control: {
                obj: '-1',
                key: 'a',
                action: 'force up',
                resolution: '1'
            }
        };

        this.collisionActions = [
            'destroy',
            'score',
            // 'trigger state'
        ];

        this.controlActions = [
            'force up',
            'force down',
            'force left',
            'force right',
            // 'move up',
            // 'move down',
            // 'move left',
            // 'move right',
            // 'shoot'
        ];

        this.keys = 'abcdefghijklmnopqrstuvwxyz1234567890'.split('');
        this.keys = this.keys.concat(['space', 'enter', 'shift']);
        console.log('keys', this.keys);

        this.handleClose = this.handleClose.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleAddCollision = this.handleAddCollision.bind(this);
        this.handleAddControl = this.handleAddControl.bind(this);
        this.handleDeleteBehavior = this.handleDeleteBehavior.bind(this);
        this.validateInput = this.validateInput.bind(this);
        this.handleFollowBodyChange = this.handleFollowBodyChange.bind(this);
    }

    componentDidUpdate(prevProps) {
        const { gameStates, followBodies, selectedObject } = this.props;
        const activeStateId = utils.getActiveGameState(gameStates);
        // If the selected object changes, make sure the follow body checkbox
        // is in sync.  We set the state of the checkbox based on whether the
        // current follow body is what's currently selected
        if (prevProps.selectedObject !== selectedObject) {
            this.setState({
                follow: followBodies[activeStateId] === selectedObject ? true : false
            });
        }
    }

    handleClose() {
        const { dispatch } = this.props;
        dispatch(actions.closeBehaviorPanel());
    }

    handleChange(e) {
        switch (e.target.name) {
            case 'new-collision-obj': {
                this.setState({
                    collision: {
                        ...this.state.collision,
                        obj: e.target.value
                    }
                });
                break;
            }
            case 'new-collision-action': {
                this.setState({
                    collision: {
                        ...this.state.collision,
                        action: e.target.value
                    }
                });
                break;
            }
            case 'new-control-key': {
                this.setState({
                    control: {
                        ...this.state.control,
                        key: e.target.value
                    }
                });
                break;
            }
            case 'new-control-action': {
                this.setState({
                    control: {
                        ...this.state.control,
                        action: e.target.value
                    }
                });
                break;
            }
            case 'score': {
                this.setState({
                    collision: {
                        ...this.state.collision,
                        score: e.target.value
                    }
                });
                break;
            }
            case 'destroy': {
                this.setState({
                    collision: {
                        ...this.state.collision,
                        destroy: e.target.value
                    }
                });
                break;
            }
            case 'follow': {
                this.handleFollowBodyChange(e.target.checked);
                this.setState({
                    ...this.state,
                    follow: e.target.checked
                });
            }
            default:
                break;
        }
    }

    handleFollowBodyChange(checked) {
        const { selectedObject, dispatch, gameStates } = this.props;
        const activeStateId = utils.getActiveGameState(gameStates);
        if (checked) {
            dispatch(actions.changeFollowBody(activeStateId, selectedObject));
        } else {
            dispatch(actions.clearFollowBody(activeStateId));
        }
    }

    handleDeleteBehavior(gameState, id) {
        const { dispatch } = this.props;
        dispatch(actions.removeBehavior(gameState, id));
    }


    validateInput(event, activeStateId, activeBehaviors) {
        // const { gameStates, behaviors } = this.props;
        // const activeStateId = utils.getActiveGameState(gameStates);
        // const activeBehaviors = behaviors[activeStateId];
        const err = {};

        switch (event.type) {
            case 'collision': {
                if (event.collidingBody === -1) {
                    console.warn('must select a body to collide with');
                    err.noCollider = true;
                }

                if (event.action === 'destroy' && event.resolution === -1) {
                    console.warn('resolution not defined');
                    err.noResolution = true;
                }
                break;
            }
            case 'control': {
                break;
            }
            default:
                break;
        }

        activeBehaviors.forEach(behavior => {
            if (event.id === behavior.id) {
                console.warn('cannot add duplicate behavior');
                err.isDupe = true;
            }
        });

        return err;
    }

    handleAddControl() {
        const { dispatch, selectedObject, gameStates, behaviors } = this.props;
        let resolution = this.state.control.action;

        switch (this.state.control.action) {
            case 'force right':
            case 'force left':
            case 'force up':
            case 'force down':
                // resolution = this.state.control
                break;

            case 'move left':
            case 'move right':
            case 'move down':
            case 'move up':
                break;

            case 'shoot':
                break;
            default:
                break;
        }

        const activeStateId = utils.getActiveGameState(gameStates);
        const activeBehaviors = behaviors[activeStateId];
        const control = new ControlEvent(
            activeStateId,
            selectedObject,
            this.state.control.key,
            this.state.control.action,
            resolution
        );

        const err = this.validateInput(control, activeStateId, activeBehaviors);

        if (Object.keys(err).length === 0) {
            // TODO: Move this into the game state
            dispatch(actions.addControlBehavior(activeStateId, control));
        }
    }

    handleAddCollision() {
        const { dispatch, selectedObject, gameStates, behaviors } = this.props;

        let resolution;
        switch (this.state.collision.action) {
            case 'score':
                resolution = this.state.collision.score;
                break;
            case 'trigger state':
                resolution = this.state.collision.triggerState;
                break;
            case 'destroy':
                resolution = this.state.collision.destroy;
                break;
            default:
                console.warn('something isnt right');
                return;
        }

        // Catch errors
        // const err = {};

        // Get active gameState
        const activeStateId = utils.getActiveGameState(gameStates);
        const activeBehaviors = behaviors[activeStateId];

        const collision = new CollisionEvent(
            activeStateId,
            selectedObject,
            parseInt(this.state.collision.obj, 10),
            this.state.collision.action,
            parseInt(resolution, 10)
        );

        const err = this.validateInput(collision, activeStateId, activeBehaviors);


        // Don't add duplicates!
        // activeBehaviors.forEach(behavior => {
        //     if (collision.id === behavior.id) {
        //         console.warn('cannot add duplicate behavior');
        //         err.isDupe = true;
        //     }
        // });


        if (Object.keys(err).length === 0) {
            dispatch(actions.addCollisionBehavior(activeStateId, collision));
        }
    }

    render() {
        const { behaviorPanelOpen, gameObjects, selectedObject, gameStates, behaviors } = this.props;
        const { collision, control } = this.state;
        console.log('behaviorPanel re-rendered');
        let clsName = 'interaction-panel';
        if (behaviorPanelOpen && selectedObject !== -1) {
            clsName += ' visible';
        } else {
            clsName += ' hidden';
        }

        const renderCollisionInputs = () => {
            switch (collision.action) {
                case 'score': {
                    return (<ScoreSelect value={this.state.collision.score} handleChange={this.handleChange} />);
                }
                case 'destroy': {
                    // Only give two options of what a collision can destroy
                    // 1. selectedObject
                    // 2. collisionObject

                    const options = [];
                    if (selectedObject !== -1) {
                        options.push(gameObjects[selectedObject]);
                    }
                    if (this.state.collision.obj !== '-1') {
                        options.push(gameObjects[this.state.collision.obj]);
                    }
                    return (<DestroySelect selected={selectedObject} value={this.state.collision.destroy} options={options} handleChange={this.handleChange} />);
                }
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

        const activeStateId = utils.getActiveGameState(gameStates);
        const activeBehaviors = behaviors[activeStateId];

        const collisionBehaviors = [];
        const controlBehaviors = [];
        if (activeBehaviors) {
            for (let i = 0; i < activeBehaviors.length; i++) {
                const b = activeBehaviors[i];
                if (b.body === selectedObject) {
                    if (b.type === 'collision') {
                        collisionBehaviors.push(b);
                    } else if (b.type === 'control') {
                        controlBehaviors.push(b);
                    }
                }
            }
        }

        const renderControlBehaviors = () => {
            if (controlBehaviors.length > 0) {
                return (
                    <div className='current'>
                        <h3>Current</h3>
                        <ol className='behavior-list'>
                            {controlBehaviors.map(behavior =>
                                <li className='behavior-item' key={behavior.id}>
                                    <div>When <span className='highlight'>key {behavior.key}</span> is pressed, this body will <span className='highlight'>{behavior.action}</span></div>
                                    <img alt='delete behavior' src={deleteImg} onClick={() => { this.handleDeleteBehavior(behavior.gameState, behavior.id); }} />
                                </li>
                            )}
                        </ol>
                    </div>
                );
            }
            return null;
        };

        const renderCollisionBehaviors = () => {
            if (collisionBehaviors.length > 0) {
                return (
                    <div className='current'>
                        <h3>Current</h3>
                        <ol className='behavior-list'>
                            {collisionBehaviors.map(behavior =>
                                <li className='behavior-item' key={behavior.id}>
                                    <div>This body hits <span className='highlight'>body {behavior.collidingBody}</span> which causes <span className='highlight'>{behavior.action}</span> to <span className='highlight'>{behavior.resolution}</span></div>
                                    <img alt='delete behavior' onClick={() => { this.handleDeleteBehavior(behavior.gameState, behavior.id); }} src={deleteImg} />
                                </li>
                            )}
                        </ol>
                    </div>
                );
            }
            return null;
        };

        return (
            <div className={clsName}>
                <img className='close-btn' onClick={this.handleClose} src={closeImg} alt='close button' />
                <div className='follow'>
                    <h2>Set Camera to Follow</h2>
                    <input type='checkbox' checked={this.state.follow} onChange={this.handleChange} name='follow' />
                </div>
                <div className='collisions'>
                    <h2>Collisions</h2>
                    <h3>Add New:</h3>
                    <div className='new'>
                        <p>This body hits</p>
                        <select value={this.state.collision.obj} onChange={this.handleChange} name='new-collision-obj'>
                            {[<option value={-1} key='null'>---</option>].concat(Object.keys(gameObjects).filter(key => {
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
                        <p>causing</p>
                        <select value={this.state.collision.action} onChange={this.handleChange} name='new-collision-action'>
                            {this.collisionActions.map(actionType => <option key={actionType}>{actionType}</option>)}
                        </select>
                        {renderCollisionInputs()}
                        <button onClick={this.handleAddCollision}>Add</button>
                    </div>
                    {renderCollisionBehaviors()}
                </div>

                <hr />

                <div className='controls'>
                    <h2>Controls</h2>
                    <div className='new'>
                        <p>When</p>
                        <select value={this.state.control.key} onChange={this.handleChange} name='new-control-key'>
                            {this.keys.map(key => <option value={key} key={key}>{key}</option>)}
                        </select>
                        <p>is pressed, this body should </p>
                        <select value={this.state.control.action} onChange={this.handleChange} name='new-control-action'>
                            {this.controlActions.map(actionType => <option key={actionType}>{actionType}</option>)}
                        </select>
                        <button onClick={this.handleAddControl}>Add</button>
                    </div>
                    {renderControlBehaviors()}
                </div>
            </div>
        );
    }
}

BehaviorPanel.propTypes = {
    selectedObject: React.PropTypes.number.isRequired,
    dispatch: React.PropTypes.func.isRequired,
    behaviorPanelOpen: React.PropTypes.bool.isRequired,
    gameObjects: React.PropTypes.object.isRequired,
    behaviors: React.PropTypes.object.isRequired,
    gameStates: React.PropTypes.object.isRequired,
    followBodies: React.PropTypes.object.isRequired
};

export default connect(state => ({
    selectedObject: state.selectedObject,
    behaviorPanelOpen: state.behaviorPanelOpen,
    gameObjects: state.gameObjects,
    gameStates: state.gameStates,
    behaviors: state.behaviors,
    followBodies: state.followBodies
}))(BehaviorPanel);