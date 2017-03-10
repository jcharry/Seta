const Camera = {};

Camera.init = function(canvas, world) {
    this.pixelRatio = 1;
    this.ctx = canvas.getContext('2d');
    this.canvas = canvas;
    this.world = world;
    this.width = canvas.width;
    this.height = canvas.height;
    this.follow = null;
    this.view = {
        min: {
            x: 0,
            y: 0
        },
        max: {
            x: canvas.width,
            y: canvas.height
        }
    };
    this.viewOffset = {
        x: 0,
        y: 0
    };
};

Camera.translateView = function(x, y) {
    this.view.min.x += x;
    this.view.min.y += y;
    this.view.max.x += x;
    this.view.max.y += y;
    this.ctx.translate(-x, -y);
};

Camera.reset = function() {
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.view.min.x = 0;
    this.view.min.y = 0;
    this.view.max.x = this.width;
    this.view.max.y = this.height;
};

// Camera.worldToView = function(worldX, worldY) {
//
// };

Camera.checkBounds = function(dx, dy) {
    const view = this.view;
    const world = this.world;
    let x = false;
    let y = false;
    if (view.min.x - dx < world.bounds.min.x) {
        x = true;
    }
    if (view.max.x - dx > world.bounds.max.x) {
        x = true;
    }
    if (view.min.y - dy < world.bounds.min.y) {
        y = true;
    }
    if (view.max.y - dy > world.bounds.max.y) {
        y = true;
    }

    return {
        x,
        y
    };
};

Camera.lookAt = function(worldX, worldY) {
    // let viewCoords = this.worldToView(worldX, worldY);

    // calculate view translation so that world coords are in center of view
    // Trsnalste to (0, 0), then to body center,
    // then back half the view size
    let dx = -this.view.min.x + worldX - this.width / 2;
    let dy = -this.view.min.y + worldY - this.height / 2;

    const bounds = this.checkBounds(-dx, -dy);
    if (bounds.x) { dx = 0; }
    if (bounds.y) { dy = 0; }

    this.translateView(dx, dy);
};

// Camera.pan = function() {
//
// };

Camera.update = function() {
    if (this.follow) {
        this.lookAt(this.follow.position.x, this.follow.position.y);
    }
};

const camera = function(canvas, world) {
    const c = Object.create(Camera);
    c.init(canvas, world);
    return c;
};


export default camera;
