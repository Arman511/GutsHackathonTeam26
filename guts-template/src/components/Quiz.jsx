import React from "react";
import PlaceCard from "./PlaceCard";
import Rating from "@mui/material/Rating";

export default function Quiz() {
    return (
        <div style={{ 
            height: '100vh', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            flexDirection: 'column',
            background: '#f0f0f0',
            gap: '10px'
        }}>
            <PlaceCard imgOne={"hi1"} imgTwo={"hi2"} reviewOne={"review1"} reviewTwo={"review2"}/>
        </div>
    );
}
