import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Container, Card, CardContent, Typography, Button, Box, Chip, Stack } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import NatureIcon from '@mui/icons-material/Nature';
import HomeIcon from '@mui/icons-material/Home';
import { getAttendingEvents } from "../api/api";
import BackgroundWrapper from "./react-bits/BackgroundWrapper";

export default function Groups() {
    const navigate = useNavigate()
    const [myEvents, setMyEvents] = useState({})
    const [loading, setLoading] = useState(true)

    useEffect(()=> {
        const loadEvents = async () => {
            try {
                const response  = await getAttendingEvents()
                console.log(response)

                let events = response
                
                if (response && response.events) {
                    events = response.events
                }

                if (!Array.isArray(events)){
                    events = []
                }

                setMyEvents(events)


            } catch (error) {
                console.log("Error", error)
                setMyEvents([])
            } finally {
            setLoading(false)
        }
        }
        loadEvents()
    }, [])

    if (loading) {
        return (
            <BackgroundWrapper>
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                    <Typography variant="h4" color="white">Loading...</Typography>
                </Box>
            </BackgroundWrapper>
        )
    }

    if (myEvents.length === 0) {
        return (
             <BackgroundWrapper>
                <Box display="flex" alignItems="center" justifyContent="center" minHeight="100vh" p={3}>
                    <Card sx={{ maxWidth: 500, textAlign: 'center', p: 4 }}>
                        <Typography variant="h1" mb={2}>📭</Typography>
                        <Typography variant="h5" gutterBottom fontWeight="bold">
                            No Events Yet
                        </Typography>
                        <Typography variant="body1" color="text.secondary" mb={3}>
                            You're not part of any events yet. Join an event or wait for an invite!
                        </Typography>
                        <Button component={Link} to="/home" variant="contained" size="large">
                            Back to Home
                        </Button>
                    </Card>
                </Box>
            </BackgroundWrapper>
        )
    }
    
    return (
<BackgroundWrapper>
            <Container maxWidth="lg" sx={{ py: 5 }}>
                <Card sx={{ mb: 4, p: 3 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box>
                            <Typography variant="h3" gutterBottom fontWeight="bold">
                                My Groups
                            </Typography>
                            <Typography variant="h6" color="text.secondary">
                                You're in {myEvents.length} event{myEvents.length > 1 ? 's' : ''}
                            </Typography>
                        </Box>
                        <Button component={Link} to="/home" variant="outlined" size="large">
                            ← Back
                        </Button>
                    </Box>
                </Card>

                <Stack spacing={3}>
                    {myEvents.map((event) => (
                        <Card
                            key={event.id}
                            onClick={() => navigate(`/rate-event/${event.id}`)}
                            sx={{
                                cursor: 'pointer',
                                transition: 'all 0.3s',
                                '&:hover': {
                                    transform: 'translateY(-5px)',
                                    boxShadow: 6,
                                    borderColor: 'primary.main'
                                },
                                border: '2px solid',
                                borderColor: 'divider'
                            }}
                        >
                            <CardContent sx={{ p: 3 }}>
                                <Typography variant="h4" gutterBottom fontWeight="bold">
                                    {event.event_name}
                                </Typography>

                                <Stack direction="row" spacing={2} mb={2} flexWrap="wrap">
                                    <Chip
                                        icon={<CalendarTodayIcon />}
                                        label={new Date(event.event_date).toLocaleDateString()}
                                    />
                                    <Chip
                                        icon={<AttachMoneyIcon />}
                                        label={event.price_range}
                                    />
                                    {event.outdoor !== null && (
                                        <Chip
                                            icon={event.outdoor ? <NatureIcon /> : <HomeIcon />}
                                            label={event.outdoor ? 'Outdoor' : 'Indoor'}
                                        />
                                    )}
                                </Stack>

                                {event.description && (
                                    <Typography variant="body1" color="text.secondary" mb={2}>
                                        {event.description}
                                    </Typography>
                                )}

                                <Box
                                    sx={{
                                        mt: 2,
                                        p: 2,
                                        bgcolor: 'primary.light',
                                        borderRadius: 2,
                                        textAlign: 'center'
                                    }}
                                >
                                    <Typography variant="body1" fontWeight="bold" color="primary.dark">
                                        Click to rate locations for this event →
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                </Stack>
            </Container>
        </BackgroundWrapper>
    );
}
