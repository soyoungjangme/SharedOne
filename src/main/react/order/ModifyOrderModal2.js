import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Order.css';
import './OrderRegist.css';
import './OrderModalDetail.css';
import useCheckboxManager from '../js/CheckboxManager';


function ModifyOrderModal2({ orderData, isOpen, onClose, onUpdate }) {

    const [modifyItem, setModifyItem] = useState({
        orderNo: '',
        regDate: '',
        employee: { employeeName: '', employeeId: '' },
        customer: { customerName: '', customerNo: '' },
        delDate: '',
        confirmStatus: '',
        remarks: '',
        confirmChangeDate: null,
        orderBList: []
    });

    const {
        allCheck,
        setAllCheck,
        checkItem,
        setCheckItem,
        showDelete,
        handleMasterCheckboxChange,
        handleCheckboxChange,
        handleDelete,
    } = useCheckboxManager();

    const [customPrice, setCustomPrice] = useState([]); // 상품 리스트
    const [checkProd, setCheckProd] = useState([]);     // 체크한 상품들
    const [addCheckProd, setAddCheckProd] = useState([]); // 추가된 상품 리스트
    const [quantities, setQuantities] = useState({});    // 각 상품의 수량

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

    const handleCheck = (prodNo, prodCat, prodName, salePrice, saleStart, saleEnd) => (e) => {
        setCheckProd(prevCheckProd => {
            const newCheckProd = [...prevCheckProd];
            if (e.target.checked) {
                newCheckProd.push({ prodNo, prodCat, prodName, salePrice, saleStart, saleEnd });
            } else {
                const index = newCheckProd.findIndex(item => item.prodNo === prodNo);
                if (index > -1) {
                    newCheckProd.splice(index, 1);
                }
            }
            return newCheckProd;
        });
    };

    // 주문 가능한 상품
    const [prod, setProd] = useState([]);
    useEffect ( () => {
        let effectProd = async() => {
            let getProd = await fetch('/product/products').then(res => res.json());
            setProd(getProd);
        }
        effectProd();
    },[]);

    // 수량
    const handleQuantityChange = (index) => (e) => {
        const qty = e.target.value || 0;
        setQuantities(prevQuantities => ({ ...prevQuantities, [index]: qty }));
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

    // 추가
    const handleAddProd = () => {
        setAddCheckProd(prevAddCheckProd => [...prevAddCheckProd, ...checkProd]); // 기존 리스트에 체크된 항목 추가
    };

    // 업데이트
    const handleUpdate = async () => {
        const updatedOrder = {
            ...modifyItem,
            orderBList: addCheckProd.map((prod, index) => ({
                productNo: prod.prodNo,
                orderProductQty: parseInt(quantities[index] || 0, 10),
                price: { customPrice: prod.salePrice }
            }))
        };
        try {
            const response = await axios.post('/order/updateOrder', updatedOrder, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('Response:', response.data);
            onUpdate(updatedOrder);
            onClose();
        } catch {
            console.error('Error');
            alert('주문 수정에 실패했습니다. 다시 시도해주세요.');
        }
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
                                        onChange={handleInputChange}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <th>담당자명</th>
                                <td><input type="text" value={modifyItem.employee?.employeeName || ''} disabled/></td>
                                <th>결재 상태</th>
                                <td>
                                    <select
                                        name="confirmStatus"
                                        value={modifyItem.confirmStatus || ''} disabled
                                    >
                                        <option value="대기">대기</option>
                                        <option value="승인">승인</option>
                                        <option value="반려">반려</option>
                                    </select>
                                </td>
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
                    <div className="RegistFormList" onChange={handleMasterCheckboxChange}>
                        <div style={{fontWeight: 'bold'}}> 총 {filteredProducts.length} 건</div>
                        <table className="formTableList">
                            <thead>
                            <tr>
                                <th><input type="checkbox"/></th>
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
                                <tr key={index} className={checkItem[index] ? 'selected-row' : ''}>
                                    <td>
                                        <input
                                            type="checkbox"
                                            data-id={prodList.prodNo}
                                            checked={checkItem[prodList.prodNo] || false}
                                            onChange={(e) => handleCheckboxChange(e)}  // `useCheckboxManager`의 함수를 그대로 사용
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
                        <table className="formTableList" onChange={handleMasterCheckboxChange}>
                            <thead>
                            <tr>
                                <th><input type="checkbox" checked={allCheck} onChange={handleMasterCheckboxChange}/></th>
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
                            {modifyItem.orderBList && modifyItem.orderBList.map((item, index) => (
                                <tr key={index} className={checkItem[index] ? 'selected-row' : ''}>
                                    <td>
                                        <input
                                            type="checkbox"
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
                                            onChange={(e) => handleQuantityChange(index, e.target.value)}
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