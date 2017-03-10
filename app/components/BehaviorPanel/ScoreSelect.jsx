/*
 * ScoreSelect.jsx
 * Copyright (C) 2017 jamiecharry <jamiecharry@Jamies-Air-2.home>
 *
 * Distributed under terms of the MIT license.
 */
import React from 'react';

class ScoreSelect extends React.Component {
    render() {
        const { value, handleChange } = this.props;
        return (
            <div className='inputs'>
                <p>to</p>
                <select name='score' value={value} onChange={handleChange}>
                    <option value='-10'>-10</option>
                    <option value='-9'>-9</option>
                    <option value='-8'>-8</option>
                    <option value='-7'>-7</option>
                    <option value='-6'>-6</option>
                    <option value='-5'>-5</option>
                    <option value='-4'>-4</option>
                    <option value='-3'>-3</option>
                    <option value='-2'>-2</option>
                    <option value='-1'>-1</option>
                    <option value='+1'>+1</option>
                    <option value='+2'>+2</option>
                    <option value='+3'>+3</option>
                    <option value='+4'>+4</option>
                    <option value='+5'>+5</option>
                    <option value='+6'>+6</option>
                    <option value='+7'>+7</option>
                    <option value='+8'>+8</option>
                    <option value='+9'>+9</option>
                    <option value='+10'>+10</option>
                </select>
            </div>
        );
    }
}

ScoreSelect.defaultProps = {
    value: '-1'
};

ScoreSelect.propTypes = {
    value: React.PropTypes.number,
    handleChange: React.PropTypes.func.isRequired
};

export default ScoreSelect;
