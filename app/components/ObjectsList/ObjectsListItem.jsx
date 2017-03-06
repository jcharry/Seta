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

class ObjectsListItem extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.handleRemoveItem = this.handleRemoveItem.bind(this);
        this.handleEditClicked = this.handleEditClicked.bind(this);
    }

    handleEditClicked() {
        // Show popup
        const { body } = this.props;
        console.log('hsould edit', `${body.id}: ${body.label}`);
    }

    handleRemoveItem() {
        const { dispatch, body } = this.props;
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
                <img className='edit' src={isActive ? pencilWhiteImg : pencilBlackImg} onClick={this.handleEditClicked}/>
                <p className='label'>{body.id}: {body.label}</p>

                {/* Cannot delete the world */}
                {body.label !== 'World' && <p onClick={this.handleRemoveItem}>X</p>}
            </li>
        );
    }
}

export default connect(state => ({
    selectedObject: state.selectedObject
}))(ObjectsListItem);
