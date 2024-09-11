import React, { useEffect, useState, useCallback } from 'react';
import ReactDOM from 'react-dom/client';
import './Confirm.css';
import './modal_confirm1.css';
import ConfirmModal from './ConfirmModal';

function Confirm() {

    const [confirm, setConfirm] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: '', direction: 'ascending' });
    const [openModal, setOpenModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [searchParams, setSearchParams] = useState({
        customerName: '',
        employeeName: '',
        confirmRegDate: '',
        confirmDate: '',
        confirmStatus: ''
    });

// 정렬 이벤트
    const [order, setOrder] = useState([
        {
            orderNo: '',
            productType: '',
            productName: '',
            productQty: '',
            customPrice: '',
            confirmStatus: '',
            confirmConfirmDate: '',
            totalAmount: ''
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

    const fetchData = async (params = {}) => {
        try {
            const queryString = new URLSearchParams(params).toString();
            const response = await fetch(`http://localhost:8383/confirm?${queryString}`);
            const data = await response.json();
            setConfirm(data);
        } catch (error) {
            console.error('데이터를 불러오는 중 오류가 발생했습니다:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);


// 모달창
    {/*    const handleOpenClick = () => {
        const item = confirm.find((item, index) => checkItem[index]);
        setSelectedItem(item || null);
        setOpenModal(true);
    }*/}
    const handleRowClick = async (confirmNo) => {
        try {
            const response = await fetch(`http://localhost:8383/confirm/${confirmNo}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setSelectedItem(data);
            setOpenModal(true);
        } catch (error) {
            console.error('Error fetching confirm details:', error);
            alert('상세 정보를 가져오는 데 실패했습니다.');
        }
    };

    const handleCloseClick = () => {
        setOpenModal(false);
        setSelectedItem(null);
    }

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setSearchParams(prev => ({...prev, [name]: value}));
    }

    {/*    // const handleUpdateItem = useCallback((updatedItem) => {
    //     setConfirm(prevConfirm =>
    //         prevConfirm.map(confirm =>
    //             confirm.confirmNo === updatedItem.confirmNo ? updatedItem : confirm
    //         )
    //     );
    //     setOpenModal(false);
    // }, []);*/}
    const handleUpdateItem = useCallback((updatedItem) => {
        setConfirm(prevConfirm =>
            prevConfirm.map(item =>
                item.confirmNo === updatedItem.confirmNo ? updatedItem : item
            )
        );
        setOpenModal(false);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchData(searchParams);
    }

    return (
        <div>
            <div className="pageHeader"><h1><i className="bi bi-search"></i>결재 리스트</h1></div>

            <div className="main-container">
                <div className="filter-container">
                    <div className="filter-row">
                        <label className="filter-label" htmlFor="customerName">고객명</label>
                        <input className="filter-input" type="text" id="customerName" name="customerName"
                               value={searchParams.customerName} onChange={handleInputChange} placeholder="고객명" required />
                    </div>
                    <div className="filter-row">
                        <label className="filter-label" htmlFor="employeeName">담당자</label>
                        <input className="filter-input" type="text" id="employeeName" name="employeeName"
                               value={searchParams.employeeName} onChange={handleInputChange} placeholder="담당자" required />
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
                        <select className="filter-select" id="confirmStatus" name="confirmStatus"
                                value={searchParams.confirmStatus} onChange={handleInputChange} required>
                            <option value="승인">승인</option>
                            <option value="대기">대기</option>
                            <option value="반려">반려</option>
                        </select>
                    </div>
                    <button type="submit" className="filter-button" onClick={handleSearch}>조회</button>
                </div>

                {/*<button type="button" className="confirm-selected" onClick={handleOpenClick}>수정</button>*/}

                <table className="seacrh-table">
                    <thead>
                    <tr>
                        <th>No.
                            <button className="sortBtn" onClick={() => sortData('confirmNo')}>
                                {sortConfig.key === 'confirmNo' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                            </button>
                        </th>
                        <th>주문 번호
                            <button className="sortBtn" onClick={() => sortData('orderNo')}>
                                {sortConfig.key === 'orderNo' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                            </button>
                        </th>
                        <th>결재 제목</th>
                        <th>총 금액
                            <button className="sortBtn" onClick={() => sortData('totalAmount')}>
                            {sortConfig.key === 'totalAmount' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                            </button>
                        </th>
                        <th>담당자</th>
                        <th>결재 여부
                            <button className="sortBtn" onClick={() => sortData('confirmStatus')}>
                                {sortConfig.key === 'confirmStatus' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                            </button>
                        </th>
                        <th>등록 일자
                            <button className="sortBtn" onClick={() => sortData('confirmRegDate')}>
                                {sortConfig.key === 'confirmRegDate' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                            </button>
                        </th>
                        <th>승인 일자
                            <button className="sortBtn" onClick={() => sortData('confirmConfirmDate')}>
                                {sortConfig.key === 'confirmConfirmDate' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                            </button>
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {confirm.length > 0 ? (
                        confirm.map((item) => (
                            <tr key={item.confirmNo} onDoubleClick={() => {handleRowClick(item.confirmNo)}}>
                                <td>{item.confirmNo}</td>
                                <td>{item.orderNo}</td>
                                <td>{item.confirmTitle}</td>
                                <td>{item.totalAmount}</td>
                                <td>{item.employeeName}</td>
                                <td>{item.confirmStatus}</td>
                                <td>{item.confirmRegDate}</td>
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
                onUpdateItem={handleUpdateItem}
            />

        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Confirm/>
);