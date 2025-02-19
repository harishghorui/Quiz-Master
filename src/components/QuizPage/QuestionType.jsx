import React from "react";

// Multiple Choice Question Component
export function MultipleChoiceQuestion({ options, selectedOption, confirmedOption, onSelect }) {
    return (
        <div className="space-y-3">
            {options.map((option, idx) => {
                // Determine option state
                const isSelected = selectedOption === option;
                const isConfirmed = confirmedOption === option;
                const isDisabled = confirmedOption !== undefined;
                
                let optionClass = "p-4 border rounded-lg transition-colors";
                
                if (isConfirmed) {
                    optionClass += " bg-green-50 border-green-300";
                } else if (isSelected) {
                    optionClass += " bg-blue-50 border-blue-300";
                } else if (isDisabled) {
                    optionClass += " opacity-50 cursor-not-allowed";
                } else {
                    optionClass += " hover:bg-gray-50 cursor-pointer";
                }
                
                return (
                    <div
                        key={idx}
                        onClick={() => !isDisabled && onSelect(option)}
                        className={optionClass}
                    >
                        <div className="flex items-center">
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                                isConfirmed ? 'border-green-500 bg-green-500' :
                                isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                            }`}>
                                {(isSelected || isConfirmed) && (
                                    <span className="text-white text-sm">✓</span>
                                )}
                            </div>
                            <span>{option}</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

// Integer Type Question Component
export function IntegerTypeQuestion({ value, confirmedValue, onChange }) {
    const isDisabled = confirmedValue !== undefined;
    
    return (
        <div className="w-full max-w-xs">
            <input
                type="number"
                value={value || ""}
                onChange={(e) => !isDisabled && onChange(Number(e.target.value))}
                placeholder="Enter your answer"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                    isDisabled ? 'bg-gray-100 cursor-not-allowed' : ''
                } ${
                    confirmedValue !== undefined ? 'border-green-500' : 'border-gray-300'
                }`}
                disabled={isDisabled}
            />
        </div>
    );
}

export default {
    MultipleChoiceQuestion,
    IntegerTypeQuestion
};