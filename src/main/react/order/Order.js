import React, {useState, useEffect, useRef} from 'react';
import ReactDOM from "react-dom/client";
import './Order.css'
import './OrderRegist.css'
import './OrderModalDetail.css'
import useCheckboxManager from "../js/CheckboxManager";
import axios from 'axios';

function Order() {

    const selectRef = useRef(null); //해당 값에 직접 접근

    const {
        allCheck,
        checkItem,
        showDelete,
        handleMasterCheckboxChange,
        handleCheckboxChange,
        handleDelete
    } = useCheckboxManager(setOrder);

    // 주문 데이터를 저장하는 상태
    const [order, setOrder] = useState([]);

    //주문목록 불러오기
    useEffect( () => {

        let effectOrder = async () => {
            try{
                let data = await fetch('/order/orderList').then(res => res.json());

                const transfomData = data.map(item => ({
                    orderNo: item.orderNo,
                    title: item.confirmList.map(confirm => confirm.confirmTitle),
                    details: item.confirmList.map(confirm => confirm.confirmContent),
                    manager: item.confirmList.map(confirm => confirm.Customer.employeeName),
                    status: item.confirmList.map(confirm => confirm.confirmStatus),
                    date: item.confirmList.map(confirm => confirm.confirmConfirmDate)
                }));

                setOrder(transfomData);
                console.log(transfomData);
            } catch (error){
                console.error('error발생함 : ', error);
            }
        }

        effectOrder();
    }, []);


// --- 테이블 정렬 기능

    // 정렬 상태와 방향을 저장하는 상태
    const [sortConfig, setSortConfig] = useState({key: '', direction: 'ascending'});

    // 정렬 함수
    const sortData = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        const sortOrder = [...order].sort((a, b) => { //order배열 정렬(매개변수 비교)
            if (a[key] < b[key]) { // key는 변수명임 (ex. orderNo, manage, title ...)
                return direction === 'ascending' ? -1 : 1; //
            }
            if (a[key] > b[key]) {
                return direction === 'ascending' ? 1 : -1;
            }
            return 0;
        });
        setOrder(sortOrder);
        setSortConfig({key, direction});
    };


// --- 테이블 정렬 기능

    /*조건 검색*/
    const [prod, setProd] = useState([]);
    const [mycustomer, setMycustomer] = useState([]);

    //상품명 목록 Data
    useEffect ( () => {
        let effectProd = async() => {
            let getProd = await fetch('/product/products').then(res => res.json());
            setProd(getProd);
        }
        effectProd();
    },[]);

    //고객명 목록 data
    useEffect ( () => {
        let effectCustomer = async() => {
            let getCustomer = await fetch('/customer/customerList').then(res => res.json());
            setMycustomer(getCustomer);
        }
        effectCustomer();
    },[]);



    const [form, setForm] = useState({});

    const handleChange = (e) => {
        let copy = {...form, [e.target.id]: e.target.value};
        setForm(copy);
        console.log(copy);
    }


    const handleSearchBtn = async() => {
        //서버로 데이터 보내기
        const date = form.date || null;
        const orderNo = form.orderNo|| null;
        const prod = form.prod || null;
        const mycustomer = form.mycustomer || null;
        const manager = form.manager || null;

        const res = await axios.post('/order/searchSelect', {
            inputDate: date, inputOrderNo: orderNo, inputProdNo: prod, inputCustomerNo: mycustomer, inputManager: manager
        }); //{매개변수 : 전달 값}

        const searchOrderData = res.data; //이렇게 먼저 묶고 반복 돌려야함.

        if(Array.isArray(searchOrderData)){
            const getSearchOrder = searchOrderData.map(item => ({ //res.data.map안된다는 소리
                orderNo: item.orderNo,
                title: item.confirmList.map(confirm => confirm.confirmTitle),
                details: item.confirmList.map(confirm => confirm.confirmContent),
                manager: item.confirmList.map(confirm => confirm.Customer.employeeName),
                status: item.confirmList.map(confirm => confirm.confirmStatus),
                date: item.confirmList.map(confirm => confirm.confirmConfirmDate),
                prodName:  item.orderBList.map(orderB => orderB.product.productName),
                mycustomer: item.customer.customerName
            }))

            setOrder(getSearchOrder);
        } else {
            console.log('서버로부터 받은 데이터가 배열이 아닙니다.', searchOrderData);
        }
    };


    /*-----조건검색-----*/





