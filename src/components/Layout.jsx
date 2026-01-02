import { useQuiz } from '../QuizContext';
import LanguageSwitcher from './LanguageSwitcher';
import '../App.css';

const Header = () => {
    const { setCurrentMode, resetGame } = useQuiz();
    return (
        <header className="main-header">
            <div
                className="logo gradient-text"
                onClick={() => { setCurrentMode(null); resetGame(); }}
                style={{ cursor: 'pointer' }}
            >
                Codle
            </div>
            <LanguageSwitcher />
        </header>
    );
};

const Footer = () => {
    const { t } = useQuiz();
    return (
        <footer className="main-footer">
            <p>{t('footer')}</p>
        </footer>
    );
};

const Layout = ({ children }) => {
    return (
        <div className="app-container">
            <Header />
            <main className="content">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
