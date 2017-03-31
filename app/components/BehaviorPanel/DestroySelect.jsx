/*
 * DestroySelect.jsx
 * Copyright (C) 2017 jamiecharry <jamiecharry@Jamies-Air-2.home>
 *
 * Distributed under terms of the MIT license.
 */
import React from 'react';

class DestroySelect extends React.Component {
    render() {
        const { selected, options, value, handleChange } = this.props;

        const renderLabel = (opt) => {
            if (opt.id === selected) {
                return 'itself';
            }
            return `${opt.id}: ${opt.name || opt.label}`;
        }

        const renderOptions = () => {
            if (typeof options === 'object' && options.length) {
                // Array
                // XXX: Really stupid solution, but we have to make sure the
                // user changes the selected value at least once to ensure
                // the handleChange handler gets fired, ensuring the state
                // of the behavior panel is up to date.
                return ([<option value='-1' key='-1'>---</option>]).concat(options.map(opt => <option value={opt.id} key={opt.id}>{renderLabel(opt)}</option>));
            }
            return null;
        };

        return (
            <div className='inputs'>
                <select name='destroy' value={value} onChange={handleChange}>
                    {renderOptions()}
                </select>
            </div>

        );
    }
}

DestroySelect.propTypes = {
    options: React.PropTypes.oneOfType([
        React.PropTypes.array,
        React.PropTypes.object
    ]).isRequired,
    value: React.PropTypes.string.isRequired,
    handleChange: React.PropTypes.func.isRequired
};

export default DestroySelect;
