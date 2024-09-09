import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './Confirm.css';
import './modal_confirm1.css';
import useCheckboxManager from '../js/CheckboxManager';
import ConfirmModal from './ConfirmModal';

function Confirm() {

    const [confirm, setConfirm] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: '', direction: 'ascending' });
    const [openModal, setOpenModal] = useState(false);
    const [isVisibleCSV, setIsVisibleCSV] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

// 정렬 이벤트
    const [order, setOrder] = useState([
        {
            productType: '',
            productName: '',
            productQty: '',
            customPrice: '',
            confirmStatus: '',
            confirmConfirmDate: ''
        }
    ]); // 리스트 데이터를 저장할 state

    const sortData = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        const sortOrder = [...confirm].sort((a, b) => {
            if (a[key] < b[key]) {
                return direction === 'ascending' ? -1 : 1;
            }
            if (a[key] > b[key]) {
                return direction === 'ascending' ? 1 : -1;
            }
            return 0;
        });
        setConfirm(sortOrder);
        setSortConfig({ key, direction });
    };

    const handleOpenClick = () => {
        const item = confirm.find((item, index) => checkItem[index]);
        setSelectedItem(item || {});
        setOpenModal(true);
    }
    const handleCloseClick = () => setOpenModal(false);

    const handleAddClickCSV = () => setIsVisibleCSV(prevState => !prevState);

    return (
        <div>
            <div className="pageHeader"><h1><i className="bi bi-search"></i>결재 리스트</h1></div>

            <div className="main-container">
                <div className="filter-container">
                    <div className="filter-row">
                        <label className="filter-label" htmlFor="customerName">고객명</label>
                        <input className="filter-input" type="text" id="customerName" placeholder="고객명" required />
                    </div>
                    <div className="filter-row">
                        <label className="filter-label" htmlFor="employeeName">담당자</label>
                        <input className="filter-input" type="text" id="employeeName" placeholder="담당자" required />
                    </div>
                    <div className="filter-row">
                        <label className="filter-label" htmlFor="confirmRegDate">시작 일자</label>
                        <span className="info-icon">
                            <i className="bi bi-info-circle"></i>
                            <span className="tooltip">결재 요청일 기준</span>
                        </span>
                        <input className="filter-input" type="date" id="confirmRegDate" required />
                    </div>
                    <div className="filter-row">
                        <label className="filter-label" htmlFor="confirmConfirmDate">종료 일자</label>
                        <span className="info-icon">
                            <i className="bi bi-info-circle"></i>
                            <span className="tooltip">결재 요청일 기준</span>
                        </span>
                        <input className="filter-input" type="date" id="confirmConfirmDate" required />
                    </div>
                    <div className="filter-row">
                        <label className="filter-label" htmlFor="confirmStatus">결재 여부</label>
                        <select className="filter-select" id="confirmStatus" required>
                            <option value="승인">승인</option>
                            <option value="진행 중">대기</option>
                            <option value="반려">반려</option>
                        </select>
                    </div>
                    <button className="filter-button">조회</button>
                </div>

                <button type="button" className="confirm-selected" onClick={handleOpenClick}>수정</button>

                <table className="seacrh-table">
                    <thead>
                    <tr>
                        <th>No.</th>
                        <th>고객명</th>
                        <th>상품 종류
                            <button className="sortBtn" onClick={() => sortData('productType')}>
                                {sortConfig.key === 'productType' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                            </button>
                        </th>
                        <th>상품명
                            <button className="sortBtn" onClick={() => sortData('productName')}>
                                {sortConfig.key === 'productName' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                            </button>
                        </th>
                        <th>상품 수량
                            <button className="sortBtn" onClick={() => sortData('productQty')}>
                                {sortConfig.key === 'productQty' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                            </button>
                        </th>
                        <th>판매가(원)
                            <button className="sortBtn" onClick={() => sortData('customPrice')}>
                                {sortConfig.key === 'productQty' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                            </button>
                        </th>
                        <th>총 금액(원)</th>
                        <th>담당자</th>
                        <th>결재자</th>
                        <th>결재 여부</th>
                        <th>비고</th>
                        <th>결재 승인일</th>
                    </tr>
                    </thead>
                    <tbody>
                    {confirm.length > 0 ? (
                        confirm.map((item, index) => (
                            <tr key={index} className={checkItem[index] ? 'selected-row' : ''}>
                                <td>{index + 1}</td>
                                <td>{item.custName}</td>
                                <td>{item.productType}</td>
                                <td>{item.productName}</td>
                                <td>{item.productQty}</td>
                                <td>{item.productPrice}</td>
                                <td>{item.customPrice}</td>
                                <td>{item.employeeName}</td>
                                <td>{item.custName}</td>
                                <td>{item.confirmStatus}</td>
                                <td>{item.delDate}</td>
                                <td>{item.confirmConfirmDate}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="12">등록된 상품이 없습니다😭</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            <ConfirmModal
                openModal={openModal}
                handleCloseClick={handleCloseClick}
                selectedItem={selectedItem}
            />

        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Confirm/>
);