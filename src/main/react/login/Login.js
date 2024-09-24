// src/Login.js

import React, { useRef, useEffect } from 'react'; // useRef와 useEffect 가져오기
import ReactDOM from "react-dom/client";
import './Login.css';

function Login() {
    const employeeIdRef = useRef(null);

    useEffect(() => {
        // URL 쿼리 파라미터에서 오류 메시지를 읽어오는 예제
        const params = new URLSearchParams(window.location.search);
        const error = params.get('err');

        if (error === 'true') {
            alert("아이디, 비밀번호를 확인해주세요.");
            localStorage.setItem('focusInput', 'employeeId'); // 포커스할 요소 저장
            location.href = "/login.user"; // 페이지 이동
        }

        // 페이지 로드 시 localStorage에서 포커스할 요소를 읽고 포커스 맞추기
        const focusInput = localStorage.getItem('focusInput');
        if (focusInput === 'employeeId') {
            employeeIdRef.current.focus(); // 사용자 ID 입력 필드에 포커스
        }
    }, []);

    return (
        <div className="main">
            <div>
                <form method='POST' action='/loginForm'>
                    <div className="login-box">
                        <img className="img-logo" src="./img/login.png" alt="Logo" />
                        <div className="inputs-box">
                            <i className="bi bi-person-fill"></i>
                            <input
                                type="text"
                                className="input-box"
                                name="employeeId"
                                ref={employeeIdRef}
                            />
                        </div>
                        <div className="inputs-box">
                            <i className="bi bi-lock-fill"></i>
                            <input
                                type="password"
                                className="input-box"
                                name="employeePw"
                            />
                        </div>
                        <button type="submit" className="login_btn"> 로그인</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('idRoot'));
root.render(
    <Login />
);
