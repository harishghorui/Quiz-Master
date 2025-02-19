import React from "react";

// Resume Prompt Component
export function ResumePrompt({ savedSession, questions, onResume, onDecline }) {
    if (!savedSession) return null;
    
    return (
        <div className="w-full max-w-3xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center mb-6">Resume Quiz?</h2>
            <p className="text-lg text-center mb-6">
                We found an unfinished quiz. Would you like to resume where you left off?
            </p>
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <p><strong>Previous session details:</strong></p>
                <ul className="list-disc pl-5 mt-2">
                    <li>Progress: Question {savedSession.currentIndex + 1} of {questions.length}</li>
                    <li>Questions answered: {Object.keys(savedSession.confirmedAnswers || {}).length}</li>
                    <li>Last active: {new Date(savedSession.lastUpdated).toLocaleString()}</li>
                </ul>
            </div>
            <div className="flex justify-center gap-4">
                <button
                    onClick={onResume}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                    Resume Quiz
                </button>
                <button
                    onClick={onDecline}
                    className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                >
                    Start New Quiz
                </button>
            </div>
        </div>
    );
}

// Loading Screen Component
export function LoadingScreen() {
    return (
        <div className="w-full max-w-3xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4">Loading quiz...</p>
        </div>
    );
}

// Save Indicator Component
export function SaveIndicator() {
    return (
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <p className="text-sm text-gray-600">
                <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Your progress is automatically saved. You can safely close this page and resume later.
                </span>
            </p>
        </div>
    );
}

export default {
    ResumePrompt,
    LoadingScreen,
    SaveIndicator
};