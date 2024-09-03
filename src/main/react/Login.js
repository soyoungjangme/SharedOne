// src/Login.js

import React, { useState } from 'react';
import ReactDOM from "react-dom/client";
import './Login.css'

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        // 간단한 폼 검증
        if (!email || !password) {
            setError('이메일과 비밀번호를 입력하세요.');
            return;
        }

        // 로그인 로직 구현 부분 (예: API 요청)
        console.log('로그인 시도:', { email, password });

        // 예시로 콘솔 출력
        // 실제 구현에서는 서버로 로그인 요청을 보낸 후 응답에 따라 로직을 작성합니다.
        setError('');
        alert('로그인 성공!'); // 예시 알림
    };

    return (
        <div className="container">
            <h2>로그인</h2>
            <form onSubmit={handleSubmit} className="form">
                <div className="inputGroup">
                    <label htmlFor="email">이메일</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input"
                        required
                    />
                </div>
                <div className="inputGroup">
                    <label htmlFor="password">비밀번호</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input"
                        required
                    />
                </div>
                {error && <div className="error">{error}</div>}
                <button type="submit" className="button">
                    로그인
                </button>
            </form>
        </div>
    );
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Login />
);