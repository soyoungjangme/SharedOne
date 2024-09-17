import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Order.css';
import './OrderRegist.css';
import './OrderModalDetail.css';
import useCheckboxManager from '../js/CheckboxManager';


function ModifyOrderModal2({ orderData, isOpen, onClose, onUpdate }) {

    const [customPrice, setCustomPrice] = useState([]); // 상품 리스트
    const [checkProd, setCheckProd] = useState([]);     // 체크한 상품들
    const [addCheckProd, setAddCheckProd] = useState([]); // 추가된 상품 리스트
    const [quantities, setQuantities] = useState({});    // 각 상품의 수량

    const [modifyItem, setModifyItem] = useState({
        orderNo: '',
        regDate: '',
        employee: { employeeName: '', employeeId: '' },
        customer: { customerName: '', customerNo: '' },
        delDate: '',
        confirmStatus: '',
        remarks: '',
        confirmerId: '',
        confirmChangeDate: null,
        orderBList: []
    });

// 주문 가능한 상품 목록을 위한 체크박스
    const {
        allCheck: availableProductsAllCheck,
        checkItem: availableProductsCheckItem,
        handleMasterCheckboxChange: handleAvailableProductsMasterCheckboxChange,
        handleCheckboxChange: handleAvailableProductsCheckboxChange,
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

    useEffect(() => {
        if (orderData) {
            setModifyItem(orderData);
        }
    }, [orderData]);

// 삭제
    const handleDelete = () => {
        const newOrderBList = modifyItem.orderBList.filter((_, index) => !selectedProductsCheckItem[index]);
        setModifyItem(prev => ({
            ...prev,
            orderBList: newOrderBList
        }));
        // 체크박스 상태 초기화
        setSelectedProductsCheckItem({});
    };

// 기존의 주문 데이터 불러오기
    useEffect(() => {
        if (orderData) {
            const customerNo = orderData.customer?.customerNo;
            if (customerNo) {
                fetchCustomerProducts(customerNo);  // 고객 번호로 상품 목록을 불러옴
            } else {
                console.error('고객 번호가 없습니다.');
            }
            setModifyItem(orderData);
        }
    }, [orderData]);

// 고객에 맞는 상품 리스트 가져오기
    const fetchCustomerProducts = async (customerNo) => {
        try {
            const response = await axios.post('/order/getPrice', {
                inputOrderCustomerNo: parseInt(customerNo, 10)
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
                    saleEnd: value.endDate
                }));
                setCustomPrice(getOrderCustomer);
                setCheckProd(new Array(getOrderCustomer.length).fill(false)); // 체크박스 초기 상태 설정
            } else {
                console.error('상품 목록을 불러오는 중 오류 발생:', OrderCustomerData);
            }
        } catch {
            console.error('애초에 fetchCustomerProducts 호출 오류');
        }
    };

// 주문 가능한 상품
    const [prod, setProd] = useState([]);
    useEffect ( () => {
        let effectProd = async() => {
            let getProd = await fetch('/product/products').then(response => response.json());
            setProd(getProd);
        }
        effectProd();
    },[]);

    const handleQuantityChange = (index) => (e) => {
        const qty = e.target.value || 0;
        setModifyItem(prev => {
            const updatedOrderBList = [...prev.orderBList]; // 배열 복사
            updatedOrderBList[index] = {
                ...updatedOrderBList[index], // 기존 객체 복사
                orderProductQty: parseInt(qty, 10) // 수량 업데이트
            };
            return {
                ...prev,
                orderBList: updatedOrderBList // 업데이트된 리스트로 상태 변경
            };
        });
    };



// 검색
    const [searchTerm, setSearchTerm] = useState('');
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredProducts = customPrice.filter(product =>
        product.prodName.toLowerCase().includes(searchTerm.toLowerCase())
    );

// 입력 값 변경
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setModifyItem(prev => ({
            ...prev,
            [name]: value
        }));
    };

