import { useState } from 'react';
import Rating from '@mui/material/Rating';
import './EventSwiper.css'

function EventSwiper({ events, onRatingComplete, onClose}) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [rating, setRating] = useState(0)
    const [allRatings, setAllRatings] = useState({})

    const currentEvent = events[currentIndex]

    const handleRate = (newRating) => {
        setRating(newRating)

        const updatedRatings = {
            ...allRatings,
            [currentEvent.id]: newRating
        }
        setAllRatings(updatedRatings)


        setTimeout(()=> {
            if (currentIndex < events.length-1) {
                setCurrentIndex(currentIndex + 1)
                setRating(0)

            } else {
                onRatingComplete(updatedRatings)
            }
        }, 500)
    }

    const goToPrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1)
            setRating(0)
        }
    }

    return (
        <div className="swiper-overlay">
            <button className="close-btn" onClick={onClose}>X</button>
            
            <div className="progress">{currentIndex + 1} / {events.length}</div>

            <div className="card">
                <div className="card-content">
                    <div className="event-image">
                        {currentEvent.image}
                    </div>
                    <h2>{currentEvent.title}</h2>
                    
                    <div className="info-box">
                        <p>{currentEvent.date}</p>
                        {currentEvent.time && <p> {currentEvent.time}</p>}
                        <p>👥 {currentEvent.group}</p>
                    </div>

                    <h3>About</h3>
                    <p>{currentEvent.details}</p>
                    <div className="event-image secondary">
                        {currentEvent.secondaryImage}
                    </div>

                    <h3>Reviews</h3>
                    <div className="review-box">
                        <p>"{currentEvent.review}"</p>
                    </div>
                </div>

                <div className="rating-section">
                    <p>How interested are you?</p>
                    <Rating
                        value={rating}
                        onChange={(e, newValue) => handleRate(newValue)}
                        size="large"
                    />
                </div>
                {currentIndex > 0 && (
                    <button className="back-btn" onClick={goToPrev}>
                        ← Back
                    </button>
                )}
            </div>
        </div>
    )
}

export default EventSwiper