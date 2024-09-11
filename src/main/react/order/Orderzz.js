import React, { useState, useEffect } from 'react';
import ReactDOM from "react-dom/client";
import './Orderzz.css'

function Order() {
    // 주문 데이터를 저장하는 상태
    const [order, setOrder] = useState([
        {
            orderNo: 0,
            title: '',
            details: '',
           /* price: 0,*/
            manager: '',
            status: '',
            date: ''
        }
    ]);

    // 정렬 상태와 방향을 저장하는 상태
    const [sortConfig, setSortConfig] = useState({ key: 'orderNo', direction: 'ascending' });

    // 정렬 함수
    const sortData = (key) => {
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

    //주문목록 불러오기
    useEffect( () => {

        let effectOrder = async () => {
            try{
                let data = await fetch('/order/orderList').then(res => res.json());

                const transformData = data.map(item => ({
                    orderNo: item.orderNo,
                    title: item.confirmTitle,
                    details: item.confirmContent,
                    manager: item.Customer.employeeName,
                    status: item.confirmStatus,
                    date: item.confirmConfirmDate
                }))

                setOrder(transformData);
                console.log(transformData);
            } catch (error){
                console.error('error발생함 : ', error);
            }
        }

        effectOrder();
    }, []);



    return (
    <div>
        <h1> <i className="bi bi-search"></i> 주문 리스트 </h1>
        {/*<div className="breadcrumb">
            <a href="#"><span className="home-icon"></span></a>
            <span className="separator"></span>
            <a href="#">주문 정보</a>
            <span className="separator"></span>
            <a className="#">주문 정보 조회</a>
        </div>*/}

        <div className="main-container">
            <div className="filter-container">

                <div className="filter-row">
                <label className="filter-label" htmlFor="date">등록 일자</label>
                <input className="filter-input" type="date" id="date" required />
                </div>

                <div className="filter-row">
                <label className="filter-label" htmlFor="orderNo">주문 번호</label>
                <input className="filter-input" type="text" id="orderNo" placeholder="담당자" required/>
                </div>

                <div className="filter-row">
                <label className="filter-label" htmlFor="prod">상품</label>
                <input className="filter-input" type="text" id="prod" placeholder="출하창고" required/>
                </div>

                <div className="filter-row">
                <label className="filter-label" htmlFor="transaction">담당자</label>
                <input className="filter-input" type="text" id="manager" placeholder="거래처" required/>
                </div>

                <button className="filter-button">조회</button>
            </div>

            <table className="seacrh-table">
                <thead>
                    <tr>
                        <th><input type="checkbox" /></th>
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
                        {/*<th>
                                            가격(원)
                                            <button className="sortBtn" onClick={() => sortData('price')}>
                                                {sortConfig.key === 'price' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                                            </button>
                                        </th>*/}
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
                    {order.map((order) => (
                        <tr key={order.orderNo}>
                        <td><input type="checkbox" /></td>
                        <td>{order.orderNo}</td>
                        <td className="ellipsis">{order.title}</td>
                        <td className="ellipsis">{order.details}</td>
                        {/*<td>{order.price}</td>*/}
                        <td>{order.manager}</td>
                        <td>{order.status}</td>
                        <td>{order.date}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>


    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
<Orderzz />
);
