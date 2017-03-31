/*
 * GameContainer.jsx
 * Copyright (C) 2017 jamiecharry <jamiecharry@Jamies-Air-2.home>
 *
 * Distributed under terms of the MIT license.
 */
import React from 'react';
import { connect } from 'react-redux';
import GameCanvas from 'components/GamePanel/GameCanvas';
import StatePanel from 'components/StatePanel/StatePanel';
import PopupPanel from 'components/Popup/PopupPanel';
import BehaviorPanel from 'components/BehaviorPanel/BehaviorPanel';
import StylePanel from 'components/StylePanel/StylePanel';
import EditPanel from 'components/EditPanel/EditPanel';

import * as actions from 'actions';

class GameContainer extends React.Component {
    constructor(props) {
        super(props);
        this.handleClose = this.handleClose.bind(this);
    }
    componentDidMount() {
        console.log('game container mounted');
    }

    handleClose() {
        const { dispatch } = this.props;
        dispatch(actions.setPopupPanelContent(''));
    }

    render() {
        const { popupPanelContent } = this.props;

        const selectPopupPanelContent = () => {
            switch (popupPanelContent) {
                case 'behaviors':
                    return <BehaviorPanel />
                case 'properties:object':
                    return <StylePanel />
                case 'properties:text':
                    return <EditPanel />
            }
        }
        return (
            <div className='game-panel panel'>
                <StatePanel />
                <GameCanvas />
                {popupPanelContent !== ('') && <PopupPanel handleClose={this.handleClose}>{selectPopupPanelContent()}</PopupPanel>}
            </div>
        );
    }
}

export default connect(state => ({
    popupPanelContent: state.popupPanelContent
}))(GameContainer);
