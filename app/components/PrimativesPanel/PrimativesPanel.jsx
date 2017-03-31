import React from 'react';
import { connect } from 'react-redux';
import PrimativesList from 'components/PrimativesPanel/PrimativesList';

import rectImg from 'images/Rectangle/Inactive.png';
import rectImgActive from 'images/Rectangle/Active.png';
import circleImg from 'images/Oval/Inactive.png';
import circleImgActive from 'images/Oval/Active.png';
// import polyImg from 'images/Polygon/Inactive.png';
// import polyImgActive from 'images/Polygon/Active.png';
// import ropeImg from 'images/Rope.png';
import rodImg from 'images/Line-48-black.png';
import rodImgActive from 'images/Line-48-white.png';
import springImg from 'images/Spring-black.png';
import springImgActive from 'images/Spring-white.png';
import sensorImg from 'images/Sensor-50-black.png';
import sensorImgActive from 'images/Sensor-50-white.png';
import textImg from 'images/Text-50-black.png';
import textImgActive from 'images/Text-50-white.png';

import * as actions from 'actions';

import placeRect from 'images/place-rect.png';
import clickRect from 'images/click-rect.png';
import placeSpring from 'images/place-spring.png';
import clickSpring from 'images/click-spring.png';

// TODO: Swap out black icons for white ones when selected
class PrimativesPanel extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.handleHelpHover = this.handleHelpHover.bind(this);
    }

    handleHelpHover(e) {

    }

    handleClick(targetName) {
        const { dispatch, primativesPanelSelection } = this.props;

        // If the targetName is the same as what's currently in the store,
        // then clear out the selected item (i.e. deselect everythign)
        let id = targetName;
        if (targetName === primativesPanelSelection) {
            id = '';
        }
        dispatch(actions.setPrimativesPanelSelection(id));
    }

    render() {
        const { primativesPanelSelection, isPlaying } = this.props;
        const panes = [
            {
                title: 'Shapes',
                tooltipContent:
                    <div className='tooltip-content'>
                        <div className='column'>
                            <h2>1. Select a shape by clicking on it</h2>
                            <img src={clickRect} />
                        </div>
                        <div className='column'>
                            <h2>2. Place the shape by clicking on the game world</h2>
                            <img src={placeRect} />
                        </div>
                    </div>,
                items: [{title: 'Rectangle', activeImg: rectImgActive, img: rectImg, active: false}, {title: 'Circle', activeImg: circleImgActive, img: circleImg, active: false}]
            },
            {
                title: 'Connectors',
                tooltipContent:
                    <div className='tooltip-content'>
                        <div className='column'>
                            <h2>1. Select a connector</h2>
                            <img src={clickSpring} />
                        </div>
                        <div className='column'>
                            <h2>2. Click on the first body, then the second</h2>
                            <img src={placeSpring} />
                        </div>
                    </div>,
                items: [{title: 'Spring', activeImg: springImgActive, img: springImg, active: false}, {title: 'Rod', activeImg: rodImgActive, img: rodImg, active: false}]
            },
            {
                title: 'Misc',
                tooltipContent:
                    <div>
                        <h2>1. Sensors don't interact with objects, so they are useful for creating events</h2>
                        <h2>2. Text can be used to give the player instructions on how to play your game</h2>
                    </div>,
                items: [
                    {title: 'Sensor', activeImg: sensorImgActive, img: sensorImg, active: false},
                    {title: 'Text', activeImg: textImgActive, img: textImg, active: false}
                ]
            }
        ];   //eslint-disable-line
        panes.forEach(pane => {
            pane.items.forEach(item => {
                if (item.title === primativesPanelSelection) {
                    item.active = true;     //eslint-disable-line
                } else {
                    item.active = false;    //eslint-disable-line
                }
            });
        });

        const renderPanes = () => panes.map(pane =>
            <PrimativesList itemClickHandler={this.handleClick} key={pane.title} helpHoverHandler={this.handleHelpHover} tooltipContent={pane.tooltipContent} title={pane.title} items={pane.items} />
        );

        let clsName = 'panel primatives-panel';
        if (isPlaying) {
            clsName += ' inactive';
        }
        return (
            <div className={clsName}>
                {renderPanes()}
            </div>
        );
    }
}

PrimativesPanel.propTypes = {
    dispatch: React.PropTypes.func.isRequired,
    primativesPanelSelection: React.PropTypes.string.isRequired,
    isPlaying: React.PropTypes.bool.isRequired
};

export default connect(state => ({
    primativesPanelSelection: state.primativesPanelSelection,
    isPlaying: state.isPlaying
}))(PrimativesPanel);
