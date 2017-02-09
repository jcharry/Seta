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

class GameCanvas extends React.Component {
    componentDidMount() {
        const { dispatch } = this.props;
        // Bound class methods
        this.updateEngine = this.updateEngine.bind(this);
        this.addBody = this.addBody.bind(this);
        this.initializeEventListeners = this.initializeEventListeners.bind(this);

        // TODO: Store globally for now...
        window.Matter = Matter;

        // create an engine
        this.engine = Matter.Engine.create();

        // Bounding rect of canvas in DOM, to be used for Matter Engine
        const { width, height } = this.container.getBoundingClientRect();

        // Capture Matter.Mouse for user interaction
        this.mouse = Matter.Mouse.create(this.canvas);

        // create a renderer
        this.renderMatter = Matter.Render.create({
            canvas: this.canvas,
            engine: this.engine,
            options: {
                width,
                height,
                pixelRatio: 1,
                background: '#123456',
                wireframeBackground: '#222',
                hasBounds: true,
                enabled: true,
                wireframes: true,
                showSleeping: true,
                showDebug: true,
                showBroadphase: true,
                showBounds: false,
                showVelocity: false,
                showCollisions: true,
                showSeparations: true,
                showAxes: true,
                showPositions: true,
                showAngleIndicator: true,
                showIds: true,
                showShadows: true,
                showVertexNumbers: true,
                showConvexHulls: true,
                showInternalEdges: true,
                showMousePosition: true
            }
        });

        this.renderMatter.mouse = this.mouse;

        this.bodies = [];


        this.initializeEventListeners();

        // create two boxes and a ground
        const boxA = Matter.Bodies.rectangle(400, 200, 80, 80);
        const boxB = Matter.Bodies.rectangle(450, 50, 80, 80);
        const ground = Matter.Bodies.rectangle(400, 610, 810, 60, { isStatic: true });
        this.addBody(boxA);
        this.addBody(boxB);
        this.addBody(ground);

        // add all of the bodies to the world
        Matter.World.add(this.engine.world, this.bodies);

        // run the renderer
        Matter.Render.run(this.renderMatter);

        // Kick off the animation
        this.updateEngine();
    }

    initializeEventListeners() {
        const { dispatch } = this.props;
        this.canvas.addEventListener('mousedown', () => {
            console.log(this.mouse.mousedownPosition);
            const bodies = Matter.Query.point(this.bodies, this.mouse.mousedownPosition);
            if (bodies.length > 0) {
                const b = bodies[0];
                console.log(b);
                dispatch(actions.setSelectedObject(b.id));
            }
        });
    }

    addBody(body) {
        const { dispatch } = this.props;
        this.bodies.push(body);
        dispatch(actions.addBody(body));
    }

    componentDidUpdate(prevProps) {
        const { isPlaying } = this.props;

        // Watch for changes in isPlaying
        // restart update if necessary
        if (prevProps.isPlaying !== isPlaying) {
            if (isPlaying) {
                this.updateEngine();
            }
        }
    }

    /**
     * Run a step of Matter.Engine to update the position of the bodies in the
     * world.  Should only fire when isPlaying is set to true
    */
    updateEngine() {
        const { isPlaying } = this.props;
        if (isPlaying) {
            window.requestAnimationFrame(this.updateEngine);
            Matter.Engine.update(this.engine, 16.6666);
        }
    }

    // loop() {
    //     (function render() {
    //         var bodies = Composite.allBodies(engine.world);
    //
    //         window.requestAnimationFrame(render);
    //
    //         context.fillStyle = '#fff';
    //         context.fillRect(0, 0, canvas.width, canvas.height);
    //
    //         context.beginPath();
    //
    //         for (var i = 0; i < bodies.length; i += 1) {
    //             var vertices = bodies[i].vertices;
    //
    //             context.moveTo(vertices[0].x, vertices[0].y);
    //
    //             for (var j = 1; j < vertices.length; j += 1) {
    //                 context.lineTo(vertices[j].x, vertices[j].y);
    //             }
    //
    //             context.lineTo(vertices[0].x, vertices[0].y);
    //         }
    //
    //         context.lineWidth = 1;
    //         context.strokeStyle = '#999';
    //         context.stroke();
    //     })();
    // }

    render() {
        return (
            <div className='game-canvas' ref={elt => { this.container = elt; }}>
                <canvas ref={elt => { this.canvas = elt; }} id='game-canvas' />
            </div>
        );
    }
}

GameCanvas.propTypes = {
    dispatch: React.PropTypes.func.isRequired,
    isPlaying: React.PropTypes.bool.isRequired,
    bodies: React.PropTypes.object
};

export default connect(state => ({
    isPlaying: state.isPlaying
}))(GameCanvas);
