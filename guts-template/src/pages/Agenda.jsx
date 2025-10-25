import { useState } from "react";
import { Link } from "react-router-dom";
import "./Agenda.css";

const eventsData = [
    {
        id: 1,
        title: "Marketing goes wild",
        date: "2025-10-28",
        group: "Marketing",
        details: "Marketing team is for a crazy night of drinks",
    },
    {
        id: 2,
        title: "LED-linquents does SubCrawl",
        date: "2025-10-30",
        group: "LaserTag",
        details: null,
    },
    {
        id: 3,
        title: "Halloween trick or treaking",
        date: "2025-11-05",
        group: "HR",
        details: "Lets get together as thirty year olds and go trick or treating",
    },
];

const groups = ["Marketing", "Development", "HR", "LaserTag"];
const times = ["This Week", "This Month", "This Year", "Next Year"];

export default function Agenda() {
    const [expandedId, setExpandedId] = useState(null);
    const [selectedGroups, setSelectedGroups] = useState([]);
    const [selectedTime, setSelectedTime] = useState(null);

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const toggleGroup = (group) => {
        if (selectedGroups.includes(group)) {
            setSelectedGroups(selectedGroups.filter((g) => g !== group));
        } else {
            setSelectedGroups([...selectedGroups, group]);
        }
    };

    const selectTime = (time) => {
        setSelectedTime(selectedTime === time ? null : time);
    };

    const filteredEvents = eventsData.filter((event) => {
        let groupMatch =
            selectedGroups.length === 0 || selectedGroups.includes(event.group);

        let timeMatch = true;
        const today = new Date();
        const eventDate = new Date(event.date);

        if (selectedTime === "This Week") {
            const weekEnd = new Date();
            weekEnd.setDate(today.getDate() + 7);
            timeMatch = eventDate >= today && eventDate <= weekEnd;
        } else if (selectedTime === "This Month") {
            timeMatch =
                eventDate.getMonth() === today.getMonth() &&
                eventDate.getFullYear() === today.getFullYear();
        } else if (selectedTime === "This Year") {
            timeMatch = eventDate.getFullYear() === today.getFullYear();
        } else if (selectedTime === "Next Year") {
            timeMatch = eventDate.getFullYear() === today.getFullYear() + 1;
        }

        return groupMatch && timeMatch;
    });

    return (
        <div className="agenda-container">
            <h1>Events Page</h1>
            <Link to="/home">Home</Link>

            <div className="filters">
                {groups.map((group) => (
                    <button
                        key={group}
                        className={`filter-button ${
                            selectedGroups.includes(group) ? "selected" : ""
                        }`}
                        onClick={() => toggleGroup(group)}
                    >
                        {group}
                    </button>
                ))}
            </div>

            <div className="filters">
                {times.map((time) => (
                    <button
                        key={time}
                        className={`filter-button ${
                            selectedTime === time ? "selected" : ""
                        }`}
                        onClick={() => selectTime(time)}
                    >
                        {time}
                    </button>
                ))}
            </div>

            <div className="events-container">
                {filteredEvents.map((event) => (
                    <div key={event.id} className="event-card">
                        <div
                            className="event-header"
                            onClick={() => toggleExpand(event.id)}
                        >
                            <div>
                                <h3>{event.title}</h3>
                                <p>{event.date}</p>
                                <p>Group: {event.group}</p>
                            </div>
                            {expandedId === event.id ? "🔽 Details" : "▶️ Details"}
                        </div>
                        {expandedId === event.id && (
                            <div style={{ marginTop: "10px" }}>
                                {event.details || "Details not decided yet"}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

//remove     <div>{expandedId === event.id ? "▲" : "▼"} Details</div> i want it to be > to expand