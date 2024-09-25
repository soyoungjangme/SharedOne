import React, { useState, useEffect } from 'react';
import ReactDOM from "react-dom/client";
import './Order.css'
import './OrderRegist.css'
import './OrderModalDetail.css'
import useCheckboxManager from "../js/CheckboxManager";
import axios from 'axios';
import DetailOrderModal from './DetailOrderModal';
import ModifyOrderModal from './ModifyOrderModal';
import ModifyTempOrderModal from './ModifyTempOrderModal';
import Select from "react-select";
/*
import '../js/pagecssReal.css';
*/


function Order() {

    // 주문 데이터 및 체크박스 관리 상태
    const {
        allCheck,
        checkItem,
        showDelete,
        handleMasterCheckboxChange,
        handleCheckboxChange,
        handleDelete
    } = useCheckboxManager(setOrder);

    // 주문 목록에서의 체크박스 관리 상태
    const {
        allCheck: orderListAllCheck,
        checkItem: orderListCheckItem,
        handleMasterCheckboxChange: handleOrderListMasterCheckboxChange,
        handleCheckboxChange: handleOrderListCheckboxChange,
        setAllCheck: setAllCheckMod,
        setCheckItem: setCheckItemMod,
        setShowDelete: setShowDeleteMod
    } = useCheckboxManager(setOrder);

    // 추가 상품 리스트에 대한 체크박스 관리 상태
    const {
        allCheck: orderAddAllCheck,
        checkItem: orderAddCheckItem,
        showDelete: orderAddShowDelete,
        handleMasterCheckboxChange: handleOrderAddMasterCheckboxChange,
        handleCheckboxChange: handleOrderAddCheckboxChange,
        handleDelete: handleOrderAddDelete,
        setAllCheck: setAddAllCheckMod,
        setCheckItem: setAddCheckItemMod,
        setShowDelete: setAddShowDeleteMod
    } = useCheckboxManager(setOrder);

    // 주문 데이터를 저장하는 상태
    const [order, setOrder] = useState([]);
    console.log("order" + JSON.stringify(order));

    // 사용자 정보 상태
    const [userInfo, setUserInfo] = useState(null);

    // 사용자 정보 불러오기 함수
    const fetchUserInfo = async () => {
        const response = await axios.get('/employee/user-info', { withCredentials: true });
        setUserInfo(response.data);
    }

    // 주문 목록을 서버에서 불러오는 함수
    useEffect(() => {

        let effectOrder = async () => {
            try {
                let data = await fetch('/order/orderList').then(res => res.json());
                console.log("fetched data ", data);
                const transfomData = data.map(item => ({
                    ohNo: item.ohNo,
                    orderNo: item.orderNo,
                    customerN: item.customer.customerName,
                    manager: item.employee.employeeName,
                    status: item.confirmStatus,
                    confirmChangeDate: item.confirmChangeDate,
                    managerId: item.employee.employeeId,
                    managerGrade: item.employee.authorityGrade
                }));

                setOrder(transfomData);
                console.log("tranfomData ", transfomData);

            } catch (error) {
                console.error('error발생함 : ', error);
            }

        }

        effectOrder();


        // 결재자 리스트 불러오기
        const fetchConfirmerIdList = async () => {
            const response = await axios.get('/employee/user-info', { withCredentials: true });
            console.log(response);
            const { data } = await axios.get(`/order/getManagerList/${response.data.userId}`);
            console.log(data);
            setConfirmerIdList(data);// 결재자 리스트 상태에 저장
            setConfirmerIdOptions(
                data.map(manager => ({ value: manager.employeeId, label: manager.employeeName + ' / ' + manager.employeeEmail }))
            );
        };
        fetchConfirmerIdList();

    }, []);



    // --- 테이블 정렬 기능

    // 정렬 상태와 방향을 저장하는 상태
    const [sortConfig, setSortConfig] = useState({ key: '', direction: 'descending' });

    // 정렬 함수
    const sortData = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }

        const sortOrder = [...order].sort((a, b) => {
            let aValue = a[key];
            let bValue = b[key];

            // 날짜 처리
            if (key === 'confirmChangeDate') {
                aValue = new Date(aValue);
                bValue = new Date(bValue);
            }


            // 문자열 비교
            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return direction === 'ascending'
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            }

            // 숫자 비교
            return direction === 'ascending' ? aValue - bValue : bValue - aValue;
        });

        setOrder(sortOrder);
        setSortConfig({ key, direction });
    };


    // --- 테이블 정렬 기능


    /*==============jsy조건 검색==============*/
    const [prod, setProd] = useState([]);
    const [mycustomer, setMycustomer] = useState([]);

    const [confirmState] = useState(['임시저장', '대기', '승인', '반려', '반려(처리완료)']);//결재상태배열
    const [selectedConfirm, setSelectedConfrim] = useState('');

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

    const handleChange = (e) => {
        let copy = { ...form, [e.target.id]: e.target.value };
        setForm(copy);
    }

    // 검색 버튼 클릭 시 서버로 검색 조건 전송
    const handleSearchBtn = async () => {
        setSelectedIndex(false); //내글보기 쪽 필터 초기화

        //서버로 데이터 보내기
        const date = form.date || null;
        const orderNo = form.orderNo ? form.orderNo.replace(/\s+/g, '') : null;
        const prod = form.prod || null;
        const mycustomer = form.mycustomer || null;
        const manager = form.manager ? form.manager.replace(/\s+/g, '') : null;
        const status = form.selectedConfirm || null;

        const res = await axios.post('/order/searchSelect', {
            inputDate: date,
            inputOrderNo: orderNo,
            inputProdName: prod,
            inputCustomerName: mycustomer,
            inputManager: manager,
            inputState: status
        }); //{매개변수 : 전달 값}

        const searchOrderData = res.data; //이렇게 먼저 묶고 반복 돌려야함.

        if (Array.isArray(searchOrderData)) {
            const getSearchOrder = searchOrderData.map(item => ({ //res.data.map안된다는 소리
                ohNo: item.ohNo,
                orderNo: item.orderNo,
                customerN: item.customer.customerName,
                manager: item.employee.employeeName,
                status: item.confirmStatus,
                confirmChangeDate: item.confirmChangeDate,
                managerId: item.employee.employeeId,
                managerGrade: item.employee.authorityGrade
            }))

            setOrder(getSearchOrder);
            setCurrentPage(1);
        } else {
            console.log('서버로부터 받은 데이터가 배열이 아닙니다.', searchOrderData);
        }
        setCurrentPage(1);
    };


    // =========== 조회 입력 초기화 ===========
    const handleReset = () => {
        setForm({
            inputDate: '',
            inputOrderNo: '',
            inputProdNo: '',
            inputCustomerNo: '',
            inputManager: '',
            inputState: ''
        });

        setCurrentPage(1);
    };

    // 초기화 후 목록도 리셋
    useEffect(() => {
        const isFormReset = Object.values(form).every(value => value === '');
        // 특정 조건에서만 실행
        if (isFormReset && selectedIndex === null) {  // selectedIndex가 변경된 경우에는 실행하지 않음
            handleSearchBtn();
        }
    }, [form]);


    // 포맷팅하는 함수
    const formatPrice = (price) => {
        return price ? Number(price).toLocaleString() : '';
    };

    /*---------------jsy조건 끝---------------*/

    /*==============jsy주문 등록 폼==============*/

    const [orderCustomer, setOrderCustomer] = useState([]);//고객번호목록
    const [registCustomer, setRegistCustomer] = useState(''); //선택된 고객명 저장
    const [customPrice, setCustomPrice] = useState([]);//판매가리스트
    const [addCheckProd, setAddCheckProd] = useState([]); //체크한 상품 추가된 리스트
    const [delDate, setDelDate] = useState('');//납품요청일 상태관리

    // 납품 요청일 변경 시 상태 업데이트
    const handleDateChange = (e) => {
        setDelDate(e.target.value);
        setAddCheckProd([]); //추가리스트 초기화
    }

    const customerOptions = mycustomer.map(cust => ({
        value: cust.customerNo,
        label: cust.customerName
    }));

    // 고객명 변경 시
    const handleCustomerChange = (customerNo) => {

        setRegistCustomer(customerNo);

        setAddCheckProd([]); //추가리스트 초기화
        setCustomPrice([]); //판매가리스트 초기화
        setQuantities({}); //수량 초기화
        setDelDate(''); //납풉요청일 초기화

        //체크박스 초기화
        setAllCheckMod(false);
        setCheckItemMod(false);
        setShowDeleteMod(false);
        setAddAllCheckMod(false);
        setAddCheckItemMod(false);

    };



    // 세션 정보 가져오기
    const [my, setMy] = useState({ id: '', name: '', role: '' });
    const [roleList, setRoleList] = useState([]);
    console.log("ㅋㅋ글쓴이 값이야 " + order.managerId);
    console.log("ㅋㅋ세션값이야" + JSON.stringify(my));
    //담당자명 세션에서 불러오기
    useEffect(() => {

        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // 세션에서 ID 가져오기
            const idRes = await axios.get('/order/getMyId');
            const myId = idRes.data;

            // 이름 가져오기
            const nameRes = await axios.post('/order/getMyName', { myId }); // 객체로 전달
            const RoleRes = await axios.get('/order/getMyRole'); // 권한 가져오기


            const response = await axios.get(`/order/getManagerList/${myId}`);

            const data = response.data; // Assuming response.data contains the list
            console.log(data);
            // employeeId와 authorityGrade만 추출
            const filteredList = data.map(data => ({
                employeeId: data.employeeId,
                authorityGrade: data.authorityGrade,
            }));

            setRoleList(filteredList);
            console.log("Role List" + roleList.employeeId);
            console.log("Role List" + roleList.employeeId);




            setMy({ id: myId, name: nameRes.data, role: RoleRes.data });
        } catch (error) {
            console.error('Error', error);
        }
    };






    // 고객이 선택되면 상품+판매가를 가져오는 함수
    useEffect(() => {

        const now = new Date();
        if (new Date(delDate) < now) {
            alert("납품요청일을 확인해주십시오.")
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
        if (!delDate) {
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
                    const { prodNo, prodCat, prodName, salePrice, saleStart, saleEnd, priceNo } = element; // 필요한 값 추출

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

        //추가 클릭 후 체크 초기화
        setAllCheckMod(false);
        setCheckItemMod(false);
    };

    //상품 수량
    const [quantities, setQuantities] = useState({});
    // 주문 수량 변경 처리
    const handleQuantityChange = (priceNo) => (e) => {
        // 빈 문자열을 허용하고, 숫자가 아닌 입력을 방지
        let qty = e.target.value;
        if (qty !== '' && isNaN(qty)) {
            return; // 숫자가 아닌 값 입력 방지
        }

        setQuantities(prevQuantities => ({ ...prevQuantities, [priceNo]: qty }));
    };


    const [loading, setLoading] = useState(false); // 로딩 상태 관리

    //등록하기 & 임시저장
    const handleRegistOrder = async (orderStatus) => {

        console.log(modifyItem.status);
        try {

            //데이터 유효성 검사(등록하기)
            if (orderStatus === "대기") {
                const hasInvalidQty = addCheckProd.some((product) => {
                    const qty = quantities[product.priceNo] || 0; // product의 priceNo를 이용해 수량을 가져옴

                    console.log(`상품 ID: ${product.priceNo}, 수량: ${qty}`);

                    return qty <= 0; // 수량이 0 이하인 경우
                });

                if (!registCustomer || !delDate || hasInvalidQty || !addCheckProd.length || !modifyItem.confirmerId) {
                    alert("모두 입력해 주세요.");
                    return;
                }
            }

            //추가된 리스트 반복 돌리기
            const orderBList = addCheckProd.map((addProd, index) => {
                const orderProdNo = addProd.prodNo || 0; // 상품번호
                const orderProdQty = quantities[addProd.priceNo] || 0; // 각 상품에 맞는 수량 가져오기
                const orderProdTotal = orderProdQty * addProd.salePrice; // 수량 * 판매가

                return {
                    productNo: orderProdNo,
                    orderProductQty: orderProdQty,
                    prodTotal: orderProdTotal
                };
            });
            console.log("오더바디리스트 ", orderBList);
            setLoading(true);

            const response = await axios.post('/order/registOrder', { // insert into oh
                inputOrderNo: null, //새로 등록이므로 null입력하면 시퀀스생성함
                inputDelDate: delDate || null,//납품요청일
                inputCustomerNo: registCustomer || null,//주문고객번호
                inputManager: my.id || null,
                inputConfirmer: modifyItem.confirmerId || null, //결재자
                inputStatus: orderStatus,
                orderBList: orderBList //ob데이터 배열 전달
            });

            const { orderNo, ohNo } = response.data;
            handleCloseClick(); // 등록 창 닫기 및 초기화

            if (orderStatus === "대기") {
                alert(`주문번호 ${orderNo} 등록이 완료되었습니다.`);
            } else {
                alert(`주문번호 ${orderNo} 임시저장되었습니다.`);
            }
        } catch (error) {
            console.error("주문등록 중 오류발생", error);
        } finally {
            setLoading(false);
        }
        window.location.reload();

    };

    //주문등록 - 상품검색
    const [searchTerm, setSearchTerm] = useState('');
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);

        setAllCheckMod(false);
        setCheckItemMod(false);
    };

    useEffect(() => {
        const handleSearchChange = (e) => {
            setSearchTerm(e.target.value);

            setAllCheckMod(false);
            setCheckItemMod(false);
        };
    }, [searchTerm]);


    const searchProd = customPrice.filter(product =>
        product.prodName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 추가리스트 선택 삭제
    const handleAddProdDelete = () => {

        setAddCheckProd(prevAddCheckProd => {

            if (!orderAddAllCheck) {
                // 체크된 항목의 인덱스 추출
                const checkedIndexes = Object.keys(orderAddCheckItem).filter(priceNo => orderAddCheckItem[priceNo]);

                // 해당 인덱스의 priceNo 추출
                const checkedPriceNos = checkedIndexes.map(index => prevAddCheckProd[index].priceNo);

                // 체크되지 않은 항목만 남기기
                const newAddCheckProd = prevAddCheckProd.filter(item => !checkedPriceNos.includes(item.priceNo));

                // 삭제된 항목들의 수량을 0으로 초기화
                setQuantities(prevQuantities => {
                    const updatedQuantities = { ...prevQuantities };
                    checkedPriceNos.forEach(priceNo => {
                        updatedQuantities[priceNo] = 0; // 삭제된 항목의 수량만 0으로 설정
                    });
                    return updatedQuantities;
                });

                return newAddCheckProd; // 개별 삭제 후 반환

            } else {
                // 전체 삭제 처리
                if (addCheckProd.length > 0) {
                    setQuantities({}); // 전체 삭제 시 수량도 전체 초기화
                    return []; // 전체 삭제
                } else {
                    alert(`삭제할 항목이 없습니다.`);
                    return prevAddCheckProd; // 이전 상태 유지
                }
            }
        });
    };




    /*---------------jsy주문 등록 끝---------------*/


    // ---  모달창 띄우는 스크립트

    const [isVisibleCSV, setIsVisibleCSV] = useState(false);

    const handleAddClickCSV = () => {
        setIsVisibleCSV((prevState) => !prevState);
    };

    // 주문 등록 모달 상태
    const [isVisible, setIsVisible] = useState(false);

    const handleAddClick = () => {
        setIsVisible(true);
    };


    const handleCloseClick = () => {
        setAllCheckMod(false);
        setCheckItemMod(false);
        setShowDeleteMod(false);
        setAddAllCheckMod(false);
        setAddCheckItemMod(false);


        setIsVisible(false);
        setRegistCustomer(''); //고객선택 초기화
        setDelDate(''); //납품요청일 초기화
        setAddCheckProd([]); //추가리스트 초기화
    };

    // 수정 모달 상태 관리
    const [modifyItem, setModifyItem] = useState({
        ohNo: 0,
        orderNo: 0,
        title: '',
        details: '',
        manager: '',
        status: '',
        date: '',
        confirmerId: ''
    });


    // 상세보기 모달 상태 관리
    const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
    const [isModifyModalVisible, setIsModifyModalVisible] = useState(false);
    const [isModifyTempOrderModalOpen, setIsModifyTempOrderModalOpen] = useState(false);
    const [selectedOrderNo, setSelectedOrderNo] = useState(null);
    const [selectedOhNo, setSelectedOhNo] = useState(null);
    const [selectedOrderData, setSelectedOrderData] = useState(null);

    // 주문 상세보기 열기
    const handleDetailView = (orderNo, ohNo) => {
        setSelectedOrderNo(orderNo);  // 주문 번호 설정
        setSelectedOhNo(ohNo); //주문시퀀스 설정
        setIsDetailModalVisible(true);  // 모달 열기
    };

    const handleModifyCloseClick = () => {
        setIsDetailModalVisible(false);
    };

    // 주문 수정 모달 열기
    const handleOpenModifyModal = (orderData) => {
        setSelectedOrderData(orderData);
        setIsDetailModalVisible(false); // 상세 조회 모달 닫기
        setIsModifyModalVisible(true); // 수정 모달 열기
    };

    const handleCloseModifyModal = () => {
        setIsModifyModalVisible(false);
        console.log('Closing the modal...');
    };

    // 임시 저장 모달 열기
    const handleOpenModifyTempOrderModal = (orderData) => {
        setSelectedOrderData(orderData);
        setIsModifyTempOrderModalOpen(true);
        setIsDetailModalVisible(false);
    };

    const handleCloseModifyTempOrderModal = () => {
        console.log('Closing the modal...');
        console.log('isModifyTempOrderModalOpen is now:', isModifyTempOrderModalOpen);  // 상태 확인
        setIsModifyTempOrderModalOpen(false);
    };

    // 유선화 - 끝

    // --- 모달창 띄우는 스크립트

    // 수정된 주문 데이터 업데이트
    const handleOrderUpdate = (updatedOrder) => {
        // 삭제된 주문을 목록에서 제거
        setOrder(prevOrders => prevOrders.filter(order => order.orderNo !== updatedOrder.orderNo));
        setIsModifyTempOrderModalOpen(false);

        // 수정된 주문 데이터를 반영하여 상태 업데이트
        setOrder(prevOrders => {
            const updatedOrders = prevOrders.map(order =>
                order.orderNo === updatedOrder.orderNo ? updatedOrder : order
            );
            return updatedOrders;
        });

        // 상세보기 모달에 수정된 데이터를 반영
        setSelectedOrderData(updatedOrder); // 이 부분을 추가하여 상세보기 모달에 수정된 데이터를 전달

        // 최신 데이터를 다시 불러오기
        fetchData();  // 서버에서 새로운 데이터를 가져오는 함수 (선택사항)

        setIsModifyModalVisible(false);  // 일반 주문 수정 모달 닫기
        setIsDetailModalVisible(true);  // 상세보기 모달 다시 열기

    };
    // 유선화 끝

    // 결재자 ID 리스트 상태
    const [confirmerIdList, setConfirmerIdList] = useState([]);
    const [confirmerIdOptions, setConfirmerIdOptions] = useState();

    // 결재자 변경 처리
    const handleManagerChange = (name, value) => {
        setModifyItem((prev) => ({ ...prev, [name]: value }));
    }


    // =============================================== 페이지 네이션

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(30); // 페이지당 항목 수

    // 전체 페이지 수 계산
    const totalPages = Math.ceil(order.length / itemsPerPage);

    // 현재 페이지에 맞는 데이터 필터링
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = order.slice(indexOfFirstItem, indexOfLastItem);

    console.log("current items: ", currentItems);

    // 페이지 변경 핸들러
    const handlePageChange = (pageNumber) => {

        setCurrentPage(pageNumber);
    };

    // 페이지네이션 버튼 렌더링
    const renderPageNumbers = () => {
        let pageNumbers = [];
        const maxButtons = 5; // 고정된 버튼 수

        // 맨 처음 페이지 버튼
        pageNumbers.push(
            <span
                key="first"
                onClick={() => handlePageChange(1)}
                className={`pagination_link ${currentPage === 1 ? 'disabled' : ''}`}
            >
                &laquo;&laquo; {/* 두 개의 왼쪽 화살표 */}
            </span>
        );

        // 이전 페이지 버튼
        pageNumbers.push(
            <span
                key="prev"
                onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                className={`pagination_link ${currentPage === 1 ? 'disabled' : ''}`}
            >
                &laquo; {/* 왼쪽 화살표 */}
            </span>
        );

        // 페이지 수가 4 이하일 경우 모든 페이지 표시
        if (totalPages <= 4) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(
                    <span
                        key={i}
                        onClick={() => handlePageChange(i)}
                        className={`pagination_link ${i === currentPage ? 'pagination_link_active' : ''}`}
                    >
                        {i}
                    </span>
                );
            }
        } else {
            // 페이지 수가 5 이상일 경우 유동적으로 변경
            let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
            let endPage = startPage + maxButtons - 1;

            if (endPage > totalPages) {
                endPage = totalPages;
                startPage = Math.max(1, endPage - maxButtons + 1);
            }

            // 시작 페이지와 끝 페이지에 대한 페이지 버튼 추가
            for (let i = startPage; i <= endPage; i++) {
                pageNumbers.push(
                    <span
                        key={i}
                        onClick={() => handlePageChange(i)}
                        className={`pagination_link ${i === currentPage ? 'pagination_link_active' : ''}`}
                    >
                        {i}
                    </span>
                );
            }

            // 마지막 페이지가 현재 페이지 + 1보다 큰 경우 '...'과 마지막 페이지 표시
            if (endPage < totalPages) {
                pageNumbers.push(<span className="pagination_link">...</span>);
                pageNumbers.push(
                    <span
                        key={totalPages}
                        onClick={() => handlePageChange(totalPages)}
                        className={`pagination_link ${currentPage === totalPages ? 'pagination_link_active' : ''}`}
                    >
                        {totalPages}
                    </span>
                );
            }
        }

        // 다음 페이지 버튼
        pageNumbers.push(
            <span
                key="next"
                onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                className={`pagination_link ${currentPage === totalPages ? 'disabled' : ''}`}
            >
                &raquo; {/* 오른쪽 화살표 */}
            </span>
        );

        // 맨 마지막 페이지 버튼
        pageNumbers.push(
            <span
                key="last"
                onClick={() => handlePageChange(totalPages)}
                className={`pagination_link ${currentPage === totalPages ? 'disabled' : ''}`}
            >
                &raquo;&raquo; {/* 두 개의 오른쪽 화살표 */}
            </span>
        );

        return pageNumbers;
    };

    const roleHierarchy = { S: 4, A: 3, B: 2, C: 1, D: 0 }; // Define the hierarchy

    const handleButtonClick = (item) => {
        const trimmedStatus = item.status.trim();
        const isManager = my.id === item.managerId;

        switch (trimmedStatus) {
            case '승인':
                console.log('승인 다 볼수있엉');
                handleDetailView(item.orderNo, item.ohNo);
                break;
            case '대기':
                console.log('대기');
                console.log(roleHierarchy[my.role]);
                console.log(roleHierarchy[item.managerGrade]);
                if (roleHierarchy[my.role] > roleHierarchy[item.managerGrade] || isManager) {
                    console.log("Access granted for 대기");
                    handleDetailView(item.orderNo, item.ohNo);
                } else {
                    alert("접근 권한이 없습니다.");
                }
                break;
            case '임시저장':
                console.log('임시저장');
                if (isManager) {
                    handleDetailView(item.orderNo, item.ohNo);
                } else {
                    alert("접근 권한이 없습니다.");
                }
                break;
            case '반려':
                console.log('반려');
                console.log(roleHierarchy[my.role]);
                console.log(roleHierarchy[item.managerGrade]);
                if ((roleHierarchy[my.role] > roleHierarchy[item.managerGrade]) || isManager) {
                    handleDetailView(item.orderNo, item.ohNo);
                } else {
                    alert("접근 권한이 없습니다.");
                }
                break;
            case '반려(처리완료)':
                console.log('반려(처리완료)');
                console.log(roleHierarchy[my.role]);
                console.log(roleHierarchy[item.managerGrade]);
                if ((roleHierarchy[my.role] > roleHierarchy[item.managerGrade]) || isManager) {
                    handleDetailView(item.orderNo, item.ohNo);
                } else {
                    alert("접근 권한이 없습니다.");
                }
                break;
            default:
                console.log('Unknown status');
                break;
        }
    };


    // ------------------------------------ 멀티 셀렉트

    const [selectedIndex, setSelectedIndex] = useState(-1);

    // 선택 초기화 핸들러
    const handleResetSelection = () => {
        setSelectedIndex(-1);
        sendSearchCriteria(-1); // 선택 초기화에 따른 서버 요청
    };

    // Handle button click to update selected index and send the corresponding value
    const handleButtonClick2 = (index) => {
        setSelectedIndex(index);
        sendSearchCriteria(index);
        handleReset();
    };

    // Send a POST request with the selected order status
    const sendSearchCriteria = async (index) => {

        let myId2 = null;
        let myId3 = null;
        if (index === 0) {
            myId2 = getStatusByIndex(index);
            // myId2 = "jsy";
        } else {
            myId3 = getStatusByIndex(index);
        }

        const res = await axios.post('/order/searchSelect', {
            inputState: myId3 || null,
            inputMyId: myId2 || null
        }); //{매개변수 : 전달 값}

        const confirmRes = res.data;
        console.log(confirmRes);

        if (Array.isArray(confirmRes)) {
            const getConfirmRes = confirmRes.map(item => ({ //res.data.map안된다는 소리
                ohNo: item.ohNo,
                orderNo: item.orderNo,
                customerN: item.customer.customerName,
                manager: item.employee.employeeName,
                status: item.confirmStatus,
                confirmChangeDate: item.confirmChangeDate,
                managerId: item.employee.employeeId,
                managerGrade: item.employee.authorityGrade
            }))

            setOrder(getConfirmRes);
            setCurrentPage(1);
        } else {
            console.log('서버로부터 받은 데이터가 배열이 아닙니다.', confirmRes);
        }
        setCurrentPage(1);
    };


    const getStatusByIndex = (index) => {
        switch (index) {
            case 0:
                return my.id; // 내 글 보기 (세션 my.id)
            case 1:
                return "임시저장"; // 임시저장
            case 2:
                return "대기"; // 대기
            case 3:
                return "반려"; // 반려
            case 4:
                return "반려(처리완료)"; // 반려(처리완료)
            case 5:
                return "승인"; // 승인
            default:
                return "";
        }
    };


    return (
        <div>

            <div className="pageHeader"><h1><i className="bi bi-chat-square-text-fill"></i> 주문 관리</h1></div>

            <div className="main-container">
                <div className="filter-containers">
                    <div className="filter-container">
                        <div className="filter-items">

                            <div className="filter-item">
                                <label className="filter-label" htmlFor="date">등록 일자</label>
                                <input className="filter-input" type="date" id="date" value={form.date || ''}
                                    onChange={handleChange} onKeyDown={(e) => { if (e.key === "Enter") { handleSearchBtn(); } }} required />
                            </div>

                            <div className="filter-item">
                                <label className="filter-label" htmlFor="orderNo">주문 번호</label>
                                <input className="filter-input" type="text" id="orderNo" value={form.orderNo || ''}
                                    onChange={handleChange} onKeyDown={(e) => { if (e.key === "Enter") { handleSearchBtn(); } }} placeholder="주문 번호" required />
                            </div>

                            <div className="filter-item">
                                <label className="filter-label" htmlFor="mycustomer">고객명</label>
                                <input className="filter-input" type="text" id="mycustomer" value={form.mycustomer || ''}
                                    onChange={handleChange} onKeyDown={(e) => { if (e.key === "Enter") { handleSearchBtn(); } }} placeholder="고객명" required />

                                {/*<select id="mycustomer" className="filter-input" value={form.mycustomer || ''}
                                        onChange={handleChange}>
                                    <option value="">선택</option>
                                    {mycustomer.map((customer) => (
                                        <option key={customer.customerNo} value={customer.customerNo}>
                                            {customer.customerName}
                                        </option>
                                    ))}
                                </select>*/}
                            </div>

                            <div className="filter-item">
                                <label className="filter-label" htmlFor="manager">담당자명</label>
                                <input className="filter-input" type="text" id="manager" value={form.manager || ''}
                                    onChange={handleChange} onKeyDown={(e) => { if (e.key === "Enter") { handleSearchBtn(); } }} placeholder="담당자명" required />
                            </div>

                            <div className="filter-item">
                                <label className="filter-label" htmlFor="prod">상품명</label>
                                <input className="filter-input" type="text" id="prod" value={form.prod || ''}
                                    onChange={handleChange} onKeyDown={(e) => { if (e.key === "Enter") { handleSearchBtn(); } }} placeholder="상품명" required />



                                {/*<select id="prod" className="filter-input" value={form.prod || ''}
                                        onChange={handleChange}>
                                    <option value="">선택</option>
                                    {prod.map((product) => (
                                        <option key={product.productNo} value={product.productNo}>
                                            {product.productName}
                                        </option>
                                    ))}
                                </select>*/}
                            </div>

                            <div className="filter-item">
                                <label className="filter-label" htmlFor="selectedConfirm">결재 여부</label>
                                <select className="filter-select" id="selectedConfirm"
                                    value={form.selectedConfirm || ''} onChange={handleChange}>
                                    <option value="">전체</option>
                                    {confirmState.map(state => (
                                        <option key={state} value={state}>
                                            {state}
                                        </option>
                                    ))}
                                </select>
                            </div>


                        </div>
                    </div>
                    <div className="button-container">
                        <button type="button" className="reset-btn" onClick={handleReset}>  {/* 조회 입력값 초기화 버튼입니다! */}
                            <i class="bi bi-arrow-clockwise"></i>
                        </button>
                        <button type="button" className="search-btn" id="searchOrder" onClick={handleSearchBtn}>
                            <i className="bi bi-search search-icon"></i>
                        </button>
                    </div>
                </div>


                <button className="btn-common add" type="button" onClick={handleAddClick}>
                    주문 등록
                </button>


                <div className="multi-select">
                    <button
                        className="btn reset" // 스타일 추가 가능
                        onClick={handleResetSelection}
                    >
                        <i class="bi bi-arrow-clockwise"></i>
                    </button>
                    <button
                        className={`btn ${selectedIndex === 0 ? "selected" : ""}`}
                        onClick={() => handleButtonClick2(0)}
                    >
                        내 글 보기
                    </button>
                    <button
                        className={`btn ${selectedIndex === 1 ? "selected" : ""}`}
                        onClick={() => handleButtonClick2(1)}
                    >
                        임시저장
                    </button>
                    <button
                        className={`btn ${selectedIndex === 2 ? "selected" : ""}`}
                        onClick={() => handleButtonClick2(2)}
                    >
                        대기
                    </button>
                    <button
                        className={`btn ${selectedIndex === 3 ? "selected" : ""}`}
                        onClick={() => handleButtonClick2(3)}
                    >
                        반려
                    </button>
                    <button
                        className={`btn ${selectedIndex === 4 ? "selected" : ""}`}
                        onClick={() => handleButtonClick2(4)}
                    >
                        반려(처리완료)
                    </button>
                    <button
                        className={`btn ${selectedIndex === 5 ? "selected" : ""}`}
                        onClick={() => handleButtonClick2(5)}
                    >
                        승인
                    </button>
                </div>

                <table className="seacrh-table">
                    {showDelete && <button className='delete-btn' onClick={handleDelete}>삭제</button>}
                    <thead>
                        <tr>
                            <th>No.</th>
                            <th>
                                주문 번호
                                <button className="sortBtn" onClick={() => sortData('orderNo')}>
                                    {sortConfig.key === 'orderNo' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                                </button>
                            </th>
                            <th>
                                담당자명
                                <button className="sortBtn" onClick={() => sortData('manager')}>
                                    {sortConfig.key === 'manager' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                                </button>
                            </th>
                            <th>
                                고객명
                                <button className="sortBtn" onClick={() => sortData('customerN')}>
                                    {sortConfig.key === 'customerN' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                                </button>
                            </th>
                            <th>
                                결재 상태
                                <button className="sortBtn" onClick={() => sortData('status')}>
                                    {sortConfig.key === 'status' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                                </button>
                            </th>
                            <th>
                                주문 변경일
                                <button className="sortBtn" onClick={() => sortData('confirmChangeDate')}>
                                    {sortConfig.key === 'confirmChangeDate' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                                </button>
                            </th>
                            <th>
                                주문 상세
                                {/*<button className="sortBtn" onClick={() => sortData('details')}>
                                {sortConfig.key === 'details' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                            </button>*/}
                            </th>


                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.length > 0 ? (
                            currentItems.map((item, index) => {
                                const globalIndex = indexOfFirstItem + index + 1; // +1은 1부터 시작하기 위함

                                return (


                                    <tr
                                        key={`${item.orderNo}-${item.ohNo}`}
                                        className={checkItem[index + 1] ? 'selected-row' : ''}
                                    /*             onDoubleClick={() => {
                                                     if (roleHierarchy[item.managerGrade] > roleHierarchy[my.role] || my.id === item.managerId) {
                                                         handleDetailView(item.orderNo); // 상세보기 모달 열기
                                                     } else {
                                                         alert("Access denied: Your role is not high enough."); // Optional alert for access denial
                                                     }
                                                 }}*/
                                    >
                                        <td>{globalIndex}</td> {/* 전역 인덱스 사용 */}
                                        <td>{item.orderNo}</td>
                                        <td className="ellipsis">{item.manager}</td>
                                        <td className="ellipsis">{item.customerN}</td>
                                        {/* <td className="ellipsis" >{item.managerGrade}</td>*/}
                                        <td>{item.status}</td>
                                        <td>{new Date(item.confirmChangeDate).toLocaleDateString('en-CA')}</td>
                                        <td>
                                            <button className="btn-common" onClick={() => handleButtonClick(item)}>
                                                상세보기
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="7" style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                    등록된 주문이 없습니다.
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-emoji-tear" viewBox="0 0 16 16" style={{ verticalAlign: 'middle' }}>
                                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                        <path d="M6.831 11.43A3.1 3.1 0 0 1 8 11.196c.916 0 1.607.408 2.25.826.212.138.424-.069.282-.277-.564-.83-1.558-2.049-2.532-2.049-.53 0-1.066.361-1.536.824q.126.27.232.535.069.174.135.373ZM6 11.333C6 12.253 5.328 13 4.5 13S3 12.254 3 11.333c0-.706.882-2.29 1.294-2.99a.238.238 0 0 1 .412 0c.412.7 1.294 2.284 1.294 2.99M7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5m4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5m-1.5-3A.5.5 0 0 1 10 3c1.162 0 2.35.584 2.947 1.776a.5.5 0 1 1-.894.448C11.649 4.416 10.838 4 10 4a.5.5 0 0 1-.5-.5M7 3.5a.5.5 0 0 0-.5-.5c-1.162 0-2.35.584-2.947 1.776a.5.5 0 1 0 .894.448C4.851 4.416 5.662 4 6.5 4a.5.5 0 0 0 .5-.5" />
                                    </svg>
                                </td>
                            </tr>
                        )}
                        <tr>
                            <td colSpan="6"></td>
                            <td colSpan="1">{order.length} 건</td>
                        </tr>
                    </tbody>




                </table>



            </div>

            <div className="pagination">
                {renderPageNumbers()}
            </div>




            {/* 여기 아래는 모달이다. */}

            {/*jsy 주문등록 모달창 시작*/}
            {isVisible && (loading ? (
                <div className="loading-overlay">
                    <div className="spinner">




                        <div class="item">
                            <div class="loader1"></div>
                        </div>

                        {/* <div class="item">
                            <div class="loader2"></div>
                        </div> */}

                        {/* <div class="item">
                            <div class="loader3"></div>
                        </div> */}
                    </div>
                </div>) : (
                <div className="confirmRegist">
                    <div className="fullBody">
                        <div className="form-container">
                            <button className="close-btn" onClick={handleCloseClick}> &times;
                            </button>
                            <div className="form-header">
                                <h1>주문 등록</h1>

                                <div className="btns">
                                    <div className="btn-add2">
                                        <button className='btn-add2' type="button" onClick={() => { handleRegistOrder("임시저장"); }}>
                                            임시 저장
                                        </button>
                                        <button className='btn-add2' type="button" onClick={() => { handleRegistOrder("대기"); }} >
                                            등록하기
                                        </button>

                                    </div>
                                </div>
                            </div>

                            {/*주문정보-헤더*/}
                            <div className="RegistForm">
                                <table className="formTable">
                                    <tbody>
                                        <tr>
                                            <th colSpan="1"><label htmlFor="orderCustomer">고객 명</label></th>
                                            <td colSpan="3">
                                                <Select
                                                    name="customerNo"
                                                    options={customerOptions}
                                                    placeholder="고객 선택"
                                                    onChange={(option) => handleCustomerChange(option.value)}
                                                />
                                            </td>


                                            <th colSpan="1"><label htmlFor="delDate">납품 요청일</label></th>
                                            <td colSpan="3"><input type="date" id="delDate" value={delDate} onChange={handleDateChange} /></td>
                                        </tr>

                                        <tr>
                                            <th colSpan="1"><label htmlFor="">담당자명</label></th>
                                            <td colSpan="3"><input type="text" id="" value={my.name} style={{ border: 'none', background: 'white' }} /></td>

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
                                    <input type="text" value={searchTerm} onChange={handleSearchChange} placeholder="상품 검색" />
                                    <button type="button" className="btn-common" onClick={handleAddProd}>추가</button>
                                </div>
                                {/*<div className="bookResultList">
                                        <ul>
                                        {orderCustomer.map((customer) => (
                                            <li key={customer.customerNo}>
                                            {customer.customerName}
                                            </li>
                                        ))}
                                        </ul>
                                    </div>*/}
                            </div>

                            {/*주문 가능한 상품 리스트*/}
                            <div className="RegistFormList">
                                <div style={{ fontWeight: 'bold' }}> 총 {searchProd?.length || 0} 건</div>
                                <div className="formTableBookList">
                                    <table className="formTableList2" >
                                        <thead className="formTableList2thead">
                                            <tr>
                                                <th><input type="checkbox" checked={orderListAllCheck} onChange={(e) => handleOrderListMasterCheckboxChange(e)} /></th>
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
                                                    <td><input type="checkbox" id="checkProdList" checked={orderListCheckItem[index] || false} onChange={(e) => handleOrderListCheckboxChange(e)} /></td>
                                                    <td style={{ display: 'none' }}>{index}</td>
                                                    <td>{index + 1}</td>
                                                    <td>{prodList.prodNo}</td>
                                                    <td>{prodList.prodName}</td>
                                                    <td>{prodList.prodWriter}</td>
                                                    <td>{formatPrice(prodList.salePrice)}</td>
                                                    <td>{prodList.saleStart} ~ {prodList.saleEnd}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/*담아둔 상품 리스트*/}
                            <div className="RegistFormList">

                                <div style={{ fontWeight: 'bold' }}> 총 {addCheckProd?.length || 0} 건</div>
                                {orderAddShowDelete && Object.values(orderAddCheckItem).some(isChecked => isChecked) &&
                                    <button className="delete-btn btn-common" onClick={() => { handleAddProdDelete(); handleOrderAddDelete(); }}>삭제</button>}

                                <table className="formTableList" style={{ marginTop: '5px' }}>

                                    <thead>
                                        <tr>
                                            <th><input type="checkbox" checked={orderAddAllCheck} onChange={(e) => handleOrderAddMasterCheckboxChange(e)} /></th>
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
                                            const qty = quantities[addProd.priceNo] || 0; // index에 맞는 수량 가져옴
                                            console.log(`렌더링 중: 상품명 = ${addProd.prodName}, 수량 = ${quantities[addProd.priceNo] || 0}`);

                                        return (
                                            <tr key={index} className={orderAddCheckItem[addProd.priceNo] ? 'selected-row' : ''}>
                                                <td><input type="checkbox" id="checkProdList"
                                                           checked={orderAddCheckItem[index] || false}
                                                           onChange={(e) => handleOrderAddCheckboxChange(e)}/></td>
                                                <td style={{display: 'none'}}>{index}</td>
                                                <td>{index + 1}</td>
                                                <td>{addProd.prodCat}</td>
                                                <td>{addProd.prodName}</td>
                                                <td>
                                                    <input type="text" value={qty} onChange={handleQuantityChange(addProd.priceNo)} />
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
                                                const qty = quantities[addProd.priceNo] || 0; //수량
                                                return total + (addProd.salePrice * qty);
                                            },0).toLocaleString()}원 {/*toLocaleString() : 숫자를 천 단위로 구분하고, 통화 기호 추가*/}
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>


                        </div>


                    </div>
                </div>

            ))}
            {/* 모달창의 끝  */}

            {/* 상세보기 모달 */}
            {isDetailModalVisible && (
                <DetailOrderModal
                    ohNo={selectedOhNo}
                    orderNo={selectedOrderNo}
                    isOpen={isDetailModalVisible}
                    onClose={handleModifyCloseClick}
                    onOpenModifyModal={handleOpenModifyModal}
                    fetchData={fetchData}
                    my={my}
                    roleHierarchy={roleHierarchy}
                    onOpenModifyTempOrderModal={handleOpenModifyTempOrderModal}
                />
            )}

            {/*수정 모달*/}
            {isModifyModalVisible && (
                <ModifyOrderModal
                    ohNo={selectedOhNo}
                    orderData={selectedOrderData}
                    isOpen={isModifyModalVisible}
                    onClose={handleCloseModifyModal}
                    onUpdate={handleOrderUpdate}
                    onClose2={handleModifyCloseClick}
                />
            )}

            {/* 임시 저장 전용 수정 모달 */}
            {console.log('isModifyTempOrderModalOpen:', isModifyTempOrderModalOpen)}
            {isModifyTempOrderModalOpen && (
                <ModifyTempOrderModal
                    ohNo={selectedOhNo}
                    orderNo={selectedOrderData.orderNo}
                    isOpen={isModifyTempOrderModalOpen}
                    onClose={handleCloseModifyTempOrderModal}
                    fetchData={fetchData}
                    onUpdate={handleOrderUpdate}
                    onClose2={handleModifyCloseClick}
                />
            )}
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Order />
);