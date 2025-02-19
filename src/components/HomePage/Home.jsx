import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getQuizAttempts, hasActiveSession, getCurrentSession } from "../../utils/indexedBD";
import ScoreBoard from "./ScoreBoard";
import { formatDate } from "../../utils/formatHelper";
function Home() {
    
    const [quizAttempts, setQuizAttempts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hasIncompleteQuiz, setHasIncompleteQuiz] = useState(false);
    const [incompleteQuizData, setIncompleteQuizData] = useState(null);

    useEffect(() => {
        loadAttemptHistory();
        checkForIncompleteQuiz();
    }, []);

    const loadAttemptHistory = async () => {
        try {
            const attempts = await getQuizAttempts();
            setQuizAttempts(attempts);
            setIsLoading(false);
        } catch (error) {
            console.error("Failed to load quiz history:", error);
            setIsLoading(false);
        }
    };

    const checkForIncompleteQuiz = async () => {
        try {
            const hasSession = await hasActiveSession();
            if (hasSession) {
                const sessionData = await getCurrentSession();
                setHasIncompleteQuiz(true);
                setIncompleteQuizData(sessionData);
            }
        } catch (error) {
            console.error("Failed to check for incomplete quiz:", error);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto py-8 px-4">

            <div className="grid md:grid-cols-2 gap-8">

                {/* Available Quizzes */}
                <div className="bg-white rounded-lg shadow-md p-6">

                    <h2 className="text-2xl font-bold mb-6">Available Quizzes</h2>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6 hover:shadow-md transition-shadow">

                        {/* Quiz Title */}
                        <h3 className="text-xl font-semibold mb-2">General Knowledge Quiz</h3>

                        {/* Instructions */}
                        <div className="text-sm text-gray-600 mb-4">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                    </svg>
                                    <span>30 seconds per question</span>
                                </div>
                                <div className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                        <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                                    </svg>
                                    <span>10 questions</span>
                                </div>
                            </div>
                            
                        </div>
                        
                        {/* Incomplete Quiz */}
                        <div className="flex flex-col">
                            <div className="mb-3">
                                {quizAttempts.length > 0 && (
                                    <div className="text-sm text-gray-600">
                                        Best score: <span className="font-medium text-green-600">
                                            {Math.max(...quizAttempts.map(a => a.score))}%
                                        </span>
                                    </div>
                                )}
                            </div>
                            
                            {hasIncompleteQuiz && (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-3">
                                    <div className="flex items-start">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                        </svg>
                                        <div>
                                            <p className="text-sm font-medium text-yellow-800">You have an incomplete quiz</p>
                                            <p className="text-xs text-yellow-700 mt-1">
                                                Progress: Question {incompleteQuizData?.currentIndex + 1} of 10
                                                <br />
                                                Last active: {incompleteQuizData && formatDate(incompleteQuizData.lastUpdated)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                                {hasIncompleteQuiz && (
                                    <Link to="/quiz" className="flex-1">
                                        <button className="w-full px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors cursor-pointer">
                                            Resume Quiz
                                        </button>
                                    </Link>
                                )}
                                <Link to="/quiz" className="flex-1">
                                    <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer">
                                        {hasIncompleteQuiz ? "Start New Quiz" : "Start Quiz"}
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                    
                    {/* Coming Soon Section */}
                    <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center text-gray-500">
                        <h3 className="text-xl font-medium mb-2">More Quizzes Coming Soon...</h3>
                    </div>
                </div>
                
                {/* Quiz History */}
                <ScoreBoard 
                    isLoading={isLoading}
                    quizAttempts={quizAttempts}
                    setQuizAttempts={setQuizAttempts}
                />
            </div>
        </div>
    );
}

export default Home;