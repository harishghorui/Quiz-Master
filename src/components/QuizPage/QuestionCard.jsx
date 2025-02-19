import React from "react";
import { formatTime } from "../../utils/formatHelper";
import { MultipleChoiceQuestion, IntegerTypeQuestion } from "./QuestionType";

function QuestionCard({
    question,
    questionIndex,
    totalQuestions,
    remainingTime,
    selectedAnswer,
    confirmedAnswer,
    feedback,
    onSelect,
    onConfirm,
    onClear,
    onPrevious,
    onNext,
    onFinish,
    isLast,
    isFirst
}) {

    const isAnswerSelected = selectedAnswer !== undefined;
    const isAnswerConfirmed = confirmedAnswer !== undefined;
    const isActionDisabled = isAnswerConfirmed;

    return (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
            <div className="mb-6 flex justify-between">
                <span className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                    Question {questionIndex + 1} of {totalQuestions}
                </span>
                <span className={`inline-block text-sm font-medium px-3 py-1 rounded-full 
                    ${remainingTime < 10 ? 'bg-red-100 text-red-800 animate-pulse' : 'bg-gray-100 text-gray-800'}`}>
                    Time remaining: {formatTime(remainingTime)}
                </span>
            </div>

            <h3 className="text-xl font-medium mb-6">{question.question}</h3>

            <div className="mb-6">
                {question.type === "Multiple-Choice" ? (
                    <MultipleChoiceQuestion
                        options={question.options}
                        selectedOption={selectedAnswer}
                        confirmedOption={confirmedAnswer}
                        onSelect={onSelect}
                    />
                ) : (
                    <IntegerTypeQuestion
                        value={selectedAnswer}
                        confirmedValue={confirmedAnswer}
                        onChange={onSelect}
                    />
                )}
            </div>

            {feedback && (
                <div className={`mb-6 p-3 rounded-md ${feedback.includes("✅") ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                    }`}>
                    {feedback}
                </div>
            )}

            <div className="flex justify-between">
                {/* <button
                    onClick={onPrevious}
                    disabled={isFirst}
                    className={`px-4 py-2 rounded-md ${
                        isFirst
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                    Previous
                </button> */}
                
                {/* Response Action Buttons */}
                <div className="flex gap-3 mr-3">
                    <button
                        onClick={onConfirm}
                        disabled={!isAnswerSelected || isAnswerConfirmed}
                        className={`px-4 py-2 rounded-md ${!isAnswerSelected || isAnswerConfirmed
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-green-600 text-white hover:bg-green-700'
                            }`}
                    >
                        Confirm
                    </button>
                    <button
                        onClick={onClear}
                        disabled={!isAnswerSelected || isAnswerConfirmed}
                        className={`px-4 py-2 rounded-md ${!isAnswerSelected || isAnswerConfirmed
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-red-600 text-white hover:bg-red-700'
                            }`}
                    >
                        Clear Response
                    </button>
                </div>

                {isLast ? (
                    <button
                        onClick={onFinish}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                        Finish Quiz
                    </button>
                ) : (
                    <button
                        onClick={onNext}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Next
                    </button>
                )}
            </div>
        </div>
    );
}

export default QuestionCard;