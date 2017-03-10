import React from 'react';
import SelectedObjectPaneProperty from 'components/SelectedObjectPane/SelectedObjectPaneProperty';
import { connect } from 'react-redux';
import * as actions from 'actions';
import GameState from 'models/GameState';
// import Matter from 'matter-js';

class SelectedObjectPane extends React.Component {
    constructor(props) {
        super(props);
        // const { selectedObj } = this.props;

        this.handleInputChange = this.handleInputChange.bind(this);
        this.updateBodyProperties = this.updateBodyProperties.bind(this);
        this.updateConstraintProperties = this.updateConstraintProperties.bind(this);
        this.constructState = this.constructState.bind(this);

        this.readableLabels = {
            position: 'Position',
            velocity: 'Velocity',
            size: 'Size',
            angle: 'Rotation',
            force: 'Force',
            angularVelocity: 'Spin Rate',
            isStatic: 'Fixed',
            density: 'Density',
            timeScale: 'Time Scale',
            mass: 'Mass',
            inertia: 'Inertia',
            gravity: 'Gravity',
            stiffness: 'Stiffness',
            length: 'Length',
            hasAir: 'Has Air?',
            friction: 'Friction',
            frictionAir: 'Air Friction',
            frictionStatic: 'Static Friction',
            restitution: 'Bounciness'
        };

        // initialize state with current properties
        this.visibleBodyProperties = [
            'size',
            'position',
            'velocity',
            'angle',
            'isStatic',
            'restitution',
            'force',
            'angularVelocity',
            'density',
            'mass',
            'friction',
            'frictionAir',
            'frictionStatic'
        ];

        this.visibleConstraintProperties = [
            'stiffness',
            'length'
        ];

        this.visibleWorldProperties = [
            'gravity',
            'hasAir'
        ];

        this.state = this.constructState();
    }


    /**
     * When the selectedBody switches,
     * we need to refresh the state with the values
     * from the currently selected body, otherwise
     * the input box values will be stale
    */
    componentDidUpdate(prevProps) {
        const { selectedObj, dispatch, propertiesPanelNeedsRefresh } = this.props;
        // const newStateObj = {};

        if (propertiesPanelNeedsRefresh !== prevProps.propertiesPanelNeedsRefresh &&
            propertiesPanelNeedsRefresh === true) {
            dispatch(actions.propertiesPanelNeedsRefresh(false));
        }

        // Only set the state if the selected body changes
        // The handleInputChange method takes care of setting
        // state when the input boxes change
        if (selectedObj.id !== prevProps.selectedObj.id) {
            this.setState(this.constructState());     //eslint-disable-line
        }
    }

