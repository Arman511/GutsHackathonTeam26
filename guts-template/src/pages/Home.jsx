import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Container, Grid, Card, CardContent, Typography, Button, Box, Alert } from '@mui/material';
import GroupsIcon from '@mui/icons-material/Groups';
import EventIcon from '@mui/icons-material/Event';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PsychologyIcon from '@mui/icons-material/Psychology';
import BackgroundWrapper from './react-bits/BackgroundWrapper';
import { getMe } from "../api/api";
import PersonalityQuiz from "../components/PersonalityQuiz";

export default function Home() {
    const navigate = useNavigate()
    const [currentUser, setCurrentUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [showQuiz, setShowQuiz] = useState(false)

    useEffect(() => {
        const loadUser = async () => {
            try {
                const user = await getMe()
                setCurrentUser(user)
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        }
        loadUser()
    }, [navigate])

    const handleQuizComplete = (topTags) => {
        console.log("Users personality boiled down to: ", topTags)

        localStorage.setItem('personality_tags', JSON.stringify(topTags))
        
        alert("Personality quiz complete! Well use these to recommend better activites for you.")
        setShowQuiz(false)
    }

    if (loading) {
        return (
            <BackgroundWrapper>
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                    <Typography variant="h4" color="white">Loading...</Typography>
                </Box>
            </BackgroundWrapper>
        )
    }

        const cards = [
        {
            title: 'My Groups',
            description: 'View event invites & rate activities',
            icon: <GroupsIcon sx={{ fontSize: 80 }} />,
            path: '/groups'
        },
        {
            title: 'Plan Event',
            description: 'Create event & invite team',
            icon: <EventIcon sx={{ fontSize: 80 }} />,
            path: '/plan'
        },
        {
            title: 'Dashboard',
            description: 'View event results & rankings',
            icon: <DashboardIcon sx={{ fontSize: 80 }} />,
            path: '/agenda'
        }
    ];

    return (
        <BackgroundWrapper>
            <Container maxWidth="lg" sx={{ py: 5 }}>
                <Box textAlign="center" mb={6}>
                    <Typography variant="h2" color="white" gutterBottom fontWeight="bold">
                        Welcome, {currentUser?.name || 'Employee'}!
                    </Typography>
                    <Typography variant="h5" color="white" sx={{ opacity: 0.9 }}>
                        SAS Team Event Platform
                    </Typography>
                </Box>

                <Alert 
                    severity="info" 
                    icon={<PsychologyIcon fontSize="large" />}
                    sx={{ 
                        mb: 4, 
                        fontSize: '1.1em',
                        display: 'flex',
                        alignItems: 'center',
                        textAlign: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <Box>
                        <Typography variant="h6" gutterBottom>
                            Let's learn more about what you like!
                        </Typography>
                        <Typography variant="body1">
                            Take our personality quiz to get better activity recommendations
                        </Typography>
                    </Box>
                    <Button 
                        variant="contained" 
                        size="large"
                        onClick={() => setShowQuiz(true)}
                        sx={{ ml: 2 }}
                    >
                        Take Quiz
                    </Button>
                </Alert>

                <Grid container spacing={3} mb={4} style={{display: 'flex', justifyContent: 'center'}}>
                    {cards.map((card) => (
                        <Grid item xs={12} md={4} key={card.title}>
                            <Link to={card.path} style={{ textDecoration: 'none' }}>
                                <Card 
                                    sx={{ 
                                        height: '100%',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s',
                                        '&:hover': {
                                            transform: 'translateY(-8px)',
                                            boxShadow: 6
                                        }
                                    }}
                                >
                                    <CardContent sx={{ textAlign: 'center', py: 5 }}>
                                        <Box color="primary.main" mb={2}>
                                            {card.icon}
                                        </Box>
                                        <Typography variant="h5" gutterBottom fontWeight="bold">
                                            {card.title}
                                        </Typography>
                                        <Typography variant="body1" color="text.secondary">
                                            {card.description}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Link>
                        </Grid>
                    ))}
                </Grid>

                <Box textAlign="center">
                    <Button
                        variant="outlined"
                        color="inherit"
                        size="large"
                        onClick={() => {
                            localStorage.removeItem('access_token');
                            navigate('/');
                        }}
                        sx={{ color: 'white', borderColor: 'white' }}
                    >
                        Logout
                    </Button>
                </Box>

                {showQuiz && (
                    <PersonalityQuiz onComplete={handleQuizComplete} />
                )}
            </Container>
        </BackgroundWrapper>

    );
}
