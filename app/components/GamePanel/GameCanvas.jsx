/* global window */
/*
 * GameCanvas.jsx
 * Copyright (C) 2017 jamiecharry <jamiecharry@Jamies-Air-2.home>
 *
 * Distributed under terms of the MIT license.
 */

import React from 'react';
import { connect } from 'react-redux';
import Matter from 'matter-js';
import * as actions from 'actions';
// import * as utils from 'utils';
import physicsUtils from 'utils/physicsUtils';
import GameState from './GameState';
import _ from 'underscore';

class GameCanvas extends React.Component {
    componentDidMount() {
        const { dispatch } = this.props;
        // Bound class methods
        this.renderCanvas = this.renderCanvas.bind(this);
        this.updateEngine = this.updateEngine.bind(this);
        this.drawSelectedBody = this.drawSelectedBody.bind(this);
        // this.addBody = this.addBody.bind(this);
        this.initializeEventListeners = this.initializeEventListeners.bind(this);
        this.refresh = this.refresh.bind(this);
        this.cleanupScene = this.cleanupScene.bind(this);

        // TODO: Store globally for now...
        window.Matter = Matter;

        // create an engine
        this.engine = Matter.Engine.create();

        // Bounding rect of canvas in DOM, to be used for Matter Engine
        const { width, height } = this.container.getBoundingClientRect();
        this.canvas.width = width;
        this.canvas.height = height;

        this.ctx = this.canvas.getContext('2d');

        // Capture Matter.Mouse for user interaction
        this.mouse = Matter.Mouse.create(this.canvas);

        // create a renderer
        // this.renderMatter = Matter.Render.create({
        //     canvas: this.canvas,
        //     engine: this.engine,
        //     options: {
        //         width,
        //         height,
        //         pixelRatio: 1,
        //         background: '#000000',
        //         wireframeBackground: '#333',
        //         hasBounds: true,
        //         enabled: true,
        //         wireframes: true,
        //         showSleeping: true,
        //         showDebug: true,
        //         showBroadphase: true,
        //         showBounds: false,
        //         showVelocity: false,
        //         showCollisions: true,
        //         showSeparations: true,
        //         showAxes: true,
        //         showPositions: true,
        //         showAngleIndicator: true,
        //         showIds: true,
        //         showShadows: true,
        //         showVertexNumbers: true,
        //         showConvexHulls: true,
        //         showInternalEdges: true,
        //         showMousePosition: true
        //     }
        // });

        // this.renderMatter.mouse = this.mouse;
        this.gameStates = {};
        const initialGameState = new GameState(this.engine.world, dispatch);
        this.gameStates[initialGameState.id] = initialGameState;
        this.activeState = initialGameState;
        dispatch(actions.addGameState(initialGameState.id));
        // console.log(gameState);
        // this.gameStates.push({
        //     id: 1,
        //     bodies: [],
        //     initialBodies: []
        // });

        // this.bodies = [];
        // this.initialBodies = [];
        // XXX: Remember to remove this!
        // Just for testing
        // window.globalBodies = this.bodies;
        window.as = this.activeState;

        this.initializeEventListeners();

        // create two boxes and a ground
        const boxA = physicsUtils.bodyFactory('Rectangle', { x: 400, y: 200, width: 80, height: 80 });
        const boxB = physicsUtils.bodyFactory('Rectangle', { x: 450, y: 50, width: 80, height: 80 });
        const ground = physicsUtils.bodyFactory('Rectangle', { x: 400, y: 610, width: 810, height: 60 });

        this.activeState.addBodies([boxA, boxB, ground], this.props.isPlaying);
        // Matter.World.add(this.engine.world, [boxA, boxB, ground]);
        // this.activeState.addBody(boxA, world, dispatch, isPlaying);
        // this.activeState.addBody(boxB, world, dispatch, isPlaying);
        // this.activeState.addBody(ground, world, dispatch, isPlaying);

        // Kick off the animation
        this.renderCanvas();
    }

