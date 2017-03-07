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
import GameState from 'models/GameState';
import _ from 'underscore';

class GameCanvas extends React.Component {
    componentDidMount() {
        const { dispatch } = this.props;

        // Bound class methods
        this.renderCanvas = this.renderCanvas.bind(this);
        this.updateEngine = this.updateEngine.bind(this);
        this.drawSelectedBody = this.drawSelectedBody.bind(this);
        this.initializeEventListeners = this.initializeEventListeners.bind(this);
        this.initializeMatterCollisionEvents = this.initializeMatterCollisionEvents.bind(this);
        this.clearEngineEvents = this.clearEngineEvents.bind(this);
        this.refresh = this.refresh.bind(this);
        this.cleanupScene = this.cleanupScene.bind(this);
        this.pan = this.pan.bind(this);
        this.canvasOffset = { x: 0, y: 0 };
        this.lastMousePos = { x: 0, y: 0 };

        // XXX: FOR DEBUG purposes only, don't forget to remove
        window.seta = this;

        // Prop used for drawing temporary constraints on the canvas
        this.selectedBodyForConstraint = null;

        // TODO: Store globally for now...
        window.Matter = Matter;

        // Bounding rect of canvas in DOM, to be used for Matter Engine
        const { width, height } = this.container.getBoundingClientRect();
        this.canvas.width = width;
        this.canvas.height = height;
        this.ctx = this.canvas.getContext('2d');

        // Translate the ctx to ensure clean lines
        // see here - http://stackoverflow.com/questions/7530593/html5-canvas-and-line-width/7531540#7531540
        this.ctx.translate(0.5, 0.5);

        // Capture Matter.Mouse for user interaction
        this.mouse = Matter.Mouse.create(this.canvas);

        // Hold game states data here.  Also store which state is active
        // on redux store
        this.gameStates = {};
        this.activeState = new GameState(dispatch, this.canvas);
        this.gameStates[this.activeState.id] = this.activeState;
        this.activeState.world.bounds.min.x = -300;
        this.activeState.world.bounds.min.y = -300;
        this.activeState.world.bounds.max.x = width + 300;
        this.activeState.world.bounds.max.y = height + 300;
        dispatch(actions.addGameState(this.activeState.id));

        // XXX: Remember to remove this!
        // Just for testing
        // window.globalBodies = this.bodies;
        window.as = this.activeState;

        // Canvas Mouse Event Listeners
        this.initializeEventListeners();
        this.initializeMatterCollisionEvents();

        // create two boxes and a ground
        const boxA = this.activeState.bodyFactory('Rectangle', { x: 400, y: 200, width: 80, height: 80 });
        const boxB = this.activeState.bodyFactory('Rectangle', { x: 450, y: 50, width: 80, height: 80 });
        const ground = this.activeState.bodyFactory('Rectangle', { x: 400, y: 610, width: 810, height: 60 });

        this.activeState.addBodies([boxA, boxB, ground], this.props.isPlaying);

        // Kick off the animation
        this.renderCanvas();
    }

    componentDidUpdate(prevProps) {
        console.log('canvas did update');
        const {
            needsRestart,
            needsNewGameState,
            gameStates,
            primativesPanelSelection,
            gameObjects,
            behaviors
        } = this.props;


        //FIXME: Handle behaviors situation, not sure best way to do that yet

        if (!_.isEqual(prevProps.behaviors, behaviors)) {
            if (behaviors.length > prevProps.behaviors.length) {
                this.activeState.behaviors.push(behaviors[behaviors.length - 1]);
            }
        }

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

        // Have the game objects changed?
        if (!_.isEqual(prevProps.gameObjects, gameObjects)) {
            const pkeys = Object.keys(prevProps.gameObjects);
            const keys = Object.keys(gameObjects);

            if (pkeys.length > keys.length) {
                // Removed an object
                // Find difference in changed bodies
                const diff = _.difference(pkeys, keys);
                const type = prevProps.gameObjects[diff[0]].type;
                if (diff[0]) {
                    this.activeState.removeGameObject(type, diff[0]);
                }
            }

            // Don't worry about adding an object (since that is
            // taken care of by the gameState and canvas mouse
            // events
        }

        // If the Selected Primative is changed and it's not a constraint,
        // clear out this. to ensure we dont' keep drawing the temporary
        // constraint
        if (!_.isEqual(prevProps.primativesPanelSelection, primativesPanelSelection) && primativesPanelSelection !== 'Rope' && primativesPanelSelection !== 'Spring' && primativesPanelSelection !== 'Rod') {
            this.selectedBodyForConstraint = null;
        }
    }

    refresh() {
        this.activeState.restore();
    }

    cleanupScene() {
        console.log('should remove dynamically generated bodies');
        console.log(this);
    }

