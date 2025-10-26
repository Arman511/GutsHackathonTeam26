
import React from "react";
import BackgroundWrapper from './react-bits/BackgroundWrapper';

// Bubble component for participants
function Bubble({ name, onRemove }) {
    return (
        <span className="bubble" onClick={() => onRemove(name)}>
            {name} ✕
        </span>
    );
}

export default Bubble