import React from 'react';
import { useQuiz } from '../QuizContext';

const LanguageSwitcher = () => {
    const { lang, switchLang } = useQuiz();

    return (
        <div className="language-switcher">
            <button
                className={`lang-btn ${lang === 'en' ? 'active' : ''}`}
                onClick={() => switchLang('en')}
            >
                EN
            </button>
            <button
                className={`lang-btn ${lang === 'cn' ? 'active' : ''}`}
                onClick={() => switchLang('cn')}
            >
                中文
            </button>
        </div>
    );
};

export default LanguageSwitcher;
