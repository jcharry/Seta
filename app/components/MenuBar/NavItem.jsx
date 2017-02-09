import React from 'react';

class NavItem extends React.Component {
    render() {
        const { item, toggled, handleClick } = this.props;
        // const { title, handleClick, toggled, children } = item;

        // If we're passed a component, just render it directly
        // if (item.component) {
        //     return item.component;
        // }

        // If we're passed data for
        let className = 'nav-item';
        if (toggled) { className += ' nav-item-toggled'; }

        return (
            <div className={className} onClick={handleClick}>
                {item.component}
            </div>
        );
    }
}

NavItem.propTypes = {
    item: React.PropTypes.object.isRequired,
    toggled: React.PropTypes.bool,
    handleClick: React.PropTypes.func.isRequired
};

export default NavItem;
