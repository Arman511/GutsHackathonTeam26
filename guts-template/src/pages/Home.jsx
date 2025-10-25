import { Link } from "react-router-dom";

export default function Home() {
    return (
        <div>
            <h1>Home Page</h1>
            <p>This is the home screen.</p>
            <Link to="/Groups" className="btn">Go to Groups</Link>
            <Link to="/Agenda" className="btn">Go to Agenda</Link>
            <Link to="/Plan" className="btn">Go to Plan</Link>
        </div>
    );
}
