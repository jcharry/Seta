import * as actions from 'actions';
import physicsUtils from 'utils/physicsUtils';
import Matter from 'matter-js';

let stateId = 1;

function GameState(world, dispatch) {
    this.bodies = [];
    this.world = world;
    this.initialBodies = [];
    this.id = stateId++;
    this.dispatch = dispatch;
    this.active = false;
}

GameState.prototype.addBody = function(body, isPlaying) {
    if (isPlaying === undefined || isPlaying === false) {
        this.initialBodies.push(body);
    }
    this.bodies.push(body);
    this.dispatch(actions.addBody(body));
    Matter.World.add(this.world, body);
};

GameState.prototype.addBodies = function(bodies, isPlaying) {
    if (typeof bodies === 'object' && bodies.length) {
        bodies.forEach(body => {
            this.addBody(body, isPlaying);
        });
    }
};

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
    this.initialBodies.forEach(body => {
        this.bodies.push(body);
        physicsUtils.restore(body);
        Matter.World.add(this.world, body);
        this.dispatch(actions.addBody(body));
    });

    // Ensure the engine doesn't update
    this.dispatch(actions.setIsPlaying(false));
};

export default GameState;