    componentDidUpdate(prevProps) {
        console.log('canvas did update');
        const { needsRestart, needsNewGameState, gameStates } = this.props;

        // Update all bodies on a stage reset
        if (prevProps.needsRestart !== needsRestart && needsRestart) {
            this.refresh();
        }

        // Should we add a new game state?
        if (prevProps.needsNewGameState !== needsNewGameState && needsNewGameState) {
            this.addGameState();
        }

        // Do we need to switch game states?
        if (!_.isEqual(prevProps.gameStates, gameStates)) {
            console.log('should switch game states');
            this.switchGameState();
        }
        // let prevGameState = prevProps.gameStates.filter(gs => {
        //     return gs.active;
        // })[0];
        // let currentGameState = gameStates.filter(gs => {
        //     return gs.active;
        // })[0];
        // if (prevGameState.id !== currentGameState.id) {
        //     this.switchGameState(currentGameState.id);
        // }

        // gameStates.forEach()

        // for (let i = 0; i < gameState.length; i++) {
        //     if ()
        // }
    }

    refresh() {
        this.activeState.restore();
        // const { dispatch } = this.props;
        //
        // dispatch(actions.needsRestart(false));
        //
        // // Remove all bodies generated during play
        // this.cleanupScene();
        //
        // // Restore all initial bodies to their initial states
        // this.activeState.initialBodies.forEach(body => {
        //     physicsUtils.restore(body);
        // });
        //
        // // Ensure the engine doesn't update
        // dispatch(actions.setIsPlaying(false));
    }

    cleanupScene() {
        console.log('should remove dynamically generated bodies');
        console.log(this);
    }

    /**
     * Add a body to all necessary places
     * 1. this.bodies - holds all bodies in the world
     * 2. this.initialBodies - holds only bodies initialized during creation
     *    phase
     * 3. state.bodies - Redux store so other components can read body
     *    properties
     * @param {Matter.Body} body
    */
    // addBody(gameState, body) {
    //     const { dispatch, isPlaying } = this.props;
    //
    //     // Only add a body if we're in the creation phase
    //     // gameState.addBody(body, dispatch, isPlaying);
    //
    //     // if (!isPlaying) {
    //     //     this.initialBodies.push(body);
    //     //     this.bodies.push(body);
    //     //     Matter.World.add(this.engine.world, body);
    //     //     dispatch(actions.addBody(body));
    //     // } else {
    //     //     this.bodies.push(body);
    //     //     dispatch(actions.addBody(body));
    //     // }
    // }

    /**
     * Creates a new Game State and adds it to the
     * store
    */
    addGameState() {
        const { dispatch } = this.props;
        const newGameState = new GameState(this.engine.world, dispatch);
        this.gameStates[newGameState.id] = newGameState;
        dispatch(actions.needsNewGameState(false));
        dispatch(actions.addGameState(newGameState.id));
    }

    switchGameState(id) {
        // Switch what this.activeState points to
        const { gameStates, dispatch } = this.props;
        console.log('switching game state');
        Object.keys(gameStates).forEach(id => {
            // gameState[id].restore();
            // gameState[id].clearWorld();
            if (gameStates[id]) {
                this.activeState = this.gameStates[id];
                this.activeState.restore();
            }
        });

        // Make sure game is not playing
        dispatch(actions.setIsPlaying(false));
        // this.activeState = gameStates.filter(gs => {
        //     return gs.active;
        // })[0];
        // debugger;
        // gameStates.forEach(gs => {
        //     // if (gs.id === stateId);
        // });
    }

    loadGameState() {

    }

    clearGameState() {

    }

    /**
     * Set up all event listeners for canvas interactions
    */
    initializeEventListeners() {
        this.canvas.addEventListener('mousedown', () => {
            const { dispatch, primativesPanelSelection } = this.props;
            console.log(this.mouse.mousedownPosition);

            // Handle a few different cases
            // 1. If user clicks while an object is selected in the left panel,
            //    then add the body to the world
            if (primativesPanelSelection === 'Rectangle' || primativesPanelSelection === 'Circle') {
                // Add the body to the world
                const body = physicsUtils.bodyFactory(
                    primativesPanelSelection, {
                        x: this.mouse.mousedownPosition.x,
                        y: this.mouse.mousedownPosition.y
                    }
                );
                this.activeState.addBody(body, this.props.isPlaying);
            } else {
                // 2. If nothing is selected in any panel, then query for Matter
                //    Bodies already in the world.
                const bodies = Matter.Query.point(this.activeState.bodies, this.mouse.mousedownPosition);
                if (bodies.length > 0) {
                    const b = bodies[0];
                    console.log(b);
                    dispatch(actions.setSelectedObject(b.id));
                } else {
                    dispatch(actions.setSelectedObject(-1));
                }
            }
        });
    }

