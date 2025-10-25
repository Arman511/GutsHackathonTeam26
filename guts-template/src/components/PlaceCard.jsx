import React from "react";
import { motion } from "motion/react"
import Rating from "@mui/material/Rating";


export default function PlaceCard(props) {
    return (
        <div style={{display: 'flex', width: 1000, alignItems: 'center', background: 'white', justifyContent: 'center'}}>
            <h1>hello</h1>
        <div style={{
            width: 400,
            height: 700,
            background: 'white',
            borderRadius: 20,
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
            overflow: 'hidden',
        }}>
            <div style={{
                height: '100%',
                overflowY: 'scroll',
                padding: 20
            }}>
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.5 }}
                    style={{
                        height: 400,
                        background: 'linear-gradient(to bottom, #ff6b6b, #ee5a6f)',
                        borderRadius: 15,
                        marginBottom: 15,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 80
                    }}
                >
                    {props.imgOne}
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.5 }}
                    style={{
                        background: '#f9f9f9',
                        padding: 20,
                        borderRadius: 15,
                        marginBottom: 15
                    }}
                >
                    <h3 style={{ margin: 0, color: '#888', fontSize: 14 }}>best food</h3>
                    <p style={{ fontSize: 18, margin: '10px 0 0 0' }}>
                        {props.reviewOne}
                    </p>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.5 }}
                    style={{
                        height: 400,
                        background: 'linear-gradient(to bottom, #4ecdc4, #44a08d)',
                        borderRadius: 15,
                        marginBottom: 15,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 80
                    }}
                >
                    {props.imgTwo}
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.5 }}
                    style={{
                        background: '#f9f9f9',
                        padding: 20,
                        borderRadius: 15,
                        marginBottom: 15
                    }}
                >
                    <h3 style={{ margin: 0, color: '#888', fontSize: 14 }}>Vibez bro</h3>
                    <p style={{ fontSize: 18, margin: '10px 0 0 0' }}>
                        {props.reviewTwo}
                    </p>
                </motion.div>
            </div>
        </div>
        </div>
    );
}