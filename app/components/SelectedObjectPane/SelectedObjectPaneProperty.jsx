import React from 'react';
import * as utils from 'utils/utils';

class SelectedObjectPaneProperty extends React.Component {
    constructor(props) {
        super(props);
        this.keyPressed = this.keyPressed.bind(this);
    }

    keyPressed(e) {
        console.log(e.key);
        if (parseInt(e.key) || e.key === '.') {
            console.log(e.key);
            debugger;
            this.props.handleChange(e);
        } else {
            console.warn('not a valid key');
        }
    }
    render() {
        const { label, value, handleChange } = this.props;
        const renderInput = () => {
            switch (typeof value) {
                case 'object': {
                    // TODO: Handle object case
                    return Object.keys(value).map(prop => {
                        return <input type='text' key={prop} onChange={handleChange} name={`${label}:${prop}`} value={value[prop]} />;
                    });
                }
                case 'number':
                case 'string':
                // case 'number':
                    return <input type='text' onChange={handleChange} name={label} value={value === Infinity ? 0 : value} />;
                case 'boolean':
                    return <input type='checkbox' name={label} checked={value} onChange={handleChange} />;
                default:
                    break;
            }

        };

        return (
            <li className='selected-object-property-list-item'>
                <p>{label}</p>
                {renderInput()}
            </li>
        );
    }
}

SelectedObjectPaneProperty.propTypes = {
    label: React.PropTypes.string.isRequired,
    value: React.PropTypes.any.isRequired,
    handleChange: React.PropTypes.func.isRequired
};

export default SelectedObjectPaneProperty;