    /**
     * Creates a new Game State and adds it to the
     * store
    */
    addGameState() {
        const { dispatch } = this.props;
        const newGameState = new GameState(dispatch, this.canvas);
        this.gameStates[newGameState.id] = newGameState;
        dispatch(actions.needsNewGameState(false));
        dispatch(actions.addGameState(newGameState.id));
    }

    switchGameState() {
        // Switch what this.activeState points to
        const { gameStates, dispatch } = this.props;
        Object.keys(gameStates).forEach(id => {
            // Redux store keeps track of which game state is active
            // i.e. gameStates[id] === true for active state
            // and === false for all others
            if (gameStates[id]) {
                this.activeState.restore();
                this.activeState = this.gameStates[id];
                this.activeState.restore();
            }
        });

        // TODO: Make sure this isn't just piling on events...
        // SHit.. it is...
        this.clearEngineEvents();
        this.initializeMatterCollisionEvents();

        // Make sure game is not playing
        dispatch(actions.setIsPlaying(false));
    }

    /**
     * Set up all event listeners for canvas interactions
    */
    initializeEventListeners() {
        const { dispatch } = this.props;
        console.log('initializing event listeners');
        // If the mouse is dragging, i.e this.isMouseDown = true
        // and mouse is moving, then query for bodies, and update positions
        // TODO: figure out how to force the properties panel to re-render

        // Capture body on mousedown to be dragged in mousemove
        let draggableBody;

        // Keep track of where in the body the user clicks
        // for more natural dragging
        let mouseBodyOffsetX = 0;
        let mouseBodyOffsetY = 0;


        this.canvas.addEventListener('mousedown', () => {
            const { primativesPanelSelection } = this.props;
            this.isMouseDown = true;
            console.log('mousedown at ', this.mouse.mousedownPosition);

            // Keep track of mouse position for panning
            this.lastMousePos.x = this.mouse.mousedownPosition.x;
            this.lastMousePos.y = this.mouse.mousedownPosition.y;

            // Handle a few different cases
            // 1. If user clicks while an object is selected in the left panel,
            // Add primative body
            if (primativesPanelSelection === 'Rectangle' || primativesPanelSelection === 'Circle') {
                // Add the body to the world
                const body = this.activeState.bodyFactory(
                    primativesPanelSelection, {
                        x: this.mouse.mousedownPosition.x,
                        y: this.mouse.mousedownPosition.y
                    }
                );
                this.activeState.addBody(body, this.props.isPlaying);
            }                                                       //eslint-disable-line

            // 2. If a constraint is selected
            else if (primativesPanelSelection === 'Rope' || primativesPanelSelection === 'Spring' || primativesPanelSelection === 'Rod') {
                // Add constraints to 2 bodies.  Have to query bodies
                // Need to know if it's the first or second click.  When we
                // register a body on click, keep track of the pair
                console.log('constraint selected');
                const bodies = Matter.Query.point(this.activeState.bodies, this.mouse.mousedownPosition);
                if (bodies.length > 0) {
                    const b = bodies[0];
                    if (this.selectedBodyForConstraint) {
                        // Second body selected, add constraint, clear out
                        // selected body
                        if (b !== this.selectedBodyForConstraint) {
                            this.activeState.addConstraint(
                                primativesPanelSelection,
                                this.selectedBodyForConstraint,
                                b
                            );
                            // Matter.World.add(this.engine.world, c);
                            this.selectedBodyForConstraint = null;
                        }
                    } else {
                        this.selectedBodyForConstraint = b;
                    }
                }
            }                                                       //eslint-disable-line

            // 3. Nothing Selected, query for bodies
            else {
                const bodies = Matter.Query.point(this.activeState.bodies, this.mouse.mousedownPosition);
                if (bodies.length > 0) {
                    const b = bodies[0];
                    draggableBody = b;
                    mouseBodyOffsetX = this.mouse.mousedownPosition.x - b.position.x;
                    mouseBodyOffsetY = this.mouse.mousedownPosition.y - b.position.y;
                    dispatch(actions.setSelectedObject(b.id));
                } else {
                    dispatch(actions.setSelectedObject(-1));
                }
            }
        });

        this.canvas.addEventListener('mousemove', () => {
            if (this.isMouseDown) {
                if (draggableBody) {
                    this.activeState.setInitialProperty(draggableBody, 'position', { x: this.mouse.position.x - mouseBodyOffsetX, y: this.mouse.position.y - mouseBodyOffsetY });
                    dispatch(actions.propertiesPanelNeedsRefresh(true));
                } else {
                    // Pan the world.
                    this.pan();
                }
            }
        });
        this.canvas.addEventListener('mouseup', () => {
            // FIXME: This doesn't fire if mouse is lifted up outside canvas
            this.isMouseDown = false;
            this.isMouseDragging = false;
            draggableBody = null;

            // Set mouse offset once panning is done
            Matter.Mouse.setOffset(this.mouse, { x: -this.canvasOffset.x, y: -this.canvasOffset.y });
        });

        // let boundsScaleTarget = 1,
        //     boundsScale = {
        //         x: 1,
        //         y: 1
        //     };

        // Matter.Events.on(this.activeState.engine, 'beforeTick', function() {
        //     console.log('beforetick');
        //     const world = this.engine.world,
        //         mouse = this.mouseConstraint.mouse;
        //     let translate;
        //
        //     // mouse wheel controls zoom
        //     // const scaleFactor = mouse.wheelDelta * -0.1;
        //     // if (scaleFactor !== 0) {
        //     //     if ((scaleFactor < 0 && boundsScale.x >= 0.6) || (scaleFactor > 0 && boundsScale.x <= 1.4)) {
        //     //         boundsScaleTarget += scaleFactor;
        //     //     }
        //     // }
        //     //
        //     // // if scale has changed
        //     // if (Math.abs(boundsScale.x - boundsScaleTarget) > 0.01) {
        //     //     // smoothly tween scale factor
        //     //     scaleFactor = (boundsScaleTarget - boundsScale.x) * 0.2;
        //     //     boundsScale.x += scaleFactor;
        //     //     boundsScale.y += scaleFactor;
        //     //
        //     //     // scale the this.renderBounds
        //     //     this.renderBounds.max.x = render.bounds.min.x + render.options.width * boundsScale.x;
        //     //     this.renderBounds.max.y = render.bounds.min.y + render.options.height * boundsScale.y;
        //     //
        //     //     // translate so zoom is from centre of view
        //     //     translate = {
        //     //         x: render.options.width * scaleFactor * -0.5,
        //     //         y: render.options.height * scaleFactor * -0.5
        //     //     };
        //     //
        //     //     Bounds.translate(this.renderBounds, translate);
        //     //
        //     //     // update mouse
        //     //     Mouse.setScale(mouse, boundsScale);
        //     //     Mouse.setOffset(mouse, this.renderBounds.min);
        //     // }
        //     //
        //     // // get vector from mouse relative to centre of viewport
        //
        //     // translate the view if mouse has moved over 50px from the centre of viewport
        // });
    }

