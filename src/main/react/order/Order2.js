import React, {useState, useEffect} from 'react';
import ReactDOM from "react-dom/client";
import './Order.css'
import './OrderRegist.css'
import './OrderModalDetail.css'
import useCheckboxManager from "../js/CheckboxManager";
import axios from 'axios';
import Select from "react-select";
/*
import '../js/pagecssReal.css';
*/

function Order2({orderNo, onClose, initialData}) {
    const {
        allCheck: orderListAllCheck,
        checkItem: orderListCheckItem,
        handleMasterCheckboxChange: handleOrderListMasterCheckboxChange,
        handleCheckboxChange: handleOrderListCheckboxChange,
        setAllCheck: setAllCheckMal,
        setShowDelete: setShowDeleteMal,
        setCheckItem: setCheckItemMal
    } = useCheckboxManager(setOrder);

    const {
        allCheck: orderAddAllCheck,
        checkItem: orderAddCheckItem,
        showDelete: orderAddShowDelete,
        handleMasterCheckboxChange: handleOrderAddMasterCheckboxChange,
        handleCheckboxChange: handleOrderAddCheckboxChange,
        handleDelete: handleOrderAddDelete
    } = useCheckboxManager(setOrder);

    // 주문 데이터를 저장하는 상태
    const [order, setOrder] = useState([]);

    const [userInfo, setUserInfo] = useState(null);

    const fetchUserInfo = async () => {
        const response = await axios.get('/employee/user-info', { withCredentials: true });
        setUserInfo(response.data);
    }

    //주문목록 불러오기
    useEffect( () => {

        let effectOrder = async () => {
            try {
                let data = await fetch('/order/orderList').then(res => res.json());

                const transfomData = data.map(item => ({
                    orderNo: item.orderNo,
                    customerN: item.customer.customerName,
                    manager: item.employee.employeeName,
                    status: item.confirmStatus,
                    date: item.regDate
                }));

                setOrder(transfomData);
                console.log(transfomData);
            } catch (error) {
                console.error('error발생함 : ', error);
            }
        }

        effectOrder();

        const fetchConfirmerIdList = async () => {
            const response = await axios.get('/employee/user-info', { withCredentials: true });
            console.log(response);
            const {data} = await axios.get(`/order/getManagerList/${response.data.userId}`);
            console.log(data);
            setConfirmerIdList(data);
            setConfirmerIdOptions(
                data.map(manager => ({value:manager.employeeId, label: manager.employeeName+' / ' + manager.employeeEmail}))
            );
        };
        fetchConfirmerIdList();
    }, []);

    /*==============jsy조건 검색==============*/
    const [prod, setProd] = useState([]);
    const [mycustomer, setMycustomer] = useState([]);
    const [confirmState] = useState(['임시저장', '대기', '승인', '반려']);//결재상태배열

    //상품명 목록 Data
    useEffect(() => {
        let effectProd = async () => {
            let getProd = await fetch('/product/products').then(res => res.json());
            setProd(getProd);
        }
        effectProd();
    }, []);

    //고객명 목록 data
    useEffect(() => {
        let effectCustomer = async () => {
            let getCustomer = await fetch('/customer/customerAll').then(res => res.json());
            setMycustomer(getCustomer);//주문필터
            setOrderCustomer(getCustomer);//주문등록폼
        }
        effectCustomer();
    }, []);


    //입력된 조건 데이터 보내기
    const [form, setForm] = useState({});

    const [orderCustomer, setOrderCustomer] = useState([]);//고객번호목록
    const [registCustomer, setRegistCustomer] = useState(''); //선택된 고객명 저장
    const [customPrice, setCustomPrice] = useState([]);//판매가리스트
    const [addCheckProd, setAddCheckProd] = useState([]); //체크한 상품 추가된 리스트
    const [delDate, setDelDate] = useState('');//납품요청일 상태관리
    const [confirmerId, setConfirmerId] = useState('');  // 결재자 ID 상태 추가


    const handleDateChange = (e) => {
        setDelDate(e.target.value);

        setAddCheckProd([]); //추가리스트 초기화
    }

    // 고객명 변경 시 고객번호 저장
    const handleCustomerChange = (e) => {
        setRegistCustomer(e.target.value);
        //목록 호출하는게 customoPrice임 ㅇㄴ

        setAddCheckProd([]); //추가리스트 초기화
        setCustomPrice([]); //판매가리스트 초기화
        setQuantities({}); //수량 초기화
    };

    const [my, setMy]= useState({id: '', name: ''});

    //담당자명 세션에서 불러오기
    useEffect(() => {
        const fetchData = async () => {
            try {
                // 세션에서 ID 가져오기
                const idRes = await axios.get('/order/getMyId');
                const myId = idRes.data;

                // 이름 가져오기
                const nameRes = await axios.post('/order/getMyName', { myId }); // 객체로 전달

                setMy({ id: myId, name: nameRes.data });
            } catch (error) {
                console.error('Error', error);
            }
        };
        fetchData();
    }, []);

    // 고객이 선택되면 상품+판매가를 가져오는 함수
    useEffect(() => {
        console.log("zz",delDate);

        const now = new Date();
        if(new Date(delDate) < now){
            alert("")
            return setDelDate('');
        }

        if (registCustomer) {
            const fetchPrice = async () => {
                try {
                    const resp = await axios.post('/order/getPrice', {
                        inputOrderCustomerNo: parseInt(registCustomer, 10),
                        inputOrderDelDate: delDate || null
                    });

                    const OrderCustomerData = resp.data;

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
                        console.error('등록폼 에러', OrderCustomerData);
                    }
                } catch (error) {
                    console.error('API 호출 오류', error);
                }
            };
            fetchPrice();
        } else {
            setCustomPrice([]); // 고객이 없을 때만 초기화
        }
    }, [registCustomer, delDate]); // registCustomer가 변경될 때만 실행


    //추가 클릭
    const handleAddProd = () => {
        if(!delDate){
            alert("납품요청일을 입력해주십시오.");
            return;
        }
        setAddCheckProd(prevAddCheckProd => {
            // 기존 addCheckProd에서 priceNo만 Set에 저장
            const existingPriceNos = new Set(prevAddCheckProd.map(item => item.priceNo));

            const newCheckProd = [];//중복 아닌 것들만 담을 용도

            let hasDuplicates = false; //중복확인

            if (orderListAllCheck) { // 체크 전체선택
                for (const element of customPrice) {
                    const {prodNo, prodCat, prodName, salePrice, saleStart, saleEnd, priceNo} = element; // 필요한 값 추출

                    //existingPriceNos에 priceNo 유무
                    if (existingPriceNos.has(priceNo)) { //중복
                        hasDuplicates = true;
                    } else { //중복 아닌 항목은 newCheckProd에 추가
                        newCheckProd.push({ prodNo, prodCat, prodName, salePrice, saleStart, saleEnd, priceNo });
                        existingPriceNos.add(priceNo); // Set에도 추가하여 중복 방지
                    }
                }
            } else {
                // 체크된 항목만 처리
                Object.keys(orderListCheckItem).forEach(index => {
                    if (orderListCheckItem[index]) {
                        const item = customPrice[index]; // 인덱스로 항목 찾기
                        if (item && !existingPriceNos.has(item.priceNo)) {
                            newCheckProd.push(item);
                            existingPriceNos.add(item.priceNo);
                        } else {
                            hasDuplicates = true;
                        }
                    }
                });
            }

            // 중복 항목이 있었으면 알림을 띄움
            if (hasDuplicates) {
                alert("이미 추가된 항목이 있습니다.");
            }

            // 새로운 항목만 addCheckProd에 추가
            return [...prevAddCheckProd, ...newCheckProd];
        });
    };

    //상품 수량
    const [quantities, setQuantities] = useState({});
    const handleQuantityChange = (index) => (e) => {
        const qty = Number(e.target.value) || 0;
        setQuantities(prevQuantities => ({
            ...prevQuantities,
            [index]: qty
        }));
    };

    //주문등록 - 상품검색
    const [searchTerm, setSearchTerm] = useState('');
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const searchProd = customPrice.filter(product =>
        product.prodName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 추가리스트 체크 삭제
    const handleAddProdDelete = () => {
        setAddCheckProd(prevAddCheckProd => {
            let newAddCheckProd = prevAddCheckProd;

            if(!orderAddAllCheck){

                const checkedIndexes = Object.keys(orderAddCheckItem).filter(key => orderAddCheckItem[key]);//체크된 항목의 인덱스를 추출

                const checkedPriceNos = checkedIndexes.map(index => prevAddCheckProd[index].priceNo);//해당 인덱스의 priceNo를 추출

                const newAddCheckProd = prevAddCheckProd.filter(item => !checkedPriceNos.includes(item.priceNo)); //체크 안한 것만 남기기

                return newAddCheckProd; //개별 삭제 후 반환

            }else {
                if(addCheckProd.length > 0){
                    return []; //전체 삭제
                }else{
                    alert(`삭제할 항목이 없습니다.`);
                    return prevAddCheckProd; //이전 상태 유지
                }
            }

        });
    };


    // ---  모달창 띄우는 스크립트

    const [isVisibleCSV, setIsVisibleCSV] = useState(false);

    const handleAddClickCSV = () => {
        setIsVisibleCSV((prevState) => !prevState);
    };


    const [isVisible, setIsVisible] = useState(false);

    const handleCloseClick = () => {
        setCheckItemMal(false);
        setShowDeleteMal(false);
        setAllCheckMal(false);
        setIsVisible(false);
        setRegistCustomer(''); //고객선택 초기화
        setDelDate(''); //납품요청일 초기화
        setAddCheckProd([]); //추가리스트 초기화
    };
    const [selectedOrderNo, setSelectedOrderNo] = useState(null);
    const [selectedOrderData, setSelectedOrderData] = useState(null);

    // --- 모달창 띄우는 스크립트

// 임시 저장 파트 시작
    const [modifyItem, setModifyItem] = useState(initialData || {});

    useEffect(() => {
        if (initialData) {
            setModifyItem(initialData);

            // 고객 정보 설정
            if (initialData.customer) {
                setRegistCustomer(initialData.customer.customerNo);
            }

            // 납품 요청일
            setDelDate(initialData.delDate);

            // 결재자 설정
            setModifyItem(prev => ({
                ...prev,
                confirmerId: initialData.confirmerId || ''
            }));

            // 주문 상품 리스트 설정
            if (initialData.orderBList) {
                const savedProducts = initialData.orderBList.map(item => ({
                    prodNo: item.product.productNo,
                    priceNo: item.price.priceNo,
                    prodCat: item.product.productCategory,
                    prodName: item.product.productName,
                    salePrice: item.price.customPrice,
                    saleStart: item.price.startDate,
                    saleEnd: item.price.endDate,
                    orderProductQty: item.orderProductQty
                }));

                setAddCheckProd(savedProducts);

                const newQuantities = savedProducts.reduce((acc, item, index) => {
                    acc[index] = item.orderProductQty || 0;
                    return acc;
                }, {});

                setQuantities(newQuantities);
            }
        }
    }, [initialData]);


    const handleAddClick = async (orderNo = null) => {
        if (orderNo) {
            await fetchOrderDetail(orderNo);
            setSelectedOrderNo(orderNo);
            setModifyItem(prev => ({
                ...prev,
                orderNo: orderNo // orderNo 설정
            }));
        }
        setIsVisible(true);
    };

// 임시 저장 데이터
    const fetchOrderDetail = async (orderNo) => {
        try {
            const response = await axios.get(`/order/detail/${orderNo}`);
            const orderData = response.data;
            setModifyItem(orderData);
            setRegistCustomer(orderData.customer.customerNo);
            setDelDate(orderData.delDate);
            setModifyItem({
                ...orderData,
                confirmerId: orderData.confirmerId || '', // 결재자 정보 추가
            });

            if (Array.isArray(orderData.orderBList)) {
                const savedProducts = orderData.orderBList.map(item => ({
                    prodNo: item.product.productNo,
                    priceNo: item.price.priceNo,
                    prodCat: item.product.productCategory,
                    prodName: item.product.productName,
                    prodWriter: item.product.productWriter,
                    salePrice: item.price.customPrice,
                    saleStart: item.price.startDate,
                    saleEnd: item.price.endDate,
                    orderProductQty: item.orderProductQty
                }));

                setAddCheckProd(savedProducts);

                const newQuantities = savedProducts.reduce((acc, item, index) => {
                    acc[index] = item.orderProductQty || 0;
                    return acc;
                }, {});

                setQuantities(newQuantities);
            }
        } catch (error) {
            console.error('임시저장 주문 정보 가져오기 실패:', error);
        }
    };

// 임시 저장 업데이트
    const handleUpdateOrder = async (status) => {
        console.log('handleUpdateOrder 함수 시작');

        // 간단한 유효성 검사
        if (!registCustomer) {
            alert("고객을 선택해 주세요.");
            return;
        }

        if (!delDate) {
            alert("납품 요청일을 입력해 주세요.");
            return;
        }

        if (addCheckProd.length === 0) {
            alert("상품을 선택해 주세요.");
            return;
        }

        const invalidQuantities = addCheckProd.some((_, index) => {
            const qty = quantities[index] || 0;
            return qty <= 0;
        });

        if (invalidQuantities) {
            alert("모든 상품의 수량을 1개 이상 입력해 주세요.");
            return;
        }

        // orderBList 생성
        const orderBList = addCheckProd.map((addProd, index) => {
            const orderProdQty = quantities[index] || 0;
            return {
                productNo: addProd.prodNo,
                priceNo: addProd.priceNo,
                orderProductQty: orderProdQty,
                prodTotal: orderProdQty * addProd.salePrice,
            };
        });

        // 순수한 JavaScript 객체로 업데이트 데이터 생성
        const orderData = {
            orderNo: modifyItem.orderNo,
            inputDelDate: delDate,
            inputCustomerNo: registCustomer,
            inputManager: my.id,
            inputConfirmer: modifyItem.confirmerId,
            inputStatus: status,
            orderBList,
        };

        try {
            // 업데이트 요청
            const response = await axios.put('/order/update', orderData);
            console.log('리스폰스 데이터:', JSON.stringify(response.data, null, 2));
            alert(`주문번호 ${modifyItem.orderNo}가 수정되었습니다.`);
            onClose(); // 창 닫기
        } catch (error) {
            console.error("주문 수정 중 오류 발생:", error);
            alert("주문 수정 중 오류가 발생했습니다. 다시 시도해 주세요.");
        }
    };

    const [confirmerIdList, setConfirmerIdList] = useState([]);
    const [confirmerIdOptions, setConfirmerIdOptions] = useState();

    const handleManagerChange = (name, value) => {
        setModifyItem((prev) => ({ ...prev, [name]: value }));
    }

    return (
        <div className="confirmRegist">
            <div className="fullBody">
                <div className="form-container">
                    <button className="close-btn" onClick={onClose}> &times;
                    </button>
                    <div className="form-header">
                        <h1>임시 저장</h1>
                        <div className="btns">
                            <div className="btn-add2">
                                {/* 임시 저장 버튼 */}
                                <button
                                    type="button"
                                    onClick={() => {
                                        handleUpdateOrder("임시저장");
                                    }}
                                >
                                    임시 저장
                                </button>
                            </div>
                            <div className="btn-close">
                                {/* 등록하기 버튼 */}
                                <button
                                    type="button"
                                    onClick={() => {
                                        handleUpdateOrder("대기"); // 주문 번호가 있으면 update
                                    }}
                                >
                                    등록하기
                                </button>
                            </div>
                        </div>
                    </div>

                    {/*주문 정보 - 헤더*/}
                    <div className="RegistForm">
                        <table className="formTable">
                            <tbody>
                            <tr>
                                <th colSpan="1"><label htmlFor="orderCustomer">고객사 명</label></th>
                                <td colSpan="3">
                                    <select id="orderCustomer" value={registCustomer || ''} onChange={handleCustomerChange}>
                                        <option value="">선택</option>
                                        {orderCustomer.map(customer => (
                                            <option key={customer.customerNo} value={customer.customerNo}>
                                                {customer.customerName}
                                            </option>
                                        ))}
                                    </select>
                                </td>

                                <th colSpan="1"><label htmlFor="delDate">납품 요청일</label></th>
                                <td colSpan="3"><input type="date" id="delDate" value={delDate} onChange={handleDateChange} /></td>
                            </tr>

                            <tr>
                                <th colSpan="1"><label htmlFor="">담당자명</label></th>
                                <td colSpan="3"><input type="text" id="" value={my.name} style={{border: 'none', background: 'white'}} /></td>

                                <th colSpan="1"><label htmlFor="">결재자</label></th>
                                <td colSpan="3">
                                    <Select name="confirmerId" options={confirmerIdOptions} placeholder="결재자 선택"
                                            onChange={(option) => handleManagerChange('confirmerId', option.value)} />
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
                        <div style={{fontWeight: 'bold'}}> 총 {searchProd?.length || 0} 건</div>
                        <table className="formTableList">
                            <thead>
                            <tr>
                                <th><input type="checkbox" checked={orderListAllCheck} onChange={(e) => handleOrderListMasterCheckboxChange(e)}/></th>
                                <th>no</th>
                                <th>상품 코드</th>
                                <th>상품 명</th>
                                <th>저자</th>
                                <th>판매가</th>
                                <th>판매 기간</th>
                            </tr>
                            </thead>
                            <tbody>
                            {searchProd.map((prodList, index) => (
                                <tr key={index} className={orderListCheckItem[index] ? 'selected-row' : ''}>
                                    <td><input type="checkbox" id="checkProdList" checked={orderListCheckItem[index] || false } onChange={(e) => handleOrderListCheckboxChange(e)}/></td>
                                    <td style={{display: 'none'}}>{index}</td>
                                    <td>{index + 1}</td>
                                    <td>{prodList.prodNo}</td>
                                    <td>{prodList.prodName}</td>
                                    <td>{prodList.prodWriter}</td>
                                    <td>{prodList.salePrice}</td>
                                    <td>{prodList.saleStart} ~ {prodList.saleEnd}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {/*담아둔 상품 리스트*/}
                    <div className="RegistFormList">

                        <div style={{fontWeight: 'bold'}}> 총 {addCheckProd?.length || 0} 건</div>
                        {orderAddShowDelete && Object.values(orderAddCheckItem).some(isChecked => isChecked) &&
                            <button className="delete-btn btn-common" onClick={() => {handleAddProdDelete(); handleOrderAddDelete();}}>삭제</button>}

                        <table className="formTableList" style={{marginTop: '5px'}}>

                            <thead>
                            <tr>
                                <th><input type="checkbox" checked={orderAddAllCheck} onChange={(e)=>handleOrderAddMasterCheckboxChange(e)}/></th>
                                <th>no</th>
                                <th>상품 종류</th>
                                <th>상품 명</th>
                                <th>상품 수량</th>
                                <th>총 액</th>
                                <th>판매시작날짜</th>
                                <th>판매종료날짜</th>
                            </tr>
                            </thead>
                            <tbody>
                            {addCheckProd.map((addProd, index) => {
                                console.log(`렌더링 중: 상품명 = ${addProd.prodName}, 수량 = ${quantities[index] || 0}`);
                                const qty = quantities[index] || 0; // index에 맞는 수량 가져옴
                                return (
                                    <tr key={index} className={orderAddCheckItem[index] ? 'selected-row' : ''}>
                                        <td><input type="checkbox" id="checkProdList"
                                                   checked={orderAddCheckItem[index] || false}
                                                   onChange={(e) => handleOrderAddCheckboxChange(e)}/></td>
                                        <td style={{display: 'none'}}>{index}</td>
                                        <td>{index + 1}</td>
                                        <td>{addProd.prodCat}</td>
                                        <td>{addProd.prodName}</td>
                                        <td>
                                            <input type="number" id={`prodQty_${index}`} value={qty}
                                                   onChange={handleQuantityChange(index)} placeholder="수량"/>
                                        </td>
                                        <td>{addProd.salePrice * qty}</td>
                                        <td>{addProd.saleStart}</td>
                                        <td>{addProd.saleEnd}</td>
                                    </tr>
                                );
                            })}
                            <tr style={{fontWeight: 'bold'}}>
                                <td colSpan="5"> 합계</td>
                                <td colSpan="3">
                                    {addCheckProd.reduce((total, addProd, index) => {
                                        const qty = quantities[index] || 0; //수량
                                        return total + (addProd.salePrice * qty);
                                    },0).toLocaleString()}원
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Order2;