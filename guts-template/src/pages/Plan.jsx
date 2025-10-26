import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import BackgroundWrapper from './react-bits/BackgroundWrapper';
import "./Plan.css";
import { getUsers } from "../api/api";

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

    const allPreferences = [
        "Outdoor",
        "Indoor",
        "Quiet",
        "Group Activity",
        "Lively",
        "Food Included",
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

        // Checking for input
        if (!participantInput.length) {
            alert("Please add at least one person")
            return
        }
        if (!priceRange) {
            alert("Please add price range!!!!")
            return
        }
        if (!date) {
            alert("DATEEEEE")
            return
        }

        try {
            const eventData = {
                event_name: `Tea Event - ${date}`, // maybe add a name section?
                event_date: date,
                description: `Event with ${participants.join(', ')}. Preferences: ${preferences.join(', ')}`,
                price_range: priceRange,
                outdoor: preferences.includes("Outdoor"),
                participant_ids: []
            }
            await createEvent(eventData)

            console.log("Event JSON:", JSON.stringify(eventData, null, 2));
            alert("Event planned successfully! Redirecting to home...");
            navigate("/home");
        } catch (error) {
            alert("omething went wrong, please try again!!")
            console.log(error)
        }

    };



    return (
        <BackgroundWrapper>
            <div className="plan-container">
                <h1>Plan an Event</h1>
                <form onSubmit={handleSubmit} className="plan-form">
                    <div className="form-group">
                        <label>Participants:</label>
                        <div className="participant-input-container">
                            <input
                                type="text"
                                placeholder="Type a username"
                                value={participantInput}
                                onChange={(e) => setParticipantInput(e.target.value)}
                            />
                        </div>
                        <div className="suggested-bubbles">
                            {suggestedUsers.map(user => (
                                <span
                                    key={user.id}
                                    className="bubble suggested"
                                    onClick={() => handleAddParticipant(user.username)}
                                >
                                    {user.username}
                                </span>
                            ))}
                        </div>
                        <div className="participant-bubbles">
                            {participants.map((p) => (
                                <Bubble key={p} name={p} onRemove={handleRemoveParticipant} />
                            ))}
                        </div>
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
                        <label>Time:</label>
                        <input
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
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
