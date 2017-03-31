/*
 * Draggable.jsx
 * Copyright (C) 2017 jamiecharry <jamiecharry@Jamies-Air-2.home>
 *
 * Distributed under terms of the MIT license.
 */
import React from 'react';

class Draggable extends React.Component {
    constructor(props) {
        super(props);
        this.isMouseDown = false;
        this.state = {
            left: this.props.startLeft,
            top: this.props.startTop
        };

        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
    }

    handleMouseDown(e) {
        this.isMouseDown = true;
        console.log(e.clientX, e.clientY)
        console.log(e.pageX, e.pageY);
        this.startX = e.pageX;
        this.startY = e.pageY;
        this.lastMouseX = e.pageX;
        this.lastMouseY = e.pageY;
    }
    handleMouseUp(e) {
        this.isMouseDown = false;
        let dx = e.pageX - this.startX;
        let dy = e.pageY - this.startY;
        console.log('mouseup', dx, dy);
        if (this.props.handleMouseUp) {
            this.props.handleMouseUp(dx, dy);
        }
    }
    handleMouseMove(e) {
        // Distance panned
        let dx = e.pageX - this.lastMouseX;
        let dy = e.pageY - this.lastMouseY;
        this.lastMouseX = e.pageX;
        this.lastMouseY = e.pageY;
        if (this.isMouseDown) {
            this.setState({
                left: this.state.left + dx,
                top: this.state.top + dy
            });
        }
    }

    render() {
        const { left, top } = this.state;
        let style = {
            left: `${this.state.left}px`,
            top: `${this.state.top}px`
        };
        return (
            <div onMouseDown={this.handleMouseDown} onMouseUp={this.handleMouseUp} onMouseMove={this.handleMouseMove} className='draggable' style={style}>
                {this.props.children}
            </div>
        );
    }
}

export default Draggable;
