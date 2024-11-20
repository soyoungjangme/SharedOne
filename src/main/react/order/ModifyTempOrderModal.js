import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';
import './Order.css';
import './OrderRegist.css';
import useCheckboxManager from "../js/CheckboxManager";

const ModifyTempOrderModal = ({ohNo, orderNo, isOpen, onClose,onClose2, fetchData, onUpdate }) => {
    const [modifyItem, setModifyItem] = useState({
        ohNo: '',
        orderNo: '',
        regDate: '',
        employee: { employeeName: '', employeeId: '' },
        customer: { customerName: '', customerNo: '' },
        delDate: '',
        confirmStatus: '임시저장',
        remarks: '',
        confirmerId: '',
        orderBList: []
    });

    const [orderCustomer, setOrderCustomer] = useState([]);
    const [customPrice, setCustomPrice] = useState([]);
    const [addCheckProd, setAddCheckProd] = useState([]);
    const [delDate, setDelDate] = useState('');
    const [quantities, setQuantities] = useState({});
    const [confirmerIdOptions, setConfirmerIdOptions] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [orderListCheckboxes, setOrderListCheckboxes] = useState({});
    const [addedListCheckboxes, setAddedListCheckboxes] = useState({});
    const [loading, setLoading] = useState(false); // 로딩 상태 관리

    useEffect(() => {
        if (isOpen && ohNo) {
            const fetchOrderDetails = async () => {
                try {
                    const response = await axios.get(`/order/detail/${ohNo}`);
                    setModifyItem(response.data);
                    setDelDate(response.data.delDate);
                    setAddCheckProd(response.data.orderBList);

                    // 기존 수량을 productNo나 priceNo로 설정
                    const initialQuantities = {};
                    response.data.orderBList.forEach((item) => {
                        initialQuantities[item.price.priceNo] = item.orderProductQty;
                    });
                    setQuantities(initialQuantities);
                } catch (error) {
                    console.error('주문 데이터를 불러오는 중 오류 발생:', error);
                    alert('주문 데이터를 불러오는 중 문제가 발생했습니다.');
                }
            };
            fetchOrderDetails();
        }
    }, [ohNo, isOpen]);


    useEffect(() => {
        const fetchCustomerList = async () => {
            try {
                const response = await axios.get('/customer/customerAll');
                setOrderCustomer(response.data);
            } catch (error) {
                console.error('고객 목록 불러오기 실패:', error);
            }
        };
        fetchCustomerList();
    }, []);

    useEffect(() => {
        const fetchConfirmerList = async () => {
            try {
                const response = await axios.get('/employee/user-info', { withCredentials: true });
                const { data } = await axios.get(`/order/getManagerList/${response.data.userId}`);
                setConfirmerIdOptions(data.map(manager => ({
                    value: manager.employeeId,
                    label: `${manager.employeeName} / ${manager.employeeEmail}`
                })));
            } catch (error) {
                console.error('결재자 목록 불러오기 실패:', error);
            }
        };
        fetchConfirmerList();
    }, []);

    // 고객 변경
    const handleCustomerChange = (e) => {
        setModifyItem(prev => ({
            ...prev,
            customer: {
                ...prev.customer,
                customerNo: e.target.value
            }
        }));
        setAddCheckProd([]);
        setQuantities({});
    };

    const handleDateChange = (e) => {
        setDelDate(e.target.value);
        setAddCheckProd([]);
        setQuantities({});
    };

    useEffect(() => {
        if (modifyItem.customer.customerNo && delDate) {
            const fetchPriceList = async () => {
                try {
                    const response = await axios.post('/order/getPrice', {
                        inputOrderCustomerNo: modifyItem.customer.customerNo,
                        inputOrderDelDate: delDate
                    });
                    setCustomPrice(response.data);
                } catch (error) {
                    console.error('판매가 리스트 불러오기 실패:', error);
                }
            };
            fetchPriceList();
        }
    }, [modifyItem.customer.customerNo, delDate]);


    // 주문 수량 변경 처리
    const handleQuantityChange = (priceNo) => (e) => {
        // 빈 문자열을 허용하고, 숫자가 아닌 입력을 방지
        let qty = e.target.value;
        if (qty !== '' && isNaN(qty)) {
            return; // 숫자가 아닌 값 입력 방지
        }

        setQuantities(prevQuantities => ({ ...prevQuantities, [priceNo]: qty }));
    };

    // 주문 임시저장 처리
    const handleTempSave = async () => {
        const orderBList = addCheckProd.map((addProd, index) => ({
            ohNo: modifyItem.ohNo,
            orderNo: modifyItem.orderNo,
            productNo: addProd.product.productNo,
            priceNo: addProd.price.priceNo,
            orderProductQty: quantities[addProd.price.priceNo] || 0, // 수량
            prodTotal: (quantities[addProd.price.priceNo] || 0) * addProd.price.customPrice
        }));

        // console.log('서버로 전송할 데이터 (임시 저장):', {
        //     ...modifyItem,
        //     orderBList
        // });  // 전송 전 데이터 확인

        try {
            await axios.put(`/order/temp/${modifyItem.ohNo}`, {
                ...modifyItem,
                delDate: delDate,
                confirmStatus: '임시저장',
                orderBList: orderBList
            });
            alert(`주문 번호 ${modifyItem.orderNo} 임시 저장되었습니다.`);
            fetchData();
            onClose();
            onClose2();
            window.location.reload();
        } catch (error) {
            console.error('임시 저장 중 오류 발생:', error.response?.data || error.message);
            alert('임시 저장 중 오류가 발생했습니다: ' + (error.response?.data || error.message));
        }
    };

    // 주문 등록 처리
    const handleSubmit = async () => {
        if (addCheckProd.length === 0) {
            alert("상품을 추가해주세요.");
            return;
        }

        const hasInvalidQty = addCheckProd.some((addProd) => quantities[addProd.price.priceNo] <= 0);
        if (hasInvalidQty) {
            alert("수량은 1개 이상이어야 합니다."); // Update the alert message to reflect the correct validation
            return;
        }


        if(!modifyItem.confirmerId) {
            alert("결재자를 선택해 주세요.");
            return;
        }


        try {
            const orderBList = addCheckProd.map((addProd, index) => ({
                ohNo: modifyItem.ohNo,
                orderNo: modifyItem.orderNo,
                productNo: addProd.product.productNo,
                priceNo: addProd.price.priceNo,
                orderProductQty: quantities[addProd.price.priceNo] || 0,
                prodTotal: (quantities[addProd.price.priceNo] || 0) * addProd.price.customPrice
            }));

            setLoading(true);

            await axios.put(`/order/temp/${modifyItem.ohNo}`, {
                ...modifyItem,
                delDate: delDate,
                confirmStatus: '대기',
                orderBList: orderBList
            });
            alert(`주문 번호 ${modifyItem.orderNo} 등록되었습니다.`);
            // 업데이트된 데이터를 전달하여 상세보기 창에 반영
            onUpdate({ ...modifyItem, orderBList }); // 업데이트된 데이터를 콜백으로 전달
            fetchData();
            onClose();
            onClose2();
            window.location.reload();
        } catch (error) {
            console.error('임시 저장 중 오류 발생:', error.response?.data || error.message);
            alert('임시 저장 중 오류가 발생했습니다: ' + (error.response?.data || error.message));
        } finally {
            setLoading(false);
        }
        window.location.reload();

    };

    // 임시저장 삭제
    const handleDeleteOrder = async () => {
        if (window.confirm('주문을 삭제하시겠습니까?')) {
            try {
                await axios.delete(`/order/delete/${ohNo}`);
                alert(`주문 번호 ${orderNo} 삭제되었습니다.`);

                // Order 컴포넌트에 삭제된 주문 업데이트 반영
                fetchData();
                onUpdate({ ohNo });
                onClose();
                onClose2();
            } catch (error) {
                console.error('삭제 중 오류 발생:', error);
            }
        }
        window.location.reload();

    };

    // 추가 버튼
    const handleAddProd = () => {
        setAddCheckProd(prevAddCheckProd => {
            const existingPriceNos = new Set(prevAddCheckProd.map(item => item.price.priceNo));
            const newCheckProd = [];
            let hasDuplicates = false;

            if (orderListAllCheck) {
                searchProd.forEach(element => {
                    if (!existingPriceNos.has(element.priceNo)) {
                        newCheckProd.push({
                            product: element.product,
                            price: {
                                priceNo: element.priceNo,
                                customPrice: element.customPrice,
                                startDate: element.startDate,
                                endDate: element.endDate
                            }
                        });
                        existingPriceNos.add(element.priceNo);
                    } else {
                        hasDuplicates = true;
                    }
                });
            } else {
                Object.keys(orderListCheckItem).forEach(index => {
                    if (orderListCheckItem[index]) {
                        const item = searchProd[index];
                        if (item && !existingPriceNos.has(item.priceNo)) {
                            newCheckProd.push({
                                product: item.product,
                                price: {
                                    priceNo: item.priceNo,
                                    customPrice: item.customPrice,
                                    startDate: item.startDate,
                                    endDate: item.endDate
                                }
                            });
                            existingPriceNos.add(item.priceNo);
                        } else {
                            hasDuplicates = true;
                        }
                    }
                });
            }

            if (hasDuplicates) {
                alert('이미 추가된 항목이 있습니다.');
            }

            // 새로 추가된 상품의 수량을 1로 설정
            const resetQuantities = newCheckProd.reduce((acc, _, index) => {
                acc[prevAddCheckProd.length + index] = 1;
                return acc;
            }, {});

            setQuantities(prevQuantities => ({
                ...prevQuantities,
                ...resetQuantities
            }));

            return [...prevAddCheckProd, ...newCheckProd];
        });

        setOrderListCheckboxes({});
        handleOrderListMasterCheckboxChange({ target: { checked: false } });
    };



    // 체크박스 삭제
    // const handleAddProdDelete = () => {
    //     setAddCheckProd(prevAddCheckProd => {
    //         if(!orderAddAllCheck){
    //             const checkedIndexes = Object.keys(orderAddCheckItem).filter(key => orderAddCheckItem[key]);
    //             const checkedPriceNos = checkedIndexes.map(index => prevAddCheckProd[index].price.priceNo);
    //
    //             // 체크박스 상태 초기화
    //             setOrderListCheckboxes({});
    //             handleOrderAddMasterCheckboxChange({ target: { checked: false } });
    //
    //             return prevAddCheckProd.filter(item => !checkedPriceNos.includes(item.price.priceNo));
    //         } else {
    //             if(prevAddCheckProd.length > 0){
    //                 return []; // 전체 삭제
    //             } else {
    //                 alert(`삭제할 항목이 없습니다.`);
    //                 return prevAddCheckProd; // 이전 상태 유지
    //             }
    //         }
    //     });
    // };

    const handleAddProdDelete = () => {
        setAddCheckProd(prevAddCheckProd => {
            if (!orderAddAllCheck) {
                const checkedIndexes = Object.keys(orderAddCheckItem).filter(key => orderAddCheckItem[key]);
                const checkedPriceNos = checkedIndexes.map(index => prevAddCheckProd[index].price.priceNo);

                // 삭제된 상품의 수량만 제거
                setQuantities(prevQuantities => {
                    const newQuantities = { ...prevQuantities };
                    checkedIndexes.forEach(index => delete newQuantities[prevAddCheckProd[index].price.priceNo]);
                    return newQuantities;
                });

                return prevAddCheckProd.filter(item => !checkedPriceNos.includes(item.price.priceNo));
            } else {
                if (prevAddCheckProd.length > 0) {
                    // 모든 상품을 삭제할 때 수량 초기화
                    setQuantities({});
                    return [];
                } else {
                    alert(`삭제할 항목이 없습니다.`);
                    return prevAddCheckProd;
                }
            }
        });

        setOrderListCheckboxes({});
        handleOrderAddMasterCheckboxChange({ target: { checked: false } });
    };

    // 체크박스
    const {
        allCheck: orderListAllCheck,
        checkItem: orderListCheckItem,
        handleMasterCheckboxChange: handleOrderListMasterCheckboxChange,
        handleCheckboxChange: handleOrderListCheckboxChange,
    } = useCheckboxManager(setCustomPrice);

    const {
        allCheck: orderAddAllCheck,
        checkItem: orderAddCheckItem,
        showDelete: orderAddShowDelete,
        handleMasterCheckboxChange: handleOrderAddMasterCheckboxChange,
        handleCheckboxChange: handleOrderAddCheckboxChange,
        handleDelete: handleOrderAddDelete
    } = useCheckboxManager(setAddCheckProd);

    // const handleSearchChange = (e) => {
    //     setSearchTerm(e.target.value);
    // };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);

        // 검색 시 체크박스를 초기화
        setOrderListCheckboxes({});
        handleOrderListMasterCheckboxChange({ target: { checked: false } });
    };

    const searchProd = customPrice.filter(product =>
        product.product.productName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return isOpen ? ( loading ? (
        <div className="loading-overlay">

             <div class="item">
                <div class="loader1"></div>
            </div>

            {/* <div class="item">
                <div class="loader2"></div>
            </div> */}

            {/* <div class="item">
                <div class="loader3"></div>
            </div> */}
            
        </div>) : (
        <div className="confirmRegist">
            <div className="fullBody">
                <div className="form-container">
                    <button className="close-btn" onClick={onClose}> &times; </button>
                    <div className="form-header">
                        <h1>임시 저장</h1>
                            <div className="btns">
                                              <div className="btn-add2">
                                                  <button type="button" onClick={handleDeleteOrder}>삭제</button>
                                                  <button type="button" onClick={handleTempSave}>임시 저장</button>
                                                  <button type="button" onClick={handleSubmit}>등록하기</button>

                                              </div>
                                          </div>
                    </div>

                    <div className="RegistForm">
                        <table className="formTable">
                            <tbody>
                            <tr>
                                <th colSpan="1"><label htmlFor="orderCustomer">고객사 명</label></th>
                                <td colSpan="3">
                                    <select id="orderCustomer" value={modifyItem.customer.customerNo || ''} onChange={handleCustomerChange}>
                                        <option value="">선택</option>
                                        {orderCustomer.map(customer => (
                                            <option key={customer.customerNo} value={customer.customerNo}>
                                                {customer.customerName}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                                <th colSpan="1"><label htmlFor="delDate">납품 요청일</label></th>
                                <td colSpan="3"><input type="date" id="delDate" value={delDate || ''}
                                                       onChange={(e) => {
                                                           const now = new Date();
                                                           const selectDate = new Date(e.target.value);

                                                           if(selectDate < now ){
                                                               alert(`납품 요청일을 확인해주세요.`);
                                                               return;
                                                           }

                                                           setDelDate(e.target.value);
                                                       }}/>
                                </td>
                            </tr>
                            <tr>
                                <th colSpan="1"><label htmlFor="employeeName">담당자명</label></th>
                                <td colSpan="3"><input type="text" value={modifyItem.employee.employeeName} readOnly /></td>
                                <th colSpan="1"><label htmlFor="confirmerId">결재자</label></th>
                                <td colSpan="3">
                                    <Select
                                        name="confirmerId"
                                        options={confirmerIdOptions}
                                        value={confirmerIdOptions.find(option => option.value === modifyItem.confirmerId)}
                                        onChange={(option) => setModifyItem({...modifyItem, confirmerId: option.value})}
                                    />
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="bookSearchBox">
                        <div className="bookSearch">
                            <input type="text" value={searchTerm} onChange={handleSearchChange} placeholder="상품 검색"/>
                            <button type="button" className="btn-common" onClick={handleAddProd}>추가</button>
                        </div>
                    </div>

                    <div className="RegistFormList">
                        <div style={{fontWeight: 'bold'}}>고객별 주문 가능한 상품 리스트 (총 {searchProd.length}건)</div>
                         <div className="formTableBookList">
                                                        <table className="formTableList2">
                                  <thead className="formTableList2thead">
                            <tr>
                                <th><input type="checkbox" checked={orderListAllCheck}
                                           onChange={(e) => handleOrderListMasterCheckboxChange(e)}/></th>
                                <th>No</th>
                                <th>상품 코드</th>
                                <th>상품 명</th>
                                <th>저자</th>
                                <th>판매가</th>
                                <th>판매 기간</th>
                            </tr>
                            </thead>
                            <tbody>
                            {searchProd.map((product, index) => (
                                <tr key={index}>
                                    <td><input type="checkbox" checked={orderListCheckItem[index] || false}
                                               onChange={(e) => handleOrderListCheckboxChange(e)}/></td>
                                    <td style={{display: 'none'}}>{index}</td>
                                    <td>{index + 1}</td>
                                    <td>{product.product.productNo}</td>
                                    <td>{product.product.productName}</td>
                                    <td>{product.product.productWriter}</td>
                                    <td>{product.customPrice.toLocaleString()}</td>
                                    <td>{`${product.startDate} ~ ${product.endDate}`}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        </div>
                    </div>

                    <div className="RegistFormList">
                        <div style={{fontWeight: 'bold'}}>추가된 상품 리스트 (총 {addCheckProd.length}건)</div>
                        {orderAddShowDelete && Object.values(orderAddCheckItem).some(isChecked => isChecked) && (
                            <button className="delete-btn btn-common" onClick={handleAddProdDelete}>삭제</button>
                        )}
                        <table className="formTableList" style={{marginTop: '5px'}}>
                            <thead>
                            <tr>
                                <th><input type="checkbox" checked={orderAddAllCheck}
                                           onChange={(e) => handleOrderAddMasterCheckboxChange(e)}/></th>
                                <th>No</th>
                                <th>상품 종류</th>
                                <th>상품 명</th>
                                <th>상품 수량</th>
                                <th>총액</th>
                                <th>판매 시작 날짜</th>
                                <th>판매 종료 날짜</th>
                            </tr>
                            </thead>
                            <tbody>
                            {addCheckProd.map((addProd, index) => {
                                const qty = quantities[addProd.price.priceNo] || 0;
                                return (
                                    <tr key={index}>
                                        <td><input type="checkbox" checked={orderAddCheckItem[index] || false}
                                                   onChange={(e) => handleOrderAddCheckboxChange(e)}/></td>
                                        <td style={{display: 'none'}}>{index}</td>
                                        <td>{index + 1}</td>
                                        <td>{addProd.product.productCategory}</td>
                                        <td>{addProd.product.productName}</td>
                                        <td>
                                            <input type="text" value={qty} onChange={handleQuantityChange(addProd.price.priceNo)} />
                                        </td>
                                        <td>{(addProd.price.customPrice * qty).toLocaleString()}</td>
                                        <td>{addProd.price.startDate}</td>
                                        <td>{addProd.price.endDate}</td>
                                    </tr>
                                );
                            })}
                            <tr style={{fontWeight: 'bold'}}>
                                <td colSpan="5">합계</td>
                                <td colSpan="3">
                                    {addCheckProd.reduce((total, addProd, index) => {
                                        const qty = quantities[addProd.price.priceNo] || 0;
                                        return total + (addProd.price.customPrice * qty);
                                    }, 0).toLocaleString()} 원
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )) : null;
};

export default ModifyTempOrderModal;