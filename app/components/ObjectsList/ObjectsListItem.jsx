/*
 * ObjectsListItem.jsx
 * Copyright (C) 2017 jamiecharry <jamiecharry@Jamies-Air-2.home>
 *
 * Distributed under terms of the MIT license.
 */
import React from 'react';
import { connect } from 'react-redux';
import * as actions from 'actions';

class ObjectsListItem extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        const { dispatch, body } = this.props;
        dispatch(actions.setSelectedObject(body.id));
    }
    render() {
        const { body, selectedObject } = this.props;
        let clsName = 'objects-list-item';
        if (body.id === selectedObject) {
            clsName += ' active';
        }
        return (
            <li className={clsName} onClick={this.handleClick}>{body.id}: {body.label}</li>
        );
    }
}

export default connect(state => ({
    selectedObject: state.selectedObject
}))(ObjectsListItem);
