import { Link } from "react-router-dom";

export default function Home() {
    return (
        <div className="home-container">
            <header>
                <h1>Home Page</h1>
            </header>
            <nav className="button-group" style={{
                display: 'flex',
                justifyContent: 'center',
                padding: '10px',
                backgroundColor: '#f0f0f0',
                borderBottom: '2px solid #ccc',
                marginBottom: '20px',
                gap: '20px'
                }}>
                <Link to="/Groups" className="btn">Groups</Link>
                <Link to="/Agenda" className="btn">Agenda</Link>
                <Link to="/Plan" className="btn">Plan</Link>
            </nav>

        </div>
    );
}
