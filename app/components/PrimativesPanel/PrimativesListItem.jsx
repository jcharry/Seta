/*
 * PrimativesListItem.jsx
 * Copyright (C) 2017 jamiecharry <jamiecharry@Jamies-Air-2.home>
 *
 * Distributed under terms of the MIT license.
 */
import React from 'react';

class PrimativesListItem extends React.Component {
    render() {
        const { image, title, active, clickHandler } = this.props;
        let clsName = 'primatives-panel-list-item';

        if (active) {
            clsName += ' active';
        }
        return (
            <div onClick={() => { clickHandler(title); }} className={clsName}>
                <img src={image} alt={title} />
                <p>{title}</p>
            </div>
        );
    }
}

PrimativesListItem.defaultProps = {
    active: false,
    image: '',
    clickHandler: null
};

PrimativesListItem.propTypes = {
    image: React.PropTypes.string,
    title: React.PropTypes.string.isRequired,
    active: React.PropTypes.bool,
    clickHandler: React.PropTypes.func
};

export default PrimativesListItem;
