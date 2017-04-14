/* eslint
    "class-methods-use-this": "off"
 */
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import * as actions from 'actions';

import playIcon from 'images/Play-48-black.png';
import stopIcon from 'images/Stop-48-black.png';
import restartIcon from 'images/Restart-48-black.png';
import pauseIcon from 'images/Pause-48-black.png';
import setaLogo from 'images/seta-logo@3x.png';
import FixedPanel from 'components/FixedPanel';
import CloseButton from 'components/CloseButton';

class MenuPanel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            help: false
        };

        this.handlePlay = this.handlePlay.bind(this);
        this.togglePlay = this.togglePlay.bind(this);
        this.handleStop = this.handleStop.bind(this);
        this.handleRestart = this.handleRestart.bind(this);
        this.changeState = this.changeState.bind(this);
    }

    togglePlay() {
        const { dispatch } = this.props;
        dispatch(actions.toggleIsPlaying());
    }

    handlePlay() {
        const { dispatch } = this.props;
        dispatch(actions.setIsPlaying(true));
        dispatch(actions.setSelectedObject(-1));
        dispatch(actions.setPrimativesPanelSelection(''));
    }

    handleStop() {
        const { dispatch } = this.props;
        dispatch(actions.setIsPlaying(false));
    }

    handleRestart() {
        const { dispatch } = this.props;
        dispatch(actions.needsRestart(true));
    }

    changeState(prop, value) {
        this.setState({
            [prop]: value
        });
    }

    render() {
        const { isPlaying } = this.props;
        return (
            <div className='panel menu-panel'>
                <div className='menu-left'>
                    <Link to='/'><img src={setaLogo} alt='seta logo'/></Link>
                    {/* <p>new</p> */}
                    {/* <p>load</p> */}
                    {/* <p>save</p> */}
                    <div>
                        <p onClick={() => {this.changeState('help', true)}}>help</p>
                        <FixedPanel
                            visible={this.state.help}
                            style={{
                                backgroundColor: 'orange',
                                border: '1px solid darkgray',
                                width: '600px'
                            }}
                        >
                            <h2>FAQ</h2>
                            <ol>
                                <li>
                                    <h3>How do I deselect an on object!?</h3>
                                    <p>To deselect an object in the left panel, simply click the item that is currently selected, or just pres the ESC key on your keyboard.</p>
                                </li>
                                <li>
                                    <h3>What are sensors good for?</h3>
                                    <p>Sensors don't collide with other game objects, so they can be used to trigger events, like changing worlds, on incrementing score.</p>
                                </li>
                                <li>
                                    <h3>How do I change the properties of objects?</h3>
                                    <p>When you select a game object, by either clicking on it directly, or clicking on it's name in the right panel, you'll see a bunch of properties appear in the lower right hand corner of the screen.  There are the physical properties like mass, friction, etc.</p>
                                </li>
                                <li>
                                    <h3>What units are those properties in?</h3>
                                    <p>Unfortunately, due to the nature of physics engines, it's tricky to use real world units, since the browser works in pixels.  So for now, the units are somewhat arbitrary, but play around with them to get a feel for what different numbers do.</p>
                                </li>
                            </ol>
                            <CloseButton onClick={() =>{ this.changeState('help', false)}} />
                        </FixedPanel>
                    </div>
                </div>
                <div className='menu-right'>
                    <button className='menu-panel-button' onClick={isPlaying ? this.handleStop : this.handlePlay}><img src={isPlaying ? pauseIcon : playIcon} alt='play/pause' /></button>
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
