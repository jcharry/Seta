/* eslint
    "class-methods-use-this": "off"
 */
import React from 'react';
import { connect } from 'react-redux';
import * as actions from 'actions';

import playIcon from 'images/Play-48-black.png';
import stopIcon from 'images/Stop-48-black.png';
import restartIcon from 'images/Restart-48-black.png';
import pauseIcon from 'images/Pause-48-black.png';

class MenuBar extends React.Component {
    constructor(props) {
        super(props);

        this.handlePlay = this.handlePlay.bind(this);
        this.togglePlay = this.togglePlay.bind(this);
        this.handleStop = this.handleStop.bind(this);
    }

    togglePlay() {
        const { dispatch } = this.props;
        dispatch(actions.toggleIsPlaying());
    }

    handlePlay() {
        const { dispatch } = this.props;
        dispatch(actions.setIsPlaying(true));
    }

    handleStop() {
        const { dispatch } = this.props;
        dispatch(actions.setIsPlaying(false));
    }

    handleRestart() {
        console.log('should restart');
    }

    render() {
        const { isPlaying } = this.props;
        return (
            <div className='menu-bar'>
                <button className='menu-bar-button' onClick={this.togglePlay}><img src={isPlaying ? pauseIcon : playIcon} alt='play/pause' /></button>
                <button className='menu-bar-button' onClick={this.handleStop}><img src={stopIcon} alt='stop' /></button>
                <button className='menu-bar-button' onClick={this.handleRestart}><img src={restartIcon} alt='restart' /></button>
            </div>
        );
    }
}

MenuBar.propTypes = {
    dispatch: React.PropTypes.func.isRequired,
    isPlaying: React.PropTypes.bool.isRequired
};

export default connect(state => ({ isPlaying: state.isPlaying }))(MenuBar);
