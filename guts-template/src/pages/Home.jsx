import { Link } from "react-router-dom";

export default function Home() {
    return (
        <div className="home-container">
            <h1>Home Page</h1>
            <p>This is the home screen.</p>
            <div className="button-group">
                <Link to="/Groups" className="btn">Go to Groups</Link>
                <Link to="/Agenda" className="btn">Go to Agenda</Link>
                <Link to="/Plan" className="btn">Go to Plan</Link>
            </div>
        </div>
    );
}
// looking at having sections of events
// create event button - ha
