import React, {useState, useEffect} from 'react';
import ReactDOM from "react-dom/client";
import './Order.css'
import './OrderRegist.css'
import './OrderModalDetail.css'
import useCheckboxManager from "../js/CheckboxManager";

function Order() {
    const {
        allCheck,
        checkItem,
        showDelete,
        handleMasterCheckboxChange,
        handleCheckboxChange,
        handleDelete
    } = useCheckboxManager(setOrder);

    // 주문 데이터를 저장하는 상태
    const [order, setOrder] = useState([
        {
            orderNo: 0,
            title: '',
            details: '',
            manager: '',
            status: '',
            date: '',
            prodName: ''
        }
    ]);

    //주문목록 불러오기
    useEffect( () => {

        let effectOrder = async () => {
            try{
                let data = await fetch('/order/orderList').then(res => res.json());

                const transformData = data.map(item => {
                    // orderBList 배열의 첫 번째 요소를 안전하게 가져오기
                    const firstOrderB = item.orderH.orderBList[0] || {};
                    const productName = firstOrderB.product ? firstOrderB.product.productName : '';

                    return {
                        orderNo: item.orderNo,
                        title: item.confirmTitle,
                        details: item.confirmContent,
                        manager: item.employee.employeeName,
                        status: item.confirmStatus,
                        date: item.confirmConfirmDate,
                        prodName: productName
                    };
                });


                setOrder(transformData);
                console.log(transformData);
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

    useEffect ( () => {
        let effectProd = async() => {
            let getProd = await fetch('/product/products').then(res => res.json());
            setProd(getProd);
        }
        effectProd();
    },[]);


    /*const [customers, setCustomer] = useState([]);
    useEffect ( () => {
        let effectCustomer = async() => {
            let getCustomer = await fetch('').then(res => res.json());
            setCustomer(getCustomer);
        }
        effectCustomer();
    },[]);*/


    const handleSearchClick = async() => {
        let getSearch = await fetch('/order/orderList').then(res => res.json());
        setOrder(getSearch);
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

            <div className="pageHeader"><h1><i className="bi bi-search"></i>주문 관리</h1></div>

            <div className="main-container">
                <div className="filter-container">

                    {/* <div className="filter-row">
                        <label className="filter-label" htmlFor="date">일자</label>
                        <input className="filter-input" type="date" id="date" required />
                    </div> */}

                    <div className="filter-row">
                    <label className="filter-label" htmlFor="date">등록 일자</label>
                    <input className="filter-input" type="date" id="date" required />
                    </div>

                    <div className="filter-row">
                    <label className="filter-label" htmlFor="orderNo">주문 번호</label>
                    <input className="filter-input" type="text" id="orderNo" placeholder="주문 번호" required/>
                    </div>

                    <div className="filter-row">
                    <label className="filter-label" htmlFor="prod">고객사명</label>
                    <select id="customers" className="filter-input">
                        <option value="">선택</option>
                        {/*{customers.map((customer) => (
                            <option key={customer.customerNo} value={customer.customerNo}>
                                {customer.customertName}
                            </option>
                        ))}*/}
                    </select>
                    </div>

                    <div className="filter-row">
                        <label className="filter-label" htmlFor="prod">상품명</label>
                        <select id="prod" className="filter-input">
                            <option value="">선택</option>
                                {prod.map((product) => (
                                    <option key={product.productNo} value={product.productNo}>
                                        {product.productName}
                                    </option>
                                ))}
                        </select>
                    </div>

                    <div className="filter-row">
                    <label className="filter-label" htmlFor="transaction">담당자명</label>
                    <input className="filter-input" type="text" id="manager" placeholder="담당자명" required/>
                    </div>

                    <button className="filter-button" id="searchOrder" onClick={handleSearchClick}>조회</button>
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

                        <th>
                        상품명
                        <button className="sortBtn" onClick={() => sortData('prodName')}>
                        {sortConfig.key === 'prodName' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                        </button>
                        </th>

                    </tr>
                    </thead>
                    <tbody>
                    {order.length > 0 ? (
                        order.map((item, index) => (
                                <tr key={`${item.orderNo}-${item.prodName}`} className={checkItem[index + 1] ? 'selected-row' : ''}>
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
                                <td>{item.prodName}</td>
                                </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6">등록된 상품이 없습니다😭</td>
                        </tr>
                    )}
                    <tr>
                        <td colspan="5"></td>
                        <td colspan="1"> 6 건</td>
                    </tr>

                    </tbody>
                </table>
            </div>

        {/*{*//* 여기 아래는 모달이다. *//*}


            {isVisible && (
                <div class="confirmRegist">
                    <div class="fullBody">
                        <div class="form-container">
                            <button className="close-btn" onClick={handleCloseClick}> &times;
                            </button>
                            <div class="form-header">
                                <h1>직원 등록</h1>

                                <div class="btns">
                                    <div class="btn-add2">
                                        <button> 등록하기</button>
                                    </div>
                                    <div class="btn-close">

                                    </div>
                                </div>
                            </div>


                            <div class="RegistForm">
                                <table class="formTable">

                                    <tr>

                                        <th colspan="1"><label for="">직원 ID</label></th>
                                        <td colspan="3"><input type="text" placeholder="필드 입력"/></td>

                                        <th colspan="1"><label for="">직원 PW</label></th>
                                        <td colspan="3"><input type="text" placeholder="필드 입력"/></td>

                                    </tr>


                                    <tr>
                                        <th><label for="">연락처</label></th>
                                        <td><input type="text" placeholder="필드 입력"/></td>


                                        <th><label for="">연락처</label></th>
                                        <td><input type="text" placeholder="필드 입력"/></td>


                                        <th><label for="">연락처</label></th>
                                        <td><input type="text" placeholder="필드 입력"/></td>
                                        <th><label for="">직원 ID</label></th>
                                        <td><input type="text" placeholder="필드 입력"/></td>

                                    </tr>


                                    <tr>
                                        <th colspan="1"><label for="">연락처</label></th>
                                        <td colspan="3"><input type="text" placeholder="필드 입력"/></td>

                                        <th colspan="1"><label for="">연락처</label></th>
                                        <td colspan="3"><input type="text" placeholder="필드 입력"/></td>
                                    </tr>


                                    <tr>

                                        <th colspan="1"><label for="">연락처</label></th>
                                        <td colspan="3"><select>
                                            <option>담당 직원</option>
                                        </select></td>

                                        <th colspan="1"><label for="">연락처</label></th>
                                        <td colspan="3"><select>
                                            <option>담당 직원</option>
                                        </select></td>
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

                            <div class="RegistFormList">
                                <div style={{fontWeight: 'bold'}}> 총 N 건</div>
                                <table class="formTableList">
                                    <thead>
                                    <tr>
                                        <th><input type="checkbox"/></th>
                                        <th>no</th>
                                        <th>품목명</th>
                                        <th>규격</th>
                                        <th>단위</th>
                                        <th>창고</th>
                                        <th>LOT</th>
                                        <th>현재고</th>
                                        <th>실사수량</th>
                                        <th>조정수량</th>
                                        <th>단가</th>
                                        <th>공급가액</th>
                                        <th>부가세</th>
                                        <th>총금액</th>
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
                                        <td>5,000</td>
                                        <td>100</td>
                                        <td>3,000</td>
                                        <td>300,000</td>
                                        <td>30,000</td>
                                        <td>330,000</td>
                                    </tr>

                                    <tr style={{fontWeight: 'bold'}}>
                                        <td colspan="12"> 합계</td>
                                        <td colspan="2"> 13,000,000</td>
                                    </tr>

                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

            )}
            {*//* 모달창의 끝  *//*}

            {*//* 수정 모달창 *//* }
            {isModifyModalVisible && (
                <div class="confirmRegist">
                    <div class="fullBody">
                        <div class="form-container">
                            <button className="close-btn" onClick={handleModifyCloseClick}> &times;
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
                            <div class="RegistForm">
                                <table class="formTable">
                                    <tr>
                                        <th colspan="1"><label for="">직원 ID</label></th>
                                        <td colspan="3"><input type="text" placeholder="필드 입력" value={modifyItem.productNo}/></td>

                                        <th colspan="1"><label for="">직원 PW</label></th>
                                        <td colspan="3"><input type="text" placeholder="필드 입력" value={modifyItem.productNo}/></td>
                                    </tr>
                                    <tr>
                                        <th><label for="">연락처</label></th>
                                        <td><input type="text" placeholder="필드 입력" value={modifyItem.productNo}/></td>
                                        <th><label for="">연락처</label></th>
                                        <td><input type="text" placeholder="필드 입력" value={modifyItem.productNo}/></td>
                                        <th><label for="">연락처</label></th>
                                        <td><input type="text" placeholder="필드 입력" value={modifyItem.productNo}/></td>
                                        <th><label for="">직원 ID</label></th>
                                        <td><input type="text" placeholder="필드 입력" value={modifyItem.productNo}/></td>
                                    </tr>
                                    <tr>
                                        <th colspan="1"><label for="">연락처</label></th>
                                        <td colspan="3"><input type="text" placeholder="필드 입력" value={modifyItem.productNo}/></td>
                                        <th colspan="1"><label for="">연락처</label></th>
                                        <td colspan="3"><input type="text" placeholder="필드 입력" value={modifyItem.productNo}/></td>
                                    </tr>
                                    <tr>
                                        <th colspan="1"><label for="">연락처</label></th>
                                        <td colspan="3"><select>
                                            <option>담당 직원</option>
                                        </select></td>
                                        <th colspan="1"><label for="">연락처</label></th>
                                        <td colspan="3"><select>
                                            <option>담당 직원</option>
                                        </select></td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

            )}
            {*//* 모달창의 끝  *//*}

            {*//* 새로운 모달창 *//*}
            {isVisibleDetail && (

                <div class="confirmRegist">
                    <div class="fullBody">
                        <div class="form-container-Detail">
                            <div>
                                <button className="" onClick={handleCloseClickDetail}> &times; </button>
                            </div>

                            내용 상세페이지 넣을 예정입니다. ㅎㅎ!

                        </div>
                    </div>
                </div>


            )}*/}


        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Order/>
);