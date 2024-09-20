// src/components/Dashboard.js
import React, {useEffect, useState} from 'react';
import MonthlySalesChart from './MonthlySalesChart';
import EmployeeOfMonth from './EmployeeOfMonth';
import TopSalesTable from './TopSalesTable';
import './Main.css';
import ReactDOM from "react-dom/client";
import axios from "axios";

function Main() {
    const [topOfMonth, setTopOfMonth] = useState({});
    const [salesByMonth, setSalesByMonth] = useState([]);
    const [employeeRank, setEmployeeRank] = useState([]);
    const [productRank, setProductRank] = useState([]);

    const getStatistics = async () => {
        let {data} = await axios.get('/order/getStatistics');

        setTopOfMonth(data.topOfMonth);
        setSalesByMonth(data.salesByMonth);
        setEmployeeRank(data.employeeRank);
        setProductRank(data.productRank);
    }

    useEffect(() => {
        getStatistics();
    }, []);

    return (
        <div className="dashboard">
            <div className="card">
                <h3>월 별 매출액</h3>
                <div className="chart-container">
                    <MonthlySalesChart/>
                </div>
            </div>
            <div className="card">
                <h3>이 달의 우수사원</h3>
                <EmployeeOfMonth/>
            </div>
            <div className="card">
                <h3>직원 판매 순위 탑10 (가격 기준)</h3>
                <TopSalesTable/>
            </div>
            <div className="card">
                <h3>상품 판매 순위 탑10 (가격 기준)</h3>
                <TopSalesTable/>
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Main/>
);