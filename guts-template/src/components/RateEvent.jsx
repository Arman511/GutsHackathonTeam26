import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Button, Card } from '@mui/material';
import { getLocationsForEvent, rankLocation } from "../api/api";
import EventSwiper from "./EventSwiper";
import BackgroundWrapper from "/Users/lemartokham/hack/GutsHackathonTeam26/guts-template/src/pages/react-bits/BackgroundWrapper";

export default function RateEvent() {
    const { eventId } = useParams()
    const navigate = useNavigate()

    const [locations, setLocations] = useState([])
    const [loading, setLoading] = useState(true)

        useEffect(() =>{
        const loadLocations = async () => {
            try {
                const response = await getLocationsForEvent(eventId)
                const locs = response.locations     

                // Get users personality type from browser localStorage 
                const personalityTags = JSON.parse(localStorage.getItem('personality_tags') || '[]')

                // Format locations and calculate match scores
                let formattedLocations = locs.map(loc => {
                    // for match between persoalities and events
                    let matchScore = 0;
                    
                    if (personalityTags.length > 0) { // Ensures they took quiz

                        personalityTags.forEach(tag => {
                            const lowerTag = tag.toLowerCase();
                            
                            // Adventurous/brave/spontaneous people like outdoor & group activities
                            if (['brave', 'adventurous', 'spontaneous', 'chaotic'].includes(lowerTag)) {
                                if (loc.outdoor) matchScore += 2;
                                if (loc.group_activity) matchScore += 2;
                            }
                            
                            // Social/energetic/lively people like group activities
                            if (['social', 'energetic', 'crowd-pleaser', 'entertainer', 'mood-lifter'].includes(lowerTag)) {
                                if (loc.group_activity) matchScore += 2;
                            }
                            
                            // Introverted/quiet/homebody people prefer indoor, NOT group
                            if (['introverted', 'homebody', 'quiet', 'shy', 'observer'].includes(lowerTag)) {
                                if (!loc.outdoor) matchScore += 1;
                                if (!loc.group_activity) matchScore += 1;
                            }
                            
                            // Food lovers like food venues
                            if (['indulgent', 'extra'].includes(lowerTag)) {
                                if (loc.food || loc.drinks) matchScore += 1;
                            }
                        });
                    }
                    
                    return {
                        id: loc.id,
                        title: loc.location,
                        date: loc.address || "Address TBD",
                        time: `${loc.open_time || ''} - ${loc.close_time || ''}`.trim(),
                        group: getLocationTags(loc),
                        details: loc.description || "No description available",
                        image: getLocationEmoji(loc),
                        secondaryImage: "📍",
                        review: loc.google_rating ? `Google Rating: ${loc.google_rating}/5.0 ⭐` : "No reviews yet",
                        matchScore: matchScore // Store the score 
                    };
                });

                // Sort by match score (highest first) if user has taken quiz
                if (personalityTags.length > 0) {
                    formattedLocations.sort((a, b) => b.matchScore - a.matchScore); //if diff is positive, b is higher, else a is higher
                    console.log('Locations sorted by personality match!', personalityTags);
                }

                setLocations(formattedLocations)
            } catch (error) {
                console.error(error)
                navigate('/groups')
            } finally {
                setLoading(false)
            }
        }
        loadLocations()
    }, [eventId, navigate])

    const handleRatingComplete = async (ratings) => {
        try {
            for (const [locationId, rating] of Object.entries(ratings)) {
                await rankLocation({
                    location_id: parseInt(locationId),
                    ranking: rating
                })
            }
            alert("Thanks for rating!")
            navigate('/groups')
        } catch (error) {
            console.log(error)
        }
    }

    if (loading) {
        return (
            <BackgroundWrapper>
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                    <Typography variant="h4" color="white">Loading locations...</Typography>
                </Box>
            </BackgroundWrapper>
        );
    }

        if (locations.length === 0) {
        return (
            <BackgroundWrapper>
                <Box display="flex" alignItems="center" justifyContent="center" minHeight="100vh" p={3}>
                    <Card sx={{ maxWidth: 500, textAlign: 'center', p: 4 }}>
                        <Typography variant="h1" mb={2}>📍</Typography>
                        <Typography variant="h5" gutterBottom fontWeight="bold">
                            No Locations Yet
                        </Typography>
                        <Typography variant="body1" color="text.secondary" mb={3}>
                            No locations have been added for this event yet mate
                        </Typography>
                        <Button variant="contained" size="large" onClick={() => navigate('/groups')}>
                            Back to Groups
                        </Button>
                    </Card>
                </Box>
            </BackgroundWrapper>
        );
    }

    return (
        <EventSwiper
            events={locations}
            onRatingComplete={handleRatingComplete}
            onClose={() => navigate('/groups')}
        />
    );
}

function getLocationEmoji(location) {
    if (location.food) return '🍽️';
    if (location.drinks) return '🍺';
    if (location.outdoor) return '🌳';
    if (location.group_activity) return '👥';
    return '📍';
}

function getLocationTags(location) {
    const tags = [];
    
    if (location.outdoor) tags.push('Outdoor');
    if (location.food) tags.push('Food');
    if (location.drinks) tags.push('Drinks');
    if (location.group_activity) tags.push('Group Activity');
    if (location.accessible) tags.push('Accessible');
    if (location.vegetarian) tags.push('Vegetarian');
    
    return tags.length > 0 ? tags.join(', ') : 'Activity';
}