    clearEngineEvents() {
        Matter.Events.off(this.activeState.engine, 'collisionStart');
        Matter.Events.off(this.activeState.engine, 'collisionActive');
        Matter.Events.off(this.activeState.engine, 'collisionEnd');
    }

    initializeMatterCollisionEvents() {
        // an example of using collisionStart event on an engine
        Matter.Events.on(this.activeState.engine, 'collisionStart', event => {
            const pairs = event.pairs;

            // change object colours to show those starting a collision
            for (let i = 0; i < pairs.length; i++) {
                const pair = pairs[i];
                pair.bodyA.render.fillStyle = '#333';
                pair.bodyB.render.fillStyle = '#333';
            }
        });

        // an example of using collisionActive event on an engine
        Matter.Events.on(this.activeState.engine, 'collisionActive', event => {
            const pairs = event.pairs;

            // change object colours to show those in an active collision (e.g. resting contact)
            for (let i = 0; i < pairs.length; i++) {
                const pair = pairs[i];
                pair.bodyA.render.fillStyle = '#333';
                pair.bodyB.render.fillStyle = '#333';
            }
        });

        // an example of using collisionEnd event on an engine
        Matter.Events.on(this.activeState.engine, 'collisionEnd', event => {
            const pairs = event.pairs;

            // change object colours to show those ending a collision
            for (let i = 0; i < pairs.length; i++) {
                const pair = pairs[i];

                pair.bodyA.render.fillStyle = '#fff';
                pair.bodyB.render.fillStyle = '#fff';
            }
        });
    }

    pan() {
        const world = this.activeState.world;
        const renderBounds = this.activeState.renderBounds;
        // const startX = this.mouse.mousedownPosition.x;
        // const startY = this.mouse.mousedownPosition.y;
        const lastX = this.lastMousePos.x;
        const lastY = this.lastMousePos.y;
        const currentX = this.mouse.position.x;
        const currentY = this.mouse.position.y;

        // Get direction of drag
        let dx = currentX - lastX;
        let dy = currentY - lastY;
        // const translate = Matter.Vector.create(dx, dy);

        // restrict panning to world bounds
        if (this.canvasOffset.x + dx < world.bounds.min.x) {
            dx = 0;
        }
        if (this.canvasOffset.x + renderBounds.max.x + dx > world.bounds.max.x) {
            dx = 0;
        }
        if (this.canvasOffset.y + dy < world.bounds.min.y) {
            dy = 0;
        }
        if (this.canvasOffset.y + renderBounds.max.y + dy > world.bounds.max.y) {
            dy = 0;
        }

        this.canvasOffset.x += dx;
        this.canvasOffset.y += dy;

        // reset last pos for next update
        this.lastMousePos.x = currentX;
        this.lastMousePos.y = currentY;

        // Matter.Mouse.setOffset(this.mouse, renderBounds.min);
        this.ctx.translate(dx, dy);
    }

