import * as actions from 'actions';
// import physicsUtils from 'utils/physicsUtils';
import Matter from 'matter-js';
import * as utils from 'utils/utils';

let stateId = 1;

function GameState(dispatch, canvas) {
    this.bodies = [];
    // this.world = world;
    this.engine = Matter.Engine.create();
    this.world = this.engine.world;
    this.world.hasAir = true;
    this.world.originalProperties = {};
    this.constraints = [];
    this.initialBodies = [];
    this.id = stateId++;
    this.dispatch = dispatch;
    this.active = false;
    this.collisionEvents = [];
    this.controls = {};

    // TODO: Behavior system doesn't work properly
    // Need to figure out a better way to handle this
    this.behaviors = [];

    dispatch(actions.addGameObject(this.world));

    // Set bounds
    this.world.bounds.min.x = -300;
    this.world.bounds.min.y = -300;
    this.world.bounds.max.x = canvas.width + 300;
    this.world.bounds.max.y = canvas.height + 300;

    this.renderBounds = {
        min: {
            x: 0,
            y: 0
        },
        max: {
            x: canvas.width,
            y: canvas.height
        }
    };
}


GameState.prototype.setWorldBounds = function(x, y, width, height) {
    this.world.bounds.min.x = x;
    this.world.bounds.min.y = y;
    this.world.bounds.max.x = x + width;
    this.world.bounds.max.y = y + height;
};
GameState.prototype.setRenderBounds = function(x, y, width, height) {
    this.renderBounds.min.x = x;
    this.renderBounds.min.y = y;
    this.renderBounds.max.x = x + width;
    this.renderBounds.max.y = y + height;
};

GameState.prototype.addConstraint = function(type, bodyA, bodyB) {
    let stiffness;
    switch (type) {
        case 'Rope':
            stiffness = 0.1;
            break;
        case 'Rod':
            stiffness = 1;
            break;
        case 'Spring':
            stiffness = 0.5;
            break;
        default:
            break;
    }
    const c = Matter.Constraint.create({
        bodyA,
        bodyB,
        stiffness
    });

    this.constraints.push(c);
    Matter.World.add(this.world, c);
    // TODO: Dispatch an action to
    // keep track of the constraint
    this.dispatch(actions.addGameObject(c));
};

/**
 * Restore body to original state.
 * Some properties, like frictionAir, should not
 * be restored, and only changed through the properties
 * panel directly.
 */
GameState.prototype.restoreBody = function(body) {
    Matter.Body.set(body, {
        ...body.originalProperties,
        frictionAir: body.frictionAir
    });
};

GameState.prototype.setProperty = function(body, property, value) {
    Matter.Body.set(body, property, value);
};

GameState.prototype.setInitialProperty = function(body, property, value) {
    // Size is not a Matter.Body property, but here it's being used
    // to handle scaling objects.  Size holds the current size of the body.
    // Initial size is kept constant on _createdSize prop.  And the current
    // scale is held on body.scaleX and body.scaleY.  These are used
    // to calculate amount of scaleChanged required to make the body the
    // desired size
    if (property === 'size') {
        body.size = value;  //eslint-disable-line

        const initialScaleX = body.scaleX,
            initialScaleY = body.scaleY;

        let targetScaleX,
            targetScaleY;

        if (value.radius) {
            targetScaleX = value.radius / body.originalProperties.creationSize.radius;
            targetScaleY = value.radius / body.originalProperties.creationSize.radius;
        } else {
            targetScaleX = value.width / body.originalProperties.creationSize.width;
            targetScaleY = value.height / body.originalProperties.creationSize.height;
        }

        body.scaleX = targetScaleX;     //eslint-disable-line
        body.scaleY = targetScaleY;     //eslint-disable-line

        const scaleChangeX = targetScaleX / initialScaleX;
        const scaleChangeY = targetScaleY / initialScaleY;
        Matter.Body.scale(body, scaleChangeX, scaleChangeY);
    } else {
        Matter.Body.set(body, property, value);
    }
    this.updateBodyInitialState(body, property);
};


/**
 * Only to be called on body creation.  Set initial properties
 * off the bat
 */
GameState.prototype.initializeBodyState = function(body) {
    body.originalProperties = {};
    const p = body.originalProperties;
    p.density = body.density;
    p.inertia = body.inertia;
    p.inverseInertia = body.inverseInertia;
    p.inverseMass = body.inverseMass;
    p.mass = body.mass;
    p.isStatic = body.isStatic;
    p.position = utils.clone(body.position);
    p.velocity = utils.clone(body.velocity);
    p.angularVelocity = body.angularVelocity;
    p.angle = body.angle;
    p.friction = body.friction;
    p.frictionAir = body.frictionAir;
    p.frictionStatic = body.frictionStatic;
    p.scaleX = body.scaleX;
    p.scaleY = body.scaleY;
    p.creationSize = utils.clone(body._creationSize);
    p.size = utils.clone(body.size);
    p.restitution = body.restitution;
};

