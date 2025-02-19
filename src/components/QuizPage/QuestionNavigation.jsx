import React from "react";

function QuestionNavigation({ questions, currentIndex, selectedAnswers, confirmedAnswers, onNavigate }) {
    return (
        <div className="bg-white shadow rounded-lg mb-6">
            <div className="px-6 py-2 bg-gray-50 flex">
                <div className="flex space-x-1 overflow-x-auto py-2">
                    {questions.map((_, idx) => {
                        // Determine button style based on selection/confirmation status
                        const isSelected = selectedAnswers[idx] !== undefined;
                        const isConfirmed = confirmedAnswers[idx] !== undefined;
                        let buttonClass = "w-8 h-8 flex items-center justify-center rounded-full text-sm border";
                        
                        if (currentIndex === idx) {
                            buttonClass = "w-8 h-8 flex items-center justify-center rounded-full text-sm bg-blue-600 text-white";
                        } else if (isConfirmed) {
                            buttonClass = "w-8 h-8 flex items-center justify-center rounded-full text-sm bg-green-600 text-white";
                        } else if (isSelected) {
                            buttonClass = "w-8 h-8 flex items-center justify-center rounded-full text-sm bg-yellow-100 border-yellow-300";
                        }
                        
                        return (
                            <button
                                key={idx}
                                // onClick={() => onNavigate(idx)}
                                className={buttonClass}
                            >
                                {idx + 1}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default QuestionNavigation;