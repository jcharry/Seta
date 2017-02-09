/* global window */
import React from 'react';

class ExternalLink extends React.Component {

    render() {
        const { dest, children } = this.props;
        return (
            <a className='link' onClick={() => { window.open(dest, '_blank'); }}>{children}</a>
        );
    }
}

ExternalLink.propTypes = {
    dest: React.PropTypes.string.isRequired,
    children: React.PropTypes.string.isRequired
};

export default ExternalLink;
