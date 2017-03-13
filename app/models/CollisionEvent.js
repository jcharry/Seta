function CollisionEvent(stateId, bodyId, collidingBody, action, resolution) {
    this.gameState = stateId;
    this.body = bodyId;
    this.collidingBody = collidingBody;
    this.action = action;
    this.resolution = resolution;
    this.id = `b${bodyId}-c${collidingBody}-a${action}-s${stateId}`;
    this.type = 'collision';
}

export default CollisionEvent;
