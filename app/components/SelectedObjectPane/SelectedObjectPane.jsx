import React from 'react';
import SelectedObjectPaneProperty from 'components/SelectedObjectPane/SelectedObjectPaneProperty';
import physicsUtils from 'utils/physicsUtils';
import { connect } from 'react-redux';
import * as actions from 'actions';
// import Matter from 'matter-js';

class SelectedObjectPane extends React.Component {
    constructor(props) {
        super(props);
        const { selectedObj } = this.props;

        // initialize state with current properties
        this.visibleBodyProperties = [
            'position',
            'velocity',
            'size',
            'angle',
            'force',
            'angularVelocity',
            'isStatic',
            'density',
            'timeScale',
            'mass',
            'inertia'
        ];

        this.visibleConstraintProperties = [
            'stiffness',
            'length'
        ];

        this.visibleWorldProperties = [
            'gravity'
        ];

        this.state = {};
        switch (selectedObj.type) {
            case 'body':
                this.visibleBodyProperties.forEach(p => {
                    this.state[p] = selectedObj[p];
                });
                break;
            case 'constraint':
                this.visibleConstraintProperties.forEach(p => {
                    this.state[p] = selectedObj[p];
                });
                break;
            case 'composite':
                this.visibleWorldProperties.forEach(p => {
                    this.state[p] = selectedObj[p];
                });
                break;
        }

        this.handleInputChange = this.handleInputChange.bind(this);
        this.updateBodyProperties = this.updateBodyProperties.bind(this);
        this.updateConstraintProperties = this.updateConstraintProperties.bind(this);
    }

    /**
     * When the selectedBody switches,
     * we need to refresh the state with the values
     * from the currently selected body, otherwise
     * the input box values will be stale
    */
    componentDidUpdate(prevProps) {
        const { selectedObj, dispatch, propertiesPanelNeedsRefresh } = this.props;
        const newStateObj = {};

        if (propertiesPanelNeedsRefresh !== prevProps.propertiesPanelNeedsRefresh && propertiesPanelNeedsRefresh === true) {
            dispatch(actions.propertiesPanelNeedsRefresh(false));
        }

        switch (selectedObj.type) {
            case 'body': {
                // Grab properties off currently selected body
                this.visibleBodyProperties.forEach(p => {
                    newStateObj[p] = selectedObj[p];
                });
                break;
            }
            case 'constraint':
                this.visibleConstraintProperties.forEach(p => {
                    newStateObj[p] = selectedObj[p];
                });
                break;
        }

        // Only set the state if the selected body changes
        // The handleInputChange method takes care of setting
        // state when the input boxes change
        if (selectedObj.id !== prevProps.selectedObj.id) {
            this.setState(newStateObj);     //eslint-disable-line
        }
    }

    handleInputChange(e) {
        const { selectedObj } = this.props;

        switch (selectedObj.type) {
            case 'body':
                this.updateBodyProperties(e);
                break;
            case 'constraint':
                this.updateConstraintProperties(e);
                break;
        }

    }

    updateConstraintProperties(e) {
        const { selectedObj } = this.props;
        console.log(e);
    }

    updateBodyProperties(e) {
        const { selectedObj } = this.props;
        const propName = e.target.name;
        switch (e.target.type) {
            case 'checkbox': {
                physicsUtils.setInitialProperty(selectedObj, propName, e.target.checked);
                this.setState({
                    [propName]: e.target.checked
                });
                break;
            }
            case 'text': {
                // Data was entered in a text box.  Only proceed if the value
                // can be parsed into a number
                const val = parseFloat(e.target.value);
                if (val || val === 0) {
                    // Vector properties (like position, velocity)
                    // return a name with a colon separating the
                    // prop name and the component name - e.g.
                    // position:x
                    if (propName.indexOf(':') !== -1) {
                        switch (propName) {
                            // TODO: This could be optimized, but no need
                            // right now, it works fine...
                            case 'position:y':
                            case 'position:x': {
                                const newPos = { ...selectedObj.position };
                                newPos[propName[propName.length - 1]] = val;
                                physicsUtils.setInitialProperty(selectedObj, 'position', newPos);
                                this.setState({
                                    position: newPos
                                });
                                break;
                            }
                            case 'velocity:y':
                            case 'velocity:x': {
                                const newVel = { ...selectedObj.velocity };
                                newVel[propName[propName.length - 1]] = val;
                                physicsUtils.setInitialProperty(selectedObj, 'velocity', newVel);
                                this.setState({
                                    velocity: newVel
                                });
                                break;
                            }
                            case 'force:x':
                            case 'force:y': {
                                break;
                            }

                            case 'size:radius':
                            case 'size:width':
                            case 'size:height': {
                                // Don't accept 0 or negative values
                                if (val <= 0) {
                                    break;
                                }
                                // Calculate scale (use original size)
                                // let scaleX, scaleY, scaleR;
                                if (selectedObj.label === 'Circle Body') {
                                    physicsUtils.setInitialProperty(selectedObj, 'size', {radius: val});
                                    this.setState({
                                        size: {radius: val}
                                    });
                                } else if (selectedObj.label === 'Rectangle Body') {
                                    // Check if width or height changed
                                    if (propName.split(':')[1] === 'width') {
                                        physicsUtils.setInitialProperty(selectedObj, 'size', { width: val, height: selectedObj.size.height });
                                        this.setState({
                                            size: { width: val, height: selectedObj.size.height}
                                        });
                                    } else {
                                        // Must be height
                                        physicsUtils.setInitialProperty(selectedObj, 'size', { width: selectedObj.size.width, height: val });
                                        this.setState({
                                            size: { width: selectedObj.size.width, height: val}
                                        });
                                    }
                                }
                                break;
                            }
                            default:
                                break;
                        }
                    } else {
                        physicsUtils.setInitialProperty(selectedObj, propName, val);
                        this.setState({
                            [propName]: val
                        });
                    }
                }
                break;
            }
            default:
                break;
        }
    }


    render() {
        const { selectedObj } = this.props;

        const renderProperties = () => {
            switch (selectedObj.type) {
                case 'body':
                    return (this.visibleBodyProperties.map(p => <SelectedObjectPaneProperty key={p} label={p} value={this.state[p]} handleChange={this.handleInputChange} />));
                case 'constraint': {
                    return (this.visibleConstraintProperties.map(p => <SelectedObjectPaneProperty key={p} label={p} value={this.state[p]} handleChange={this.handleInputChange} />));
                }
                case 'composite': {
                    if (selectedObj.label === 'World') {
                        return (this.visibleWorldProperties.map(p => <SelectedObjectPaneProperty key={p} label={p} value={this.state[p]} handleChange={this.handleWorldInputChange} />));
                    }
                }
            }
        }

        return (
            <div className='selected-object-pane'>
                <h2>Selected Object</h2>
                <p>Object ID: {selectedObj.id}</p>
                <ul className='selected-object-property-list'>
                    {renderProperties()}
                </ul>
            </div>
        );
    }
}

SelectedObjectPane.propTypes = {
    selectedObj: React.PropTypes.object.isRequired,
};

export default connect(state => ({
    propertiesPanelNeedsRefresh: state.propertiesPanelNeedsRefresh
}))(SelectedObjectPane);
