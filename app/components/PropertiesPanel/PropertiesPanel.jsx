import React from 'react';
import { connect } from 'react-redux';
// import PropertiesMenuItem from 'components/PropertiesPanel/PropertiesMenuItem';
import ObjectsList from 'components/ObjectsList/ObjectsList';
import SelectedObjectPane from 'components/SelectedObjectPane/SelectedObjectPane';

class PropertiesPanel extends React.Component {
    render() {
        const { selectedObject, gameObjects, isPlaying } = this.props;
        const selectedBody = selectedObject === -1 ? null : gameObjects[selectedObject];

        let clsName = 'panel properties-panel';
        if (isPlaying) {
            clsName += ' inactive';
        }
        return (
            <div className={clsName}>
                <ObjectsList gameObjects={gameObjects} />
                {selectedBody && <SelectedObjectPane selectedObj={selectedBody} /> }
            </div>
        );
    }
}

PropertiesPanel.propTypes = {
    selectedObject: React.PropTypes.number.isRequired,
    gameObjects: React.PropTypes.object.isRequired,
    isPlaying: React.PropTypes.bool.isRequired
};

export default connect(state => ({
    selectedObject: state.selectedObject,
    gameObjects: state.gameObjects,
    propertiesPanelNeedsRefresh: state.propertiesPanelNeedsRefresh,
    isPlaying: state.isPlaying
}))(PropertiesPanel);
