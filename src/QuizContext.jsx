import React, { createContext, useContext, useState, useEffect } from 'react';
import questionsData from './data/questions.json';

const QuizContext = createContext();

const translations = {
  en: {
    daily_title: "Daily Sprint",
    daily_desc: "10 calibrated questions refreshed every 24 hours. Compete with the community.",
    daily_btn: "Start Today's Quiz",
    infinite_title: "Infinite Survival",
    infinite_desc: "Test your limits. 2 lives, no end. How far can you go?",
    infinite_btn: "Enter Infinite Mode",
    lives: "Lives",
    score: "Score",
    explanation: "Explanation",
    next: "Next Question",
    see_results: "See Results",
    try_another: "Try Another Mode",
    share: "Share My Rank",
    rank_god: "Code Goddess/God",
    rank_senior: "Senior Architect",
    rank_mid: "Mid-Level Engineer",
    rank_junior: "Junior Developer",
    rank_kiddie: "Script Kiddie",
    awesome: "Awesome Work!",
    keep_refining: "Keep refining your skills daily to reach the top level.",
    hero_title: "Sharpen Your ",
    hero_span: "Coding Skills",
    hero_desc: "Daily challenges and survival modes for serious developers.",
    copy_success: "Result copied to clipboard!",
    footer: "© 2026 Codle - Empowering Developers"
  },
  cn: {
    daily_title: "每日挑战",
    daily_desc: "每天 10 道精选题目，24 小时刷新。看看你的全球排名。",
    daily_btn: "开始今日挑战",
    infinite_title: "无限模式",
    infinite_desc: "挑战极限。2 条命，没有终点。你能走多远？",
    infinite_btn: "进入无限模式",
    lives: "生命值",
    score: "得分",
    explanation: "解析",
    next: "下一题",
    see_results: "查看结果",
    try_another: "尝试其他模式",
    share: "分享我的称号",
    rank_god: "代码之神",
    rank_senior: "高级架构师",
    rank_mid: "中级工程师",
    rank_junior: "初级开发者",
    rank_kiddie: "脚本小子",
    awesome: "做得太棒了！",
    keep_refining: "每天坚持练习，登顶代码之巅。",
    hero_title: "磨练你的 ",
    hero_span: "编程技艺",
    hero_desc: "为硬核开发者准备的每日挑战与生存模式。",
    copy_success: "结果已复制到剪贴板！",
    footer: "© 2026 Codle - 为开发者赋能"
  }
};

export const useQuiz = () => useContext(QuizContext);

export const QuizProvider = ({ children }) => {
  const [lang, setLang] = useState(localStorage.getItem('lang') || 'cn');
  const [questions, setQuestions] = useState([]);
  const [currentMode, setCurrentMode] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(2);
  const [answers, setAnswers] = useState([]); // Track user answers for history
  const [isGameOver, setIsGameOver] = useState(false);

  // Daily selection logic
  const getDailyQuestions = () => {
    const today = new Date().toISOString().split('T')[0];

    // 1. First, pick questions pinned for today
    const pinned = questionsData.filter(q => q.scheduled_date === today);

    if (pinned.length >= 10) return pinned.slice(0, 10);

    // 2. Fill the rest with seeded random questions (avoid duplicates)
    const seed = today.split('-').reduce((acc, val) => acc + parseInt(val), 0);
    const pinnedIds = new Set(pinned.map(q => q.id));

    const pool = questionsData.filter(q => !pinnedIds.has(q.id));
    const shuffled = pool.sort((a, b) => {
      const pseudoRandom = Math.sin(seed + a.id.length + b.id.length);
      return pseudoRandom > 0 ? 1 : -1;
    });

    return [...pinned, ...shuffled].slice(0, 10);
  };

  const startDaily = () => {
    const daily = getDailyQuestions();
    setQuestions(daily);
    setCurrentMode('daily');
    resetGame();
  };

  const startInfinite = (category = 'All') => {
    let filtered = [...questionsData];
    if (category !== 'All') {
      filtered = filtered.filter(q => q.category === category);
    }
    // Random shuffle for infinite
    const shuffled = filtered.sort(() => Math.random() - 0.5);
    setQuestions(shuffled);
    setCurrentMode('infinite');
    resetGame();
    setLives(2);
  };

  const resetGame = () => {
    setCurrentIndex(0);
    setScore(0);
    setAnswers([]);
    setIsGameOver(false);
  };

  const submitAnswer = (answerIndex) => {
    const currentQuestion = questions[currentIndex];
    const isCorrect = answerIndex === currentQuestion.answer;

    const newAnswers = [...answers, {
      questionId: currentQuestion.id,
      userAnswer: answerIndex,
      isCorrect
    }];
    setAnswers(newAnswers);

    if (isCorrect) {
      setScore(s => s + 1);
    } else {
      if (currentMode === 'infinite') {
        const newLives = lives - 1;
        setLives(newLives);
        if (newLives <= 0) {
          setIsGameOver(true);
          return;
        }
      }
    }

    // Move to next question or end
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(i => i + 1);
    } else {
      setIsGameOver(true);
    }
  };

  const switchLang = (newLang) => {
    setLang(newLang);
    localStorage.setItem('lang', newLang);
  };

  const t = (key) => translations[lang][key] || key;

  const devJumpToResult = (mockScore) => {
    const mockQuestions = Array(10).fill({
      id: 'mock',
      category: { en: 'Developer', cn: '开发' },
      difficulty: 'Mock',
      question: { en: 'Mock', cn: '开发模式' },
      options: { en: ['A', 'B', 'C', 'D'], cn: ['A', 'B', 'C', 'D'] },
      answer: 0,
      explanation: { en: 'Mock', cn: '开发模式' }
    });
    setQuestions(mockQuestions);
    setScore(mockScore);
    setCurrentMode('daily');
    setIsGameOver(true);
  };

  const value = {
    lang,
    switchLang,
    t,
    questions,
    currentMode,
    currentIndex,
    score,
    lives,
    answers,
    isGameOver,
    startDaily,
    startInfinite,
    submitAnswer,
    resetGame,
    setCurrentMode,
    devJumpToResult
  };

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
};