// 업데이트
    const handleUpdate = async () => {
        const updatedOrder = {
            ...modifyItem,
            // 선택한 상품 리스트와 납품 요청일을 포함한 주문 데이터를 구성
            orderBList: modifyItem.orderBList.map((item) => ({
                productNo: item.product.productNo,
                orderProductQty: parseInt(item.orderProductQty, 10),
                priceNo: item.price.priceNo
            })),
            delDate: modifyItem.delDate // 납품 요청일 추가
        };

        try {
            const response = await axios.post('/order/updateOrder', updatedOrder, {
                headers: { 'Content-Type': 'application/json' }
            });
            console.log('Response:', response.data);
            onUpdate(updatedOrder); // 부모 컴포넌트에 업데이트된 주문 전달
            onClose(); // 모달 닫기
        } catch (error) {
            console.error('주문 수정에 실패했습니다:', error);
            alert('주문 수정에 실패했습니다. 다시 시도해주세요.');
        }
    };

// 상품 체크 이벤트 - 체크항목만 checkProd 넣기
    const handleCheck = (prodList) => (e) => {
        const {prodNo, prodCat, prodName, salePrice, saleStart, saleEnd, priceNo} = prodList;
        handleAvailableProductsCheckboxChange(e, prodList.index);

        setCheckProd(prevCheckProd => {
            const newCheckProd = [...prevCheckProd];
            if (e.target.checked) {
                newCheckProd.push({prodNo, prodCat, prodName, salePrice, saleStart, saleEnd, priceNo});
            } else {
                const index = newCheckProd.findIndex(item => item.priceNo === priceNo);
                if (index > -1) {
                    newCheckProd.splice(index, 1);
                }
            }
            return newCheckProd;
        });
    }

// 추가 버튼
    const handleAddProd = () => {
        const productsToAdd = availableProductsAllCheck ? customPrice : checkProd;

        const newOrderBList = modifyItem.orderBList.concat(
            productsToAdd
                .filter(product => product && product.prodNo)
                .filter(product => !modifyItem.orderBList.some(item =>
                    item.product && item.product.productNo === product.prodNo
                ))
                .map(product => ({
                    product: {
                        productNo: product.prodNo,
                        productCategory: product.prodCat,
                        productName: product.prodName,
                        productWriter: product.prodWriter
                    },
                    orderProductQty: 1,
                    price: {
                        customPrice: product.salePrice,
                        startDate: product.saleStart,
                        endDate: product.saleEnd
                    }
                }))
        );

        setModifyItem(prev => ({
            ...prev,
            orderBList: newOrderBList
        }));

        // 체크박스 및 checkProd 초기화
        handleAvailableProductsMasterCheckboxChange({ target: { checked: false } });
        setCheckProd([]);
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
                            <div className="btn-add">
                                <button onClick={handleUpdate}>수정하기</button>
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
                                <td><input type="text" value={modifyItem.regDate || ''} disabled/></td>
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
                                        onChange={(e) => setModifyItem(prev => ({
                                            ...prev,
                                            delDate: e.target.value
                                        }))}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <th>담당자</th>
                                <td><input type="text" value={modifyItem.employee?.employeeName || ''} disabled/></td>
                                <th>결재자</th>
                                <td><input type="text" value={modifyItem.confirmerId || '정보 없음'} disabled/></td>
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
                    <div className="RegistFormList">
                        <div style={{fontWeight: 'bold'}}> 총 {filteredProducts.length} 건</div>
                        <table className="formTableList">
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
                                            type="number"
                                            value={item.orderProductQty}
                                            onChange={handleQuantityChange(index)}
                                        />
                                    </td>
                                    <td>{item.price?.customPrice || 0}</td>
                                    <td>{item.orderProductQty * (item.price?.customPrice || 0)}</td>
                                    <td>{`${item.price?.startDate || '정보 없음'} ~ ${item.price?.endDate || '정보 없음'}`}</td>
                                </tr>
                            ))}
                            {modifyItem.orderBList?.length > 0 && (
                                <tr style={{fontWeight: 'bold'}}>
                                    <td colSpan="6">합계</td>
                                    <td colSpan="2">
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
    );
}

export default ModifyOrderModal2;