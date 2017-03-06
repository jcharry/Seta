import React from 'react';
import { connect } from 'react-redux';
import PrimativesList from 'components/PrimativesPanel/PrimativesList';

import rectImg from 'images/Rectangle.png';
import circleImg from 'images/Circle.png';
import polyImg from 'images/Polygon.png';
import ropeImg from 'images/Rope.png';
import rodImg from 'images/Rod.png';
import springImg from 'images/Spring.png';

import * as actions from 'actions';


// TODO: Swap out black icons for white ones when selected
class PrimativesPanel extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
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
        const { primativesPanelSelection } = this.props;
        const panes = [{title: 'Shapes', items: [{title: 'Rectangle', image: rectImg, active: false}, {title: 'Circle', image: circleImg, active: false}, {title: 'Polygon', image: polyImg, active: false}]}, {title: 'Connectors', items: [{title: 'Rope', image: ropeImg, active: false}, {title: 'Spring', image: springImg, active: false}, {title: 'Rod', image: rodImg, active: false}]}];   //eslint-disable-line
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
            <PrimativesList itemClickHandler={this.handleClick} key={pane.title} title={pane.title} items={pane.items} />
        );

        return (
            <div className='panel primatives-panel'>
                {renderPanes()}
            </div>
        );
    }
}

PrimativesPanel.propTypes = {
    dispatch: React.PropTypes.func.isRequired,
    primativesPanelSelection: React.PropTypes.string.isRequired
};

export default connect(state => ({
    primativesPanelSelection: state.primativesPanelSelection
}))(PrimativesPanel);
