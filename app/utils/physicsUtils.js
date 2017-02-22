import Matter from 'matter-js';
import * as utils from 'utils/utils';

const physicsUtils = {
    bodySetters: {
        position: Matter.Body.setPosition,
        scale: Matter.Body.scale,
        angle: Matter.Body.setAngle,
        force: Matter.Body.applyForce,
        velocity: Matter.Body.setVelocity,
        angularVelocity: Matter.Body.setAngularVelocity,
        mass: Matter.Body.setMass,
        inertia: Matter.Body.setInertia,
        isStatic: Matter.Body.setStatic,
        density: Matter.Body.setDensity
    }
};

physicsUtils.prototype = {
    /**
     * Generic Function to create bodies
     * Only good for Matter.Bodies
     * Creates the body, and stores it's initial
     * state (i.e. posiiton, velocity, etc) so
     * the body can be reset
     * @param {string} type - Matter body type
     * @param {object} params
     * @return {Matter.Body} body
     */
    bodyFactory(type, params) {
        // Get basic params, don't worry about other Matter.Body params, those
        // are settable in the Selected Object Panel
        const x = params.x,
            y = params.y;

        const width = params.width === undefined ? 50 : params.width,
            height = params.height === undefined ? 50 : params.height,
            radius = params.radius === undefined ? 50 : params.radius;

        // Make Body
        let b;
        switch (type) {
            case 'Rectangle':
                b = Matter.Bodies.rectangle(x, y, width, height);
                break;
            case 'Circle':
                b = Matter.Bodies.circle(x, y, radius);
                break;
            case 'Polygon':
                b = null;
                break;
            default:
                b = null;
                break;
        }

        // Store the initial state
        if (b) {
            this.storeInitialState(b);
        }
        return b;
    },

    /**
     * Helper to pull off necessary properties
     * to restore initial state of the body
     * @param {Matter.Body} body
     */
    storeInitialState(body) {
        body.originalProperties = {};       // eslint-disable-line
        const p = body.originalProperties;    // shorthand
        p.position = utils.clone(body.position);
        p.velocity = utils.clone(body.velocity);
        p.isStatic = body.isStatic;
        p.isSleeping = false;
        p.mass = body.mass;
        p.density = body.density;
        p.inertia = body.inertia;
        p.angle = body.angle;
        p.angularVelocity = body.angularVelocity;
        p.scale = 1;
    },

    setInitialProperty(body, property, value) {
        Matter.Body.set(body, property, value);
        this.storeInitialState(body);
        // body.originalProperties[property] = value;
    },

    /**
     * Reset all the properties of the body
     * Use during a stage reset
     * @param {Matter.Body} body
    */
    restore(body) {
        Matter.Body.set(body, body.originalProperties);
    },

    setProperty(body, property, value) {
        Matter.Body.set(body, property, value);
    }
};

export default Object.create(physicsUtils.prototype);
