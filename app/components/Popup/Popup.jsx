import React from 'react';
import { connect } from 'react-redux';
import { clamp } from 'utils/utils';
import * as actions from 'actions';

class Popup extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.isValid = this.isValid.bind(this);
    }

    isValid(label) {
        const { selectedObject, ignoreLabels, gameObjects } = this.props;
        if (selectedObject !== -1) {
            if (ignoreLabels.indexOf(gameObjects[selectedObject].label) === -1) {
                return true;
            }
        }
        return false;
    }

    componentDidUpdate() {
        console.log('popup did update');
        const { gameObjects, selectedObject, bounds, ignoreLabels } = this.props;

        // Only move it if there's a selected object
        if (this.isValid()) {
            let obj = gameObjects[selectedObject];
            let x, y;
            const eltSize = this._elt.getBoundingClientRect();
            const view = this.props.activeState.camera.view;
            let top, left;

            switch (obj.type) {
                case 'body':
                    x = obj.position.x - view.min.x;
                    y = obj.position.y - view.min.y;
                    top = clamp(y - (eltSize.height * 2), eltSize.height, 0, bounds.height);
                    left = clamp(x - (eltSize.width / 2), eltSize.width, 0, bounds.width);
                    break;
                case 'text':
                    x = obj.x;
                    y = obj.y;
                    top = clamp(y - eltSize.height, eltSize.height, 0, bounds.height);
                    left = clamp(x, eltSize.width, 0, bounds.width);
            }
            // Restrict position based on bounds of container element

            // Popup element size
            this._elt.style.top = `${top}px`;
            this._elt.style.left = `${left}px`;
        }
    }

    handleClick(e) {
        const { dispatch } = this.props;
        switch (e.target.name) {
            case 'properties':
                dispatch(actions.setPopupPanelContent('properties:object'));
                {/* dispatch(actions.closeBehaviorPanel()); */}
                break;
            case 'controls':
            case 'collisions':
                dispatch(actions.setPopupPanelContent('behaviors'));
                {/* dispatch(actions.closeStylePanel()); */}
                break;
            case 'edittext':
                dispatch(actions.setPopupPanelContent('properties:text'))
                break;
            default:
                break;
        }
    }

    render() {
        const { gameObjects, selectedObject, ignoreLabels } = this.props;

        const obj = gameObjects[selectedObject];

        const classes = ['popup', 'hidden'];
        if (this.isValid()) {
            classes.pop();
            classes.push('visible');
        }

        const renderContent = () => {
            if (obj) {
                switch (obj.type) {
                    case 'body':
                        return [
                            <button key='ctrl-btn' name='controls' onClick={this.handleClick}>Controls & Collisions</button>,
                            <button key='prop-btn' name='properties' onClick={this.handleClick}>Properties</button>
                        ];
                        break;
                    case 'text':
                        return <button key='prop-btn' name='edittext' onClick={this.handleClick}>Edit</button>;
                        break;
                    default:
                        break;
                }
            }
        }

        return (
            <div className={classes.join(' ')} ref={c => { this._elt = c; }}>
                {renderContent()}
            </div>
        );
    }
}

Popup.defaultProps = {
    bounds: {}
};

Popup.propTypes = {
    bounds: React.PropTypes.object,
    selectedObject: React.PropTypes.number.isRequired,
    gameObjects: React.PropTypes.object.isRequired,
    propertiesPanelNeedsRefresh: React.PropTypes.bool.isRequired,
    dispatch: React.PropTypes.func.isRequired
};

export default connect(state => ({
    isPlaying: state.isPlaying,
    selectedObject: state.selectedObject,
    gameObjects: state.gameObjects,
    propertiesPanelNeedsRefresh: state.propertiesPanelNeedsRefresh,
    activeState: state.activeState
}))(Popup);
