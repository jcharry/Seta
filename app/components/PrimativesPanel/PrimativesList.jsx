/*
 * PrimativesList.jsx
 * Copyright (C) 2017 jamiecharry <jamiecharry@Jamies-Air-2.home>
 *
 * Distributed under terms of the MIT license.
 */
import React from 'react';
import PrimativesListItem from 'components/PrimativesPanel/PrimativesListItem';
import HoverWithTooltip from 'components/HoverWithTooltip';

import helpImg from 'images/Help-50-black.png';

class PrimativesList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            active: false
        };

        this.handleMouseEnter = this.handleMouseEnter.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
    }

    handleMouseEnter(e) {
        this.setState({
            active: true
        });
    }
    handleMouseLeave(e) {
        this.setState({
            active: false
        });
    }

    render() {
        // <img src={helpImg} alt={`help for ${title}`}/>
        const { items, title, itemClickHandler, tooltipContent } = this.props;
        console.log(tooltipContent);
        return (
            <div
                className='primatives-panel-list'
                onMouseEnter={this.handleMouseEnter}
                onMouseLeave={this.handleMouseLeave}
            >
                <div className='title'>
                    <h2>{title}</h2>
                    {this.state.active &&
                    <HoverWithTooltip
                        src={helpImg}
                        alt={`help for ${title}`}
                    >
                        {tooltipContent}
                    </HoverWithTooltip>

                    }
                </div>
                {items.map(
                    item =>
                    <div
                        className={item.active ? 'primatives-panel-list-item active' : 'primatives-panel-list-item'}
                        onClick={() => {itemClickHandler(item.title)}}
                        key={item.title}
                    >
                            <img src={item.active ? item.activeImg : item.img} alt={title} />
                            <p>{item.title}</p>
                        </div>
                    )
                }
            </div>
        );
    }
}

PrimativesList.defaultProps = {
    itemClickHandler: null
};

PrimativesList.propTypes = {
    items: React.PropTypes.array.isRequired,
    title: React.PropTypes.string.isRequired,
    itemClickHandler: React.PropTypes.func
};

export default PrimativesList;
