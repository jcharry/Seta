import React from 'react';

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
        const { label, value, handleChange, readableLabel, ignoreProps, idx } = this.props;
        const renderInput = () => {
            switch (typeof value) {
                case 'object': {
                    // Several cases, object either looks like this:
                    // {x: 10, y: 20}
                    // or this:
                    // {min: {x: 10, y: 20}, max: {x: 50, y: 60}}

                    // Check for a nested object
                    if (value.min) {
                        return Object.keys(value).reduce((acc, curr) => {
                            const v = value[curr];
                            Object.keys(v).forEach(p => {
                                acc.push(
                                    <div key={`${curr}:${p}`} style={{ display: 'flex', flexDirection: 'column' }}>
                                        <input type='text' onChange={handleChange} name={`${label}:${curr}:${p}`} value={value[curr][p]} />
                                        <label htmlFor={`${label}:${curr}:${p}`}>{`${curr}:${p}`}</label>
                                    </div>
                                );
                            });
                            return acc;
                        }, []);
                    }

                    // Else, we have a normal object
                    return Object.keys(value).filter(prop => {
                        if (ignoreProps) {
                            if (ignoreProps.indexOf(prop) === -1) {
                                return true;
                            }
                            return false;
                        }
                        return true;
                    })
                    .map(prop => (
                        <div key={prop} style={{ display: 'flex', flexDirection: 'column' }}>
                            <input type='text' onChange={handleChange} name={`${label}:${prop}`} value={value[prop]} />
                            <label htmlFor={`${label}:${prop}`}>{prop}</label>
                        </div>
                    ));
                }

                case 'number':
                case 'string': {
                    return <input type='text' onChange={handleChange} name={label} value={value === Infinity ? 0 : value} />;
                }

                case 'boolean': {
                    return <input type='checkbox' name={label} checked={value} onChange={handleChange} />;
                }
                default:
                    return <div />;
            }
        };

        let clsName = 'selected-object-property-list-item';
        if (idx % 2 === 0) clsName += ' alternate';
        return (
            <li className={clsName}>
                <div className='left'>
                    <p>{readableLabel || label}</p>
                </div>
                <div className='right'>
                    {renderInput()}
                </div>
            </li>
        );
    }
}

SelectedObjectPaneProperty.defaultProps = {
    value: '',
    ignoreProps: null,
    readableLabel: null
};

SelectedObjectPaneProperty.propTypes = {
    label: React.PropTypes.string.isRequired,
    value: React.PropTypes.any,
    handleChange: React.PropTypes.func.isRequired,
    readableLabel: React.PropTypes.string,
    ignoreProps: React.PropTypes.array
};

export default SelectedObjectPaneProperty;
