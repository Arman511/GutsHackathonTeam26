import { Link } from "react-router-dom";
import SplitText from "./react-bits/SplitText";
import Quiz from "../components/Quiz";

export default function Home() {
    return (
        <div className="home-container">
            <header>
                <SplitText
                    text="Welcome Home!"
                    className="text-3xl font-bold text-center"
                    delay={0.1}
                />
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
            <div>
                <Quiz />
            </div>

            

        </div>
    );
}
