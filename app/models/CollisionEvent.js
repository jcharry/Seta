function CollisionEvent(bodyId, collidingBody, action, resolution) {
    this.body = bodyId;
    this.collidingBody = collidingBody;
    this.action = action;
    this.resolution = resolution;
}

export default CollisionEvent;
