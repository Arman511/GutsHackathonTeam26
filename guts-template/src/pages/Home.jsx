import { Link } from "react-router-dom";

export default function Home() {
    return (
        <div>
            <h1>Home Page</h1>
            <p>This is the home screen.</p>
            <Link to="/login">Go to Login</Link>
        </div>
    );
}
