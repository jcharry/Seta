import React from 'react';
import { connect } from 'react-redux';
import PropertiesMenuItem from 'components/PropertiesPanel/PropertiesMenuItem';

class PropertiesMenu extends React.Component {
    render() {
        const { selectedObject, bodies } = this.props;
        const selectedBody = selectedObject === -1 ? null : bodies[selectedObject];

        const visibleProperties = [
            'position',
            'angle',
            'position',
            'force',
            'torque',
            'velocity',
            'angularVelocity',
            'isStatic',
            'density',
            'collisionFilter',
            'slop',
            'timeScale',
            'mass',
            'inertia'
        ];

        const renderProperties = () => {
            if (selectedBody) {
                return Object.keys(selectedBody).map(key => {
                    const value = selectedBody[key];
                    if (visibleProperties.indexOf(key) !== -1) {
                        return <PropertiesMenuItem key={key} label={key} value={value} />;
                    }
                    return null;
                });
            }
            return null;
        };

        return (
            <div className='properties-menu'>
                <h1>selected: {selectedBody && selectedBody.id}</h1>
                {renderProperties()}
            </div>
        );
    }
}

PropertiesMenu.propTypes = {
    selectedObject: React.PropTypes.number.isRequired,
    bodies: React.PropTypes.object.isRequired
};

export default connect(state => ({
    selectedObject: state.selectedObject,
    bodies: state.bodies
}))(PropertiesMenu);
