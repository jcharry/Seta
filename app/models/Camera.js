const Camera = {};

/**
 * Initialize the Camera
 * @param {Object} canvas - render canvas
 * @param {Matter.World} world - Matter.World object
 */
Camera.init = function(canvas, world) {
    // this.pixelRatio = 1;
    this.ctx = canvas.getContext('2d');     // Ctx for translating
    this.canvas = canvas;                   // render canvas
    this.world = world;                     // game world
    this.mouse = null;                      // Matter.Mouse, must be attached after instantiation
    this.width = canvas.width;              // View width and height
    this.height = canvas.height;
    this.follow = null;                     // Matter.Body to follow, can be null
    this.view = {                           // Viewport - essentially, what the camera sees
        min: {
            x: 0,
            y: 0
        },
        max: {
            x: canvas.width,
            y: canvas.height
        }
    };
};

/**
 * Translate the View around the world
 * @param {number} x
 * @param {number} y
 */
Camera.translateView = function(x, y) {
    this.view.min.x += x;
    this.view.min.y += y;
    this.view.max.x += x;
    this.view.max.y += y;
    this.ctx.translate(-x, -y);
};

/**
 * Fully reset camera view
 * Move it back to (0, 0)
 * @public
 */
Camera.reset = function() {
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.view.min.x = 0;
    this.view.min.y = 0;
    this.view.max.x = this.width;
    this.view.max.y = this.height;
};

/**
 * Check for world edges and prevent the camera
 * from translating beyond world boundaries
 * @public
 * @param {number} dx - amount view changed in x since last movement
 * @param {number} dy - amount view changed in y since last movement
 */
Camera.checkBounds = function(dx, dy) {
    const view = this.view;
    const world = this.world;
    let x = 0,
        y = 0;

    // If we're out of bounds, translate the view just back to
    // the edge of the world bounds
    if (view.min.x - dx < world.bounds.min.x) {
        // Get vector from current location to edge of bounds
        x = this.world.bounds.min.x - this.view.min.x;
    }
    if (view.max.x - dx > world.bounds.max.x) {
        x = this.world.bounds.max.x - this.view.max.x;
    }
    if (view.min.y - dy < world.bounds.min.y) {
        y = this.world.bounds.min.y - this.view.min.y;
    }
    if (view.max.y - dy > world.bounds.max.y) {
        y = this.world.bounds.max.y - this.view.max.y;
    }
    this.translateView(x, y);
};

/**
 * Pan the camera view
 * @public
 */
Camera.pan = function() {
    // Mouse might not be set, guard agasin't that
    if (this.mouse) {
        const lastX = this.mouse.lastMousePos.x;
        const lastY = this.mouse.lastMousePos.y;
        const currentX = this.mouse.position.x;
        const currentY = this.mouse.position.y;

        // Get direction of drag
        const dx = currentX - lastX;
        const dy = currentY - lastY;

        this.translateView(-dx, -dy);
        this.checkBounds(dx, dy);

        // reset last pos for next update
        this.mouse.lastMousePos.x = currentX;
        this.mouse.lastMousePos.y = currentY;
    }
};

/**
 * Used to look at a particular world X and Y,
 * Simple way to follow a body as it moves around the world
 * @param {number} worldX - world x coordinate
 * @param {number} worldY - world y coordinate
 */
Camera.lookAt = function(worldX, worldY) {
    // calculate view translation so that world coords are in center of view
    // Trsnalste to (0, 0), then to body center,
    // then back half the view size
    const dx = worldX - this.view.min.x - (this.width / 2);
    const dy = worldY - this.view.min.y - (this.height / 2);

    this.translateView(dx, dy);
    this.checkBounds(-dx, -dy);
};

/**
 * Update step, to be run during game loop
 * If a follow body is specified, the camera
 * will automatically start tracking that body
 */
Camera.update = function() {
    if (this.follow) {
        this.lookAt(this.follow.position.x, this.follow.position.y);
    }
};

/**
 * Convenience "constructor"
 * @param {Object} canvas - render canvas
 * @param {Matter.World} world - game world
 */
const camera = function(canvas, world) {
    const c = Object.create(Camera);
    c.init(canvas, world);
    return c;
};


export default camera;
