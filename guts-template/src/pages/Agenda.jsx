import EventCard from "../components/EventCard";
import { Link } from "react-router-dom";

export default function Agenda() {
    return (
        <>
            <h1>Events Page</h1>
            <nav style={{
                display: 'flex',
                justifyContent: 'center',
                padding: '10px',
                backgroundColor: '#f0f0f0',
                borderBottom: '2px solid #ccc',
                marginBottom: '20px'
            }}>
                <Link to="/home" style={{textDecoration: 'none', color: '#007BFF'}}>Home</Link>
            </nav>
             <div style={{
                display: "flex",
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '20px',
                backgroundColor: '#fafafa',
                border: '1px solid #ddd',
                borderRadius: '8px'
            }}>
                <EventCard />
                <EventCard />
            </div>
        </>
    );  
}
