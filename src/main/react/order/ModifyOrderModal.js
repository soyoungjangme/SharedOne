import React, { useState, useEffect } from 'react';
import './Order.css'
import './OrderRegist.css'
import './OrderModalDetail.css'
import axios from 'axios';

const ModifyOrderModal = ({ orderNo, isOpen, onClose, onUpdate }) => {
    console.log("ModifyOrderModal received onUpdate:", onUpdate);  // 디버깅 로그 추가

    const [modifyItem, setModifyItem] = useState({
        orderNo: '',
        regDate: '',
        employee: { employeeName: '' },
        customer: { customerName: '' },
        delDate: '',
        confirmStatus: '',
        remarks: '',
        confirm_change_date: null,
        orderBList: []
    });

    // 승인 여부 관리 (승인 됐으면 조회만 되게끔 하기 위해 만듦)
    const [isApproved, setIsApproved] = useState(false);

    // 주문 데이터 가져오기
    useEffect(() => {
        if (isOpen && orderNo) {
            const fetchOrderDetails = async () => {
                try {
                    const response = await axios.get(`/order/detail/${orderNo}`);
                    setModifyItem(response.data);

                    if (response.data.confirmStatus.trim() === '승인') {
                        setIsApproved(true);  // 승인 상태일 때 true로 설정
                    } else {
                        setIsApproved(false);  // 그 외 상태는 false
                    }
                } catch {
                    console.error('주문 상세 정보 조회 실패');
                    alert('주문 상세 정보를 조회하는 중 오류가 발생했습니다.');
                }
            };
            fetchOrderDetails();
        }
    }, [orderNo, isOpen]);

    // 입력 값 변경 가능한 처리
    const handleInputChange = (e) => {
        if (isApproved) return;
        const { name, value } = e.target;
        setModifyItem(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // 수량 변경 처리 함수
    const handleQuantityChange = (index, newQty) => {
        setModifyItem(prevState => {
            const updatedOrderBList = prevState.orderBList.map((item, i) =>
                i === index ? { ...item, orderProductQty: newQty } : item
            );
            return { ...prevState, orderBList: updatedOrderBList };
        });
    };

    // 결재 여부 매핑 처리
    const getConfirmStatus = (status) => {
        const trimmedStatus = (status || '').trim();
        const statusMap = {
            '승인': '승인',
            '반려': '반려',
            '대기': '대기'
        };
        return statusMap[trimmedStatus] || '대기';
    };

    // 정렬 상태 관리
    const [modalSortConfig, setModalSortConfig] = useState({ key: '', direction: 'ascending' });

    // 정렬 함수
    const sortModalData = (key) => {
        let direction = 'ascending';
        if (modalSortConfig.key === key && modalSortConfig.direction === 'ascending') {
            direction = 'descending';
        }

        const sortedData = [...modifyItem.orderBList].sort((a, b) => {
            if (key === 'productName' || key === 'productCategory') {
                // 상품명 또는 카테고리 정렬
                if (a.product[key] < b.product[key]) return direction === 'ascending' ? -1 : 1;
                if (a.product[key] > b.product[key]) return direction === 'ascending' ? 1 : -1;
            } else if (key === 'salePrice') {
                // 판매가 정렬 (customPrice 기준)
                const priceA = a.price?.customPrice || 0;
                const priceB = b.price?.customPrice || 0;
                if (priceA < priceB) return direction === 'ascending' ? -1 : 1;
                if (priceA > priceB) return direction === 'ascending' ? 1 : -1;
            } else if (key === 'totalPrice') {
                // 총 금액 정렬 (판매가 * 수량)
                const totalA = a.orderProductQty * (a.price?.customPrice || 0);
                const totalB = b.orderProductQty * (b.price?.customPrice || 0);
                if (totalA < totalB) return direction === 'ascending' ? -1 : 1;
                if (totalA > totalB) return direction === 'ascending' ? 1 : -1;
            } else if (key === 'orderProductQty') {
                // 수량 정렬
                if (a.orderProductQty < b.orderProductQty) return direction === 'ascending' ? -1 : 1;
                if (a.orderProductQty > b.orderProductQty) return direction === 'ascending' ? 1 : -1;
            }
            return 0;
        });

        setModifyItem({ ...modifyItem, orderBList: sortedData });
        setModalSortConfig({ key, direction });
    };

    // 업데이트 처리
    // const handleUpdate = async () => {
    //     try {
    //         const response = await axios.put(`/order/update/${modifyItem.orderNo}`, modifyItem);
    //         alert('주문이 성공적으로 수정되었습니다.');
    //
    //         // 모달이 닫히고 부모 컴포넌트에 업데이트된 값을 전달
    //         if (onUpdate) onUpdate(modifyItem);  // updatedOrder로 전달
    //         onClose();  // 모달 닫기
    //     } catch (error) {
    //         console.error('주문 수정 실패', error);  // 에러 로그 추가
    //         alert('주문 수정에 실패했습니다. 다시 시도해주세요.');
    //     }
    // };
    const handleUpdate = async () => {
        try {
            const response = await axios.put(`/order/update/${modifyItem.orderNo}`, modifyItem);
            alert('주문이 성공적으로 수정되었습니다.');

            console.log("Sending updated order to onUpdate:", modifyItem); // 업데이트된 아이템 로그
            if (onUpdate) {
                console.log("onUpdate is defined, calling it..."); // onUpdate가 정의되어 있는지 확인
                onUpdate(modifyItem);
            } else {
                console.warn("onUpdate is not defined");
            }
            onClose();  // 모달 닫기
        } catch (error) {
            console.error('주문 수정 실패', error);
            alert('주문 수정에 실패했습니다. 다시 시도해주세요.');
        }
    };



    return isOpen ? (
        <div className="confirmRegist">
            <div className="fullBody">
                <div className="form-container">
                    <button className="close-btn" onClick={onClose}> &times; </button>
                    <div className="form-header">
                        <h1>상세 조회</h1>
                        <div className="btns">
                            <div className="btn-add">
                                {!isApproved && (
                                    <button type="button" onClick={handleUpdate}>
                                        수정하기
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                    <form className="RegistForm" className={isApproved ? 'form-disabled' : ''}>
                        <table className="formTable">
                            <tbody>
                            <tr>
                                <th><label htmlFor="confirmTitle">주문 번호</label></th>
                                <td>
                                    <input type="text" value={modifyItem.orderNo || ''} readOnly
                                    />
                                </td>
                                <th><label htmlFor="confirmTitle">주문 등록일</label></th>
                                <td>
                                    <input type="text" value={modifyItem.regDate || ''} readOnly
                                    />
                                </td>
                                <th><label htmlFor="picName">담당자명</label></th>
                                <td>
                                    <input type="text"
                                           name="employeeName"
                                           value={modifyItem.employee?.employeeName || ''} readOnly
                                    />
                                </td>
                            </tr>
                            <tr>
                                <th colSpan="1"><label htmlFor="customerName">고객명</label></th>
                                <td colSpan="1">
                                    <input value={modifyItem.customer?.customerName || ''} readOnly
                                    />
                                </td>
                                <th colSpan="1"><label htmlFor="delDate">납품 요청일</label></th>
                                <td>
                                    <input type="date" name="delDate" value={modifyItem.delDate || ''}
                                           onChange={handleInputChange}
                                           readOnly={isApproved}
                                    />
                                </td>
                                <th><label htmlFor="approvalStatus">결재 여부</label></th>
                                <td>
                                    <select
                                        name="confirmStatus"
                                        value={getConfirmStatus(modifyItem.confirmStatus)}
                                        onChange={handleInputChange}
                                        disabled={isApproved}
                                    >
                                        <option value="대기">대기</option>
                                        <option value="승인">승인</option>
                                        <option value="반려">반려</option>
                                    </select>
                                </td>
                            </tr>
                            </tbody>
                        </table>

                        <table className="formTable2">
                            <tbody>
                            <tr>
                                <th><label htmlFor="approver">결재자</label></th>
                                <td>
                                    <input type="text"/>
                                </td>
                                <th colSpan="1"><label htmlFor="remarks">비고</label></th>
                                <td colSpan="3">
                                    <textarea name="remarks" value={modifyItem.remarks || ''}
                                              onChange={handleInputChange}
                                              readOnly={isApproved}
                                    ></textarea>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </form>

                    <div className="RegistFormList">
                        <div style={{ fontWeight: 'bold' }}>총 {modifyItem.orderBList?.length || 0} 건</div>
                        <table className="formTableList">
                            <thead>
                            <tr>
                                <th>No</th>
                                <th>상품 카테고리
                                    <button className="sortBtn" onClick={() => sortModalData('productCategory')}>
                                        {modalSortConfig.key === 'productCategory' ? (modalSortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                                    </button>
                                </th>
                                <th>상품명
                                    <button className="sortBtn" onClick={() => sortModalData('productName')}>
                                        {modalSortConfig.key === 'productName' ? (modalSortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                                    </button>
                                </th>
                                <th>상품 수량
                                    <button className="sortBtn" onClick={() => sortModalData('orderProductQty')}>
                                        {modalSortConfig.key === 'orderProductQty' ? (modalSortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                                    </button>
                                </th>
                                <th>판매가
                                    <button className="sortBtn" onClick={() => sortModalData('salePrice')}>
                                        {modalSortConfig.key === 'salePrice' ? (modalSortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                                    </button>
                                </th>
                                <th>총 금액
                                    <button className="sortBtn" onClick={() => sortModalData('totalPrice')}>
                                        {modalSortConfig.key === 'totalPrice' ? (modalSortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                                    </button>
                                </th>
                                <th>판매 기간</th>
                            </tr>
                            </thead>
                            <tbody>
                            {modifyItem.orderBList && modifyItem.orderBList.length > 0 ? (
                                modifyItem.orderBList.map((item, index) => {
                                    const orderNo = item.orderNo || modifyItem.orderNo;
                                    const customPrice = item.price?.customPrice || 0;
                                    const saleStart = item.price?.startDate || '정보 없음';
                                    const saleEnd = item.price?.endDate || '정보 없음';

                                    return (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{item.product?.productCategory}</td>
                                            <td>{item.product?.productName}</td>
                                            <td>
                                                {/* 수량 변경 가능하도록 input 추가 */}
                                                <input
                                                    type="number"
                                                    value={item.orderProductQty}
                                                    onChange={(e) => handleQuantityChange(index, parseInt(e.target.value))}
                                                    disabled={isApproved}
                                                />
                                            </td>
                                            <td>{customPrice}</td>
                                            <td>{item.orderProductQty * customPrice}</td>
                                            {/* 총 금액 */}
                                            <td>{`${saleStart} ~ ${saleEnd}`}</td>
                                            {/* 판매 기간 */}
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="7">No data available</td>
                                </tr>
                            )}
                            {modifyItem.orderBList?.length > 0 && (
                                <tr style={{fontWeight: 'bold'}}>
                                    <td colSpan="5">합계</td>
                                    <td colSpan="3">
                                        {modifyItem.orderBList.reduce(
                                            (total, item) => total + (item.orderProductQty * (item.price?.customPrice || 0)),
                                            0
                                        )}
                                    </td>
                                </tr>
                            )}
                            </tbody>

                        </table>
                    </div>
                </div>
            </div>
        </div>
    ) : null;
};

export default ModifyOrderModal;