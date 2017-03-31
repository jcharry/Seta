function ControlEvent(stateId, bodyId, key, action, resolution, condition) {
    this.gameState = stateId;
    this.body = bodyId;
    this.key = key;
    this.action = action;
    this.resolution = resolution;
    this.id = `b:${bodyId}-k:${key}-a:${action}-r:${resolution}-s:${stateId}`;
    this.type = 'control';
    this.condition = condition;
}

export default ControlEvent;
