/* XXX: Super wrong way to do this,
 * this should not be it's own component, but a child
 * of the Behavior Panel
 */
import React from 'react';
import closeImg from 'images/Close-Filled-48.png';
import { connect } from 'react-redux';
import ColorPicker from 'rc-color-picker';
import 'rc-color-picker/assets/index.css';
import * as utils from 'utils/utils';

import * as actions from 'actions';

class StylePanel extends React.Component {
    constructor(props) {
        super(props);

        const { selectedObject, gameObjects, gameStates, followBodies } = this.props;
        const body = gameObjects[selectedObject];
        const activeStateId = utils.getActiveGameState(gameStates);

        this.state = {
            name: body.name || '',
            color: body.render.strokeStyle,
            follow: followBodies[activeStateId] === body.id
        }

        this.handleClose = this.handleClose.bind(this);
        this.setColor = this.setColor.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleFollowBodyChange = this.handleFollowBodyChange.bind(this);
    }

    handleClose() {
        const { dispatch } = this.props;
        dispatch(actions.closeStylePanel());
    }

    handleChange(e) {
        const { selectedObject, gameObjects } = this.props;
        const body = gameObjects[selectedObject];

        switch (e.target.name) {
            case 'name':
                body.name = e.target.value;
                this.setState({
                    name: e.target.value
                });
                break;
            case 'follow': {
                this.handleFollowBodyChange(e.target.checked);
                this.setState({
                    follow: e.target.checked
                });
                break;
            }
            default:
                break;
        }

    }

    setColor(colors) {
        const { gameObjects, selectedObject} = this.props;
        this.setState({
            color: colors.color
        });
        gameObjects[selectedObject].render.fillStyle = colors.color;
        gameObjects[selectedObject].render.strokeStyle = colors.color;
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

    render() {
        return (
            <div className='style-panel'>
                <img className='close-btn' onClick={this.handleClose} src={closeImg} alt='close button' />
                <h2>Properties</h2>
                <div>
                    <h2>Name</h2>
                    <input type='text' value={this.state.name} onChange={this.handleChange} name='name' />
                </div>
                <div>
                    <h2>Color</h2>
                    <ColorPicker
                        onChange={this.setColor}
                        color={this.state.color}
                    />
                </div>
                <div className='follow'>
                    <h2>Set Camera to Follow</h2>
                    <input type='checkbox' checked={this.state.follow} onChange={this.handleChange} name='follow' />
                </div>
            </div>
        );
    }
}

export default connect(state => ({
    selectedObject: state.selectedObject,
    gameObjects: state.gameObjects,
    gameStates: state.gameStates,
    followBodies: state.followBodies
}))(StylePanel);
