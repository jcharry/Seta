/*
 * HoverWithTooltip.jsx
 * Copyright (C) 2017 jamiecharry <jamiecharry@Jamies-Air-2.home>
 *
 * Distributed under terms of the MIT license.
 */
import React from 'react';

class HoverWithTooltip extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            active: false
        }

        this.handleMouseEnter = this.handleMouseEnter.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
    }

    handleMouseEnter() {
        this.setState({
            active: true
        });
    }

    handleMouseLeave() {
        this.setState({
            active: false
        });
    }

    render() {
        const { src, alt } = this.props;

        let tooltipStyle = {
            position: 'fixed',
            zIndex: 200,
            backgroundColor: 'white',
            border: '1px solid darkgray'
        };
        if (this.state.active) {
            tooltipStyle.visibility = 'visible';
        } else {
            tooltipStyle.visibility = 'hidden';
        }

        return (
            <div>
                <img src={src} alt={alt} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave} />
                <div style={tooltipStyle} className='fixed-tootlip'>
                    {this.props.children}
                </div>
            </div>
        );
    }
}

export default HoverWithTooltip;
