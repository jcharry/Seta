/*
 * PrimativesList.jsx
 * Copyright (C) 2017 jamiecharry <jamiecharry@Jamies-Air-2.home>
 *
 * Distributed under terms of the MIT license.
 */
import React from 'react';
import PrimativesListItem from 'components/PrimativesPanel/PrimativesListItem';

class PrimativesList extends React.Component {
    render() {
        const { items, title, itemClickHandler } = this.props;
        return (
            <div className='primatives-panel-list'>
                <h2>{title}</h2>
                {items.map(item => <PrimativesListItem key={item.title} clickHandler={itemClickHandler} active={item.active} image={item.image} title={item.title} />)}
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