// ---  모달창 띄우는 스크립트
    const [isVisibleDetail, setIsVisibleDetail] = useState(false);

    const handleAddClickDetail = () => {
        setIsVisibleDetail(true);
    };

    const handleCloseClickDetail = () => {
        setIsVisibleDetail(false);
    };

    const [isVisibleCSV, setIsVisibleCSV] = useState(false);

    const handleAddClickCSV = () => {
        setIsVisibleCSV((prevState) => !prevState);
    };


    const [isVisible, setIsVisible] = useState(false);

    const handleAddClick = () => {
        setIsVisible(true);
    };

    const handleCloseClick = () => {
        setIsVisible(false);
    };

    const [modifyItem, setModifyItem] = useState([
        {
            orderNo: 0,
            title: '',
            details: '',
            manager: '',
            status: '',
            date: ''
        }
    ]);
    const [isModifyModalVisible, setIsModifyModalVisible] = useState(false);
    const handleModify = (item) => {
        setModifyItem(item);
        setIsModifyModalVisible(true);

    }

    const handleModifyCloseClick = () => {
        setIsModifyModalVisible(false);
    }

// --- 모달창 띄우는 스크립트



    return (
        <div>

            <div className="pageHeader"><h1><i class="bi bi-menu-up"></i>주문 관리</h1></div>

            <div className="main-container">
                <div className="filter-containers">
                    <div className="filter-container">
                        <div className="filter-items">

                            <div className="filter-item">
                                <label className="filter-label" htmlFor="date">등록 일자</label>
                                <input className="filter-input" type="date" id="date" value={form.date || ''} onChange={handleChange} ref={selectRef} required />
                            </div>

                            <div className="filter-item">
                                <label className="filter-label" htmlFor="orderNo">주문 번호</label>
                                <input className="filter-input" type="text" id="orderNo" value={form.orderNo || ''} onChange={handleChange} ref={selectRef} placeholder="주문 번호" required/>
                            </div>

                            <div className="filter-item">
                                <label className="filter-label" htmlFor="mycustomer">고객사명</label>
                                <select id="mycustomer" className="filter-input" value={form.mycustomer || ''} onChange={handleChange} ref={selectRef}>
                                    <option value="">선택</option>
                                    {mycustomer.map((customer) => (
                                        <option key={customer.customerNo} value={customer.customerNo}>
                                            {customer.customerName}
                                        </option>
                                    ))}
                                </select>
                            </div>


                            <div className="filter-item">
                                <label className="filter-label" htmlFor="prod">상품명</label>
                                <select id="prod" className="filter-input" value={form.prod || ''} onChange={handleChange} ref={selectRef}>
                                    <option value="">선택</option>
                                        {prod.map((product) => (
                                            <option key={product.productNo} value={product.productNo}>
                                                {product.productName}
                                            </option>
                                        ))}
                                </select>
                            </div>

                            <div className="filter-item">
                                <label className="filter-label" htmlFor="transaction">담당자명</label>
                                <input className="filter-input" type="text" id="manager" value={form.manager || ''} onChange={handleChange} ref={selectRef} placeholder="담당자명" required/>
                            </div>
                        </div>
                    </div>
                    <div className="button-container">
                        <button type="button" className="search-btn" id="searchOrder" onClick={handleSearchBtn}><i
                        className="b    i bi-search search-icon"></i>
                        </button>
                    </div>
                </div>

                <button className="filter-button" id="add" type="button" onClick={handleAddClick}>
                    주문 등록
                </button>

                <table className="seacrh-table">
                    {showDelete && <button className='delete-btn' onClick={handleDelete}>삭제</button>}
                    <thead>
                    <tr>
                        <th><input type="checkbox" /></th>
                        <th>No.</th>
                        <th>
                        주문 번호
                        <button className="sortBtn" onClick={() => sortData('orderNo')}>
                        {sortConfig.key === 'orderNo' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                        </button>
                        </th>
                        <th>
                        결재 제목
                        <button className="sortBtn" onClick={() => sortData('title')}>
                        {sortConfig.key === 'title' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                        </button>
                        </th>
                        <th>
                        주문 내역
                        <button className="sortBtn" onClick={() => sortData('details')}>
                        {sortConfig.key === 'details' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                        </button>
                        </th>
                        <th>
                        담당자명
                        <button className="sortBtn" onClick={() => sortData('manager')}>
                        {sortConfig.key === 'manager' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                        </button>
                        </th>
                        <th>
                        결재 상태
                        <button className="sortBtn" onClick={() => sortData('status')}>
                        {sortConfig.key === 'status' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                        </button>
                        </th>
                        <th>
                        등록 일자
                        <button className="sortBtn" onClick={() => sortData('date')}>
                        {sortConfig.key === 'date' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                        </button>
                        </th>

                    </tr>
                    </thead>
                    <tbody>
                    {order.length > 0 ? (
                        order.map((item, index) => (

                                <tr key={`${item.orderNo}-${index}`} className={checkItem[index+1] ? 'selected-row' : ''} onDoubleClick={() => {
                                handleModify(item)
                                }}>
                                <td>
                                    <input
                                    type="checkbox"
                                    checked={checkItem[index + 1] || false}
                                    onChange={handleCheckboxChange}
                                    />
                                </td>
                                <td>{index + 1}</td>
                                <td>{item.orderNo}</td>
                                <td className="ellipsis">{item.title}</td>
                                <td className="ellipsis">{item.details}</td>
                                <td>{item.manager}</td>
                                <td>{item.status}</td>
                                <td>{item.date}</td>
                                {/*<td>{item.prodName}</td>*/}
                                </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6">등록된 주문이 없습니다😭</td>
                        </tr>
                    )}
                    <tr>
                        <td colSpan="5"></td>
                        <td colSpan="1"> 6 건</td>
                    </tr>

                    </tbody>
                </table>
            </div>

{/* 여기 아래는 모달이다. */}


            {isVisible && (
                <div class="confirmRegist">
                    <div class="fullBody">
                        <div class="form-container">
                            <button className="close-btn" onClick={handleCloseClick}> &times;
                            </button>
                            <div class="form-header">
                                <h1>주문 등록</h1>

                                <div class="btns">
                                    <div class="btn-add2">
                                        <button> 등록하기</button>
                                    </div>
                                    <div class="btn-close">

                                    </div>
                                </div>
                            </div>

                            {/*주문정보-헤더*/}
                            <div class="RegistForm">
                                <table class="formTable">

                                    <tr>

                                        <th colspan="1"><label for="">고객사 명</label></th>
                                        <td colspan="3">
                                        <select>
                                        <option>선택</option>
                                        </select></td>

                                        <th colspan="1"><label for="">납품 요청일</label></th>
                                        <td colspan="3"><input type="date" placeholder="필드 입력"/></td>

                                    </tr>


                                    <tr>
                                        <th colspan="1"><label for="">담당자명</label></th>
                                        <td colspan="3"><input type="text" placeholder="필드 입력"/></td>


                                        <th colspan="1"><label for="">결재자</label></th>
                                        <td colspan="3"><input type="text" placeholder="필드 입력"/></td>

                                    </tr>

                                </table>


                                <button id="downloadCsv">CSV 샘플 양식</button>
                                <button id="uploadCsv" onClick={handleAddClickCSV}>CSV 파일 업로드</button>
                                {isVisibleCSV && (
                                    <input type="file" id="uploadCsvInput" accept=".csv"/>)}

                                <div className="btn-add">
                                    <button> 추가</button>
                                </div>
                            </div>

                            <div>
                                <input type="text" />
                                <button type="button" >추가</button>

                                <ul>
                                <li>신서유기</li>
                                <li>신라면</li>
                                <li>신봉선</li>
                                <li>신발장</li>
                                <li>신동엽</li>
                                </ul>
                            </div>



                            <div class="RegistFormList">
                                <div style={{fontWeight: 'bold'}}> 총 N 건</div>
                                <table class="formTableList">
                                    <thead>
                                        <tr>
                                            <th><input type="checkbox"/></th>
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
                                        <tr>
                                            <td><input type="checkbox"/></td>
                                            <td>1</td>
                                            <td>제품공고1</td>
                                            <td>EA</td>
                                            <td>EA</td>
                                            <td>재품창고1</td>
                                            <td>L2017-11-260001</td>
                                            <td>4,900</td>
                                        </tr>

                                        <tr style={{fontWeight: 'bold'}}>
                                            <td colspan="6"> 합계</td>
                                            <td colspan="2"> 13,000,000</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

            )}
            {/* 모달창의 끝  */}




            </div>
                );
            }

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
<Order />
);