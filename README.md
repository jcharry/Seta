#IN PROGRESS#

##TODO##
- ~~Drag bodies around during creation stage~~
- ~~Scale / Resize bodies?~~ Should I use handlebars?  A slider?
- ~~Move world around on drag~~
- ~~Set world parameters - air friction, gravity, size, bounds?~~
- ~~Set world bounds~~
- Polygon implementation?  Draw your own, or just specify number of sides?
- ~~Implement constraint behaviors~~
- ~~Collision callbacks??~~
- ~~Fix camera issue when refreshing scene~~
- Set limits on some controls - i.e. only add force if body is colliding with
    another body (i.e. on the floor);
- Camera to maintain it's position on refresh?
- "Look Inside" feature - (show vectors, forces, eqns of motion?)
- Debug view - show vectors (accel, pos, vel, forces, torque)
- Implement sensors for collision events
- Let collisions remove contraints as well as destroy bodies
- User settable styles
- Handlebars for object resizing
- CTRL-Z for undo
- ~~ESC to deselect objects~~
- Drag To Highlight multiple bodies
- Batch Edit
- Limit values of certain properties to prevent exploding simulations
- Transition to a new world, add some delay so it's not instantaneous

## LEFT OFF ##
- 3/30: Need to finish implementing text edit
- Ideally, combine Behavior Panel, Style Panel, and Edit Text Panel all into
    one.  Shoudl be simple.  Just make a container that shows somethign based
    on whatever is toggled in the redux store


