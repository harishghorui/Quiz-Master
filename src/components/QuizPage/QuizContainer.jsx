import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import QuizHeader from "./QuizHeader";
import QuestionNavigation from "./QuestionNavigation";
import QuestionCard from "./QuestionCard";
import ResultsScreen from "./ResultsScreen";
import { ResumePrompt, LoadingScreen, SaveIndicator } from "./quizUtilities";
import {
    saveQuizAttempt,
    saveCurrentSession,
    getCurrentSession,
    clearCurrentSession,
    hasActiveSession
} from "../../utils/indexedBD";

function QuizContainer({ questionsSet }) {
    const navigate = useNavigate();
    const questions = questionsSet.questions;
    const questionTimeLimit = questionsSet.questionTimeLimit || 30;

    // State management
    const [questionRemainingTime, setQuestionRemainingTime] = useState(questionTimeLimit);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [feedback, setFeedback] = useState("");
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [confirmedAnswers, setConfirmedAnswers] = useState({});  // Track confirmed answers
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [score, setScore] = useState(0);
    const [questionTimers, setQuestionTimers] = useState(
        questions.map(() => questionTimeLimit)
    );
    const [totalTimeSpent, setTotalTimeSpent] = useState(0);
    const [quizStartTime, setQuizStartTime] = useState(null);
    const [isInitialized, setIsInitialized] = useState(false);
    const [showResumePrompt, setShowResumePrompt] = useState(false);
    const [savedSession, setSavedSession] = useState(null);

    // Check for existing session on component mount
    useEffect(() => {
        const checkExistingSession = async () => {
            const hasSession = await hasActiveSession();
            if (hasSession) {
                const session = await getCurrentSession();
                setSavedSession(session);
                setShowResumePrompt(true);
            } else {
                initializeNewQuiz();
            }
        };

        checkExistingSession();
    }, []);

    // Initialize a new quiz
    const initializeNewQuiz = useCallback(() => {
        const startTime = new Date();
        setQuizStartTime(startTime);
        setCurrentIndex(0);
        setSelectedAnswers({});
        setConfirmedAnswers({});
        setFeedback("");
        setTotalTimeSpent(0);
        setQuestionRemainingTime(questionTimeLimit);
        setQuestionTimers(questions.map(() => questionTimeLimit));
        setQuizCompleted(false);
        setScore(0);
        setIsInitialized(true);

        // Save initial state
        saveCurrentSession({
            currentIndex: 0,
            selectedAnswers: {},
            confirmedAnswers: {},
            quizStartTime: startTime.toISOString(),
            totalTimeSpent: 0,
            questionTimers: questions.map(() => questionTimeLimit),
        });
    }, [questionTimeLimit, questions]);

    // Resume existing quiz
    const resumeQuiz = useCallback(() => {
        if (!savedSession) return;

        setCurrentIndex(savedSession.currentIndex);
        setSelectedAnswers(savedSession.selectedAnswers || {});
        setConfirmedAnswers(savedSession.confirmedAnswers || {});
        setQuizStartTime(new Date(savedSession.quizStartTime));
        setTotalTimeSpent(savedSession.totalTimeSpent);
        setQuestionTimers(savedSession.questionTimers);
        setQuestionRemainingTime(savedSession.questionTimers[savedSession.currentIndex]);
        setIsInitialized(true);
        setShowResumePrompt(false);
    }, [savedSession]);

    // Decline to resume and start fresh
    const declineResume = useCallback(() => {
        clearCurrentSession();
        initializeNewQuiz();
        setShowResumePrompt(false);
    }, [initializeNewQuiz]);

    // Save current session state
    const persistCurrentState = useCallback(() => {
        if (!isInitialized || quizCompleted) return;

        saveCurrentSession({
            currentIndex,
            selectedAnswers,
            confirmedAnswers,
            quizStartTime: quizStartTime.toISOString(),
            totalTimeSpent,
            questionTimers,
            lastUpdated: new Date().toISOString()
        });
    }, [currentIndex, isInitialized, questionTimers, quizCompleted, quizStartTime, selectedAnswers, confirmedAnswers, totalTimeSpent]);

    // Move to next question
    const moveToNextQuestion = useCallback(() => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prevIndex => prevIndex + 1);
            setFeedback("");
            persistCurrentState();
        } else {
            finishQuiz();
        }
    }, [currentIndex, persistCurrentState, questions.length]);

    // Navigate to specific question
    const goToQuestion = (index) => {
        if (index >= 0 && index < questions.length) {
            setQuestionTimers(prev => {
                const updated = [...prev];
                updated[currentIndex] = questionRemainingTime;
                return updated;
            });
            setQuestionRemainingTime(questionTimers[index]);
            setCurrentIndex(index);
            setFeedback("");
            setTimeout(persistCurrentState, 100);
        }
    };

    // Finish quiz and calculate results
    const finishQuiz = () => {
        const endTime = new Date();
        const timeSpentInSeconds = quizStartTime
            ? Math.floor((endTime - quizStartTime) / 1000)
            : totalTimeSpent;

        let correctAnswers = 0;
        questions.forEach((question, index) => {
            const userAnswer = confirmedAnswers[index];
            if (userAnswer !== undefined) {
                if (userAnswer === question.answer) {
                    correctAnswers++;
                }
            }
        });

        const finalScore = Math.round((correctAnswers / questions.length) * 100);
        setScore(finalScore);
        setQuizCompleted(true);

        const attemptData = {
            date: new Date().toISOString(),
            timeSpent: timeSpentInSeconds,
            score: finalScore,
            answers: confirmedAnswers,
            totalQuestions: questions.length,
            correctAnswers: correctAnswers
        };

        saveQuizAttempt(attemptData);
        clearCurrentSession();
    };

    // Handler functions passed to child components
    const handleTempAnswer = (selectedOption) => {
        setSelectedAnswers({
            ...selectedAnswers,
            [currentIndex]: selectedOption,
        });
    };

    const handleConfirmAnswer = () => {
        if (selectedAnswers[currentIndex] === undefined) return;
        
        const answer = selectedAnswers[currentIndex];
        setConfirmedAnswers({
            ...confirmedAnswers,
            [currentIndex]: answer,
        });

        const isCorrect = answer === questions[currentIndex].answer;
        setFeedback(isCorrect ? "✅ Correct!" : "❌ Wrong!");
        setTimeout(persistCurrentState, 100);
    };

    const handleClearResponse = () => {
        const updatedSelections = { ...selectedAnswers };
        delete updatedSelections[currentIndex];
        setSelectedAnswers(updatedSelections);
        
        if (confirmedAnswers[currentIndex] !== undefined) {
            const updatedConfirmed = { ...confirmedAnswers };
            delete updatedConfirmed[currentIndex];
            setConfirmedAnswers(updatedConfirmed);
            setFeedback("");
            setTimeout(persistCurrentState, 100);
        }
    };

    // Quiz timer effect
    useEffect(() => {
        if (!isInitialized || quizCompleted || showResumePrompt) return;

        const timer = setTimeout(() => {
            if (questionRemainingTime > 0) {
                setQuestionRemainingTime(prevTime => prevTime - 1);
                setQuestionTimers(prev => {
                    const updated = [...prev];
                    updated[currentIndex] = questionRemainingTime - 1;
                    return updated;
                });
                setTotalTimeSpent(prev => prev + 1);
            } else {
                moveToNextQuestion();
                setQuestionRemainingTime(questionTimers[currentIndex + 1] || questionTimeLimit);
            }
        }, 1000);

        return () => clearTimeout(timer);
    }, [questionRemainingTime, currentIndex, quizCompleted, moveToNextQuestion, 
        questionTimers, questionTimeLimit, isInitialized, showResumePrompt]);

    // Auto-save effect
    useEffect(() => {
        if (!isInitialized) return;
        const saveInterval = setInterval(persistCurrentState, 5000);
        return () => clearInterval(saveInterval);
    }, [isInitialized, persistCurrentState]);

    // Beforeunload warning
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (!quizCompleted && isInitialized) {
                const message = "You have an active quiz. Your progress will be saved, but are you sure you want to leave?";
                e.returnValue = message;
                return message;
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [quizCompleted, isInitialized]);

    // Start new attempt
    const startNewAttempt = () => {
        clearCurrentSession();
        initializeNewQuiz();
    };

    // Navigate to home
    const goToHome = () => {
        navigate('/');
    };

    // Conditional rendering
    if (showResumePrompt) {
        return <ResumePrompt 
            savedSession={savedSession} 
            questions={questions} 
            onResume={resumeQuiz} 
            onDecline={declineResume} 
        />;
    }

    if (!isInitialized) {
        return <LoadingScreen />;
    }

    if (quizCompleted) {
        return <ResultsScreen 
            score={score} 
            questions={questions} 
            answers={confirmedAnswers} 
            totalTimeSpent={totalTimeSpent}
            onTryAgain={startNewAttempt}
            onGoHome={goToHome}
        />;
    }

    return (
        <div className="w-full max-w-4xl mx-auto">
            <QuizHeader 
                questionRemainingTime={questionRemainingTime} 
                currentIndex={currentIndex}
                totalQuestions={questions.length}
            />
            
            <QuestionNavigation 
                questions={questions}
                currentIndex={currentIndex}
                selectedAnswers={selectedAnswers}
                confirmedAnswers={confirmedAnswers}
                onNavigate={goToQuestion}
            />
            
            <QuestionCard 
                question={questions[currentIndex]}
                questionIndex={currentIndex}
                totalQuestions={questions.length}
                remainingTime={questionRemainingTime}
                selectedAnswer={selectedAnswers[currentIndex]}
                confirmedAnswer={confirmedAnswers[currentIndex]}
                feedback={feedback}
                onSelect={handleTempAnswer}
                onConfirm={handleConfirmAnswer}
                onClear={handleClearResponse}
                onPrevious={() => goToQuestion(currentIndex - 1)}
                onNext={() => goToQuestion(currentIndex + 1)}
                onFinish={finishQuiz}
                isLast={currentIndex === questions.length - 1}
                isFirst={currentIndex === 0}
            />
            
            <SaveIndicator />
        </div>
    );
}

export default QuizContainer;