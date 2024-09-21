import React, { useState, useEffect } from 'react';
import './Order.css'
import './OrderRegist.css'
import './OrderModalDetail.css'
import ModifyOrderModal2 from "./ModifyOrderModal2";
import Order2 from './Order2';
import axios from 'axios';
import Select from "react-select";

const ModifyOrderModal = ({ orderNo, isOpen, onClose, onUpdate, onOpenModifyModal2, onOpenOrder2 }) => {

    const [modifyItem, setModifyItem] = useState({
        orderNo: '',
        regDate: '',
        employee: { employeeName: '' , employeeId : ''},
        customer: { customerName: '' , customerNo : '' },
        delDate: '',
        confirmStatus: '',
        remarks: '',
        confirmerId: '',
        confirmerName:'',
        confirmChangeDate: null,
        orderBList: []
    });

    // 승인 여부 관리 (승인 됐으면 조회만 되게끔 하기 위해 만듦)
    const [isApproved, setIsApproved] = useState(false);

    // 주문 수정하는 모달창
    const [isModifyModalOpen, setIsModifyModalOpen] = useState(false);

    const openModifyModal2 = () => {
        const updatedModifyItem = {
            ...modifyItem,
            customerNo: modifyItem.customer?.customerNo || ''
        };
        setIsModifyModalOpen(true);
        onOpenModifyModal2(updatedModifyItem);
    };
    const closeModifyModal = () => {
        setIsModifyModalOpen(false);
    };

    // 임시 저장 모달 관리
    const [isOrder2Open, setIsOrder2Open] = useState(false);

    // 임시 저장 모달 열기 함수
    const openOrder2 = (orderData) => {
        setIsOrder2Open(true);
    };

    // 임시 저장 모달 닫기 함수
    const closeOrder2Modal = () => {
        setIsOrder2Open(false);
    };

    const handleModifyUpdate = (updatedOrder) => {
        // 수정된 주문 데이터를 반영하여 modifyItem 상태 업데이트
        setModifyItem(prev => ({
            ...prev,
            ...updatedOrder,  // 모달2에서 전달받은 데이터로 상태 업데이트
            confirmChangeDate: updatedOrder.confirmChangeDate // 오늘 날짜로 상태 변경일 업데이트
        }));

        // 필요한 경우, 부모에게도 업데이트된 데이터를 전달
        if (onUpdate) {
            onUpdate(updatedOrder);
        }

        closeModifyModal(); // 모달2 닫기
    };

//--------------------------------------------------------------------------
 const [orderDetails, setOrderDetails] = useState({
        orderNo: 0,
        customerNo: '',
        employeeId: '',
        delDate: '',
        orderB: [
            {
                productNo: 0,
                orderProductQty: 0,
                product: '',
                price: 0,
                priceNo: 0
            }
        ]
    });

    // modifyItem이 업데이트될 때마다 orderDetails와 orderDetailsBList를 업데이트
    useEffect(() => {
        if (modifyItem) {
            const updatedOrderDetailsBList = modifyItem.orderBList.map(item => ({
                productNo: item.productNo,            // 원본 값
                orderProductQty: item.orderProductQty,                  // 기본값 또는 나중에 업데이트 필요
                price: item.productPrice ?? 0,        // null을 0으로 대체
                priceNo: item.price?.priceNo ?? 0  // 추가

            }));

            // 상태를 한 번에 업데이트
            setOrderDetails({
                orderNo: modifyItem.orderNo,          // 예시: orderNo 추가
                employeeId: modifyItem.employee.employeeId,
                customerNo: modifyItem.customer.customerNo,
                delDate: modifyItem.delDate,
                orderB: updatedOrderDetailsBList
            });
        }
    }, [modifyItem]);  // modifyItem이 변경될 때마다 호출

    const handleUpdate = async () => {
        try {
            console.log('Sending Order Details:', orderDetails); // 전송 전 데이터 확인
    
            const response = await axios.post('/order/updateOrder', orderDetails, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            console.log('Response:', response.data); // 서버 응답 확인
        } catch (error) {
            console.error('Error:', error.response ? error.response.data : error.message); // 에러 상세 확인
        }
    };
//--------------------------------------------------------------------------









    // 주문 데이터 가져오기
    useEffect(() => {
        if (isOpen && orderNo) {
            console.log('useEffect orderNo: '+orderNo); // 망할 디버깅
            const fetchOrderDetails = async () => {
                try {
                    const response = await axios.get(`/order/detail/${orderNo}`);
                    console.log('Fetched data:', response.data);
                    console.log('Server response:', JSON.stringify(response.data, null, 2)); // 디버깅
                    setModifyItem(response.data);

                    const confirmStatus = getConfirmStatus(response.data?.confirmStatus);
                    if (confirmStatus === '승인') {
                        setIsApproved(true);
                    } else {
                        setIsApproved(false);
                    }
                } catch (error) {
                    console.error('주문 상세 정보 조회 실패:', error);
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

    // 결재 여부 매핑 처리
    const getConfirmStatus = (status) => {
        const trimmedStatus = (status || '').trim();
        const statusMap = {
            '임시저장': '임시저장',
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

// 임시로 만든 승인, 반려 버튼
    const handleApproval = async (status) => {
        const message = status === '승인' ? '승인 처리하시겠습니까?' : '반려 처리하시겠습니까?';

        if (!window.confirm(message)) {
            return; // 사용자가 취소를 누르면 함수 종료
        }

        try {
            const today = new Date();
            today.setDate(today.getDate());
            const todayPlus = today.toISOString().split('T')[0];

            const response = await axios.post('/order/updateApproval', {
                orderNo: modifyItem.orderNo,
                confirmStatus: status,
                remarks: modifyItem.remarks,
                confirmChangeDate: todayPlus
            });

            if (response.data.success) {
                setModifyItem(prev => ({
                    ...prev,
                    confirmStatus: status,
                    confirmChangeDate: todayPlus
                }));
                alert(`주문 번호 ${modifyItem.orderNo}, ${status === '승인' ? '승인' : '반려'} 처리되었습니다.`);
                window.location.reload();
            } else {
                console.error('승인/반려 처리 실패');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('처리 중 오류가 발생했습니다. 다시 시도해주세요.');
        }
    };

    useEffect(() => {
        if (modifyItem && modifyItem.confirmStatus) {
            console.log('confirmStatus:', modifyItem.confirmStatus);
            console.log('getConfirmStatus:', getConfirmStatus(modifyItem.confirmStatus));
        } else {
            console.log('modifyItem or confirmStatus is undefined');
        }
    }, [modifyItem]);



    return isOpen ? (
        <div className="confirmRegist">
            <div className="fullBody">
                <div className="form-container">
                    <button className="close-btn" onClick={onClose}> &times; </button>
                    <div className="form-header">
                        <h1>상세 조회</h1>
                        <div className="btns">
                            <div className="btn-add">
                                {getConfirmStatus(modifyItem.confirmStatus) === '임시저장' && (
                                    <>
                                        <button type="button" >삭제</button>
                                    </>
                                )}
                                {getConfirmStatus(modifyItem.confirmStatus) === '대기' && (
                                    <>
                                        <button type="button" onClick={() => handleApproval('반려')}>반려</button>
                                        <button type="button" onClick={() => handleApproval('승인')}>승인</button>
                                    </>
                                )}
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (window.confirm('주문을 수정하시겠습니까?')) {
                                            if (getConfirmStatus(modifyItem.confirmStatus) === '임시저장') {
                                                openOrder2(modifyItem);
                                            } else {
                                                onOpenModifyModal2(modifyItem);
                                            }
                                        }
                                    }}
                                >수정하기
                                </button>
                            </div>


                        </div>
                    </div>
                    <form className={`RegistForm ${isApproved ? 'form-disabled' : ''}`}>
                        <table className="formTable">
                            <tbody>
                            <tr>
                                <th><label htmlFor="confirmTitle">주문 번호</label></th>
                                <td>{modifyItem.orderNo || ''}</td>

                                <th><label htmlFor="customerName">고객명</label></th>
                                <td>{modifyItem.customer?.customerName || ''}</td>
                            </tr>
                            <tr>
                                <th><label htmlFor="confirmTitle">주문 등록일</label></th>
                                <td>{modifyItem.regDate || ''}</td>

                                <th colSpan="1"><label htmlFor="delDate">납품 요청일</label></th>
                                <td>{modifyItem.delDate || ''}</td>

                                <th colSpan="1"><label htmlFor="confirmTitle">상태 변경일</label></th>
                                <td>{modifyItem.confirmChangeDate || '정보 없음'}</td>
                            </tr>
                            <tr>
                                <th><label htmlFor="picName">담당자명</label></th>
                                <td>{modifyItem.employee?.employeeName || ''}</td>
                                <th><label htmlFor="approver">결재자</label></th>
                                <td>{modifyItem.confirmerName || '정보 없음'}</td>
                                <th><label htmlFor="approvalStatus">결재 여부</label></th>
                                <td>{modifyItem.confirmStatus}</td>
                                    {/*{(modifyItem.confirmStatus?.trim() === '승인' || modifyItem.confirmStatus?.trim() === '반려') ? (*/}
                                    {/*    <span>{getConfirmStatus(modifyItem.confirmStatus)}</span>*/}
                                    {/*) : (*/}
                                    {/*    <select*/}
                                    {/*        name="confirmStatus"*/}
                                    {/*        value={getConfirmStatus(modifyItem.confirmStatus)}*/}
                                    {/*        onChange={handleInputChange}*/}
                                    {/*    >*/}
                                    {/*        <option value="대기">대기</option>*/}
                                    {/*        <option value="승인">승인</option>*/}
                                    {/*        <option value="반려">반려</option>*/}
                                    {/*    </select>*/}
                                    {/*)}*/}

                            </tr>
                            </tbody>
                        </table>

                        <table className="formTable2">
                            <tbody>
                            <tr>

                                <th colSpan="1"><label htmlFor="remarks">비고</label></th>
                                <td colSpan="3">
                                    {(getConfirmStatus(modifyItem.confirmStatus) === '승인' || getConfirmStatus(modifyItem.confirmStatus) === '반려') ? (
                                        <span>{modifyItem.remarks || '비고 없음'}</span>
                                    ) : (
                                        <textarea
                                            name="remarks"
                                            value={modifyItem.remarks || ''}
                                            onChange={handleInputChange}
                                        ></textarea>
                                    )}
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </form>

                    <div className="RegistFormList">
                    <div style={{fontWeight: 'bold'}}>총 {modifyItem.orderBList?.length || 0} 건</div>
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
                                            <td>{item.orderProductQty}</td>
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

            {isOrder2Open && (
            <Order2
                orderNo={modifyItem.orderNo}
                onClose={closeOrder2Modal}
                initialData={modifyItem}
            />
        )}

            {isModifyModalOpen && (
                <ModifyOrderModal2
                    orderData={modifyItem}
                    isOpen={isModifyModalOpen}
                    onClose={closeModifyModal}
                    onUpdate={handleModifyUpdate}
                />
            )}
        </div>
    ) : null;
};

export default ModifyOrderModal;