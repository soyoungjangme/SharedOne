import React, { useState } from 'react';
import ReactDOM from "react-dom/client";
import './Confirm.css'

function Confirm() {

    /*li 태그로 불러오기 연습*/
    let [confirmList, setConfirmList] = useState([]);
    const handleClick = async () => {
        let response = await fetch ('/confirm/get?allId=1,2,3');
        let data = await response.json();

        if (Array.isArray(data)) {
            setConfirmList(data);
        }
    }

    return (
        <div>
            <div>
                {confirmList.map(item => (
                    <li key={item.confirmNo}>결재 번호: {item.confirmNo} | 결재 여부: {item.confirmStatus} | 결재 제목: {item.confirmTitle} | 결재 내용 : {item.confirmContent} | 결재 요청일 : {item.confirmRegDate}</li>
                ))}
            </div>

            <h1> 결재 리스트 </h1>

         <div className="main-container">
                <div className="filter-container">
    <div className="main-container">
        <div className="filter-container">

                    <div className="filter-row">
                        <label className="filter-label" htmlFor="customerName">고객명</label>
                        <input className="filter-input" type="text" id="customerName" placeholder="고객명" required/>
                    </div>

                    <div className="filter-row">
                        <label className="filter-label" htmlFor="employeeName">담당자</label>
                        <input className="filter-input" type="text" id="employeeName" placeholder="담당자" required/>
                    </div>

                    <div className="filter-row">
                        <label className="filter-label" htmlFor="confirmStatus">결재 여부</label>
                        <select className="filter-select" id="confirmStatus" required>
                            <option value="승인">승인</option>
                            <option value="진행 중">대기</option>
                            <option value="반려">반려</option>
                        </select>
                    </div>

                    <div className="filter-row">
                        <label className="filter-label" htmlFor="confirmRegDate">등록 일자</label>
                        <input className="filter-input" type="date" id="confirmRegDate" required/>
                    </div>

                    <div className="filter-row">
                        <label className="filter-label" htmlFor="confirmConfirmDate">승인 일자</label>
                        <input className="filter-input" type="date" id="confirmConfirmDate" required/>
                    </div>

                    <button className="filter-button" onClick={handleClick}>조회</button>
                </div>

                <table className="seacrh-table">
                    <thead>
                    <tr>
                        <th>No.</th>
                        <th>고객명</th>
                        <th>상품 종류</th>
                        <th>상품명</th>
                        <th>상품 수량</th>
                        <th>판매가(원)</th>
                        <th>총 금액(원)</th>
                        <th>담당자</th>
                        <th>담당자 연락처</th>
                        <th>결재자</th>
                        <th>결재 여부</th>
                        <th>비고</th>
                        <th>결재 승인일</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>1</td>
                        <td>교보문고 강남점</td>
                        <td>도서</td>
                        <td>삼국지 -상-</td>
                        <td>1500</td>
                        <td>1000</td>
                        <td>1,500,000</td>
                        <td>유선화</td>
                        <td>010-1234-5678</td>
                        <td>이기성</td>
                        <td>승인</td>
                        <td></td>
                        <td>2024-09-06</td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>알라딘 선릉점</td>
                        <td>도서</td>
                        <td>인간실격</td>
                        <td>11000</td>
                        <td>100</td>
                        <td>1,100,000</td>
                        <td>홍길동</td>
                        <td>010-1111-5578</td>
                        <td>이기성</td>
                        <td>승인</td>
                        <td></td>
                        <td>2024-09-06</td>
                    </tr>
                    <tr>
                        <td>3</td>
                        <td>교보문고 이대점</td>
                        <td>도서</td>
                        <td>무인도에서 살아남기1</td>
                        <td>10000</td>
                        <td>1000</td>
                        <td>10,000,000</td>
                        <td>이순신</td>
                        <td>010-5464-5545</td>
                        <td>이기성</td>
                        <td>대기</td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>4</td>
                        <td>YES24 신림점</td>
                        <td>도서</td>
                        <td>나는 누구인가</td>
                        <td>8000</td>
                        <td>100</td>
                        <td>800,000</td>
                        <td>아무개</td>
                        <td>010-2134-5655</td>
                        <td>이기성</td>
                        <td>반려</td>
                        <td>재고 부족</td>
                        <td></td>
                    </tr>
                    </tbody>
                </table>
            </div>

        </div>

    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Confirm/>
);