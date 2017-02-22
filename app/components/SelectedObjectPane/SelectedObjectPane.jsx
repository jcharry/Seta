import React from 'react';
import SelectedObjectPaneProperty from 'components/SelectedObjectPane/SelectedObjectPaneProperty';
import physicsUtils from 'utils/physicsUtils';
// import Matter from 'matter-js';

class SelectedObjectPane extends React.Component {
    constructor(props) {
        super(props);
        const { body } = this.props;

        // initialize state with current properties
        this.visibleProperties = ['position', 'velocity', 'scale', 'angle', 'force', 'angularVelocity', 'isStatic', 'density', 'timeScale', 'mass', 'inertia'];

        this.state = {};
        this.visibleProperties.forEach(p => {
            this.state[p] = body[p];
        });

        this.handleInputChange = this.handleInputChange.bind(this);
    }

    /**
     * When the selectedBody switches,
     * we need to refresh the state with the values
     * from the currently selected body, otherwise
     * the input box values will be stale
    */
    componentDidUpdate(prevProps) {
        const { body } = this.props;
        const newStateObj = {};

        // Grab properties off currently selected body
        this.visibleProperties.forEach(p => {
            newStateObj[p] = body[p];
        });

        // Only set the state if the selected body changes
        // The handleInputChange method takes care of setting
        // state when the input boxes change
        if (body.id !== prevProps.body.id) {
            this.setState(newStateObj);     //eslint-disable-line
        }
    }

    handleInputChange(e) {
        const { body } = this.props;

        const propName = e.target.name;
        switch (e.target.type) {
            case 'checkbox': {
                physicsUtils.setInitialProperty(body, propName, e.target.checked);
                this.setState({
                    [propName]: e.target.checked
                });
                break;
            }
            case 'text': {
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
                                const newPos = { ...body.position };
                                newPos[propName[propName.length - 1]] = val;
                                physicsUtils.setInitialProperty(body, 'position', newPos);
                                this.setState({
                                    position: newPos
                                });
                                break;
                            }
                            case 'velocity:y':
                            case 'velocity:x': {
                                const newVel = { ...body.velocity };
                                newVel[propName[propName.length - 1]] = val;
                                physicsUtils.setInitialProperty(body, 'velocity', newVel);
                                this.setState({
                                    velocity: newVel
                                });
                                break;
                            }
                            case 'force:x':
                            case 'force:y': {
                                break;
                            }
                            default:
                                break;
                        }
                    } else {
                        physicsUtils.setInitialProperty(body, propName, val);
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
        const { body } = this.props;

        const renderProperties = () =>
            this.visibleProperties.map(p => <SelectedObjectPaneProperty key={p} label={p} value={this.state[p]} handleChange={this.handleInputChange} />);

        return (
            <div className='selected-object-pane'>
                <h2>Selected Object</h2>
                <p>Object ID: {body.id}</p>
                <ul className='selected-object-property-list'>
                    {renderProperties()}
                </ul>
            </div>
        );
    }
}

SelectedObjectPane.propTypes = {
    body: React.PropTypes.object.isRequired
};

export default SelectedObjectPane;
