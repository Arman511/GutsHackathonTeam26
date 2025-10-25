import { Link } from "react-router-dom";
import SplitText from "./react-bits/SplitText";
import BackgroundWrapper from './react-bits/BackgroundWrapper';
import EventSwiper from "../components/EventSwiper";
import { useState } from "react";

const mockEvents = [
    {
        id: 1,
        title: "Team Drinks",
        date: "2025-10-28",
        time: "7:00 PM",
        group: "Marketing",
        details: "Join us for after-work drinks at the local pub!",
        image: "🍺",
        secondaryImage: "🎉",
        review: "Last time was amazing! Can't wait for round 2."
    },
    {
        id: 2,
        title: "SubCrawl",
        date: "2025-10-30",
        time: "6:00 PM",
        group: "LaserTag",
        details: "Epic subway crawl through the city.",
        image: "🚇",
        secondaryImage: "🎊",
        review: "Always a wild time with this crew!"
    },
    {
        id: 3,
        title: "Halloween Party",
        date: "2025-11-05",
        time: "8:00 PM",
        group: "HR",
        details: "Costumes required!",
        image: "🎃",
        secondaryImage: "👻",
        review: "Best Halloween idea ever!"
    }
];

export default function Home() {
    const [showSwiper, setShowSwiper] = useState(0)
    return (
        <BackgroundWrapper>
            <div className="home-container">
                <header>
                    <SplitText
                        text="Welcome SAS Employees!"
                        className="text-3xl font-bold text-center"
                        delay={0.1}
                        style={{ color: 'white' }}
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
            </div>
             <button
            onClick={()=> setShowSwiper(true)}>
                Rate Events
            </button>

            {showSwiper && (
                <EventSwiper
                events={mockEvents}
                onClose={() => setShowSwiper(false)}
                onRatingComplete={() => {
                    alert("All done!")
                    setShowSwiper(false)
                }}
                />
            )}
            </BackgroundWrapper>

    );
}
