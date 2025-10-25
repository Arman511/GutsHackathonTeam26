import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home";
import Agenda from "./pages/Agenda";
import Groups from "./pages/Groups";
import Plan from "./pages/Plan";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/home" element={<Home />} />
                <Route path="/agenda" element={<Agenda />} />
                <Route path="/groups" element={<Groups />} />
                <Route path="/plan-event" element={<Plan />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    </React.StrictMode>
);
