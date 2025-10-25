import { useState } from 'react'
import './PersonalityQuiz.css'

const quizQuestions = [
    {
        id: 1,
        question: "Which word would your friends most likely use to describe you? ",
        options: [
            { text: "Busy", tags: ["quirky", "different", "brave"] },
            { text: "Loud", tags: ["traditional", "crowd-pleaser", "safe"] },
            { text: "Caring", tags: ["unique", "bold", "polarizing"] },
            { text: "Brave", tags: ["indulgent", "extra", "unapologetic"] },
            { text: "Cool", tags: ["indulgent", "extra", "unapologetic"] }
        ]
    },
    {
        id: 2,
        question: "Where would you rather live?",
        options: [
            { text: "Somewhere cold", tags: ["caring", "prepared", "nurturing"] },
            { text: "A bustling city", tags: ["funny", "entertainer", "mood-lifter"] },
            { text: "Close to family", tags: ["wise", "thoughtful", "cryptic"] },
            { text: "Anywhere with hiking", tags: ["chaotic", "lovable", "disaster"] },
            { text: "Near a forest", tags: ["chaotic", "lovable", "disaster"] }
            
        ]
    },
    {
        id: 3,
        question: "What’s your dream job?",
        options: [
            { text: "Inventor", tags: ["optimistic", "renewal", "growth"] },
            { text: "Athlete", tags: ["energetic", "social", "adventurous"] },
            { text: "President", tags: ["aesthetic", "nostalgic", "basic"] },
            { text: "CEO", tags: ["introverted", "homebody", "romantic"] },
            { text: "Actor", tags: ["introverted", "homebody", "romantic"] }
        ]
    },
    {
        id: 4,
        question: "Which city’s vibe is closest to your own?",
        options: [
            { text: "Tokyo", tags: ["positive", "cringe", "wholesome"] },
            { text: "DC", tags: ["chill", "easygoing", "avoidant"] },
            { text: "Cape Town", tags: ["procrastinator", "lazy", "optimistic"] },
            { text: "London", tags: ["spontaneous", "chaotic", "brave"] },
            { text: "Mumbai", tags: ["spontaneous", "chaotic", "brave"] },
        ]
    },
    {
        id: 5,
        question: "Which kind of movie would you rather watch? ",
        options: [
            { text: "Boo! Horror", tags: ["clumsy", "romantic", "awkward"] },
            { text: "LOL! Comedy", tags: ["supportive", "loyal", "secondary"] },
            { text: "I love foreign films", tags: ["artsy", "pretentious", "deep"] },
            { text: "MUSICAL", tags: ["relatable", "lazy", "self-aware"] },
            { text: "Action baby", tags: ["relatable", "lazy", "self-aware"] },
        ]
    },
    {
        id: 6,
        question: "How do you like to spend your weekends?",
        options: [
            { text: "Trying something new like comedy class", tags: ["basic", "nostalgic", "crowd-pleaser"] },
            { text: "Perfect time to redecorate my room", tags: ["bold", "showoff", "theatrical"] },
            { text: "Picnic with friends", tags: ["scene-kid", "nostalgic", "emotional"] },
            { text: "As long as im outside, i'm good", tags: ["shy", "observer", "wallflower"] },
            { text: "Outdoor concerts all the way", tags: ["shy", "observer", "wallflower"] }
        ]
    },
    {
        id: 7,
        question: "How would you describe your fashion sense?",
        options: [
            { text: "Lots of layers brrr - brave and reckless", tags: ["courageous", "impulsive", "hero-complex"] },
            { text: "Pretty trad stuff", tags: ["strategic", "determined", "edgy"] },
            { text: "In my influencer era", tags: ["kind", "reliable", "soft"] },
            { text: "Comfort > style", tags: ["smart", "quirky", "pretentious"] },
            { text: "Whatever my mum buys me", tags: ["smart", "quirky", "pretentious"] }
        ]
    }
];

function PersonalityQuiz({ onComplete }) {
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [selectedTags, setSelectedTags] = useState([])
    const [answers, setAnswers] = useState([])

    const handleAnswer = (option) => {
        setAnswers([...answers, option.text])

        setSelectedTags([...selectedTags, ...option.tags])
        
        if (currentQuestion < quizQuestions.length - 1) {
            setCurrentQuestion(currentQuestion + 1)
        } else {
            finishQuiz()
        }
    }

    const finishQuiz = () => {
        const tagCounts = {}
        selectedTags.forEach(tag => {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1
        })

        const topTags = Object.entries(tagCounts).sort((a,b) => b[1] - a[1]).slice(0,5).map(entry => entry[0])

        console.log("users aura: ", topTags)

        // save to backend somehow

        onComplete(topTags)
    }

    const question = quizQuestions[currentQuestion]

    return (
         <div className="quiz-overlay">
            <div className="quiz-container">
                <div className="quiz-progress">
                    Question {currentQuestion + 1} of {quizQuestions.length}
                </div>

                <h2 className="quiz-question">{question.question}</h2>

                <div className="quiz-options">
                    {question.options.map((option, index) => (
                        <button
                            key={index}
                            className="quiz-option"
                            onClick={() => handleAnswer(option)}
                        >
                            {option.text}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default PersonalityQuiz