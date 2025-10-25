import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import PersonalityQuiz from "../components/PersonalityQuiz";

export default function Groups() {
    const navigate = useNavigate()

    const handleQuizCompletion = (tags) => {
        console.log("User personality: ", tags)
        alert("Personality recorded. Thank you!")
        navigate("/home")
    }
    
    return (
        <div>
            <h1>Groups Page</h1>
            <Link to="/home">Home</Link>
            <PersonalityQuiz onComplete={handleQuizCompletion}/>
        </div>
    );
}
