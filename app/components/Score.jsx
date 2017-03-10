/*
 * Score.jsx
 * Copyright (C) 2017 jamiecharry <jamiecharry@Jamies-Air-2.home>
 *
 * Distributed under terms of the MIT license.
 */
import React from 'react';
import { connect } from 'react-redux';

class Score extends React.Component {
    render() {
        const { score } = this.props;
        return (
            <div className='score'>
                <p>Score: {score}</p>
            </div>
        );
    }
}

Score.propTypes = {
    score: React.PropTypes.number.isRequired
};

export default connect(state => ({
    score: state.score
}))(Score);
