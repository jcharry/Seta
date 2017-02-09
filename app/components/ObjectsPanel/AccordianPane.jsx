/*
 * AccordianPane.jsx
 * Copyright (C) 2017 jamiecharry <jamiecharry@Jamies-Air-2.home>
 *
 * Distributed under terms of the MIT license.
 */
import React from 'react';
import { TransitionMotion, spring } from 'react-motion';
                // <TransitionMotion
                //     defaultStyle={this.bottomNavDefaultStyles(bottomNavChildren)}
                //     styles={this.bottomNavStyles(bottomNavChildren)}
                //     willLeave={this.bottomNavWillLeave}
                //     willEnter={this.bottomNavWillEnter}
                // >
                //     {interpolatedStyles =>
                //         <div className={bottomNavClass}>
                //             {interpolatedStyles.map(({ key, style, data }) =>
                //                 <BottomNavItem title={data.title} toggled={data.visible} key={key} style={style} type={data.type} />
                //             )}
                //         </div>
                //     }
                // </TransitionMotion>


class AccordianPane extends React.Component {
    render() {
        const { title, things } = this.props;

        return (
            <div className='accordian-pane'>
                {things.map(thing => <p>{thing}</p>)}
            </div>
        );
    }
}

AccordianPane.propTypes = {
    title: React.PropTypes.string.isRequired
}

export default AccordianPane;
