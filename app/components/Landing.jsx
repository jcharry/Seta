import React from 'react';
import { Link } from 'react-router';
import logo from '../images/seta-logo@3x.png';
import logoAnimation from '../images/logo-animation.mp4';


export default (props) => {
    return (
        <div className='landing'>
            <div className='full-page-absolute background'>
                <video style={{
                    position: 'fixed',
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    maxWidth: '100%',
                    maxHeight: '100%',
                    margin: 'auto',
                    overflow: 'auto'
                    }} autoPlay loop src={logoAnimation} />
                <div className='footer'>
                    <Link to='/getting-started'>See Getting Started Guide</Link>
                    <Link to='/editor'>Go to Editor</Link>
                </div>
            </div>
        </div>
    );
}
