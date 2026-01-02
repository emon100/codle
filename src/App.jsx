import React, { useState } from 'react';
import { useQuiz } from './QuizContext';
import Layout from './components/Layout';
import ShareCard from './components/ShareCard';
import MarkdownText from './components/MarkdownText';
import './App.css';

const Home = () => {
  const { startDaily, startInfinite, t, devJumpToResult } = useQuiz();
  const isDev = new URLSearchParams(window.location.search).get('dev') === '1';

  return (
    <div className="home-view">
      {isDev && (
        <div className="dev-toolbar glass">
          <span style={{ marginRight: '1rem', fontWeight: 600 }}>🛠️ Dev Mode:</span>
          <button onClick={() => devJumpToResult(0)}>Score 0</button>
          <button onClick={() => devJumpToResult(5)}>Score 5</button>
          <button onClick={() => devJumpToResult(10)}>Score 10</button>
        </div>
      )}
      <h1 className="fade-in">{t('hero_title')}<span className="gradient-text">{t('hero_span')}</span></h1>
      <p className="fade-in">{t('hero_desc')}</p>

      <div className="modes-grid">
        <div className="mode-card glass fade-in" onClick={startDaily}>
          <h3>📅 {t('daily_title')}</h3>
          <p>{t('daily_desc')}</p>
          <button className="btn-primary">{t('daily_btn')}</button>
        </div>

        <div className="mode-card glass fade-in" style={{ animationDelay: '0.1s' }} onClick={() => startInfinite()}>
          <h3>🔥 {t('infinite_title')}</h3>
          <p>{t('infinite_desc')}</p>
          <button className="btn-primary">{t('infinite_btn')}</button>
        </div>
      </div>
    </div>
  );
};

const Quiz = () => {
  const {
    questions,
    currentIndex,
    submitAnswer,
    score,
    lives,
    currentMode,
    isGameOver,
    t,
    lang
  } = useQuiz();

  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  if (!questions.length) return null;
  if (isGameOver) return <Results />;

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex) / questions.length) * 100;

  const handleOptionClick = (index) => {
    if (showExplanation) return;
    setSelectedAnswer(index);
    setShowExplanation(true);
  };

  const handleNext = () => {
    submitAnswer(selectedAnswer);
    setSelectedAnswer(null);
    setShowExplanation(false);
  };

  return (
    <div className="quiz-view">
      {currentMode === 'infinite' && (
        <div className="infinite-stats">
          <span className="lives">{t('lives')}: {'❤️'.repeat(lives)}</span>
          <span className="current-score">{t('score')}: {score}</span>
        </div>
      )}

      {currentMode === 'daily' && (
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
      )}

      <div className="question-card glass">
        <div className="question-meta">
          <span>{currentQuestion.category[lang]}</span>
          <span>{currentQuestion.difficulty}</span>
        </div>
        <div className="question-text">
          <MarkdownText>{currentQuestion.question[lang]}</MarkdownText>
        </div>

        <div className="options-list">
          {currentQuestion.options[lang].map((option, index) => {
            let className = "option-btn";
            if (showExplanation) {
              if (index === currentQuestion.answer) className += " correct";
              else if (index === selectedAnswer) className += " wrong";
            } else if (index === selectedAnswer) {
              className += " selected";
            }

            return (
              <button
                key={index}
                className={className}
                onClick={() => handleOptionClick(index)}
                disabled={showExplanation}
              >
                {option}
              </button>
            );
          })}
        </div>

        {showExplanation && (
          <div className="explanation-box">
            <h4>{t('explanation')}</h4>
            <MarkdownText>{currentQuestion.explanation[lang]}</MarkdownText>
            <button className="btn-primary next-btn" onClick={handleNext}>
              {currentIndex + 1 === questions.length ? t('see_results') : t('next')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const Results = () => {
  const { score, questions, currentMode, setCurrentMode, resetGame, t } = useQuiz();
  const today = new Date().toISOString().split('T')[0];

  const getRank = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage === 100) return t('rank_god');
    if (percentage >= 80) return t('rank_senior');
    if (percentage >= 60) return t('rank_mid');
    if (percentage >= 40) return t('rank_junior');
    return t('rank_kiddie');
  };

  const shareResult = () => {
    const text = `I just scored ${score}/${questions.length} on Codle! Rank: ${getRank()}. Can you beat me?`;
    if (navigator.share) {
      navigator.share({
        title: 'Codle Result',
        text: text,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(text);
      alert(t('copy_success'));
    }
  };

  return (
    <div className="results-view glass fade-in">
      <ShareCard score={score} total={questions.length} rank={getRank()} date={today} />

      <div className="share-btns" style={{ marginTop: '2rem' }}>
        <button className="btn-primary" onClick={shareResult} style={{ background: 'var(--bg-accent)' }}>
          {t('share')}
        </button>
        <button className="btn-primary" style={{ background: 'var(--bg-accent)' }} onClick={() => { resetGame(); setCurrentMode(null); }}>
          {t('try_another')}
        </button>
      </div>
    </div>
  );
};

function App() {
  const { currentMode } = useQuiz();

  return (
    <Layout>
      {!currentMode ? <Home /> : <Quiz />}
    </Layout>
  );
}

export default App;
