import React from "react";
import { formatTime } from "../../utils/formatHelper";

function QuizHeader({ questionRemainingTime, currentIndex, totalQuestions }) {
    return (
        <div className="bg-white shadow rounded-lg mb-6">
            <div className="px-6 py-4 flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Quiz (Set-1)</h2>
                <div className="flex items-center gap-2">
                    <span className="text-gray-600">Question timer:</span>
                    <span className={`px-4 py-1 rounded-full font-medium ${
                        questionRemainingTime < 10 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                        {formatTime(questionRemainingTime)}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default QuizHeader;