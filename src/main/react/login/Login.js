// src/Login.js

import React, {useState} from 'react';
import ReactDOM from "react-dom/client";
import './Login.css'

function Login() {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

//    const handleSubmit = (e) => {
//
//
//        // 간단한 폼 검증
//        if (!id || !password) {
//            setError('아이디와 비밀번호를 입력하세요.');
//            return;
//        }
//
//        // 로그인 로직 구현 부분 (예: API 요청)
//        console.log('로그인 시도:', {id, password});
//
//    };

    return (
        <div className="main">
            <div>
                <form method='POST' action='/loginForm'>
                <div className="login-box">
                    <img className="img-logo" src="./img/login.png"/>
                    <div className="inputs-box"><i className="bi bi-person-fill"></i>
                    <input type="text" className="input-box" name="employeeId" onChange={(e) => {setId(e.target.value)}}/>
                    </div>
                    <div className="inputs-box"><i className="bi bi-lock-fill"></i>
                    <input type="password" className="input-box" name="employeePw" onChange={(e) => {setPassword(e.target.value)}}/>
                    </div>
                    <button type="submit" className="login_btn"> 로그인</button>
                </div>
                </form>
            </div>
        </div>);
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Login/>
);