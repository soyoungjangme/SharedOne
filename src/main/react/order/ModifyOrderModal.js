import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Order.css';
import './OrderRegist.css';
import './OrderModalDetail.css';
import './OrderModalUpdate.css'
import useCheckboxManager from '../js/CheckboxManager';


function ModifyOrderModal({ orderData, isOpen, onClose,onClose2, onUpdate }) {

    // 상태 변수: 상품 목록, 추가된 상품 목록, 각 상품의 수량 관리
    const [customPrice, setCustomPrice] = useState([]); // 상품 리스트
    const [addCheckProd, setAddCheckProd] = useState([]); // 추가된 상품 리스트
    const [quantities, setQuantities] = useState({});    // 각 상품의 수량
    const [searchProd, setSearchProd] = useState([]);

    // 상태 변수: 주문 수정 항목 관리
    const [modifyItem, setModifyItem] = useState({
        orderNo: '',
        regDate: '',
        employee: { employeeName: '', employeeId: '' },
        customer: { customerName: '', customerNo: '' },
        delDate: '',
        confirmStatus: '',
        confirmerName:'',
        remarks: '',
        confirmerId: '',
        confirmChangeDate: null,
        orderBList: []
    });

    // 수정된 orderBList 디버깅용 useEffect
    useEffect(() => {
        console.log('Updated orderBList:', modifyItem.orderBList);
    }, [modifyItem.orderBList]);


// 주문 가능한 상품 목록을 위한 체크박스
    const {
        allCheck: availableProductsAllCheck,
        checkItem: availableProductsCheckItem,
        handleMasterCheckboxChange: handleAvailableProductsMasterCheckboxChange,
        handleCheckboxChange: handleAvailableProductsCheckboxChange,
        setAllCheck: setAllCheckCustomPrice,
        setCheckItem: setCheckItemCustomPrice,
        setShowDelete: setShowDeleteCustomPrice
    } = useCheckboxManager(setCustomPrice);

// 선택된 상품 목록을 위한 체크박스
    const {
        allCheck: selectedProductsAllCheck,
        checkItem: selectedProductsCheckItem,
        handleMasterCheckboxChange: handleSelectedProductsMasterCheckboxChange,
        handleCheckboxChange: handleSelectedProductsCheckboxChange,
        setCheckItem: setSelectedProductsCheckItem,
        showDelete
    } = useCheckboxManager();

    // orderData 변경 시 수정 항목을 업데이트
    useEffect(() => {
        if (orderData) {
            setModifyItem(orderData);
        }
    }, [orderData]);

// 선택한 상품 리스트에서 삭제 처리
    const handleDelete = () => {
        const checkDelete = window.confirm('선택한 상품을 목록에서 삭제하시겠습니까?');
        if (checkDelete) {
            const newOrderBList = modifyItem.orderBList.filter((_, index) => !selectedProductsCheckItem[index]);
            setModifyItem(prev => ({
                ...prev,
                orderBList: newOrderBList
            }));
            // 체크박스 상태 초기화
            setSelectedProductsCheckItem({});
        }
    };


    // 고객 번호로 상품 목록을 불러오기
    useEffect(() => {
        if (orderData) {
            const customerNo = orderData.customer?.customerNo;
            if (customerNo) {
                fetchCustomerProducts(customerNo);  // 고객 번호로 상품 목록을 불러옴
            } else {
                console.error('고객 번호가 없습니다.');
            }
            setModifyItem(orderData); // 중복 제거 후 여기에만 설정
        }
    }, [orderData]);

    // 고객에 맞는 상품 리스트를 서버에서 가져오기
    const fetchCustomerProducts = async (customerNo) => {
        try {
            console.log('Fetching products for customerNo:', customerNo);

            const response = await axios.post('/order/getPrice', {
                inputOrderCustomerNo: parseInt(customerNo, 10),
                inputOrderDelDate: modifyItem.delDate || null
            });

            const OrderCustomerData = response.data;

            if (Array.isArray(OrderCustomerData)) {
                const getOrderCustomer = OrderCustomerData.map(value => ({
                    salePrice: value.customPrice,
                    prodNo: value.product.productNo,
                    prodCat: value.product.productCategory,
                    prodName: value.product.productName,
                    prodWriter: value.product.productWriter,
                    saleStart: value.startDate,
                    saleEnd: value.endDate,
                    priceNo: value.priceNo
                }));
                setCustomPrice(getOrderCustomer);
            } else {
                console.error('상품 목록을 불러오는 중 오류 발생:', OrderCustomerData);
            }
        } catch (error) {
            console.error('fetchCustomerProducts 호출 오류:', error); // 오류 메시지 출력
            if (error.response) {
                console.error('서버 응답 오류:', error.response.data); // 서버 응답에 대한 자세한 오류 메시지
            }
        }
    };

    // 납품 요청일 변경 시 fetch 실행
    useEffect(() => {
        if (modifyItem && modifyItem.customer?.customerNo && modifyItem.delDate) {
            fetchCustomerProducts(modifyItem.customer.customerNo, modifyItem.delDate);  // 고객 번호와 납품 요청일로 상품 목록을 불러옴
        }
    }, [modifyItem.delDate, modifyItem.customer?.customerNo]);


    // 주문 수량 변경 처리
    const handleQuantityChange = (index) => (e) => {
        // 빈 문자열을 허용하고, 숫자가 아닌 입력을 방지
        let qty = e.target.value;
        if (qty !== '' && isNaN(qty)) {
            return; // 숫자가 아닌 값 입력 방지
        }

        setModifyItem(prev => {
            const updatedOrderBList = [...prev.orderBList];
            updatedOrderBList[index] = {
                ...updatedOrderBList[index],
                orderProductQty: qty === '' ? '' : parseInt(qty, 10)
            };
            console.log('Updated quantity:', updatedOrderBList); // 디버깅
            return {
                ...prev,
                orderBList: updatedOrderBList
            };
        });
    };


    // 검색 필터링 상태 관리
    const [searchTerm, setSearchTerm] = useState('');
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // 검색어에 맞는 상품 필터링
    const filteredProducts = customPrice.filter(product =>
        product.prodName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    console.log('현재 confirmStatus:', modifyItem.confirmStatus);
    console.log('타입:', typeof modifyItem.confirmStatus);



    // 주문 업데이트 처리 함수 - 수정하기 버튼에 걸려 있는 함수
    const handleUpdateOrder = async () => {
        if (!modifyItem.delDate) {
            alert('납품 요청일을 선택해주세요.');
            return;
        }

        if (modifyItem.orderBList.length === 0) {
            alert('1개 이상의 상품을 선택해주세요.');
            return;
        }

        // 빈 문자열이나 0인 수량 체크
        const invalidQuantities = modifyItem.orderBList.filter(item =>
            item.orderProductQty === '' || item.orderProductQty === 0
        );

        if (invalidQuantities.length > 0) {
            alert('모든 상품의 수량을 1개 이상 입력해주세요.');
            return;
        }

        const status = modifyItem.confirmStatus.trim();

        if (status === '반려') {
            console.log('1현재 상태: 반려');
            try {
/*                // 주문 업데이트에 필요한 데이터 준비
                const today = new Date();
                today.setDate(today.getDate() + 1);
                const todayPlus = today.toISOString().split('T')[0];*/

                const updatedOrderData = {
                    orderNo: modifyItem.orderNo,
                    inputDelDate: modifyItem.delDate,
                    inputStatus : "대기", //고정 값
                    /*confirmChangeDate: todayPlus,*/ // 인서트이므로, 상태변경일 ㄴㄴ
                    inputCustomerNo: modifyItem.customer.customerNo, // 고객 번호 설정
                    inputManager: modifyItem.employee.employeeId, // 직원 ID 설정
                    inputConfirmer: modifyItem.confirmerId, //담당자 ID 설정
                    orderBList: modifyItem.orderBList.map(item => ({
                        productNo: item.product.productNo,
                        orderProductQty: parseInt(item.orderProductQty, 10),
                        // price: item.price.customPrice,
                        priceNo: item.price.priceNo,
                        prodTotal: parseInt(item.orderProductQty, 10) * item.price.customPrice,
                        price: {
                            priceNo: item.price.priceNo,
                            customPrice: item.price.customPrice,
                            startDate: item.price.startDate,
                            endDate: item.price.endDate
                        }
                    }))
                };

                // 요청 전에 데이터 로그 찍기
                console.log('Updated Order Data:', updatedOrderData);  // 전송 데이터 확인
                console.log('OrderBList:', modifyItem.orderBList);
                modifyItem.orderBList.forEach((item, index) => {
                    console.log(`Item ${index} Price Object:`, item.price);
                });

                const response = await axios.post('/order/registOrder', updatedOrderData);
                const orderNo = response.data;

                if (response.status === 200 || response.data) {
                    // 상태를 '반려(처리완료)'로 업데이트
                    setModifyItem(prev => ({
                        ...prev,
                        confirmStatus: '반려(처리완료)'
                    }));

                    alert(`주문번호 ${orderNo} 등록이 완료되었습니다.`);

                    // 기존 주문 상태 '반려(처리완료)'로 업데이트
                    // const today = new Date().toISOString().split('T')[0];
                    const updateApprovalResponse = await axios.post('/order/updateApproval', {
                        orderNo: modifyItem.orderNo,
                        confirmStatus: '반려(처리완료)',
                        // confirmChangeDate: today,  // 상태 변경일 업데이트
                        remarks: modifyItem.remarks // 비고 업데이트
                    });

                    if (updateApprovalResponse.data.success) {
                        console.log('기존 주문 상태가 반려(처리완료)로 업데이트되었습니다.');
                    } else {
                        alert('기존 주문 상태 업데이트에 실패했습니다.');
                    }

                    onClose();
                } else {
                    alert('주문 등록을 실패하였습니다.');

                }
            } catch (error) {  // 디버깅
                console.error('주문 업데이트 중 오류 발생:', error);
                if (error.response) {
                    console.error('Error response:', error.response.data);  // 서버의 오류 응답 내용을 확인
                    console.error('Error status:', error.response.status);  // 서버 응답 코드 확인
                } else {
                    console.error('Axios request error:', error.message);  // 네트워크 오류나 기타 문제를 확인
                }
            }

        } else if (status === '대기') {
            console.log('2현재 상태: 대기');

        try {
            const today = new Date();
            today.setDate(today.getDate() + 1);
            const todayPlus = today.toISOString().split('T')[0];

            const updatedOrderData = {
                orderNo: modifyItem.orderNo,
                delDate: modifyItem.delDate,
                confirmChangeDate: todayPlus,
                customerNo: modifyItem.customer.customerNo,
                employeeId: modifyItem.employee.employeeId,
                orderBList: modifyItem.orderBList.map(item => ({
                    productNo: item.product.productNo,
                    orderProductQty: parseInt(item.orderProductQty, 10),
                    price: item.price.customPrice,
                    priceNo: item.priceNo || item.price.priceNo,
                    prodTotal: parseInt(item.orderProductQty, 10) * item.price.customPrice
                }))
            };

            const response = await axios.put(`/order/update`, updatedOrderData);

            // 서버에 업데이트 요청 보내기
            if (response.status === 200 || response.data) {
                alert('주문이 성공적으로 업데이트되었습니다.');
                onUpdate(response.data);  // 부모 컴포넌트로 수정된 데이터 전달
                onClose();  // 수정 완료 후 수정 모달 닫기
                onClose2();
                 window.location.reload();
            } else {
                alert('주문 업데이트에 실패했습니다.');
            }
        } catch (error) {
            console.error('주문 업데이트 중 오류 발생:', error);
            if (error.response) {
                console.error('Error response:', error.response.data);
                console.error('Error status:', error.response.status);
            }
            alert('주문 업데이트 중 오류가 발생했습니다.');
            }
        }

    };



// 상품 체크 이벤트 - 체크항목만 checkProd 넣기
    const handleCheck = (prodList) => (e) => {
        const {prodNo, prodCat, prodName, salePrice, saleStart, saleEnd, priceNo} = prodList;
        handleAvailableProductsCheckboxChange(e, prodList.index);
    }

    // 상품 추가 버튼 클릭 시 처리
    const handleAddProd = () => {
        // availableProductsAllCheck가 true이면 검색된 모든 상품을 추가, false이면 선택된 상품만 추가
        const productsToAdd = availableProductsAllCheck
            ? customPrice
            : customPrice.filter((_, index) => availableProductsCheckItem[index]);

        const newOrderBList = [...modifyItem.orderBList];

        productsToAdd.forEach(product => {
            // 이미 추가된 상품을 중복으로 추가하지 않도록 체크
            if (
                product &&
                product.prodNo &&
                product.priceNo &&
                !newOrderBList.some(item => item.product && item.price.priceNo === product.priceNo)
            ) {
                newOrderBList.push({
                    product: {
                        productNo: product.prodNo,
                        productCategory: product.prodCat,
                        productName: product.prodName,
                        productWriter: product.prodWriter,
                    },
                    orderProductQty: 1, // 수량 기본값
                    price: {
                        priceNo: product.priceNo,
                        customPrice: product.salePrice,
                        startDate: product.saleStart,
                        endDate: product.saleEnd,
                    },
                });
            } else {
                alert('이미 추가된 상품이 있습니다.');
            }
        });

        setModifyItem(prev => ({
            ...prev,
            orderBList: newOrderBList,
        }));

        handleAvailableProductsMasterCheckboxChange({ target: { checked: false } }); // 체크박스 상태 초기화
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

    if (!isOpen) return null;

    return (
        <div className="confirmRegist">
            <div className="fullBody">
                <div className="form-container">
                    <button className="close-btn" onClick={onClose}>&times;</button>
                    <div className="form-header">
                        <h1>주문 수정</h1>


                        <div className="btns">
                            <div className="btn-add2">
                                <button onClick={handleUpdateOrder}>수정 완료</button>
                            </div>
                        </div>



                    </div>

                    <div className="RegistForm">
                        <table className="formTable">
                            <tbody>
                            <tr>
                                <th>주문 번호</th>
                                <td><input type="text" value={modifyItem.orderNo || ''} disabled/></td>
                                <th>주문 등록일</th>
                                <td><input type="text" value={modifyItem.regDate ? new Date(modifyItem.regDate).toLocaleDateString('en-CA') : ''} disabled/></td>
                            </tr>
                            <tr>
                                <th>고객명</th>
                                <td><input value={modifyItem.customer?.customerName || ''} disabled/></td>
                                <th>납품 요청일</th>
                                <td>
                                    <input
                                        type="date"
                                        name="delDate"
                                        value={modifyItem.delDate || ''}
                                        onChange={(e) => {
                                            const now = new Date();
                                            const selectDate = new Date(e.target.value);

                                            if(selectDate < now ){
                                                alert(`납품 요청일을 확인해주세요.`);
                                                return;
                                            }
                                            setModifyItem(prev => ({
                                                    ...prev,
                                                    delDate: e.target.value,
                                                    orderBList: []
                                                })
                                            )}}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <th>담당자</th>
                                <td><input type="text" value={modifyItem.employee?.employeeName || ''} disabled/></td>
                                <th>결재자</th>
                                <td><input type="text" value={modifyItem.confirmerName || '정보 없음'} disabled/></td>
                            </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* 도서 검색 및 추가 */}
                    <div className="bookSearchBox">
                        <div className="bookSearch">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={handleSearchChange}
                                placeholder="상품 검색"
                            />
                            <button type="button" className="btn-common" onClick={handleAddProd}>추가</button>
                        </div>
                    </div>

                    {/* 주문 가능한 상품 목록 */}
                        <div style={{fontWeight: 'bold'}}> 총 {filteredProducts.length} 건</div>

                         <div className="formTableBookList">
                           <table className="formTableList2">
                            <thead>
                            <tr>
                                <th>
                                    <input
                                        type="checkbox"
                                        checked={availableProductsAllCheck}
                                        onChange={handleAvailableProductsMasterCheckboxChange}
                                    />
                                </th>
                                <th>no</th>
                                <th>상품 코드</th>
                                <th>상품 명</th>
                                <th>저자</th>
                                <th>판매가</th>
                                <th>판매 기간</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredProducts.map((prodList, index) => (
                                <tr key={index} className={availableProductsCheckItem[index] ? 'selected-row' : ''}>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={availableProductsCheckItem[index] || false}
                                            onChange={handleCheck({...prodList, index})}
                                        />
                                    </td>
                                    <td style={{display: 'none'}}>{index}</td>
                                    <td>{index + 1}</td>
                                    <td>{prodList.prodNo}</td>
                                    <td>{prodList.prodName}</td>
                                    <td>{prodList.prodWriter}</td>
                                    <td>{prodList.salePrice}</td>
                                    <td>{`${prodList.saleStart} ~ ${prodList.saleEnd}`}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {/* 선택된 상품 목록*/}
                    <div className="RegistFormList">
                        <div style={{fontWeight: 'bold'}}>총 {modifyItem.orderBList?.length || 0} 건</div>
                        <table className="formTableList">
                            <thead>
                            <tr>
                                <th>
                                    <input
                                        type="checkbox"
                                        checked={selectedProductsAllCheck}
                                        onChange={handleSelectedProductsMasterCheckboxChange}
                                    />
                                </th>
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
                                {/*<th>판매가*/}
                                {/*    <button className="sortBtn" onClick={() => sortModalData('salePrice')}>*/}
                                {/*        {modalSortConfig.key === 'salePrice' ? (modalSortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}*/}
                                {/*    </button>*/}
                                {/*</th>*/}
                                <th>총 금액
                                    <button className="sortBtn" onClick={() => sortModalData('totalPrice')}>
                                        {modalSortConfig.key === 'totalPrice' ? (modalSortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                                    </button>
                                </th>
                                <th>판매 시작일</th>
                                <th>판매 종료일</th>
                                {(showDelete || (selectedProductsAllCheck && modifyItem.orderBList?.length > 0)) && (
                                    <button className="delete-btn2 btn-common" onClick={handleDelete}>
                                        삭제
                                    </button>
                                )}
                            </tr>
                            </thead>
                            <tbody>
                            {modifyItem.orderBList && modifyItem.orderBList.map((item, index) => (
                                <tr key={index} className={selectedProductsCheckItem[index] ? 'selected-row' : ''}>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={selectedProductsCheckItem[index] || false}
                                            onChange={(e) => handleSelectedProductsCheckboxChange(e, index)}
                                        />
                                    </td>
                                    <td style={{display: 'none'}}>{index}</td>
                                    <td>{index + 1}</td>
                                    <td>{item.product?.productCategory}</td>
                                    <td>{item.product?.productName}</td>
                                    <td>
                                        <input
                                            type="text"
                                            value={item.orderProductQty}
                                            onChange={handleQuantityChange(index)}
                                        />
                                    </td>
                                    {/*<td>{item.price?.customPrice || 0}</td>*/}
                                    <td>{item.orderProductQty === '' ? 0 : item.orderProductQty * (item.price?.customPrice || 0)}</td>
                                    <td>{item.price?.startDate || '정보 없음'}</td>
                                    <td>{item.price?.endDate || '정보 없음'}</td>
                                </tr>
                            ))}
                            {modifyItem.orderBList?.length > 0 && (
                                <tr style={{fontWeight: 'bold'}}>
                                    <td colSpan="6">합계</td>
                                    <td colSpan="2">
                                        {modifyItem.orderBList.reduce(
                                            (total, item) => total + (item.orderProductQty === '' ? 0 : item.orderProductQty * (item.price?.customPrice || 0)),
                                            0
                                        ).toLocaleString()}원 {/* toLocaleString() : 숫자를 천 단위로 구분하고, 통화 기호 추가 */}
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ModifyOrderModal;