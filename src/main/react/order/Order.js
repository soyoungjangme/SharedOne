import React, { useState } from 'react';
import ReactDOM from "react-dom/client";
import './Order.css';

function Order() {
    // 주문 데이터를 저장하는 상태
    const [order, setOrder] = useState([
        { id: 1, orderNo: 10, title: '교보문고 주문 건', details: '이름이무지막지하게엄청나게 긴 책 외 20건', price: 50000000, manager: '장소영', status: '승인', date: '2024-09-05' },
        { id: 5, orderNo: 20, title: '알라딘 주문 건', details: '해리포터와 불의 잔 외 10건 ', price: 30000000, manager: '이준수', status: '승인', date: '2024-09-06' },
        { id: 3, orderNo: 40, title: '예스24 주문 건', details: '나미야 잡화점 외 521건 ', price: 25000000, manager: '김서영', status: '승인', date: '2024-09-07' },
        { id: 4, orderNo: 30, title: '서점 주문 건', details: '그리스로마신화 제우스의 불륜여정 외 51건', price: 33000000, manager: 'A', status: '승인', date: '2024-10-07' },
    ]);

    // 정렬 상태와 방향을 저장하는 상태
    const [sortConfig, setSortConfig] = useState({ key: 'orderNo', direction: 'ascending' });

    // 정렬 함수
    const sortData = (key) => {
        console.log('Type of data.employeeId:', typeof order.orderNo);
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        const sortOrder = [...order].sort((a, b) => { //order배열 정렬(매개변수 비교)
            if (a[key] < b[key]) { // key는 변수명임 (ex. orderNo, manage, title ...)
                return direction === 'ascending' ? -1 : 1; //
            }
            if (a[key] > b[key]) {
                return direction === 'ascending' ? 1 : -1;
            }
            return 0;
        });
        setOrder(sortOrder);
        setSortConfig({ key, direction });
    };

    const [data, setData] = useState({a:0,b:'',c:'',d:''});
    const handleChange = (e) => {

        setData({...data, [e.target.id]: e.target.value});
    }

    const handleInsert = async () => {
        try {
            console.log(data);

            let response = await fetch('/order/insert', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    orderNo: data.a,         // 데이터의 'a'를 'orderNo'으로 매핑
                    date: data.b,            // 데이터의 'b'를 'date'으로 매핑
                    delDate: data.c,         // 데이터의 'c'를 'delDate'으로 매핑
                    customerNo: data.d       // 데이터의 'd'를 'customerNo'으로 매핑
                }),
            });

            if (response.ok) {
                console.log("성공하였다.");
            } else {
                console.error("오류가 발생하였다:", response.statusText);
            }

        } catch (error) {
            console.error("에러 발생함:", error);
        }
    };




    return (
    <div>
        <h1> <i className="bi bi-search"></i> 주문 리스트 </h1>

        <div>
            <input type="number" id="a" value={data.a} onChange={handleChange}/>
            <input type="date" id="b" value={data.b}  onChange={handleChange}/>
            <input type="date" id="c" value={data.c}  onChange={handleChange}/>
            <input type="text" id="d" value={data.d}  onChange={handleChange}/>
            <button type="button" onClick={handleInsert}>입력</button>
        </div>



        <div className="breadcrumb">
            <a href="#"><span className="home-icon"></span></a>
            <span className="separator"></span>
            <a href="#">주문 정보</a>
            <span className="separator"></span>
            <a className="#">주문 정보 조회</a>
        </div>

        <div className="main-container">
            <div className="filter-container">
                <div className="filter-row">
                    <label className="filter-label" htmlFor="date">등록 일자</label>
                    <input className="filter-input" type="date" id="date" required />
                </div>

                <div className="filter-row">
                    <label className="filter-label" htmlFor="orderNo">주문 번호</label>
                    <input className="filter-input" type="text" id="orderNo" placeholder="담당자" required />
                </div>

                <div className="filter-row">
                    <label className="filter-label" htmlFor="prod">상품</label>
                    <input className="filter-input" type="text" id="prod" placeholder="출하창고" required />
                </div>

                <div className="filter-row">
                    <label className="filter-label" htmlFor="manager">담당자</label>
                    <input className="filter-input" type="text" id="manager" placeholder="거래처" required />
                </div>

                <button className="filter-button">조회</button>
            </div>
        </div>

        <table className="seacrh-table">
            <thead>
                <tr>
                    <th><input type="checkbox" /></th>
                    <th>No.</th>
                    <th>
                        주문 번호
                        <button className="sortBtn" onClick={() => sortData('orderNo')}>
                            {sortConfig.key === 'orderNo' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                        </button>
                    </th>
                    <th>
                        결재 제목
                        <button className="sortBtn" onClick={() => sortData('title')}>
                            {sortConfig.key === 'title' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                        </button>
                    </th>
                    <th>
                        주문 내역
                        <button className="sortBtn" onClick={() => sortData('details')}>
                            {sortConfig.key === 'details' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                        </button>
                    </th>
                    <th>
                        가격(원)
                        <button className="sortBtn" onClick={() => sortData('price')}>
                            {sortConfig.key === 'price' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                        </button>
                    </th>
                    <th>
                        담당자명
                        <button className="sortBtn" onClick={() => sortData('manager')}>
                            {sortConfig.key === 'manager' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                        </button>
                    </th>
                    <th>
                        결재 상태
                        <button className="sortBtn" onClick={() => sortData('status')}>
                            {sortConfig.key === 'status' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                        </button>
                    </th>
                    <th>
                        등록 일자
                        <button className="sortBtn" onClick={() => sortData('date')}>
                            {sortConfig.key === 'date' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                        </button>
                    </th>
                </tr>
            </thead>

            <tbody>
                {order.map((data) => (
                    <tr key={data.id}>
                        <td><input type="checkbox" /></td>
                        <td>{data.id}</td>
                        <td>{data.orderNo}</td>
                        <td className="ellipsis">{data.title}</td>
                        <td className="ellipsis">{data.details}</td>
                        <td>{data.price}</td>
                        <td>{data.manager}</td>
                        <td>{data.status}</td>
                        <td>{data.date}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
<Order />
);