    /**
     * Run a step of Matter.Engine to update the position of the bodies in the
     * world.  Should only fire when isPlaying is set to true
     * @param {number} timeStep - usually set to 16.666
    */
    updateEngine(timeStep) {
        Matter.Engine.update(this.engine, timeStep);
    }

    /**
     * Draw an outline of whatever is selected in the PrimativesPanel
    */
    drawSelectedBody() {
        const { primativesPanelSelection } = this.props;
        this.ctx.beginPath();
        this.ctx.strokeStyle = 'red';
        switch (primativesPanelSelection) {
            case 'Rectangle':
                this.ctx.rect(this.mouse.position.x - 25, this.mouse.position.y - 25, 50, 50);
                this.ctx.stroke();
                break;
            case 'Circle':
                this.ctx.arc(this.mouse.position.x, this.mouse.position.y, 50, 0, Math.PI * 2);
                this.ctx.stroke();
                break;
            case 'Polygon':
                break;
            default:
                break;
        }
    }

    /**
     * Handle different rendering cases for PrimativePanel Selection
    */
    drawSelectedObject() {
        const { primativesPanelSelection } = this.props;
        switch (primativesPanelSelection) {
            case 'Rectangle':
            case 'Circle':
            case 'Polygon':
                this.drawSelectedBody.call(this);
                break;
            //TODO: Handle these cases, which require two clicks...
            case 'Rope':
            case 'Spring':
            case 'Rod':
                break;
            default:
                break;
        }
    }

    /**
     * Renderer
    */
    renderCanvas() {
        const { isPlaying, primativesPanelSelection, selectedObject } = this.props;

        this.ctx.fillStyle = '#fff';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        if (isPlaying) {
            this.updateEngine(16.666);
        }


        for (let i = 0; i < this.activeState.bodies.length; i += 1) {
            this.ctx.beginPath();
            const body = this.activeState.bodies[i];
            if (body.id === selectedObject) {
                this.ctx.strokeStyle = 'green';
                this.ctx.lineWidth = 3;
            } else {
                this.ctx.strokeStyle = body.render.strokeStyle;
                this.ctx.lineWidth = 1;
            }
            const vertices = body.vertices;

            this.ctx.moveTo(vertices[0].x, vertices[0].y);

            for (let j = 1; j < vertices.length; j += 1) {
                this.ctx.lineTo(vertices[j].x, vertices[j].y);
            }

            this.ctx.lineTo(vertices[0].x, vertices[0].y);

            this.ctx.stroke();
        }

        // this.ctx.strokeStyle = '#333';

        if (primativesPanelSelection !== '') {
            this.drawSelectedObject();
        }

        window.requestAnimationFrame(this.renderCanvas);
    }

    /**
     * React Lifecycle
     * Just draw the canvas
    */
    render() {
        return (
            <div className='game-canvas' ref={elt => { this.container = elt; }}>
                <canvas ref={elt => { this.canvas = elt; }} id='game-canvas' />
            </div>
        );
    }
}

GameCanvas.defaultProps = {
    selectedObject: -1
};

GameCanvas.propTypes = {
    dispatch: React.PropTypes.func.isRequired,
    isPlaying: React.PropTypes.bool.isRequired,
    primativesPanelSelection: React.PropTypes.string.isRequired,
    needsRestart: React.PropTypes.bool.isRequired,
    selectedObject: React.PropTypes.number,
    needsNewGameState: React.PropTypes.bool.isRequired,
    gameStates: React.PropTypes.array.isRequired
    // bodies: React.PropTypes.object
};

export default connect(state => ({
    isPlaying: state.isPlaying,
    primativesPanelSelection: state.primativesPanelSelection,
    needsRestart: state.needsRestart,
    selectedObject: state.selectedObject,
    needsNewGameState: state.needsNewGameState,
    gameStates: state.gameStates
}))(GameCanvas);
