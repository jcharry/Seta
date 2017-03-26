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
        this.handleTextInput = this.handleTextInput.bind(this);
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
            restitution: 'Bounciness',
            bounds: 'World Bounds'
        };

        this.inputTruncation = {
            position: 2,
            velocity: 2,
            size: 2,
            angle: 2,
            angularVelocity: 2,
            length: 2,
            bounds: 2
            // density: 4,
            // mass: 2,
            // inertia: 2,
            // gravity: 2,
            // stiffness: 0,
            // friction: 2,
            // frictionAir: 4,
            // frictionStatic: 2,
            // restitution: 2,
        }

        // initialize state with current properties
        this.visibleBodyProperties = [
            'size',
            'position',
            'velocity',
            'angle',
            'isStatic',
            'restitution',
            // 'force',
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
            'hasAir',
            'bounds'
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

    // FIXME: Needs some help
    // 1. Generalize updating individual properties as much as possible
    handleTextInput(e) {
        const { selectedObj } = this.props;
        const propName = e.target.name;
        // Data was entered in a text box.  Only proceed if the value
        // can be parsed into a number
        const val = parseFloat(e.target.value);
        if (val || val === 0) {
            // Vector properties (like position, velocity)
            // return a name with a colon separating the
            // prop name and the component name - e.g.
            // position:x
            if (propName.indexOf(':') !== -1) {
                let props = propName.split(':');
                switch (propName) {
                    // TODO: This could be optimized, but no need
                    // right now, it works fine...
                    case 'position:y':
                    case 'position:x':
                    case 'velocity:y':
                    case 'velocity:x': {
                        const newState = { ...selectedObj[props[0]] };
                        newState[props[1]] = val.toFixed(this.inputTruncation[props[0]]);
                        GameState.setInitialProperty(selectedObj, props[0], newState);
                        this.setState({
                            [props[0]]: newState
                        });
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
                            if (props[1] === 'width') {
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
                        grav[props[1]] = val;
                        selectedObj.gravity = grav;
                        this.setState({
                            gravity: grav
                        });
                        break;
                    }
                    case 'bounds:min:x':
                    case 'bounds:min:y':
                    case 'bounds:max:x':
                    case 'bounds:max:y': {
                        console.log(propName, val);
                        let valueToChange = props[2];
                        let minOrMax = props[1];
                        let newBounds = {
                            min: {...this.state.bounds.min},
                            max: {...this.state.bounds.max}
                        };
                        newBounds[minOrMax][valueToChange] = val;

                        // Update the world itself
                        selectedObj.bounds = newBounds;

                        this.setState({
                            bounds: newBounds
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
            // propName could be of the form 'velocity:x' or just
            // 'angularVelocity'
            if (propName.indexOf(':') !== -1) {
                const props = propName.split(':');
                const newState = { ...selectedObj[props[0]] };
                let newValue = e.target.value;
                switch (props.length) {
                    case 2:
                        newState[props[1]] = newValue;
                        break;;
                    case 3:
                        newState[props[1]][props[2]] = newValue;
                        break;
                }
                this.setState({
                    [props[0]]: newState
                });
            } else {
                let newState = e.target.value;
                this.setState({
                    [propName]: newState
                });
            }
        }
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
                    GameState.setInitialProperty(selectedObj, propName, e.target.checked);
                }

                this.setState({
                    [propName]: e.target.checked
                });
                break;
            }
            case 'text': {
                this.handleTextInput(e);
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
                    return (this.visibleBodyProperties.map((p, i) => <SelectedObjectPaneProperty idx={i} key={p} truncateDecimal={this.inputTruncation[p]} label={p} readableLabel={this.readableLabels[p]} value={this.state[p]} handleChange={this.handleInputChange} />));
                case 'constraint': {
                    return (this.visibleConstraintProperties.map((p, i) => <SelectedObjectPaneProperty idx={i} key={p} truncateDecimal={this.inputTruncation[p]} label={p} readableLabel={this.readableLabels[p]} value={this.state[p]} handleChange={this.handleInputChange} />));
                }
                case 'composite': {
                    if (selectedObj.label === 'World') {
                        return this.visibleWorldProperties.map((p, i) => <SelectedObjectPaneProperty idx={i} key={p} truncateDecimal={this.inputTruncation[p]} label={p} readableLabel={this.readableLabels[p]} value={this.state[p]} handleChange={this.handleInputChange} ignoreProps={['scale']} />);
                    }
                    return <div />;
                }
                default:
                    return <div />;
            }
        };

        return (
            <div className='selected-object-pane'>
                <h2>Physical Properties</h2>
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