    /**
     * Run a step of Matter.Engine to update the position of the bodies in the
     * world.  Should only fire when isPlaying is set to true
     * @param {number} timeStep - usually set to 16.666
    */
    updateEngine(timeStep) {
        Matter.Engine.update(this.activeState.engine, timeStep);
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

    drawTemporaryConstraint() {
        if (this.selectedBodyForConstraint) {
            this.ctx.beginPath();
            this.ctx.moveTo(this.selectedBodyForConstraint.position.x, this.selectedBodyForConstraint.position.y);
            this.ctx.lineTo(this.mouse.position.x, this.mouse.position.y);
            this.ctx.strokeStyle = 'red';
            this.ctx.stroke();
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

        // clear the canvas with a transparent fill, to allow the canvas background to show
        const worldX = this.activeState.world.bounds.min.x;
        const worldY = this.activeState.world.bounds.min.y;
        const worldWidth = this.activeState.world.bounds.max.x - worldX;
        const worldHeight = this.activeState.world.bounds.max.y - worldY;

        this.ctx.globalCompositeOperation = 'source-in';
        this.ctx.fillStyle = 'transparent';
        this.ctx.fillRect(worldX, worldY, worldWidth, worldHeight);
        this.ctx.globalCompositeOperation = 'source-over';

        this.ctx.fillStyle = '#fff';
        this.ctx.fillRect(worldX, worldY, worldWidth, worldHeight);

        if (isPlaying) {
            this.updateEngine(16.666);
        }


        for (let i = 0; i < this.activeState.bodies.length; i++) {
            this.ctx.beginPath();
            const body = this.activeState.bodies[i];
            if (body) {
                this.ctx.strokeStyle = body.render.strokeStyle;
                this.ctx.fillStyle = body.render.fillStyle || 'transparent';
                this.ctx.lineWidth = 1;
                if (body.id === selectedObject) {
                    this.ctx.strokeStyle = 'darkgreen';
                    this.ctx.fillStyle = 'lightgreen';
                    this.ctx.lineWidth = 2;
                }

                const vertices = body.vertices;

                this.ctx.moveTo(vertices[0].x, vertices[0].y);

                for (let j = 1; j < vertices.length; j += 1) {
                    this.ctx.lineTo(vertices[j].x, vertices[j].y);
                }

                this.ctx.lineTo(vertices[0].x, vertices[0].y);

                this.ctx.stroke();
                this.ctx.fill();
            }
        }

        for (let i = 0; i < this.activeState.constraints.length; i++) {
            const c = this.activeState.constraints[i];
            if (c.type !== 'mouseConstraint') {
                this.ctx.beginPath();
                this.ctx.moveTo(c.bodyA.position.x, c.bodyA.position.y);
                this.ctx.lineTo(c.bodyB.position.x, c.bodyB.position.y);
                this.ctx.strokeStyle = 'red';
                this.ctx.lineWidth = 1;
                if (c.id === selectedObject) {
                    this.ctx.strokeStyle = 'green';
                    this.ctx.lineWidth = 3;
                }
                this.ctx.stroke();
            }
        }

        if (primativesPanelSelection !== '') {
            this.drawSelectedObject();
        }

        if (this.selectedBodyForConstraint) {
            this.drawTemporaryConstraint();
        }

        // this.pan();
        window.requestAnimationFrame(this.renderCanvas);
    }

    /**
     * React Lifecycle
     * Just draw the canvas
    */
    render() {
        return (
            <div className='game-canvas' ref={elt => { this.container = elt; }}>
                <canvas ref={elt => { window.canvas = elt; this.canvas = elt; }} id='game-canvas' />
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
    gameStates: React.PropTypes.object.isRequired,
    gameObjects: React.PropTypes.object.isRequired,
    behaviors: React.PropTypes.array.isRequired
};

export default connect(state => ({
    isPlaying: state.isPlaying,
    primativesPanelSelection: state.primativesPanelSelection,
    needsRestart: state.needsRestart,
    selectedObject: state.selectedObject,
    needsNewGameState: state.needsNewGameState,
    gameStates: state.gameStates,
    gameObjects: state.gameObjects,
    behaviors: state.behaviors
}))(GameCanvas);
