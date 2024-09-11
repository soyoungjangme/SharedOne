import React, { useEffect, useState, useCallback } from 'react';
import ReactDOM from 'react-dom/client';
import './Confirm.css';
import './modal_confirm1.css';
import ConfirmModal from './ConfirmModal';

function Confirm() {

    const [formList, setFormList] = useState([]); // 상태 및 업데이트 함수 정의
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
            orderQty: '',
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

        const sortOrder = [...formList].sort((a, b) => {
            if (a[key] < b[key]) {
                return direction === 'ascending' ? -1 : 1;
            }
            if (a[key] > b[key]) {
                return direction === 'ascending' ? 1 : -1;
            }
            return 0;
        });

        setFormList(sortOrder);
        setSortConfig({ key, direction });
    };

    const fetchData = async (params = {}) => {
<<<<<<< HEAD
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

=======
        console.log('Fetching data with params:', params);
        try {
            const queryString = new URLSearchParams(params).toString();
            console.log('Query String:', queryString);
            const response = await fetch('http://localhost:8383/confirm?${queryString}');
            const data = await response.json();
            console.log('Fetched data:', data);
            setConfirm(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:8383/confirm');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                console.log('Fetched data:', data);
                setFormList(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

// 모달창
    const handleOpenClick = () => {
        const item = formList[formList.length - 1];
        setOpenModal(true);
    }
    const handleCloseClick = () => {
        setOpenModal(false);
        setSelectedItem(null);
    }

>>>>>>> main
    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setSearchParams(prev => ({...prev, [name]: value}));
    }

<<<<<<< HEAD
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
=======
    const handleUpdateItem = useCallback((updatedItem) => {
        setFormList(prevConfirm =>
            prevConfirm.map(confirm =>
                confirm.confirmNo === updatedItem.confirmNo ? updatedItem : confirm
>>>>>>> main
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
<<<<<<< HEAD
                               value={searchParams.customerName} onChange={handleInputChange} placeholder="고객명" required />
=======
                               value={searchParams.employeeName} onChange={handleInputChange} placeholder="고객명"
                               required/>
>>>>>>> main
                    </div>
                    <div className="filter-row">
                        <label className="filter-label" htmlFor="employeeName">담당자</label>
                        <input className="filter-input" type="text" id="employeeName" name="employeeName"
<<<<<<< HEAD
                               value={searchParams.employeeName} onChange={handleInputChange} placeholder="담당자" required />
=======
                               value={searchParams.customerName} onChange={handleInputChange} placeholder="담당자"
                               required/>
>>>>>>> main
                    </div>
                    <div className="filter-row">
                        <label className="filter-label" htmlFor="confirmRegDate">시작 일자</label>
                        <span className="info-icon">
                            <i className="bi bi-info-circle"></i>
                            <span className="tooltip">결재 요청일 기준</span>
                        </span>
                        <input className="filter-input" type="date" id="confirmRegDate" required/>
                    </div>
                    <div className="filter-row">
                        <label className="filter-label" htmlFor="confirmConfirmDate">종료 일자</label>
                        <span className="info-icon">
                            <i className="bi bi-info-circle"></i>
                            <span className="tooltip">결재 요청일 기준</span>
                        </span>
                        <input className="filter-input" type="date" id="confirmConfirmDate" required/>
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
<<<<<<< HEAD
                    <button type="submit" className="filter-button" onClick={handleSearch}>조회</button>
=======
                    <button type="submit" className="filter-button">조회</button>
>>>>>>> main
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
<<<<<<< HEAD
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
=======
                        <th>상품 수량
                            <button className="sortBtn" onClick={() => sortData('orderQty')}>
                                {sortConfig.key === 'orderQty' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                            </button>
                        </th>
                        <th>판매가(원)
                            <button className="sortBtn" onClick={() => sortData('customPrice')}>
                                {sortConfig.key === 'customPrice' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                            </button>
                        </th>
                        <th>총 금액(원)
                            <button className="sortBtn" onClick={() => sortData('totalAmount')}>
                                {sortConfig.key === 'totalAmount' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                            </button>
                        </th>
                        <th>납품 요청일
                            <button className="sortBtn" onClick={() => sortData('delDate')}>
                                {sortConfig.key === 'delDate' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                            </button>
                        </th>
                        <th>담당자</th>
                        <th>결재자</th>
                        <th>결재 여부</th>
                    </tr>
                    </thead>
                    <tbody>
                    {formList.length > 0 ? (
                        formList.map((item, index) => (
                            <tr key={item.No || index}>
                                <td>{item.No}</td>
                                <td>{item.customerName}</td>
                                <td>{item.productType}</td>
                                <td>{item.productName}</td>
                                <td>{item.orderQty}</td>
                                <td>{item.customPrice}</td>
                                <td>{item.totalAmount}</td>
                                <td>{item.delDate}</td>
                                <td>{item.employeeName}</td>
                                <td>{item.approver}</td>
                                <td>{item.confirmStatus}</td>
>>>>>>> main
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