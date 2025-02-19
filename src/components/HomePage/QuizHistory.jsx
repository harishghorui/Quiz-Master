import React from 'react'
import { formatDate } from '../../utils/formatHelper';
import { clearQuizHistory } from '../../utils/indexedBD';

function QuizHistory({ quizAttempts, showHistory, setQuizAttempts }) {

    const handleClearHistory = async () => {
        try {
            await clearQuizHistory();
            setQuizAttempts([]);
        } catch (error) {
            console.error("Failed to clear history:", error);
        }
    };

    return (
        <>
            <div className="mb-4">
                {quizAttempts.sort((a, b) => new Date(b.date) - new Date(a.date)).map((attempt, index) => (
                    <div key={index} className="border-b py-4 last:border-b-0">
                        <div className="flex justify-between items-center mb-2">
                            <div className="font-medium">Attempt #{quizAttempts.length - index}</div>
                            <div className={`px-3 py-1 rounded-full text-sm font-medium ${attempt.score >= 80 ? 'bg-green-100 text-green-800' :
                                attempt.score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                }`}>
                                Score: {attempt.score}%
                            </div>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                            {formatDate(attempt.date)}
                        </div>
                        <div className="text-sm">
                            Correct: {attempt.correctAnswers}/{attempt.totalQuestions} •
                            Time: {Math.floor(attempt.timeSpent / 60)}:{(attempt.timeSpent % 60).toString().padStart(2, '0')}
                        </div>

                        {showHistory && (
                            <div className="mt-3 pl-4 border-l-2 border-gray-200">
                                <p className="text-sm font-medium mb-2">Answer Summary:</p>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    {Object.entries(attempt.answers).map(([questionIndex, answer], idx) => {
                                        const question = parseInt(questionIndex) + 1;
                                        return (
                                            <div key={idx} className="flex items-center">
                                                <span className="text-gray-600">
                                                    Q{question}:
                                                </span>
                                                <span className="ml-1 truncate">{answer}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {quizAttempts.length > 0 && (
                <div className="flex justify-end">
                    <button
                        onClick={handleClearHistory}
                        className="text-sm text-red-600 hover:text-red-800"
                    >
                        Clear History
                    </button>
                </div>
            )}
        </>
    )
}

export default QuizHistory