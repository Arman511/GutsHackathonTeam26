import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Plan.css";

export default function Plan() {
    const navigate = useNavigate()
    const [participants, setParticipants] = useState([]);
    const [participantInput, setParticipantInput] = useState("");
    const [priceRange, setPriceRange] = useState("");
    const [disabilityAccess, setDisabilityAccess] = useState(false);
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [preferences, setPreferences] = useState([]);

    const allPreferences = [
        "Outdoor",
        "Indoor",
        "Quiet",
        "Lively",
        "Food Included",
        "Drinks",
        "Vegetarian Friendly",
        "Pet Friendly",
        "Adventure",
        "Alcohol-free"
    ];

    const handleAddParticipant = (e) => {
        e.preventDefault();
        const trimmed = participantInput.trim();
        if (trimmed && !participants.includes(trimmed)) {
            setParticipants([...participants, trimmed]);
        }
        setParticipantInput("");
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

    const handleSubmit = (e) => {
        e.preventDefault();

        const jsonData = {
            participants,
            priceRange,
            disabilityAccess,
            date,
            time,
            preferences
        };

        console.log("Event JSON:", JSON.stringify(jsonData, null, 2));
        alert("Event planned successfully! Redirecting to home...");
        navigate("/home");
    };



    return (
        <div className="plan-container">
            <h1>Plan an Event</h1>
            <form onSubmit={handleSubmit} className="plan-form">
                {/* Participants Input */}
                <div className="form-group">
                    <label>Participants:</label>
                    <div className="participant-input-container">
                        <input
                            type="text"
                            placeholder="Type a name and press Enter"
                            value={participantInput}
                            onChange={(e) => setParticipantInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleAddParticipant(e);
                            }}
                        />
                    </div>
                    <div className="participant-bubbles">
                        {participants.map((p) => (
                            <span key={p} className="bubble" onClick={() => handleRemoveParticipant(p)}>
                {p} ✕
              </span>
                        ))}
                    </div>
                </div>

                {/* Price Range */}
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

                {/* Disability Access */}
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

                {/* Date and Time */}
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

                {/* Preferences */}
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
    );
}
