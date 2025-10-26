import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home";
import Agenda from "./pages/Agenda";
import Groups from "./pages/Groups";
import Plan from "./pages/Plan";
import "./index.css";
import RateEvent from "./components/RateEvent"; 

let accessToken = null;

export function setAccessToken(token) {
    accessToken = token;
    localStorage.setItem("access_token", token);
    const expirationTime = Date.now() + 20 * 60 * 1000; // 20 minutes from now
    localStorage.setItem("access_token_expiration", expirationTime);
}

export function getAccessToken() {
    return accessToken;
}

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/home" element={<Home />} />
                <Route path="/agenda" element={<Agenda />} />
                <Route path="/groups" element={<Groups />} />
                <Route path="/plan" element={<Plan />} />
                <Route path="/rate-event/:eventId" element={<RateEvent />} />
            </Routes>
        </Router>
    </React.StrictMode>
);
