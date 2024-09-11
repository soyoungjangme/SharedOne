// src/components/EmployeeOfMonth.js
import React from 'react';

const EmployeeOfMonth = () => {
    return (
        <div className="Customer-ranker">
            <img
                src="https://file2.nocutnews.co.kr/newsroom/image/2023/06/06/202306060141536125_0.jpg"
                alt="Customer of the Month"
                className="Customer-photo"
            />
            <div id="Customer-of-month" style={{ textAlign: 'center', marginTop: '30px' }}>
                Thomas Mueller (매출액: 1,500만원)
            </div>
        </div>
    );
};

export default EmployeeOfMonth;
