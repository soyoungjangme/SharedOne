import React, { useState, useEffect } from 'react';
import ReactDOM from "react-dom/client";
import './Customer.css'
import './modalAdd.css'
import './modalDetail.css'
import useCheckboxManager from "../js/CheckboxManager";

function Customer() {
    const {
        allCheck,
        checkItem,
        showDelete,
        handleMasterCheckboxChange,
        handleCheckboxChange,
        handleDelete
    } = useCheckboxManager(setCustomer);

    const [customer, setCustomer] = useState([]);     // 리스트 데이터를 저장할 state

    // 서버에서 데이터 가져오기
    useEffect(() => {
        const fetchData = async () => {
            try {
                let data = await fetch('/Customer/customer').then(res => res.json());
                setCustomer(data); // 데이터를 state에 저장
                setOrder(data);
                console.log(data)
            } catch (error) {
                console.error("데이터를 가져오는 중 오류 발생:", error);
            }
        };

        fetchData();
    }, []); // 컴포넌트가 처음 마운트될 때만 실행

    // 서버에서 데이터 가져오기
    useEffect(() => {
        const fetchData = async () => {
            try {
                let data = await fetch('/Customer/customer').then(res => res.json());
                setCustomer(data); // 데이터를 state에 저장
                sortData(sortConfig.key, sortConfig.direction, data); // 정렬 적용
            } catch (error) {
                console.error("데이터를 가져오는 중 오류 발생:", error);
            }
        };

        fetchData();
    }, [sortConfig]); // sortConfig가 변경될 때마다 데이터 재정렬

    // --- 테이블 정렬 기능

    // 주문 데이터를 저장하는 상태
    const [order, setOrder] = useState([

    ]); // 리스트 데이터를 저장할 state


    // 정렬 상태와 방향을 저장하는 상태
    const [sortConfig, setSortConfig] = useState({ key: '', direction: 'ascending' });

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
        setSortConfig({ key, direction });
    };


    // --- 테이블 정렬 기능


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
            customerNo: 0, //고객번호
            customerName: "", //고객명
            customerAddr: "", //고객주소
            customerTel: "", //고객 연락처
            postNum: "", //우편번호
            businessRegistrationNo: "", //사업자 등록 번호
            nation: "", //국가
            dealType: "", //거래 유형
            picName: "", //담당자명
            picEmail: "", //담당자 이메일
            picTel: "", //담당자 연락처
            activated: "" //활성화
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

    return (
        <div className='fade_effect'>
            <div>
                <p>테스트용123  {customer.customerName}</p>
            </div>
            <div className="pageHeader"><h1><i className="bi bi-search"></i>고객 리스트</h1></div>
            <div className="main-container">

                {/* 조회하는 부분 */}
                <div className="filter-container">

                    {/* (text) 고객명
                    (text) 고객 주소 (API 사용)
                    (number)고객 연락처
                    (number)우편번호 (API 사용)
                    (number)사업자 등록 번호
                    (select)국가
                    (select)거래 유형
                    (text)담당자명
                    (email)담당자 이메일
                    (text)담당자 연락처 */}


                    {/* <div className="filter-row">
                        <label className="filter-label" htmlFor="date">일자</label>
                        <input className="filter-input" type="date" id="date" required />
                    </div> */}

                    <div className="filter-row">
                        <label className="filter-label" htmlFor="customerNo">고객명</label>
                        <input className="filter-input" type="text" id="customerNo" placeholder="상품코드" required />
                    </div>

                    <div className="filter-row">
                        <label className="filter-label" htmlFor="customerName">상품명</label>
                        <input className="filter-input" type="text" id="customerName" placeholder="상품명" required />
                    </div>

                    <div className="filter-row">
                        <label className="filter-label" htmlFor="customerWriter">상품저자</label>
                        <input className="filter-input" type="text" id="customerWriter" placeholder="상품저자" required />
                    </div>

                    <div className="filter-row">
                        <label className="filter-label" htmlFor="customerWriter">상품카테고리</label>
                        <input className="filter-input" type="text" id="customerWriter" placeholder="상품카테고리" required />
                    </div>

                    <div className="filter-row">
                        <label className="filter-label" htmlFor="customerQty">상품수량</label>
                        <input className="filter-input" type="text" id="customerQty" placeholder="상품수량" required />
                    </div>

                    <div className="filter-row">
                        <label className="filter-label" htmlFor="customerPrice">상품원가</label>
                        <input className="filter-input" type="text" id="customerPrice" placeholder="상품원가" required />
                    </div>

                    <button className="filter-button">조회</button>
                </div>
                <button className="filter-button" id="add" type="button" onClick={handleAddClick}>
                    직원 등록
                </button>


                {/* 테이블 표 부분 */}
                <table className="seacrh-table">
                    {showDelete && <button className='delete-btn' onClick={handleDelete}>삭제</button>}
                    <thead>
                        <tr>
                            <th><input type="checkbox" checked={allCheck} onChange={handleMasterCheckboxChange} /></th>
                            <th> No.</th>
                            <th>고객 번호
                                <button className="sortBtn" onClick={() => sortData('customerNo')}>
                                    {sortConfig.key === 'customerNo' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                                </button>
                            </th>
                            <th>고객명
                                <button className="sortBtn" onClick={() => sortData('customerName')}>
                                    {sortConfig.key === 'customerName' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                                </button>
                            </th>
                            <th>고객 주소
                                <button className="sortBtn" onClick={() => sortData('customerAddr')}>
                                    {sortConfig.key === 'customerAddr' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                                </button>
                            </th>
                            <th>고객 연락처
                                <button className="sortBtn" onClick={() => sortData('customerTel')}>
                                    {sortConfig.key === 'customerTel' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                                </button>
                            </th>
                            <th>우편번호
                                <button className="sortBtn" onClick={() => sortData('postNum')}>
                                    {sortConfig.key === 'postNum' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                                </button>
                            </th>
                            <th>사업자 등록 번호
                                <button className="sortBtn" onClick={() => sortData('businessRegistrationNo')}>
                                    {sortConfig.key === 'businessRegistrationNo' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                                </button>
                            </th>
                            <th>국가
                                <button className="sortBtn" onClick={() => sortData('nation')}>
                                    {sortConfig.key === 'nation' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                                </button>
                            </th>
                            <th>거래유형
                                <button className="sortBtn" onClick={() => sortData('dealType')}>
                                    {sortConfig.key === 'dealType' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                                </button>
                            </th>
                            <th>담당자명
                                <button className="sortBtn" onClick={() => sortData('picName')}>
                                    {sortConfig.key === 'picName' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                                </button>
                            </th>
                            <th>담당자 이메일
                                <button className="sortBtn" onClick={() => sortData('picEmail')}>
                                    {sortConfig.key === 'picEmail' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                                </button>
                            </th>
                            <th>담당자 연락처
                                <button className="sortBtn" onClick={() => sortData('picTel')}>
                                    {sortConfig.key === 'picTel' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                                </button>
                            </th>
                            <th>활성화
                                <button className="sortBtn" onClick={() => sortData('activated')}>
                                    {sortConfig.key === 'activated' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '-'}
                                </button>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {customer.length > 0 ? customer.map((item, index) => (
                            <tr key={item.customerNo}>
                                <td><input type="checkbox" checked={checkItem.includes(item.customerNo)} onChange={() => handleCheckboxChange(item.customerNo)} /></td>
                                <td>{index + 1}</td>
                                <td>{item.customerNo}</td>
                                <td>{item.customerName}</td>
                                <td>{item.customerAddr}</td>
                                <td>{item.customerTel}</td>
                                <td>{item.postNum}</td>
                                <td>{item.businessRegistrationNo}</td>
                                <td>{item.nation}</td>
                                <td>{item.dealType}</td>
                                <td>{item.picName}</td>
                                <td>{item.picEmail}</td>
                                <td>{item.picTel}</td>
                                <td>{item.activated}</td>
                                <td>
                                    <button onClick={() => handleModify(item)}>수정</button>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan="14">데이터가 없습니다</td></tr>
                        )}
                        <tr>
                            <td colSpan="13"></td>
                            <td colSpan="2">{customer.length} 건</td>
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
                                        <td colspan="3"><input type="text" placeholder="필드 입력" /></td>

                                        <th colspan="1"><label for="">직원 PW</label></th>
                                        <td colspan="3"><input type="text" placeholder="필드 입력" /></td>

                                    </tr>


                                    <tr>
                                        <th><label for="">연락처</label></th>
                                        <td><input type="text" placeholder="필드 입력" /></td>


                                        <th><label for="">연락처</label></th>
                                        <td><input type="text" placeholder="필드 입력" /></td>


                                        <th><label for="">연락처</label></th>
                                        <td><input type="text" placeholder="필드 입력" /></td>
                                        <th><label for="">직원 ID</label></th>
                                        <td><input type="text" placeholder="필드 입력" /></td>

                                    </tr>


                                    <tr>
                                        <th colspan="1"><label for="">연락처</label></th>
                                        <td colspan="3"><input type="text" placeholder="필드 입력" /></td>

                                        <th colspan="1"><label for="">연락처</label></th>
                                        <td colspan="3"><input type="text" placeholder="필드 입력" /></td>
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
                                    <input type="file" id="uploadCsvInput" accept=".csv" />)}

                                <div className="btn-add">
                                    <button> 추가</button>
                                </div>


                            </div>

                            <div class="RegistFormList">
                                <div style={{ fontWeight: 'bold' }}> 총 N 건</div>
                                <table class="formTableList">
                                    <thead>
                                        <tr>
                                            <th><input type="checkbox" /></th>
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
                                            <td><input type="checkbox" /></td>
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

                                        <tr style={{ fontWeight: 'bold' }}>
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
            {/* 모달창의 끝  */}

            {/* 수정 모달창 */}
            {isModifyModalVisible && (
                <div class="confirmRegist">
                    <div class="fullBody">
                        <div class="form-container">
                            <button className="close-btn" onClick={handleModifyCloseClick}> &times;
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
                                        <td colspan="3"><input type="text" placeholder="필드 입력" value={modifyItem.customerNo} /></td>

                                        <th colspan="1"><label for="">직원 PW</label></th>
                                        <td colspan="3"><input type="text" placeholder="필드 입력" value={modifyItem.customerNo} /></td>
                                    </tr>
                                    <tr>
                                        <th><label for="">연락처</label></th>
                                        <td><input type="text" placeholder="필드 입력" value={modifyItem.customerNo} /></td>
                                        <th><label for="">연락처</label></th>
                                        <td><input type="text" placeholder="필드 입력" value={modifyItem.customerNo} /></td>
                                        <th><label for="">연락처</label></th>
                                        <td><input type="text" placeholder="필드 입력" value={modifyItem.customerNo} /></td>
                                        <th><label for="">직원 ID</label></th>
                                        <td><input type="text" placeholder="필드 입력" value={modifyItem.customerNo} /></td>
                                    </tr>
                                    <tr>
                                        <th colspan="1"><label for="">연락처</label></th>
                                        <td colspan="3"><input type="text" placeholder="필드 입력" value={modifyItem.customerNo} /></td>
                                        <th colspan="1"><label for="">연락처</label></th>
                                        <td colspan="3"><input type="text" placeholder="필드 입력" value={modifyItem.customerNo} /></td>
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
            {/* 모달창의 끝  */}

            {/* 새로운 모달창 */}
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


            )}


        </div>
    );


}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Customer />
);