import axios from 'axios';
import React, {useState} from 'react';
import ReactDOM from "react-dom/client";
import './Price.css';
import useCheckboxManager from "../js/CheckboxManager";

import { Bar, Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend,
    LineElement,
    PointElement
} from 'chart.js';

ChartJS.register(
    BarElement,
    LineElement,
    PointElement,  // Register PointElement
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend
);


function Price() {
    const {
        allCheck,
        checkItem,
        showDelete,
        handleMasterCheckboxChange,
        handleCheckboxChange,
        handleDelete
    } = useCheckboxManager();
    let [price, setPrice] = useState();
    let [searchPrice, setSearchPrice] = useState({registerDate: '', productNo: '', customerNo : '', startDate : '', endDate : ''});

    let handleBtn = async () => {
        // let data = await fetch('/test/get').then(res => res.json());
        // let {data} = await axios.get('/test/get');
        // console.log(data);
        //
        // setUser({id: data.id, pw: data.pw});
    }
    // Data and options for the chart
    const data = {
        labels: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
        datasets: [
            {
                label: '매출액 (억 원)',
                data: [12, 19, 3, 5, 2, 3, 7, 8, 5, 9, 10, 14],
                backgroundColor: 'rgba(0, 123, 255, 0.8)',
                borderColor: 'rgba(0, 123, 255, 1)',
                borderWidth: 1,
                type: 'bar'
            },
            {
                label: '전년 대비 (%)',
                data: [5, 15, -3, -5, 2, 10, 7, 12, 5, -2, 0, 4],
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 2,
                fill: false,
                type: 'line'
            }
        ]
    };

    const options = {
        responsive: true,
        scales: {
            x: {
                grid: {
                    display: false
                }
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: '#e0e0e0'
                }
            }
        },
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: '#333'
                }
            }
        }
    };

    const priceData = [
        {registerDate : '2021-01-01T00:00:00.000Z', productNo : 1, customerNo : 1, customPrice : 1000, currency : '$', discount : 1, startDate : '2021-01-01', endDate : '2021-01-01'},
        {registerDate : '2021-01-02T00:00:00.000Z', productNo : 2, customerNo : 2, customPrice : 2000, currency : '￦', discount : 2, startDate : '2021-01-02', endDate : '2021-01-02'},
        {registerDate : '2021-01-03T00:00:00.000Z', productNo : 3, customerNo : 3, customPrice : 3000, currency : '$', discount : 3, startDate : '2021-01-03', endDate : '2021-01-03'},
        {registerDate : '2021-01-04T00:00:00.000Z', productNo : 4, customerNo : 4, customPrice : 4000, currency : '￦', discount : 4, startDate : '2021-01-04', endDate : '2021-01-04'},
        {registerDate : '2021-01-05T00:00:00.000Z', productNo : 5, customerNo : 5, customPrice : 5000, currency : '$', discount : 5, startDate : '2021-01-05', endDate : '2021-01-05'}
    ];

    let priceDataSortedByProductNo = priceData.toSorted((a,b) => b.productNo - a.productNo);
    // console.log(priceDataSortedByProductNo);

    let priceDataSortedByCurrency = priceData.toSorted((a,b) => {
        if (a.currency > b.currency) return 1;
        else return -1;
    });
    // console.log(priceDataSortedByCurrency);

    let priceDataSortedByInt = priceData.toSorted((a,b) => {
        if (a.customerNo < b.customerNo) return 1;
        else return -1;
    });
    // console.log(priceDataSortedByInt);

    let newList = priceData.map((item, index) => {
        return <tr key={index} className={checkItem[index] ? 'selected-row' : ''}>
            <td><input type="checkbox" checked={checkItem[index+1] || false}
                       onChange={handleCheckboxChange}/></td>
            <td>{index + 1}</td>
            <td>{item.registerDate}</td>
            <td>{item.productNo}</td>
            <td>{item.customerNo}</td>
            <td>{item.customPrice}</td>
            <td>{item.currency}</td>
            <td>{item.discount}</td>
            <td>{item.startDate}</td>
            <td>{item.endDate}</td>
        </tr>
    });

    const handleSearchBtn = async () => {
        let {data} = await axios.post('/price/search',JSON.stringify({customerNo: "11", registerDate: new Date(),
            startDate: "2024-09-09", endDate: "2024-11-11"
        }), {
            headers: {
                'content-type': 'application/json',
                'Accept': 'application/json'
            }
        }).then((res) => {
            console.log(res)})
            .catch((e) => {
                console.log(e)});
    }

    return (

        <div >
            {/*<div>*/}
            {/*    <button type="button" onClick={handleBtn}>test</button>*/}
            {/*    <h1>{user.id} - {user.pw}</h1>*/}
            {/*</div>*/}

            <h1><i className="bi bi-search"></i> 판매가 리스트 </h1>


            <div className="main-container">
                <div className="filter-container">

                    <div className="filter-row">
                        <label className="filter-label" htmlFor="date">등록일자</label>
                        <input className="filter-input" type="date" id="date" value={searchPrice.registerDate} onClick={(e) => {}} required/>
                    </div>

                    <div className="filter-row">
                        <label className="filter-label" htmlFor="product">상품</label>
                        <input className="filter-input" type="text" id="product" value={searchPrice.productNo} placeholder="상품" required/>
                    </div>

                    <div className="filter-row">
                        <label className="filter-label" htmlFor="customer">고객</label>
                        <input className="filter-input" type="text" id="customer" value={searchPrice.customerNo} placeholder="고객" required/>
                    </div>

                    <div className="filter-row">
                        <label className="filter-label" htmlFor="startDate">시작일자</label>
                        <input className="filter-input" type="date" id="startDate" value={searchPrice.startDate} required/>
                    </div>

                    <div className="filter-row">
                        <label className="filter-label" htmlFor="endDate">종료일자</label>
                        <input className="filter-input" type="date" id="endDate" value={searchPrice.endDate} required/>
                    </div>

                    <button className="filter-button" onClick={handleSearchBtn}>조회</button>
                </div>

                <div style={{width: "100%", alignItems: "center", backgroundColor: "#fcfcfc", marginBottom: "50px"}}>
                    <div className="chart-container">
                        <div className="chart-header">
                            <h3>분기별 매출 예측</h3>
                            <button>데이터 업데이트</button>
                        </div>
                        {/*<div className="canvas"><Bar data={data} options={options} /></div>*/}
                        <Bar data={data} options={options}  className="canvas"/>
                    </div>
                </div>

                <table className="seacrh-table" style={{marginTop:"50px"}}>
                    {showDelete && <button className='delete-btn' onClick={handleDelete}>삭제</button>}
                    <thead>
                    <tr>
                        <th><input type="checkbox" checked={allCheck} onChange={handleMasterCheckboxChange}/></th>
                        <th> No.</th>
                        <th> 등록일</th>
                        <th> 상품명</th>
                        <th> 업체명</th>
                        <th> 가격</th>
                        <th> 통화</th>
                        <th> 할인율(%)</th>
                        <th> 시작일</th>
                        <th> 종료일</th>
                    </tr>
                    </thead>
                    <tbody>
                    {newList}
                    </tbody>
                </table>
            </div>


        </div>

    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Price/>
);