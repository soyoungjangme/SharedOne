import React, { useState } from 'react';
import ReactDOM from "react-dom/client";
import './Order.css'

function Order() {



    return (
    <div>


        <h1> <i className="bi bi-search"></i> 주문 리스트 </h1>

        <div className="breadcrumb">
            <a href="#">
                <span className="home-icon"></span>
            </a>
            <span className="separator"></span>
            <a href="#">주문 정보</a>
            <span class="separator"></span>
            <a className="#">주문 정보 조회</a>
        </div>



        <div className="main-container">
            <div className="filter-container">

                <div className="filter-row">
                <label className="filter-label" for="date">등록 일자</label>
                <input className="filter-input" type="date" id="date" required />
                </div>

                <div className="filter-row">
                <label className="filter-label" for="manager">주문 번호</label>
                <input className="filter-input" type="text" id="orderNo" placeholder="담당자" required/>
                </div>

                <div className="filter-row">
                <label className="filter-label" for="warehouse">상품</label>
                <input className="filter-input" type="text" id="prod" placeholder="출하창고" required/>
                </div>

                <div className="filter-row">
                <label className="filter-label" for="transaction">담당자</label>
                <input className="filter-input" type="text" id="manager" placeholder="거래처" required/>
                </div>

                {/*<div className="filter-row">
                    <label className="filter-label" for="transactionType">거래유형</label>
                    <select className="filter-select" id="transactionType" required>
                        <option value="부가세율 적용">부가세율 적용</option>
                        <option value="부가세율 미적용">부가세율 미적용</option>
                    </select>
                </div>*/}

                <button className="filter-button">조회</button>
            </div>

            <table className="seacrh-table">
                <thead>
                    <tr>
                        <th><input type="checkbox" /></th>
                        <th>No.</th>
                        <th>주문 번호</th>
                        <th>결재 제목</th>
                        <th>주문 내역</th>
                        <th>가격(원)</th>
                        <th>담당자명</th>
                        <th>결재 상태</th>
                        <th>등록 일자</th>
                    </tr>
                </thead>

                <tbody>
                    <tr>
                        <td><input type="checkbox" /></td>
                        <td>1</td>
                        <td>0001</td>
                        <td>교보문고 주문 건</td>
                        <td>삼국지 외 20 ...</td>
                        <td>50,000,000</td>
                        <td>장소영</td>
                        <td>승인</td>
                        <td>2024-09-05</td>
                    </tr>
    <tr>
    <td><input type="checkbox" /></td>
    <td>1</td>
    <td>0001</td>
    <td>교보문고 주문 건</td>
    <td>삼국지 외 20 ...</td>
    <td>50,000,000</td>
    <td>장소영</td>
    <td>승인</td>
    <td>2024-09-05</td>
    </tr>
    <tr>
    <td><input type="checkbox" /></td>
    <td>1</td>
    <td>0001</td>
    <td>교보문고 주문 건</td>
    <td>삼국지 외 20 ...</td>
    <td>50,000,000</td>
    <td>장소영</td>
    <td>승인</td>
    <td>2024-09-05</td>
    </tr>
                </tbody>
            </table>
        </div>
    </div>


    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
<Order />
);