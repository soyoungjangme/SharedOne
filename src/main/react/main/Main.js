// src/components/Dashboard.js
import React, {useEffect, useState} from 'react';
import MonthlySalesChart from './MonthlySalesChart';
import EmployeeOfMonth from './EmployeeOfMonth';
import TopSalesTable from './TopSalesTable';
import './Main.css';
import ReactDOM from "react-dom/client";
import axios from "axios";

function Main() {
    const [topOfMonth, setTopOfMonth] = useState(null);
    const [salesByMonth, setSalesByMonth] = useState([]);
    const [employeeRank, setEmployeeRank] = useState([]);
    const [productRank, setProductRank] = useState([]);
    const [loading, setLoading] = useState(true); // 로딩 상태 추가

    const getStatistics = async () => {
        try {
            const {data} = await axios.get('/order/getStatistics');
            console.log(data);

            setTopOfMonth(data.topOfMonth);
            setSalesByMonth(data.salesByMonth);
            setEmployeeRank(data.employeeRank);
            setProductRank(data.productRank);
        } catch (error) {
            console.error('Error fetching statistics:', error);
        } finally {
            setLoading(false); // 데이터를 받으면 로딩 상태 해제
        }
    };

    useEffect(() => {
        getStatistics();
    }, []);

    if (loading) { // 로딩 중일 때
        return <div>Loading...</div>; // 로딩 중 표시
    }

    return (
        <div className="dashboard">
             <div className="card">
                <h3>월 별 매출액</h3>
                <div className="chart-container">
                    <MonthlySalesChart salesByMonth={salesByMonth}/>
                </div>
             </div>
            <div className="card">
                <h3>이 달의 우수사원</h3>
                <EmployeeOfMonth topOfMonth={topOfMonth}/>
            </div>
            <div className="card">
                <h3>직원 판매 순위 탑10</h3>
                <TopSalesTable data={employeeRank}/>
            </div>
             <div className="card">
                <h3>상품 판매 순위 탑10</h3>
                <TopSalesTable data={productRank}/>
             </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Main/>
);
