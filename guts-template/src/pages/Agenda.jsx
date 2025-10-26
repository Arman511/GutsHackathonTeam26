import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { 
    Container, Card, CardContent, Typography, Button, Box, 
    Chip, Stack, Grid, CircularProgress 
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { getCreatedEvents, getEventResult } from "../api/api";
import BackgroundWrapper from "./react-bits/BackgroundWrapper";

export default function Agenda() {
    const navigate = useNavigate();
    const [myEvents, setMyEvents] = useState([]);
    const [selectedEventId, setSelectedEventId] = useState(null);
    const [eventResults, setEventResults] = useState(null);
    const [loading, setLoading] = useState(true);
    const [resultsLoading, setResultsLoading] = useState(false);

    useEffect(() => {
        const loadEvents = async () => {
            try {
                const events = await getCreatedEvents();
                setMyEvents(events);
                if (events.length > 0) {
                    setSelectedEventId(events[0].id);
                    loadResults(events[0].id);
                }
            } catch (error) {
                console.error('Error loading events:', error);
            } finally {
                setLoading(false);
            }
        };
        loadEvents();
    }, []);

    const loadResults = async (eventId) => {
        setResultsLoading(true);
        try {
            const results = await getEventResult(eventId);
            setEventResults(results);
        } catch (error) {
            console.error('Error loading results:', error);
            setEventResults(null);
        } finally {
            setResultsLoading(false);
        }
    };

    const handleEventSelect = (eventId) => {
        setSelectedEventId(eventId);
        loadResults(eventId);
    };

    const getMedal = (index) => {
        if (index === 0) return '🥇';
        if (index === 1) return '🥈';
        if (index === 2) return '🥉';
        return `#${index + 1}`;
    };

    if (loading) {
        return (
            <BackgroundWrapper>
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                    <CircularProgress size={60} sx={{ color: 'white' }} />
                </Box>
            </BackgroundWrapper>
        );
    }

    if (myEvents.length === 0) {
        return (
            <BackgroundWrapper>
                <Box display="flex" alignItems="center" justifyContent="center" minHeight="100vh" p={3}>
                    <Card sx={{ maxWidth: 500, textAlign: 'center', p: 4 }}>
                        <Typography variant="h5" gutterBottom fontWeight="bold">
                            No Events Created
                        </Typography>
                        <Typography variant="body1" color="text.secondary" mb={3}>
                            You haven't created any events yet. Create one to see results!
                        </Typography>
                        <Stack direction="row" spacing={2} justifyContent="center">
                            <Button component={Link} to="/plan" variant="contained" size="large">
                                Create Event
                            </Button>
                            <Button component={Link} to="/home" variant="outlined" size="large">
                                Back to Home
                            </Button>
                        </Stack>
                    </Card>
                </Box>
            </BackgroundWrapper>
        );
    }

    const locations = eventResults?.locations || [];

    return (
        <BackgroundWrapper>
            <Container maxWidth="lg" sx={{ py: 5 }}>
                <Card sx={{ mb: 4, p: 3 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box>
                            <Typography variant="h3" gutterBottom fontWeight="bold">
                                Results Dashboard
                            </Typography>
                            <Typography variant="h6" color="text.secondary">
                                See what your team loves
                            </Typography>
                        </Box>
                        <Button component={Link} to="/home" variant="outlined" size="large">
                            ← Back
                        </Button>
                    </Box>
                </Card>

                {myEvents.length > 1 && (
                    <Card sx={{ mb: 3, p: 2 }}>
                        <Typography variant="h6" gutterBottom fontWeight="bold">
                            SELECT EVENT:
                        </Typography>
                        <Stack direction="row" spacing={2} flexWrap="wrap">
                            {myEvents.map(evt => (
                                <Button
                                    key={evt.id}
                                    onClick={() => handleEventSelect(evt.id)}
                                    variant={selectedEventId === evt.id ? "contained" : "outlined"}
                                    size="large"
                                >
                                    {evt.event_name}
                                </Button>
                            ))}
                        </Stack>
                    </Card>
                )}

                <Grid container spacing={3} mb={4}>
                    <Grid item xs={12} md={4}>
                        <Card sx={{ border: '3px solid', borderColor: 'error.main', textAlign: 'center', p: 3 }}>
                            <Typography variant="h2" color="error.main" fontWeight="bold">
                                {eventResults?.total_attendees || 0}
                            </Typography>
                            <Typography variant="h6" color="text.secondary" textTransform="uppercase">
                                Attendees
                            </Typography>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card sx={{ border: '3px solid', borderColor: 'info.main', textAlign: 'center', p: 3 }}>
                            <Typography variant="h2" color="info.main" fontWeight="bold">
                                {eventResults?.users_who_rated || 0}
                            </Typography>
                            <Typography variant="h6" color="text.secondary" textTransform="uppercase">
                                Rated
                            </Typography>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card sx={{ border: '3px solid', borderColor: 'warning.main', textAlign: 'center', p: 3 }}>
                            <Typography variant="h2" color="warning.main" fontWeight="bold">
                                {locations.length}
                            </Typography>
                            <Typography variant="h6" color="text.secondary" textTransform="uppercase">
                                Locations
                            </Typography>
                        </Card>
                    </Grid>
                </Grid>

                <Card sx={{ p: 3 }}>
                    <Typography variant="h4" gutterBottom fontWeight="bold">
                        <EmojiEventsIcon sx={{ fontSize: 40, mr: 1, verticalAlign: 'middle' }} />
                        Location Rankings
                    </Typography>

                    {resultsLoading ? (
                        <Box textAlign="center" py={6}>
                            <CircularProgress />
                        </Box>
                    ) : locations.length === 0 ? (
                        <Box textAlign="center" py={6}>
                            <Typography variant="h1" mb={2}>⏳</Typography>
                            <Typography variant="body1" color="text.secondary">
                                Waiting for team members to rate locations...
                            </Typography>
                        </Box>
                    ) : (
                        <>
                            <Stack spacing={3} mt={3}>
                                {locations.map((location, i) => (
                                    <Card
                                        key={location.location_id}
                                        sx={{
                                            bgcolor: i === 0 ? 'warning.light' : 'background.paper',
                                            border: '3px solid',
                                            borderColor: i === 0 ? 'warning.main' : 'divider',
                                            boxShadow: i === 0 ? 4 : 1
                                        }}
                                    >
                                        <CardContent sx={{ p: 3 }}>
                                            <Box display="flex" alignItems="center" gap={3}>
                                                <Typography variant="h2" sx={{ minWidth: 80, textAlign: 'center' }}>
                                                    {getMedal(i)}
                                                </Typography>
                                                <Box flex={1}>
                                                    <Typography variant="h5" gutterBottom fontWeight="bold">
                                                        {location.location_name}
                                                    </Typography>
                                                    <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                                                        <Typography variant="h4" color="primary" fontWeight="bold">
                                                            {location.average_ranking?.toFixed(1) || 'N/A'}
                                                        </Typography>
                                                        {location.average_ranking && (
                                                            <Typography variant="h5" color="warning.main">
                                                                {'★'.repeat(Math.round(location.average_ranking))}
                                                                {'☆'.repeat(5 - Math.round(location.average_ranking))}
                                                            </Typography>
                                                        )}
                                                        <Typography variant="body1" color="text.secondary">
                                                            ({location.total_rankings || 0} rating{location.total_rankings !== 1 ? 's' : ''})
                                                        </Typography>
                                                    </Stack>
                                                </Box>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                ))}
                            </Stack>

                            {/* Recommendation */}
                            {locations[0]?.average_ranking && (
                                <Card sx={{ mt: 4, bgcolor: 'primary.main', color: 'white', p: 3 }}>
                                    <Typography variant="h5" gutterBottom fontWeight="bold">
                                        Recommendation
                                    </Typography>
                                    <Typography variant="h6">
                                        Based on ratings, <strong>{locations[0].location_name}</strong> is the clear favorite!
                                    </Typography>
                                </Card>
                            )}
                        </>
                    )}
                </Card>
            </Container>
        </BackgroundWrapper>
    );
}