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
import setaLogo from 'images/seta-logo@3x.png';

class MenuPanel extends React.Component {
    constructor(props) {
        super(props);

        this.handlePlay = this.handlePlay.bind(this);
        this.togglePlay = this.togglePlay.bind(this);
        this.handleStop = this.handleStop.bind(this);
        this.handleRestart = this.handleRestart.bind(this);
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
        const { dispatch } = this.props;
        dispatch(actions.needsRestart(true));
    }

    render() {
        const { isPlaying } = this.props;
        return (
            <div className='panel menu-panel'>
                <div className='menu-left'>
                    <img src={setaLogo} alt='seta logo'/>
                    <p>new</p>
                    <p>load</p>
                    <p>save</p>
                </div>
                <div className='menu-right'>
                    <button className='menu-panel-button' onClick={this.togglePlay}><img src={isPlaying ? pauseIcon : playIcon} alt='play/pause' /></button>
                    {/* <button className='menu-panel-button' onClick={this.handleStop}><img src={stopIcon} alt='stop' /></button> */}
                    <button className='menu-panel-button' onClick={this.handleRestart}><img src={restartIcon} alt='restart' /></button>
                </div>
            </div>
        );
    }
}

MenuPanel.propTypes = {
    dispatch: React.PropTypes.func.isRequired,
    isPlaying: React.PropTypes.bool.isRequired
};

export default connect(state => ({ isPlaying: state.isPlaying }))(MenuPanel);
