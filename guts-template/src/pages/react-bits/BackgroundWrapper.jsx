import React from 'react';
import Iridescence from './Iridescence';
import './BackgroundWrapper.css';
/*// React bits library imports are in this folder this is form a library*/

export default function BackgroundWrapper({ children }) {
    return (
        <div className="background-wrapper">
            <Iridescence color={[0, 0.388, 0.827]} mouseReact={true} amplitude={0.1} speed={1.0} />
            <div className="content">{children}</div>
        </div>
    );
}

// React bits library imports are in this folder
// This code is all from react bits
//