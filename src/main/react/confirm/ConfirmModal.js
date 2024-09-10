import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './Confirm.css';
import './modal_confirm1.css';
import useCheckboxManager from '../js/CheckboxManager';

const ConfirmModal = ({openModal, handleCloseClick, selectedItem }) => {

    const [formData, setFormData] = useState({
        customerName: '',
        picName: '',
        productType: '도서',
        productName: '',
        qty: '',
        totalAmount: '',
        delDate: '',
        startDate: '',
        endDate: '',
        approver: '',
        approvalStatus: 'pending',
        remarks: ''
    });

    const {
        allCheck,
        checkItem,
        showDelete,
        handleMasterCheckboxChange,
        handleCheckboxChange,
        handleDelete
    } = useCheckboxManager();

    const [formList, setFormList] = useState([]);
    const [isVisibleCSV, setIsVisibleCSV] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleAddClick = () => {
        setFormList([...formList, formData]);
        // Reset formData
        setFormData({
            customerName: '',
            picName: '',
            productType: '도서',
            productName: '',
            qty: '',
            totalAmount: '',
            delDate: '',
            startDate: '',
            endDate: '',
            approver: '',
            approvalStatus: '대기',
            remarks: ''
        });
    };

    const handleAddClickCSV = () => {
        setIsVisibleCSV(!isVisibleCSV);
        // 여기다가 CSV 구현 예정
    };

    return(
        <div>
            {openModal && (
                <div className="confirmRegist">
                    <div className="fullBody">
                        <div className="form-container">
                            <button className="close-btn" onClick={handleCloseClick}> &times; </button>
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
                                    <tbody>
                                    <tr>
                                        <th colSpan="1"><label htmlFor="customerName">고객명</label></th>
                                        <td colSpan="3">
                                            <input
                                                type="text"
                                                name="customerName"
                                                value={formData.customerName}
                                                onChange={handleInputChange}
                                                placeholder="필드 입력"
                                            />
                                        </td>
                                        <th colSpan="1"><label htmlFor="picName">담당자명</label></th>
                                        <td colSpan="3">
                                            <input
                                                type="text"
                                                name="picName"
                                                value={formData.picName}
                                                onChange={handleInputChange}
                                                placeholder="필드입력"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th><label htmlFor="productType">상품종류</label></th>
                                        <td>
                                            <select
                                                name="productType"
                                                value={formData.productType}
                                                onChange={handleInputChange}
                                            >
                                                <option value="도서">도서</option>
                                                <option value="MD">MD</option>
                                                <option value="기타">기타</option>
                                            </select>
                                        </td>
                                        <th><label htmlFor="productName">상품명</label></th>
                                        <td colSpan="3">
                                            <input
                                                type="text"
                                                name="productName"
                                                value={formData.productName}
                                                onChange={handleInputChange}
                                                placeholder="필드 입력"
                                            />
                                        </td>
                                        <th><label htmlFor="qty">상품수량</label></th>
                                        <td>
                                            <input
                                                type="text"
                                                name="qty"
                                                value={formData.qty}
                                                onChange={handleInputChange}
                                                placeholder="필드 입력"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th><label htmlFor="totalAmount">총 금액</label></th>
                                        <td>
                                            <input
                                                type="text"
                                                name="totalAmount"
                                                value={formData.totalAmount}
                                                onChange={handleInputChange}
                                                placeholder="필드 입력"
                                            />
                                        </td>
                                        <th><label htmlFor="delDate">납품요청일</label></th>
                                        <td>
                                            <input
                                                type="date"
                                                name="delDate"
                                                value={formData.delDate}
                                                onChange={handleInputChange}
                                            />
                                        </td>
                                        <th><label htmlFor="startDate">판매 시작날짜</label></th>
                                        <td>
                                            <input
                                                type="date"
                                                name="startDate"
                                                value={formData.startDate}
                                                onChange={handleInputChange}
                                            />
                                        </td>
                                        <th><label htmlFor="endDate">판매 종료날짜</label></th>
                                        <td>
                                            <input
                                                type="date"
                                                name="endDate"
                                                value={formData.endDate}
                                                onChange={handleInputChange}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th><label htmlFor="approver">결재자</label></th>
                                        <td>
                                            <input
                                                type="text"
                                                name="approver"
                                                value={formData.approver}
                                                onChange={handleInputChange}
                                                placeholder="필드 입력"
                                            />
                                        </td>
                                        <th><label htmlFor="approvalStatus">결재 여부</label></th>
                                        <td>
                                            <select
                                                name="approvalStatus"
                                                value={formData.approvalStatus}
                                                onChange={handleInputChange}
                                            >
                                                <option value="pending">대기</option>
                                                <option value="approved">승인</option>
                                                <option value="rejected">반려</option>
                                            </select>
                                        </td>
                                        <th colSpan="1"><label htmlFor="remarks">비고</label></th>
                                        <td colSpan="3">
                                            <input
                                                type="text"
                                                name="remarks"
                                                value={formData.remarks}
                                                onChange={handleInputChange}
                                                placeholder="필드 입력"
                                            />
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>

                                <button id="downloadCsv">CSV 샘플 양식</button>
                                <button id="uploadCsv" onClick={handleAddClickCSV}>CSV 파일 업로드</button>
                                {isVisibleCSV && (
                                    <input type="file" id="uploadCsvInput" accept=".csv"/>
                                )}

                                <div className="btn-add">
                                    <button onClick={handleAddClick}>추가</button>
                                </div>
                            </div>

                            <div className="RegistFormList">
                                <div style={{ fontWeight: 'bold' }}> 총 {formList.length} 건 </div>
                                <table className="formTableList">
                                    {showDelete && <button className='delete-btn' onClick={handleDelete}>삭제</button>}
                                    <thead>
                                    <tr>
                                        <th><input type="checkbox" checked={allCheck}
                                                   onChange={handleMasterCheckboxChange}/></th>
                                        <th>No</th>
                                        <th>고객명</th>
                                        <th>상품 종류</th>
                                        <th>상품명</th>
                                        <th>상품 수량</th>
                                        <th>총 금액</th>
                                        <th>납품 요청일</th>
                                        <th>판매 시작일</th>
                                        <th>판매 종료일</th>
                                        <th>담당자</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {formList.map((item, index) => (
                                        <tr key={index}>
                                            <td><input type="checkbox" checked={checkItem[index]}
                                                       onChange={handleCheckboxChange}/></td>
                                            <td>{index}</td>
                                            <td>{item.customerName}</td>
                                            <td>{item.productType}</td>
                                            <td>{item.productName}</td>
                                            <td>{item.qty}</td>
                                            <td>{item.totalAmount}</td>
                                            <td>{item.delDate}</td>
                                            <td>{item.startDate}</td>
                                            <td>{item.endDate}</td>
                                            <td>{item.picName}</td>
                                        </tr>
                                    ))}
                                    <tr style={{ fontWeight: 'bold' }}>
                                        <td colSpan="9"> 합계</td>
                                        <td colSpan="2">
                                            {/* Calculate sum based on formList */}
                                            {formList.reduce((acc, item) => acc + (parseFloat(item.totalAmount) || 0), 0)}
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                                {showDelete && (
                                    <button className='delete-btn' onClick={handleDelete}>삭제</button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ConfirmModal;