// src/components/EmployeeOfMonth.js
import React from 'react';

const EmployeeOfMonth = ({topOfMonth}) => {
    return (
        <div className="Employee-ranker">
            <div id="Employee-of-month" style={{ textAlign: 'center', marginTop: '30px' }}>
                {topOfMonth.employeeName} (매출액: {topOfMonth.monthlySales})
            </div>
        </div>
    );
};

export default EmployeeOfMonth;
