export const PropertyDecimalTruncations = {
    position: 2,
    velocity: 2,
    size: 2,
    angle: 2,
    angularVelocity: 2,
    length: 2,
    bounds: 2,
    // density: 4,
    mass: 2,
    // inertia: 2,
    // gravity: 2,
    // stiffness: 0,
    // friction: 2,
    // frictionAir: 4,
    // frictionStatic: 2,
    // restitution: 2,
};

const PropertyTypes = {
    obj: 'OBJECT',
    primative: 'PRIMATIVE',
    bounds: 'BOUNDS'
};

export const PropertyMap = {
    position: PropertyTypes.obj,
    velocity: PropertyTypes.obj,
    size: PropertyTypes.obj,
    angle: PropertyTypes.primative,
    angularVelocity: PropertyTypes.primative,
    length: PropertyTypes.primative,
    bounds: PropertyTypes.bounds,
    density: PropertyTypes.primative,
    mass: PropertyTypes.primative,
    inertia: PropertyTypes.primative,
    gravity: PropertyTypes.obj,
    stiffness: PropertyTypes.primative,
    friction: PropertyTypes.primative,
    frictionAir: PropertyTypes.primative,
    frictionStatic: PropertyTypes.primative,
    restitution: PropertyTypes.primative
};
