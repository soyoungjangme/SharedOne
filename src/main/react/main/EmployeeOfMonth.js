// src/components/EmployeeOfMonth.js
import React from 'react';

const EmployeeOfMonth = ({topOfMonth}) => {

     const formatSales = (sales) => {
        return sales ? Number(sales).toLocaleString() : '';
    };


    return (
        <div className="Employee-ranker">
                <img src="/img/1340658823.jpg" alt="Employee of the Month" style={{  height: '195px' }}/>
            <div id="Employee-of-month" style={{ textAlign: 'center', marginTop: '30px', fontWeight: 'bold', fontSize: '15px'}}>
                {topOfMonth.employeeName} (매출액: {formatSales(topOfMonth.monthlySales)} 원)
            </div>
        </div>
    );
};

export default EmployeeOfMonth;
