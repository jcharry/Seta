/*
 * ObjectsListItem.jsx
 * Copyright (C) 2017 jamiecharry <jamiecharry@Jamies-Air-2.home>
 *
 * Distributed under terms of the MIT license.
 */
import React from 'react';
import { connect } from 'react-redux';
import * as actions from 'actions';

import pencilBlackImg from 'images/Pencil-50-black.png';
import pencilWhiteImg from 'images/Pencil-50-white.png';
import deleteBlackImg from 'images/Delete-50-black.png';
import deleteWhiteImg from 'images/Delete-50-white.png';

class ObjectsListItem extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.handleRemoveItem = this.handleRemoveItem.bind(this);
        this.handleEditClicked = this.handleEditClicked.bind(this);
    }

    handleEditClicked() {
        const { dispatch } = this.props;
        dispatch(actions.openBehaviorPanel());
    }

    handleRemoveItem(e) {
        const { dispatch, body, selectedObject } = this.props;
        e.stopPropagation();
        if (body.id === selectedObject) {
            dispatch(actions.setSelectedObject(-1));
        }
        dispatch(actions.removeGameObject(body.id));
    }

    handleClick() {
        const { dispatch, body } = this.props;
        dispatch(actions.setSelectedObject(body.id));
    }
    render() {
        const { body, selectedObject } = this.props;
        let isActive = false;
        if (body.id === selectedObject) {
            isActive = true;
        }
        return (
            <li className={isActive ? 'objects-list-item active' : 'objects-list-item'} onClick={this.handleClick}>
                {/* {body.label !== 'World' && body.type !== 'constraint' && <img className='edit' src={isActive ? pencilWhiteImg : pencilBlackImg} onClick={this.handleEditClicked} alt='edit' /> } */}
                <p className='label'>{body.id}: {body.name || body.label}</p>

                {/* Cannot delete the world */}
                {body.label !== 'World' && <img src={isActive ? deleteWhiteImg : deleteBlackImg} alt={`delete object ${body.id}`} onClick={this.handleRemoveItem} />}
            </li>
        );
    }
}

ObjectsListItem.propTypes = {
    dispatch: React.PropTypes.func.isRequired,
    body: React.PropTypes.object.isRequired,
    selectedObject: React.PropTypes.number.isRequired
};

export default connect(state => ({
    selectedObject: state.selectedObject
}))(ObjectsListItem);
