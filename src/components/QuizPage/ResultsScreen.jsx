import React from "react";
import { formatTotalTime } from "../../utils/formatHelper";

function ResultsScreen({ score, questions, answers, totalTimeSpent, onTryAgain, onGoHome }) {
    return (
        <div className="w-full max-w-3xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center mb-6">Quiz Results</h2>

            <div className="text-center mb-8">
                <div className="text-5xl font-bold mb-4">{score}%</div>
                <p className="text-lg">
                    You answered {Object.keys(answers).length} out of {questions.length} questions.
                </p>
                <p className="text-md text-gray-600 mt-2">
                    Time taken: {formatTotalTime(totalTimeSpent)}
                </p>
            </div>

            <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Question Summary</h3>
                <div className="space-y-4">
                    {questions.map((question, idx) => {
                        const userAnswer = answers[idx];
                        const isAnswered = userAnswer !== undefined;
                        const isCorrect = isAnswered && userAnswer === question.answer;

                        return (
                            <div key={idx} className={`p-4 rounded-md ${
                                !isAnswered ? 'bg-gray-50 border border-gray-200' :
                                isCorrect ? 'bg-green-50 border border-green-200' : 
                                'bg-red-50 border border-red-200'
                            }`}>
                                <p className="font-medium">{idx + 1}. {question.question}</p>
                                <div className="mt-2 grid grid-cols-2 gap-2">
                                    <div>
                                        <span className="text-sm font-medium text-gray-500">Your answer:</span>
                                        <p className={
                                            !isAnswered ? 'text-gray-600 italic' :
                                            isCorrect ? 'text-green-600 font-medium' : 
                                            'text-red-600 font-medium'
                                        }>
                                            {isAnswered ? userAnswer : 'Not answered'}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-sm font-medium text-gray-500">Correct answer:</span>
                                        <p className="text-green-600 font-medium">{question.answer}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="flex justify-center gap-4">
                <button
                    onClick={onTryAgain}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                    Try Again
                </button>
                <button
                    onClick={onGoHome}
                    className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                >
                    Back to Home
                </button>
            </div>
        </div>
    );
}

export default ResultsScreen;