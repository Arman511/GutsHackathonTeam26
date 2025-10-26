import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import BackgroundWrapper from './react-bits/BackgroundWrapper';
import "./Plan.css";
import { getUsers } from "../api/api";
import { createEvent, addUsersToEvent } from "../api/api"; // adjust path if needed

function Bubble({ name, onRemove }) {
    return (
        <span className="bubble">
            {name}
            <button
                type="button"
                className="bubble-remove"
                onClick={() => onRemove(name)}
                aria-label={`Remove ${name}`}
            >
                ×
            </button>
        </span>
    );
}

export default function Plan() {
    const navigate = useNavigate();
    const [participants, setParticipants] = useState([]);
    const [participantInput, setParticipantInput] = useState("");
    const [priceRange, setPriceRange] = useState("");
    const [disabilityAccess, setDisabilityAccess] = useState(false);
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [preferences, setPreferences] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [suggestedUsers, setSuggestedUsers] = useState([]);
    const [description, setDescription] = useState("");
    const [eventName, setEventName] = useState("");
    const [openTime, setOpenTime] = useState("");
    const [closeTime, setCloseTime] = useState("");

    const allPreferences = [
        "Outdoor",
        "Indoor",
        "Group Activity",
        "Food Available",
        "Drinks",
        "Vegetarian Friendly",
        "Pet Friendly",
        "Formal Attire",
    ];

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await getUsers();
                setAllUsers(response.users);
            } catch (error) {
                console.error("Failed to fetch users:", error);
            }
        };

        fetchUsers();
    }, []);

    useEffect(() => {
        // Update suggestions as user types
        if (participantInput.trim() === "") {
            setSuggestedUsers([]);
        } else {
            setSuggestedUsers(
                allUsers.filter(
                    user =>
                        user.username
                            .toLowerCase()
                            .includes(participantInput.trim().toLowerCase()) &&
                        !participants.includes(user.username)
                )
            );
        }
    }, [participantInput, allUsers, participants]);

    const handleAddParticipant = (name) => {
        if (name && !participants.includes(name)) {
            setParticipants([...participants, name]);
        }
        setParticipantInput("");
        setSuggestedUsers([]);
    };

    const handleRemoveParticipant = (name) => {
        setParticipants(participants.filter((p) => p !== name));
    };

    const togglePreference = (pref) => {
        setPreferences((prev) =>
            prev.includes(pref)
                ? prev.filter((p) => p !== pref)
                : [...prev, pref]
        );
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        // Map participant usernames to user IDs
        const participantIds = participants
            .map(username => {
                const user = allUsers.find(u => u.username === username);
                return user ? user.id : null;
            })
            .filter(id => id !== null);

        // Prepare event data
        const eventData = {
            event_name: eventName,
            event_date: String(date),
            description: description,
            price_range: priceRange,
            outdoor: preferences.includes("Outdoor"),
            group_activity: preferences.includes("Group Activity"),
            vegetarian: preferences.includes("Vegetarian Friendly"),
            drinks: preferences.includes("Drinks"),
            food: preferences.includes("Food Available"),
            accessible: disabilityAccess,
            formal_attire: preferences.includes("Formal Attire"),
            open_time: String(openTime),
            close_time: String(closeTime),
        };

        console.log("eventData", eventData);

        try {
            // 1. Create the event
            const eventRes = await createEvent(eventData);
            const eventId = eventRes.event_id || eventRes.id; // adjust based on backend response

            // 2. Add users to event
            await addUsersToEvent(eventId, { user_ids: participantIds });

            alert("Event created and participants added!");
            navigate("/home");
        } catch (err) {
            alert("Error: " + err.message);
        }
    };

    return (
        <BackgroundWrapper>
            <div className="plan-container">
                <h1>Plan an Event</h1>
                <form onSubmit={handleSubmit} className="plan-form">
                    <div className="form-group">
                        <label>Event Name:</label>
                        <input
                            type="text"
                            value={eventName}
                            onChange={(e) => setEventName(e.target.value)}
                            required
                            placeholder="Enter event name"
                        />
                    </div>
                    <div className="form-group">
                        <label>Description:</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            placeholder="Enter event description"
                            rows={2}
                            style={{ width: "100%", borderRadius: "8px", padding: "6px", border: "1px solid #ccc" }}
                        />
                    </div>
                    <div className="form-group">
                        <label>Participants:</label>
                        <div
                            className="participant-input-container"
                            style={{
                                display: "flex",
                                flexWrap: "wrap",
                                alignItems: "center",
                                minHeight: "40px",
                                border: "1px solid #ccc",
                                borderRadius: "8px",
                                padding: "6px"
                            }}
                        >
                            {/* Render participant bubbles inside the input container */}
                            {participants.map((p) => (
                                <Bubble key={p} name={p} onRemove={handleRemoveParticipant} />
                            ))}
                            <input
                                type="text"
                                placeholder="Type a username"
                                value={participantInput}
                                onChange={(e) => setParticipantInput(e.target.value)}
                                style={{
                                    border: "none",
                                    outline: "none",
                                    flex: "1",
                                    minWidth: "120px",
                                    marginLeft: "4px"
                                }}
                            />
                        </div>
                        {/* Matching users as clickable bubbles */}
                        {participantInput.trim() && (
                            <div className="matching-user-bubbles" style={{ margin: "10px 0" }}>
                                <label>Matching Users:</label>
                                <div>
                                    {allUsers
                                        .filter(user =>
                                            user.username
                                                .toLowerCase()
                                                .includes(participantInput.trim().toLowerCase()) &&
                                            !participants.includes(user.username)
                                        ).length === 0 ? (
                                        <span style={{ color: "#888", fontStyle: "italic" }}>none</span>
                                    ) : (
                                        allUsers
                                            .filter(user =>
                                                user.username
                                                    .toLowerCase()
                                                    .includes(participantInput.trim().toLowerCase()) &&
                                                !participants.includes(user.username)
                                            )
                                            .map(user => (
                                                <span
                                                    key={user.id}
                                                    className="bubble"
                                                    onClick={() => handleAddParticipant(user.username)}
                                                >
                                                    {user.username}
                                                </span>
                                            ))
                                    )
                                    }
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="form-group">
                        <label>Price Range:</label>
                        <div className="price-buttons">
                            {["£", "££", "£££"].map((symbol, index) => (
                                <button
                                    type="button"
                                    key={index}
                                    className={`price-btn ${priceRange === symbol ? "selected" : ""}`}
                                    onClick={() => setPriceRange(symbol)}
                                >
                                    {symbol}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Date:</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Open Time:</label>
                        <input
                            type="time"
                            value={openTime}
                            onChange={(e) => setOpenTime(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Close Time:</label>
                        <input
                            type="time"
                            value={closeTime}
                            onChange={(e) => setCloseTime(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Preferences:</label>
                        <div className="preferences-container">
                            {allPreferences.map((pref) => (
                                <button
                                    type="button"
                                    key={pref}
                                    className={`pref-btn ${preferences.includes(pref) ? "selected" : ""}`}
                                    onClick={() => togglePreference(pref)}
                                >
                                    {pref}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="form-group checkbox">
                        <label>
                            <input
                                type="checkbox"
                                checked={disabilityAccess}
                                onChange={(e) => setDisabilityAccess(e.target.checked)}
                            />
                            Disability Access Required
                        </label>
                    </div>

                    <button type="submit" className="submit-btn">
                        Submit
                    </button>
                </form>

                <Link to="/home" className="back-link">
                    Back to Home
                </Link>
            </div>
        </BackgroundWrapper>
    );
}
