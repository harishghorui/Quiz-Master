import React, { useState } from 'react'
import QuizHistory from './QuizHistory';

function ScoreBoard({ isLoading, quizAttempts, setQuizAttempts }) {
    
    const [showHistory, setShowHistory] = useState(false);

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Your Quiz History</h2>
                <button
                    onClick={() => setShowHistory(!showHistory)}
                    className="text-blue-600 hover:underline text-sm font-medium"
                >
                    {showHistory ? 'Hide Details' : 'Show Details'}
                </button>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
                
            ) : quizAttempts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <p>You haven't attempted any quizzes yet.</p>
                    <p className="mt-2">Start a quiz to see your history here!</p>
                </div>

            ) : (
                <QuizHistory 
                    quizAttempts={quizAttempts}
                    showHistory={showHistory}
                    setQuizAttempts={setQuizAttempts}
                />
            )}
        </div>
    )
}

export default ScoreBoard