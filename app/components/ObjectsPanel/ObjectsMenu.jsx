import React from 'react';
import AccordianPane from 'components/ObjectsPanel/AccordianPane';

class ObjectsMenu extends React.Component {
    render() {
        const panes = [
            {
                title: 'Primatives',
                open: false,
                children: [
                    'Rectangle',
                    'Circle',
                    'Triangle',
                    'Square'
                ]
            }, {
                title: 'Springs and Ropes',
                open: false,
                children: [
                    'Rod',
                    'Spring',
                    'Rope'
                ]
            }
        ];

        const renderPanes = () => panes.map(pane =>
            <AccordianPane open={pane.open} key={pane.title} things={pane.children} title={pane.title} />
        );

        return (
            <div className='objects-menu'>
                {renderPanes()}
            </div>
        );
    }
}

export default ObjectsMenu;