GameState.prototype.setAirFriction = function(world, hasAir) {
    console.log('setting air friction', hasAir);
    if (world.label !== 'World') {
        console.warn('cannot pass objects other than World to setAirFriction');
        return;
    }
    world.hasAir = hasAir;

    world.bodies.forEach(body => {
        if (hasAir) {
            Matter.Body.set(body, 'frictionAir', body.originalProperties.frictionAir);
        } else {
            Matter.Body.set(body, 'frictionAir', 0);
        }
    });
}

/**
 * Updates starting properties
 * NOTE: When Matter sets certain props, like mass, or isStatic,
 * it also updates necessarily related properties.  This function
 * is a bit ugly, but we only want to update things that needed
 * to be updated, so we don't override values by mistake.
 * @param {Body} body - the body to update
 * @param {String} property - property being updated
 */
GameState.prototype.updateBodyInitialState = function(body, property) {
    // body.originalProperties = {};       // eslint-disable-line
    const p = body.originalProperties;    // shorthand
    if (property === 'mass' || property === 'density' || property === 'inertia') {
        p.density = body.density;
        p.inertia = body.inertia;
        p.inverseInertia = body.inverseInertia;
        p.inverseMass = body.inverseMass;
        p.mass = body.mass;
    } else if (property === 'isStatic') {
        p.isStatic = body.isStatic;
    } else if (property === 'position' || property === 'velocity' || property === 'angularVelocity' || property === 'angle') {
        p.position = utils.clone(body.position);
        p.velocity = utils.clone(body.velocity);
        p.angularVelocity = body.angularVelocity;
        p.angle = body.angle;
    } else if (property === 'friction' || property === 'frictionAir' || property === 'frictionStatic') {
        p.friction = body.friction;
        p.frictionAir = body.frictionAir;
        p.frictionStatic = body.frictionStatic;
    } else if (property === 'size') {
        p.scaleX = body.scaleX;
        p.scaleY = body.scaleY;
        p.creationSize = utils.clone(body._creationSize);
        p.size = utils.clone(body.size);
    } else if (property === 'restitution') {
        p.restitution = body.restitution;
    }
};

GameState.prototype.bodyFactory = function(type, params) {
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
            b.scaleX = 1;
            b.scaleY = 1;
            b._creationSize = {
                width,
                height
            };
            b.size = {
                width,
                height
            };
            break;
        case 'Circle':
            b = Matter.Bodies.circle(x, y, radius);
            b.scaleX = 1;
            b.scaleY = 1;
            b._creationSize = {
                radius
            };
            b.size = {
                radius
            };
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
        // b.originalProperties = {};
        this.initializeBodyState(b);
        // this.updateBodyInitialState(b);
    }
    return b;
};

GameState.prototype.addBody = function(body, isPlaying) {
    if (isPlaying === undefined || isPlaying === false) {
        this.initialBodies.push(body);
    }
    this.bodies.push(body);
    this.dispatch(actions.addGameObject(body));
    Matter.World.add(this.world, body);
};

GameState.prototype.addBodies = function(bodies, isPlaying) {
    if (typeof bodies === 'object' && bodies.length) {
        bodies.forEach(body => {
            this.addBody(body, isPlaying);
        });
    }
};

GameState.prototype.removeGameObject = function(type, id) {
    switch (type) {
        case 'body':
            this.bodies = this.bodies.filter((body, i) => {
                if (body.id === parseInt(id, 10)) {
                    Matter.World.remove(this.world, body);
                    if (this.initialBodies.indexOf(body) !== -1) {
                        this.initialBodies.splice(i, 1);
                    }
                    return false;
                } else {
                    return true;
                }
            });
            break;
        case 'constraint':
            this.constraints = this.constraints.filter(constraint => {
                if (constraint.id === parseInt(id, 10)) {
                    Matter.World.remove(this.world, constraint);
                    return false;
                } else {
                    return true;
                }
            });
            break;
    }
};

// GameState.prototype.updateBody = function(body, updates) {
// }

GameState.prototype.clearWorld = function() {
    Matter.World.clear(this.world);
};

/**
 * Clear the world of physics bodies,
 * reset bodies to initialized properties,
 * and remove bodies generated during gameplay
 */
GameState.prototype.restore = function() {
    // Need to set redux state "needsRestart" to false,
    // so that we don't update again
    this.dispatch(actions.needsRestart(false));
    Matter.World.clear(this.world);

    this.bodies = [];
    this.dispatch(actions.clearBodies());
    this.dispatch(actions.addGameObject(this.world));
    this.initialBodies.forEach(body => {
        this.bodies.push(body);
        this.restoreBody(body);
        Matter.World.add(this.world, body);
        this.dispatch(actions.addGameObject(body));
    });

    this.constraints.forEach(constraint => {
        Matter.World.add(this.world, constraint);
        if (constraint.type !== 'mouseConstraint') {
            this.dispatch(actions.addGameObject(constraint));
        }
    });

    // Ensure the engine doesn't update
    this.dispatch(actions.setIsPlaying(false));
};

// Static Methods, they cannot (and must not) operate directly on
// instance properties.  These must be functional, not OOP
GameState.setAirFriction = GameState.prototype.setAirFriction;
GameState.setInitialProperty = GameState.prototype.setInitialProperty;
GameState.updateBodyInitialState = GameState.prototype.updateBodyInitialState;


export default GameState;
