import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './Confirm.css';
import './modal_confirm1.css';
import useCheckboxManager from '../js/CheckboxManager';

function Confirm() {

// 체크박스 이벤트
    const {
        allCheck,
        checkItem,
        showDelete,
        handleMasterCheckboxChange,
        handleCheckboxChange,
        handleDelete
    } = useCheckboxManager(setConfirm);

    const [product, setProduct] = useState([]);
    const [confirm, setConfirm] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: '', direction: 'ascending' });
    const [openModal, setOpenModal] = useState(false);
    const [isVisibleCSV, setIsVisibleCSV] = useState(false);

// 정렬 이벤트
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                let data = await fetch('/product/products').then(res => res.json());
                setProduct(data);
                setConfirm(data);
            } catch (error) {
                console.error('데이터를 가져오는 중 오류 발생:', error);
            }
        };
        fetchData();
    }, []);


    const handleOpenClick = () => setOpenModal(true);
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
                        <th>판매가(원)</th>
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


{/*모달 창 띄우기 연습2*/}
            {openModal && (
                <div className="confirmRegist">
                    <div className="fullBody">
                    <div className="form-container">
                            <button className="close-btn" onClick={handleCloseClick}> &times;
                            </button>
                            <div className="form-header">
                                <h1>주문 및 결재 상세 조회</h1>

                                <div className="btns">
                                    <div className="btn-add">
                                        <button>수정</button>
                                    </div>
                                </div>
                            </div>

                            <div className="RegistForm">
                                <table className="formTable">
                                    <tr>
                                        <th colSpan="1"><label htmlFor="">고객사명</label></th>
                                        <td colSpan="3"><input type="text" placeholder="필드 입력"/></td>
                                        <th colSpan="1"><label htmlFor="">담당자명</label></th>
                                        <td colSpan="3"><input type="text" placeholder="필드 입력"/></td>
                                    </tr>

                                    <tr>
                                        <th><label htmlFor="">상품종류</label></th>
                                        <td>
                                            <select>
                                                <option>도서</option>
                                                <option>MD</option>
                                                <option>기타</option>
                                            </select>
                                        </td>
                                        <th><label htmlFor="">상품명</label></th>
                                        <td colSpan="3"><input type="text" placeholder="필드 입력"/></td>
                                        <th><label htmlFor="">상품수량</label></th>
                                        <td><input type="text" placeholder="필드 입력"/></td>
                                    </tr>

                                    <tr>
                                        <th><label htmlFor="">총 금액</label></th>
                                        <td><input type="text" placeholder="필드 입력"/></td>
                                        <th><label htmlFor="">납품요청일</label></th>
                                        <td><input type="date" placeholder="필드 입력"/></td>
                                        <th><label htmlFor="">판매 시작날짜</label></th>
                                        <td><input type="date" placeholder="필드 입력"/></td>
                                        <th><label htmlFor="">판매 종료날짜</label></th>
                                        <td><input type="date" placeholder="필드 입력"/></td>
                                    </tr>

                                    <tr>
                                        <th><label htmlFor="">결재자</label></th>
                                        <td><input type="text" placeholder="필드 입력"/></td>
                                        <th><label htmlFor="">결재 여부</label></th>
                                        <td>
                                            <select>
                                                <option value="pending">대기</option>
                                                <option value="approved">승인</option>
                                                <option value="rejected">반려</option>
                                            </select>
                                        </td>
                                        <th colSpan="1"><label htmlFor="">비고</label></th>
                                        <td colSpan="3">
                                            <input type="text" placeholder="필드 입력"/>
                                        </td>
                                    </tr>
                                </table>

                                <button id="downloadCsv">CSV 샘플 양식</button>
                                <button id="uploadCsv" onClick={handleAddClickCSV}>CSV 파일 업로드</button>
                                {isVisibleCSV && (
                                    <input type="file" id="uploadCsvInput" accept=".csv"/>
                                )}

                                <div className="btn-add">
                                    <button>추가</button>
                                </div>

                            </div>

                            <div className="RegistFormList">
                                <div style={{fontWeight: 'bold'}}> 총 N 건</div>
                                <table className="formTableList">
                                {showDelete && <button className='delete-btn' onClick={handleDelete}>삭제</button>}
                                    <thead>
                                    <tr>
                                        <th><input type="checkbox" checked={allCheck}
                                                   onChange={handleMasterCheckboxChange}/></th>
                                        <th>No</th>
                                        <th>상품명</th>
                                        <th>상품 종류</th>
                                        <th>상품 수량</th>
                                        <th>판매가</th>
                                        <th>총 금액</th>
                                        <th>납품 요청일</th>
                                        <th>담당자</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <td><input type="checkbox"/></td>
                                        <td>1</td>
                                        <td>삼국지</td>
                                        <td>도서</td>
                                        <td>500</td>
                                        <td>10000</td>
                                        <td>5000000</td>
                                        <td>2024-10-01</td>
                                        <td>유선화</td>
                                    </tr>

                                    <tr style={{fontWeight: 'bold'}}>
                                        <td colSpan="7"> 합계</td>
                                        <td colSpan="2"> 13,000,000</td>
                                    </tr>

                                    </tbody>
                                </table>
                            </div>

                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Confirm/>
);