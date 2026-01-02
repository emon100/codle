import React, { useRef } from 'react';
import { useQuiz } from '../QuizContext';

const ShareCard = ({ score, total, rank, date }) => {
    const { lang, t } = useQuiz();
    const svgRef = useRef();

    const handleDownload = () => {
        const svgElement = svgRef.current;
        const svgData = new XMLSerializer().serializeToString(svgElement);
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);

        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const scale = 2; // High resolution
            canvas.width = 600 * scale;
            canvas.height = 450 * scale;
            const ctx = canvas.getContext('2d');
            ctx.scale(scale, scale);
            ctx.drawImage(img, 0, 0);

            const pngUrl = canvas.toDataURL('image/png');
            const downloadLink = document.createElement('a');
            downloadLink.href = pngUrl;
            downloadLink.download = `Codle-${date}.png`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            URL.revokeObjectURL(url);
        };
        img.src = url;
    };

    return (
        <div className="share-card-container">
            <svg
                ref={svgRef}
                width="600"
                height="450"
                viewBox="0 0 600 450"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="share-svg"
            >
                <rect width="600" height="450" rx="24" fill="#0D1117" />
                <rect x="2" y="2" width="596" height="446" rx="22" stroke="url(#paint0_linear)" strokeWidth="4" />

                {/* Background Gradients */}
                <circle cx="500" cy="100" r="150" fill="url(#paint1_radial)" fillOpacity="0.2" />
                <circle cx="100" cy="350" r="150" fill="url(#paint2_radial)" fillOpacity="0.2" />

                {/* Content */}
                <text x="50" y="70" fill="url(#paint0_linear)" fontSize="32" fontWeight="800" fontFamily="Inter, sans-serif">Codle</text>
                <text x="50" y="105" fill="#94A3B8" fontSize="16" fontFamily="Inter, sans-serif">{date}</text>

                <text x="300" y="165" textAnchor="middle" fill="#F0F4F8" fontSize="22" fontWeight="600" fontFamily="Inter, sans-serif">
                    {lang === 'cn' ? '今日挑战结果' : 'Daily Challenge Result'}
                </text>

                <g transform="translate(300, 260) rotate(-90)">
                    <circle r="70" stroke="#1E2533" strokeWidth="10" fill="none" />
                    <circle
                        r="70"
                        stroke="url(#paint0_linear)"
                        strokeWidth="10"
                        fill="none"
                        strokeDasharray={2 * Math.PI * 70}
                        strokeDashoffset={2 * Math.PI * 70 * (1 - score / total)}
                        strokeLinecap="round"
                    />
                </g>
                <g transform="translate(300, 260)">
                    <text textAnchor="middle" dy="0.3em" fill="#F0F4F8" fontSize="56" fontWeight="800" fontFamily="Inter, sans-serif">{score}</text>
                    <text textAnchor="middle" dy="2.4em" fill="#94A3B8" fontSize="18" fontFamily="Inter, sans-serif">/{total}</text>
                </g>

                <rect x="150" y="375" width="300" height="45" rx="22.5" fill="#3B82F6" />
                <text x="300" y="405" textAnchor="middle" fill="white" fontSize="20" fontWeight="700" fontFamily="Inter, sans-serif">{rank}</text>

                {/* Definitions */}
                <defs>
                    <linearGradient id="paint0_linear" x1="0" y1="0" x2="600" y2="450" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#3B82F6" />
                        <stop offset="1" stopColor="#8B5CF6" />
                    </linearGradient>
                    <radialGradient id="paint1_radial" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(500 100) rotate(90) scale(150)">
                        <stop stopColor="#3B82F6" />
                        <stop offset="1" stopColor="#3B82F6" stopOpacity="0" />
                    </radialGradient>
                    <radialGradient id="paint2_radial" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(100 350) rotate(90) scale(150)">
                        <stop stopColor="#8B5CF6" />
                        <stop offset="1" stopColor="#8B5CF6" stopOpacity="0" />
                    </radialGradient>
                </defs>
            </svg>

            <button className="btn-primary download-btn" onClick={handleDownload} style={{ marginTop: '1rem', width: '100%' }}>
                {lang === 'cn' ? '下载成绩分享卡' : 'Download Share Card'}
            </button>
        </div>
    );
};

export default ShareCard;
