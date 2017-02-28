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
        // this.addBody = this.addBody.bind(this);
        this.initializeEventListeners = this.initializeEventListeners.bind(this);
        this.refresh = this.refresh.bind(this);
        this.cleanupScene = this.cleanupScene.bind(this);
        this.pan = this.pan.bind(this);
        this.canvasOffset = { x: 0, y: 0 };
        this.lastMousePos = { x: 0, y: 0 };

        window.game = this;

        this.selectedBodyForConstraint = null;

        // TODO: Store globally for now...
        window.Matter = Matter;


        // Bounding rect of canvas in DOM, to be used for Matter Engine
        const { width, height } = this.container.getBoundingClientRect();
        this.canvas.width = width;
        this.canvas.height = height;

        // create an engine
        // this.engine = Matter.Engine.create();

        this.ctx = this.canvas.getContext('2d');

        // Capture Matter.Mouse for user interaction
        this.mouse = Matter.Mouse.create(this.canvas);
        // this.mouseConstraint = Matter.MouseConstraint.create(this.engine, {
        //     mouse: this.mouse,
        //     constraint: {
        //         stiffness: 1
        //     }
        // });

        // Matter.World.add(this.engine.world, this.mouseConstraint);

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

        this.gameStates = {};
        this.activeState = new GameState(dispatch, this.canvas);

        this.gameStates[this.activeState.id] = this.activeState;

        this.activeState.world.bounds.min.x = -300;
        this.activeState.world.bounds.min.y = -300;
        this.activeState.world.bounds.max.x = width + 300;
        this.activeState.world.bounds.max.y = height + 300;
        // this.activeState.constraints.push(this.mouseConstraint);
        dispatch(actions.addGameState(this.activeState.id));
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
        const boxA = this.activeState.bodyFactory('Rectangle', { x: 400, y: 200, width: 80, height: 80 });
        const boxB = this.activeState.bodyFactory('Rectangle', { x: 450, y: 50, width: 80, height: 80 });
        const ground = this.activeState.bodyFactory('Rectangle', { x: 400, y: 610, width: 810, height: 60 });

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
        const { needsRestart, needsNewGameState, gameStates, primativesPanelSelection } = this.props;

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

        // If the Selected Primative is changed and it's not a constraint,
        // clear out this. to ensure we dont' keep drawing the temporary
        // constraint
        if (!_.isEqual(prevProps.primativesPanelSelection, primativesPanelSelection) && primativesPanelSelection !== 'Rope' && primativesPanelSelection !== 'Spring' && primativesPanelSelection !== 'Rod') {
            this.selectedBodyForConstraint = null;
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

        // Make sure game is not playing
        dispatch(actions.setIsPlaying(false));
        // this.activeState = gameStates.filter(gs => {
        //     return gs.active;
        // })[0];
        // gameStates.forEach(gs => {
        //     // if (gs.id === stateId);
        // });
    }

    // loadGameState() {
    //
    // }
    //
    // clearGameState() {
    //
    // }

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


        // if (renderBounds.min.x + translate.x < world.bounds.min.x) {
        //     translate.x = world.bounds.min.x - renderBounds.min.x;
        // }
        //
        // if (renderBounds.max.x + translate.x > world.bounds.max.x) {
        //     translate.x = world.bounds.max.x - renderBounds.max.x;
        // }
        //
        // if (renderBounds.min.y + translate.y < world.bounds.min.y) {
        //     translate.y = world.bounds.min.y - renderBounds.min.y;
        // }
        //
        // if (renderBounds.max.y + translate.y > world.bounds.max.y) {
        //     translate.y = world.bounds.max.y - renderBounds.max.y;
        // }
            //
        this.canvasOffset.x += dx;
        this.canvasOffset.y += dy;
        console.log(this.canvasOffset);

        // reset last pos for next update
        this.lastMousePos.x = currentX;
        this.lastMousePos.y = currentY;

        // move the view
        // Matter.Bounds.translate(renderBounds, translate);

        // we must update the mouse too
        // renderBounds.min.x += dx;
        // renderBounds.min.y += dy;
        // renderBounds.max.x += dx;
        // renderBounds.max.y += dy;

        // Matter.Mouse.setOffset(this.mouse, renderBounds.min);
        this.ctx.translate(dx, dy);


        // this.canvasOffset.x = startPos.x - this.mouse.position.x;
        // this.canvasOffset.y = startPos.x - this.mouse.position.y;

        // const viewportCentre = {
        //     x: this.canvas.width / 2,
        //     y: this.canvas.height / 2
        // };
        // let translate;
        // const world = this.activeState.world;
        // var deltaCentre = Matter.Vector.sub(this.mouse.absolute, viewportCentre),
        //     centreDist = Matter.Vector.magnitude(deltaCentre);
        //
        // if (centreDist > 50) {
        //     // create a vector to translate the view, allowing the user to control view speed
        //     var direction = Matter.Vector.normalise(deltaCentre),
        //         speed = Math.min(10, Math.pow(centreDist - 50, 2) * 0.0002);
        //
        //     translate = Matter.Vector.mult(direction, speed);
        //
        //     // prevent the view moving outside the world bounds
        //     if (this.activeState.renderBounds.min.x + translate.x < world.bounds.min.x)
        //         translate.x = world.bounds.min.x - this.activeState.renderBounds.min.x;
        //
        //     if (this.activeState.renderBounds.max.x + translate.x > world.bounds.max.x)
        //         translate.x = world.bounds.max.x - this.activeState.renderBounds.max.x;
        //
        //     if (this.activeState.renderBounds.min.y + translate.y < world.bounds.min.y)
        //         translate.y = world.bounds.min.y - this.activeState.renderBounds.min.y;
        //
        //     if (this.activeState.renderBounds.max.y + translate.y > world.bounds.max.y)
        //         translate.y = world.bounds.max.y - this.activeState.renderBounds.max.y;
        //
        //     // move the view
        //     Matter.Bounds.translate(this.activeState.renderBounds, translate);
        //
        //     // we must update the mouse too
        //     Matter.Mouse.setOffset(this.mouse, this.activeState.renderBounds.min);
        //     this.ctx.translate(-translate.x, -translate.y);
        // }
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
            this.ctx.strokeStyle = body.render.strokeStyle;
            this.ctx.lineWidth = 1;
            if (body.id === selectedObject) {
                this.ctx.strokeStyle = 'green';
                this.ctx.lineWidth = 3;
            }

            const vertices = body.vertices;

            this.ctx.moveTo(vertices[0].x, vertices[0].y);

            for (let j = 1; j < vertices.length; j += 1) {
                this.ctx.lineTo(vertices[j].x, vertices[j].y);
            }

            this.ctx.lineTo(vertices[0].x, vertices[0].y);

            this.ctx.stroke();
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

        // this.ctx.strokeStyle = '#333';

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
    gameStates: React.PropTypes.object.isRequired
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
