import { useState } from "react";
import { Link } from "react-router-dom";
import "./Agenda.css";

// This should eventually be an API call
const eventsData = [
    {
        id: 1,
        title: "Marketing goes wild",
        date: "2025-10-28",
        group: "Marketing",
        details: "Marketing team is for a crazy night of drinks",
        image: "https://image.cnbcfm.com/api/v1/image/104137541-GettyImages-454971061.jpg?v=1529473448"
    },
    {
        id: 2,
        title: "LED-linquents does SubCrawl",
        date: "2025-10-30",
        group: "LaserTag",
        details: null,
        image: "https://www.arenasports.net/wp-content/uploads/2025/05/Laser-Tag-22-11-22-ArenaSports-3437-1024x683.jpg"
    },
    {
        id: 3,
        title: "Halloween trick or treaking",
        date: "2025-11-05",
        group: "HR",
        details: "Lets get together as thirty year olds and go trick or treating",
        image: "https://www.childcraftbaby.com/wp/wp-content/uploads/2024/10/AdobeStock_383985651-1-1-1536x1024.jpeg"
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

            {/* Group filters */}
            <div className="filters">
                {groups.map((group) => (
                    <button
                        key={group}
                        className={`filter-button ${selectedGroups.includes(group) ? "selected" : ""}`}
                        onClick={() => toggleGroup(group)}
                    >
                        {group}
                    </button>
                ))}
            </div>

            {/* Time filters */}
            <div className="filters">
                {times.map((time) => (
                    <button
                        key={time}
                        className={`filter-button ${selectedTime === time ? "selected" : ""}`}
                        onClick={() => selectTime(time)}
                    >
                        {time}
                    </button>
                ))}
            </div>

            {/* Events list */}
            <div className="events-container">
                {filteredEvents.map((event) => (
                    <div key={event.id} className="event-card">
                        {/* Image on the left */}
                        {event.image && (
                            <div className="event-image">
                                <img src={event.image} alt={event.title} />
                            </div>
                        )}

                        {/* Event details on the right */}
                        <div className="event-details">
                            <div className="event-info">
                                <h3>{event.title}</h3>
                                <p>{event.date}</p>
                                <p>Group: {event.group}</p>
                            </div>

                            {/* More info toggle */}
                            <div className="event-more">
                                <button onClick={() => toggleExpand(event.id)}>
                                    {expandedId === event.id ? "🔽 Hide Details" : "▶️ More Info"}
                                </button>

                                {expandedId === event.id && (
                                    <div className="event-extra">
                                        {event.details || "Details not decided yet"}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
