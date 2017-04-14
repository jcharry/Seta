/*
 * Main.jsx
 * Copyright (C) 2017 jamiecharry <jamiecharry@Jamies-Air-2.home>
 *
 * Distributed under terms of the MIT license.
 */
import React from 'react';
import { connect } from 'react-redux';
import MenuPanel from 'components/MenuPanel/MenuPanel';
import GamePanel from 'components/GamePanel/GamePanel';
import PrimativesPanel from 'components/PrimativesPanel/PrimativesPanel';
import PropertiesPanel from 'components/PropertiesPanel/PropertiesPanel';

class Main extends React.Component {
    render() {
        const { behaviorPanelOpen, stylePanelOpen } = this.props;
        return (
            <div className='main'>
                <div className='top'>
                    <MenuPanel />
                </div>
                <div className='bottom'>
                    <PrimativesPanel />
                    <GamePanel />
                    <PropertiesPanel />
                </div>
            </div>
        );
    }
}


Main.propTypes = {
    behaviorPanelOpen: React.PropTypes.bool.isRequired,
    stylePanelOpen: React.PropTypes.bool.isRequired
};

export default connect(state => ({
    behaviorPanelOpen: state.behaviorPanelOpen,
    stylePanelOpen: state.stylePanelOpen,
}))(Main);

