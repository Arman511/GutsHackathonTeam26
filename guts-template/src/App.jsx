import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Events from "./pages/Events";
import Groups from "./pages/Groups";
import "./App.css";

export default function App() {
    return (
        <Router>
            <div>
                <h1>Hello World</h1>

                <nav style={{ marginBottom: "1rem" }}>
                    <Link to="/">Home</Link> |{" "}
                    <Link to="/login">Login</Link> |{" "}
                    <Link to="/events">Events</Link> |{" "}
                    <Link to="/groups">Groups</Link>
                </nav>

                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/events" element={<Events />} />
                    <Route path="/groups" element={<Groups />} />
                </Routes>
            </div>
        </Router>
    );
}
