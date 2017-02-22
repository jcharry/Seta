import React from 'react';
import { connect } from 'react-redux';
// import PropertiesMenuItem from 'components/PropertiesPanel/PropertiesMenuItem';
import ObjectsList from 'components/ObjectsList/ObjectsList';
import SelectedObjectPane from 'components/SelectedObjectPane/SelectedObjectPane';

class PropertiesPanel extends React.Component {
    render() {
        const { selectedObject, bodies } = this.props;
        const selectedBody = selectedObject === -1 ? null : bodies[selectedObject];

        return (
            <div className='panel properties-panel'>
                <ObjectsList bodies={bodies} />
                {selectedBody && <SelectedObjectPane body={selectedBody} /> }
            </div>
        );
    }
}

PropertiesPanel.propTypes = {
    selectedObject: React.PropTypes.number.isRequired,
    bodies: React.PropTypes.object.isRequired
};

export default connect(state => ({
    selectedObject: state.selectedObject,
    bodies: state.bodies
}))(PropertiesPanel);
