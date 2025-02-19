import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/HomePage/Home';
import Quiz from './components/QuizPage/Quiz';
import Questions from './utils/quiz.json';
import QuizContainer from './components/QuizPage/QuizContainer';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-2xl font-bold text-blue-600">Quiz Master</h1>
            <nav className="flex space-x-4">
              <a href="/" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Home</a>
              <a href="/quiz" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Take Quiz</a>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-grow py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quiz" element={<QuizContainer questionsSet={Questions.set1} />} />
        </Routes>
      </main>

      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} Quiz Master. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;