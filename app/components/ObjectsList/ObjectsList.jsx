/*
 * ObjectsList.jsx
 * Copyright (C) 2017 jamiecharry <jamiecharry@Jamies-Air-2.home>
 *
 * Distributed under terms of the MIT license.
 */
import React from 'react';
import ObjectsListItem from './ObjectsListItem';

class ObjectsList extends React.Component {
    render() {
        const { bodies } = this.props;
        return (
            <div className='objects-list'>
                <h2>Active Objects</h2>
                <ul>
                    {Object.keys(bodies).map(key => {
                        const body = bodies[key];
                        return <ObjectsListItem key={body.id} body={body} />;
                    })}
                </ul>
            </div>
        );
    }
}

ObjectsList.defaultProps = {
    bodies: []
};

ObjectsList.propTypes = {
    bodies: React.PropTypes.object
};

export default ObjectsList;