    constructState() {
        const { selectedObj } = this.props;
        const newState = {};
        switch (selectedObj.type) {
            case 'body':
                this.visibleBodyProperties.forEach(p => {
                    newState[p] = selectedObj[p];
                });
                break;
            case 'constraint':
                this.visibleConstraintProperties.forEach(p => {
                    newState[p] = selectedObj[p];
                });
                break;
            case 'composite':
                this.visibleWorldProperties.forEach(p => {
                    newState[p] = selectedObj[p];
                });
                break;
            default:
                break;
        }
        return newState;
        // this.setState(newState);
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
            case 'composite':
                if (selectedObj.label === 'World') {
                    this.updateBodyProperties(e);
                } else {
                    this.updateCompositeProperties(e);
                }
                break;
            default:
                break;
        }
    }

    updateCompositeProperties(e) {
        console.log(e);
        console.log(this);
    }

    // updateWorldProperties(e) {
    //     // const { selectedObj } = this.props;
    //     // const propName = e.target.name;
    //     // switch (e.target.type) {
    //     //     case 'text': {
    //     //         const val = parseFloat(e.target.value);
    //     //         if (val || val === 0) {
    //     //             switch (propName) {
    //     //                 default:
    //     //                     break;
    //     //             }
    //     //         }
    //     //     }
    //     //     default:
    //     //         break;
    //     // }
    // }

    updateConstraintProperties(e) {
        const { selectedObj } = this.props;
        console.log(selectedObj);
        console.log(this);
        console.log(e);
    }

    updateBodyProperties(e) {
        const { selectedObj } = this.props;
        const propName = e.target.name;
        switch (e.target.type) {
            case 'checkbox': {
                if (propName === 'hasAir') {
                    console.log('switching hasAir', e.target.checked);
                    GameState.setAirFriction(selectedObj, e.target.checked);
                } else {
                    // dispatch()
                    GameState.setInitialProperty(selectedObj, propName, e.target.checked);
                }

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
                                GameState.setInitialProperty(selectedObj, 'position', newPos);
                                this.setState({
                                    position: newPos
                                });
                                break;
                            }
                            case 'velocity:y':
                            case 'velocity:x': {
                                const newVel = { ...selectedObj.velocity };
                                newVel[propName[propName.length - 1]] = val;
                                GameState.setInitialProperty(selectedObj, 'velocity', newVel);
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
                                    GameState.setInitialProperty(selectedObj, 'size', { radius: val });
                                    this.setState({
                                        size: { radius: val }
                                    });
                                } else if (selectedObj.label === 'Rectangle Body') {
                                    // Check if width or height changed
                                    if (propName.split(':')[1] === 'width') {
                                        GameState.setInitialProperty(selectedObj, 'size', { width: val, height: selectedObj.size.height });
                                        this.setState({
                                            size: { width: val, height: selectedObj.size.height }
                                        });
                                    } else {
                                        // Must be height
                                        GameState.setInitialProperty(selectedObj, 'size', { width: selectedObj.size.width, height: val });
                                        this.setState({
                                            size: { width: selectedObj.size.width, height: val }
                                        });
                                    }
                                }
                                break;
                            }

                            // WORLD PROPERTIES
                            case 'gravity:x':
                            case 'gravity:y': {
                                const grav = { ...selectedObj.gravity };
                                grav[propName.slice(-1)] = val;
                                selectedObj.gravity = grav;
                                this.setState({
                                    gravity: grav
                                });
                                break;
                            }
                            default:
                                break;
                        }
                    } else {
                        GameState.setInitialProperty(selectedObj, propName, val);
                        this.setState({
                            [propName]: val
                        });
                    }
                } else {
                    // Input cannot be coerced into a number
                    // set the state, but don't set any body properties
                    if (propName.indexOf(':') !== -1) {
                        // We have an object to set
                        const props = propName.split(':');
                        const newState = { ...selectedObj[props[0]] };
                        if (e.target.value === '') {
                            newState[props[1]] = '';
                        } else if (e.target.value === '.') {
                            newState[props[1]] = '.';
                        } else if (e.target.value === '0.') {
                            newState[props[1]] = '0.';
                        }
                        this.setState({
                            [props[0]]: newState
                        });

                    } else {
                        let retVal = '';
                        if (e.target.value === '.') {
                            retVal = '.';
                        } else if (e.target.value === '0.') {
                            retVal = '0.';
                        }
                        // just a primative
                        this.setState({
                            [propName]: retVal
                        });
                    }
                }
            }
            default:
                break;
        }

        function getVal(input) {
            if (input === '') {
                return input;
            }
        }
    }


    render() {
        const { selectedObj } = this.props;

        const renderProperties = () => {
            switch (selectedObj.type) {
                case 'body':
                    return (this.visibleBodyProperties.map(p => <SelectedObjectPaneProperty key={p} label={p} readableLabel={this.readableLabels[p]} value={this.state[p]} handleChange={this.handleInputChange} />));
                case 'constraint': {
                    return (this.visibleConstraintProperties.map(p => <SelectedObjectPaneProperty key={p} label={p} readableLabel={this.readableLabels[p]} value={this.state[p]} handleChange={this.handleInputChange} />));
                }
                case 'composite': {
                    if (selectedObj.label === 'World') {
                        return (this.visibleWorldProperties.map(p => <SelectedObjectPaneProperty key={p} label={p} readableLabel={this.readableLabels[p]} value={this.state[p]} handleChange={this.handleInputChange} ignoreProps={['scale']} />));
                    }
                    return <div />;
                }
                default:
                    return <div />;
            }
        };

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
    dispatch: React.PropTypes.func.isRequired,
    propertiesPanelNeedsRefresh: React.PropTypes.bool.isRequired
};

export default connect(state => ({
    propertiesPanelNeedsRefresh: state.propertiesPanelNeedsRefresh
}))(SelectedObjectPane);
