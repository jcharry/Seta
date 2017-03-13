function ControlEvent(stateId, bodyId, key, action, resolution) {
    this.gameState = stateId;
    this.body = bodyId;
    this.key = key;
    this.action = action;
    this.resolution = resolution;
    this.id = `b${bodyId}-k${key}-a${action}-s${stateId}`;
    this.type = 'control';
}

export default ControlEvent;
