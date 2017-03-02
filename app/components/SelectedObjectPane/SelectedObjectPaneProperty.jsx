import React from 'react';
import * as utils from 'utils/utils';

class SelectedObjectPaneProperty extends React.Component {
    constructor(props) {
        super(props);
        this.keyPressed = this.keyPressed.bind(this);
    }

    keyPressed(e) {
        if (parseInt(e.key, 10) || e.key === '.') {
            this.props.handleChange(e);
        } else {
            console.warn('not a valid key');
        }
    }
    render() {
        const { label, value, handleChange, readableLabel, ignoreProps } = this.props;
        const renderInput = () => {
            switch (typeof value) {
                case 'object': {
                    // Create an input for each property on the passed in value
                    // obj, unless the prop is specified as ignored
                    return Object.keys(value).map(prop => {
                        if (ignoreProps) {
                            if (ignoreProps.indexOf(prop) === -1) {
                                return <input type='text' key={prop} onChange={handleChange} name={`${label}:${prop}`} value={value[prop]} />;
                            }
                        } else {
                            return <input type='text' key={prop} onChange={handleChange} name={`${label}:${prop}`} value={value[prop]} />;
                        }
                    });
                }

                case 'number':
                case 'string': {
                    return (<input type='text' onChange={handleChange} name={label} value={value === Infinity ? 0 : value} />);
                }

                case 'boolean': {
                    return (<input type='checkbox' name={label} checked={value} onChange={handleChange} />);
                }
                default:
                    return <div />
            }
            return <div />
        };

        return (
            <li className='selected-object-property-list-item'>
                <p>{readableLabel || label}</p>
                {renderInput()}
            </li>
        );
    }
}

SelectedObjectPaneProperty.defaultProps = {
    value: ''
};

SelectedObjectPaneProperty.propTypes = {
    label: React.PropTypes.string.isRequired,
    value: React.PropTypes.any,
    handleChange: React.PropTypes.func.isRequired,
    readableLabel: React.PropTypes.string
};

export default SelectedObjectPaneProperty;
