import React, { useState } from 'react'; //어느 컴포넌트이든 React임포트가 필요합니다.
import ReactDOM from 'react-dom/client'; //root에 리액트 돔방식으로 렌더링시 필요합니다.
import './Customer.css' //css파일 임포트

import axios from 'axios';

function Customer() {

    //데이터 초기값, 배열로
    let [customer, setCustomer] = useState([
        {
            customerNo: 333, //고객번호
            customerName: "bana", //고객명
            customerAddr: "good", //고객주소
            customerTel: "010-1234-1234", //고객 연락처
            postNum: "12345", //우편번호
            businessRegistrationNo: "1212-2424", //사업자 등록 번호
            nation: "한국", //국가
            dealType: "거래", //거래 유형
            picName: "픽네임", //담당자명
            picEmail: "123", //담당자 이메일
            picTel: "3252", //담당자 연락처
            activated: "Y" //활성화
        }
    ]);

    // 고객 데이터 상태
    // const [customers, setCustomers] = useState([]);

    //선택된 행 저장
    //const [selectedRows, setSelectedRows] = useState(new set());

    //단일 객체로
    // let [customer, setCustomer] = useState({
    //     customerNo: 333, //고객번호
    //     customerName: "bana", //고객명
    //     customerAddr: "good", //고객주소
    //     customerTel: "010-1234-1234", //고객 연락처
    //     postNum: "12345", //우편번호
    //     businessRegistrationNo: "1212-2424", //사업자 등록 번호
    //     nation: "한국", //국가
    //     dealType: "거래", //거래 유형
    //     picName: "픽네임", //담당자명
    //     picEmail: "123", //담당자 이메일
    //     picTel: "3252", //담당자 연락처
    //     activated: "Y" //활성화
    // });

    let handleBtn = async () => {
        try {
            
            let response = await fetch('/Customer_test/customer');

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            let data = await response.json();
            console.log("전체 데이터!", data);

            // 서버 응답이 단일 객체인 경우, 배열로 변환
            if (data && typeof data === 'object' && !Array.isArray(data)) {
                setCustomer([data]); // 단일 객체를 배열로 감싸서 상태 업데이트
            } else if (Array.isArray(data)) {
                setCustomer(data);
            } else {
                console.error("데이터 형식이 올바르지 않습니다:", data);
                setCustomer([]); // 빈 배열로 초기화
            }

        } catch (error) {
            console.error("데이터 요청 중 오류 발생:", error);
            setCustomer([]); // 빈 배열로 초기화
        }

    }




    return (
        <div>

            <div>

                <button type="button" onClick={handleBtn}>버튼 test</button>


            </div>

            <h1> <i className="bi bi-search"></i> 고객 리스트 </h1>

            <div className="breadcrumb">
                <a href="#">
                    <span className="home-icon"></span>
                </a>
                <span className="separator"></span>
                <a href="#">고객정보</a>
                <span class="separator"></span>
                <a className="#">고객정보조회</a>
            </div>



            <div className="main-container">
                <div className="filter-container">

                    <div className="filter-row">
                        <label className="filter-label" for="date">일자</label>
                        <input className="filter-input" type="date" id="date" required />
                    </div>

                    <div className="filter-row">
                        <label className="filter-label" for="manager">담당자</label>
                        <input className="filter-input" type="text" id="manager" placeholder="담당자" required />
                    </div>

                    <div className="filter-row">
                        <label className="filter-label" for="warehouse">창고</label>
                        <input className="filter-input" type="text" id="warehouse" placeholder="출하창고" required />
                    </div>

                    <div className="filter-row">
                        <label className="filter-label" for="transaction">거래처</label>
                        <input className="filter-input" type="text" id="transaction" placeholder="거래처" required />
                    </div>

                    <div className="filter-row">
                        <label className="filter-label" for="department">부서</label>
                        <input className="filter-input" type="text" id="department" placeholder="부서" required />
                    </div>

                    <div className="filter-row">
                        <label className="filter-label" for="transactionType">거래유형</label>
                        <select className="filter-select" id="transactionType" required>
                            <option value="부가세율 적용">부가세율 적용</option>
                            <option value="부가세율 미적용">부가세율 미적용</option>
                        </select>
                    </div>
                    <div className="filter-row">
                        <label className="filter-label" for="transactionType">거래유형</label>
                        <select className="filter-select" id="transactionType" required>
                            <option value="부가세율 적용">부가세율 적용</option>
                            <option value="부가세율 미적용">부가세율 미적용</option>
                        </select>
                    </div>
                    <div className="filter-row">
                        <label className="filter-label" for="transactionType">거래유형</label>
                        <select className="filter-select" id="transactionType" required>
                            <option value="부가세율 적용">부가세율 적용</option>
                            <option value="부가세율 미적용">부가세율 미적용</option>
                        </select>
                    </div>

                    <div className="filter-row">
                        <label className="filter-label" for="transactionType">거래유형</label>
                        <select className="filter-select" id="transactionType" required>
                            <option value="부가세율 적용">부가세율 적용</option>
                            <option value="부가세율 미적용">부가세율 미적용</option>
                        </select>
                    </div>
                    <div className="filter-row">
                        <label className="filter-label" for="warehouse">창고</label>
                        <input className="filter-input" type="text" id="warehouse" placeholder="출하창고" required />
                    </div>

                    <div className="filter-row">
                        <label className="filter-label" for="transaction">거래처</label>
                        <input className="filter-input" type="text" id="transaction" placeholder="거래처" required />
                    </div>

                    <div className="filter-row">
                        <label className="filter-label" for="department">부서</label>
                        <input className="filter-input" type="text" id="department" placeholder="부서" required />
                    </div>


                    <button className="filter-button" onClick={handleBtn}>조회</button>
                </div>


                <table className="seacrh-table">
                    <thead>

                        <tr>
                            <th><input type="checkbox" /></th>
                            <th>고객 번호</th>
                            <th>고객명</th>
                            <th>고객 주소</th>
                            <th>고객 연락처</th>
                            <th>우편번호</th>
                            <th>사업자 등록 번호</th>
                            <th>국가</th>
                            <th>거래유형</th>
                            <th>담당자명</th>
                            <th>담당자 이메일</th>
                            <th>담당자 연락처</th>
                            <th>활성화</th>
                        </tr>

                    </thead>

                    <tbody>

                        {/* 테이블 전부 나타내기 */}
                        {customer.length > 0 ? (
                            customer.map((cust) => (
                                <tr key={cust.customerNo}>
                                    <td><input type="checkbox" /></td>
                                    <td>{cust.customerNo}</td>
                                    <td>{cust.customerName}</td>
                                    <td>{cust.customerAddr}</td>
                                    <td>{cust.customerTel}</td>
                                    <td>{cust.postNum}</td>
                                    <td>{cust.businessRegistrationNo}</td>
                                    <td>{cust.nation}</td>
                                    <td>{cust.dealType}</td>
                                    <td>{cust.picName}</td>
                                    <td>{cust.picEmail}</td>
                                    <td>{cust.picTel}</td>
                                    <td>{cust.activated}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="13">데이터가 없습니다.</td>
                            </tr>
                        )}


                        <tr>
                            <td> <input type="checkbox" /></td>
                            <td>1</td>
                            <td>삼국지</td>
                            <td>1234</td>
                            <td>승인됨</td>
                            <td>12345</td>
                            <td>123-45-67890</td>
                            <td>02-1234-5678</td>
                            <td><i className="bi bi-search"></i></td>
                            <td>이영희</td>
                            <td>kim@abc.com</td>
                            <td>lee@abc.com</td>
                            <td>010-8765-4321</td>
                        </tr>

                    </tbody>
                </table>
            </div>
            {
                isVisible && (
                    <div class="confirmRegist">
                        <div class="fullBody">
                            <div class="form-container">
                                <button className="close-btn" onClick={handleCloseClick}> &times;
                                </button>
                                <div class="form-header">
                                    <h1>직원 등록</h1>

                                    <div className="btns">
                                        <div className="btn-add2">
                                            <button type="button" onClick={onClickRegistBtn}> 등록하기</button>
                                        </div>

                                        <div className="btn-close">

                                        </div>
                                    </div>
                                </div>

                                <div class="RegistForm">
                                    <table class="formTable">
                                        <tr>
                                            <th><label for="">고객명</label></th>
                                            <td><input type="text" placeholder="입력" /></td>
                                            <th><label for="">고객 연락처</label></th>
                                            <td><input type="text" placeholder="입력" /></td>
                                        </tr>

                                        <tr>
                                            <th><label for="">사업자 등록 번호</label></th>
                                            <td><input type="text" placeholder="입력" /></td>
                                            <th><label for="">고객 주소</label></th>
                                            <td><input type="text" placeholder="입력" /></td>
                                        </tr>

                                        <tr>
                                            <th><label for="">우편 번호</label></th>
                                            <td><input type="text" placeholder="입력" /></td>

                                            <th><label for="">담당자명</label></th>
                                            <td><input type="text" placeholder="입력" /></td>
                                        </tr>

                                        <tr>
                                            <th><label for="">담당자 이메일</label></th>
                                            <td><input type="text" placeholder="입력" /></td>

                                            <th><label for="">담당자 연락처</label></th>
                                            <td><input type="text" placeholder="입력" /></td>
                                        </tr>

                                        <tr>
                                            <th><label for="">거래 유형</label></th>
                                            <td>
                                                <select>
                                                    <option>B2B</option>
                                                    <option>B2C</option>
                                                </select>
                                            </td>

                                            <th><label for="">activated</label></th>
                                            <td><input type="text" placeholder="입력" /></td>
                                        </tr>
                                    </table>


                                    <button id="downloadCsv">CSV 샘플 양식</button>
                                    <button id="uploadCsv" onClick={handleAddClickCSV}>CSV 파일 업로드</button>
                                    {isVisibleCSV && (
                                        <input type="file" id="uploadCsvInput" accept=".csv" />)}

                                    <div className="btn-add">
                                        <button onClick={onClickListAdd}> 추가</button>
                                    </div>


                                </div>

                                <div class="RegistFormList">
                                    <div style={{ fontWeight: 'bold' }}> {list.length} 건</div>
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

                )
            }

        </div>





    );


}



//페이지 root가 되는 JS는 root에 삽입되도록 처리
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Customer />
);


import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client'; // Ensure you have the correct import path and version
import axios from 'axios';
import useSort from '../js/useSort';
import useCheckboxManager from '../js/CheckboxManager';
import './Customer.css';
import './modalAdd.css';
import './modalDetail.css';

import AddressInput from './AddressInput'; // AddressInput 컴포넌트

function Customer() {


    //체크박스 관련
    const {
        allCheck,
        checkItem,
        showDelete,
        handleMasterCheckboxChange,
        handleCheckboxChange,
        handleDelete
    } = useCheckboxManager(setCustomer);

    const {
        zonecode,
        address,
        detailedAddress,
        isOpen
    } = AddressInput();

    const [customer, setCustomer] = useState([]);     // 리스트 데이터를 저장할 state

    // 서버에서 데이터 가져오기
    useEffect(() => {
        const fetchData = async () => {
            try {
                let data = await fetch('/customer/customerList').then(res => res.json());
                setCustomer(data); // 데이터를 state에 저장
                setOrder(data);
                console.log(data)
            } catch (error) {
                console.error("데이터를 가져오는 중 오류 발생:", error);
            }
        };

        fetchData();
    }, []); // 컴포넌트가 처음 마운트될 때만 실행

    메인 리스트 가져오기 axios
    useEffect(() => {
        fetchData();
    }, []);

    // 검색,필터 기능
    const [filters, setFilters] = useState({
        customerNo: '',
        customerName: '',
        customerTel: '',
        customerAddress: '',
        postNum: '',
        businessRegistrationNo: '',
        nation: '',
        dealType: '',
        picName: '',
        picEmail: '',
        picTel: ''
    });

    // 필터 변경 핸들러
    const handleFilterChange = (e) => {
        const { id, value } = e.target;
        console.log(e.target);
        // 변경된 필드의 값을 업데이트합니다.
        setFilters((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    // 검색 필터
    const handleSearchcustomer = () => {
        if (filters) {
            axios.post('/customer/customerSearch', filters, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => setCustomer(response.data))
                .catch(error => console.error('에러에러', error));
        } else {
            console.error('핸들러 작동 잘 함, 필터 값이 없음');
        }
        console.log(321321)
    };

    // 직원 추가 정보를 저장할 상태
    const [test, setTest] = useState({
        customerNo: '',
        customerName: '',
        customerTel: '',
        customerAddress: '',
        postNum: '',
        businessRegistrationNo: '',
        nation: '',
        dealType: '',
        picName: '',
        picEmail: '',
        picTel: '',
        activated: ''
    });

    // 직원 추가 리스트
    const [list, setList] = useState([]);
    const [customerRegist, setCustomerRegist] = useState([]);

    // 입력값 변경 핸들러
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTest(prevTest => ({
            ...prevTest,
            [name]: value,
        }));
        console.log(test);
    };

    // 추가 핸들러
    const handleInputRegistAdd = (e) => {
        const { id, value } = e.target;
        console.log(e.target);
        // 변경된 필드의 값을 업데이트합니다.
        setcustomerRegist((prev) => ({
            ...prev,
            [id]: value,
        }));
        console.log(customerRegist);
    };

    // 리스트에 입력값 추가 핸들러
    const onClickListAdd = () => {
        setList((prevList) => [...prevList, test]);
        setTest({
            customerNo: '',
            customerName: '',
            customerTel: '',
            customerAddress: '',
            postNum: '',
            businessRegistrationNo: '',
            nation: '',
            dealType: '',
            picName: '',
            picEmail: '',
            picTel: '',
        }); // 입력값 초기화

        console.log('리스트:', JSON.stringify(list));
    };

    const onClickRegistBtn = () => {
        if (list.length > 0) {
            axios.post('/customer/customerRegist', list, {
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then(response => {
                setCustomer(response.data); // Update state with new data
                console.log('등록 성공:', response.data);
                setIsVisible(false); // Hide modal
            })
            .catch(error => console.error('서버 요청 중 오류 발생', error))
            .finally(() => {
                setList([]); // Clear the list after successful registration
                window.location.reload(); // Refresh the page
            });
        } else {
            console.error('등록할 항목이 없습니다');
        }
    };

    const handleDeleteClick = () => {
        if (checkedIds.length > 0) {
            axios.post('/customer/customerDelete', checkedIds, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                console.log('삭제 요청 성공', response.data);
                setCustomer(response.data); // Update state with new data
            })
            .catch(error => {
                console.error('서버 요청 중 오류 발생', error);
            })
            .finally(() => {
                window.location.reload(); // Refresh the page
            });
        } else {
            console.error('삭제할 항목이 없습니다');
        }
    };

    


    // 상태가 업데이트된 후 로그를 출력하기 위한 useEffect
    //    useEffect(() => {
    //        console.log('업데이트된 customerRegist:', JSON.stringify(customerRegist));
    //    }, [customerRegist]);




    // --- 테이블 정렬 기능
    const { sortedData, sortData, sortConfig } = useSort(customer);

    // ---  모달창 띄우는 스크립트
    const [isVisibleDetail, setIsVisibleDetail] = useState(false);

    const handleAddClickDetail = () => {
        setIsVisibleDetail(true);
    };

    const handleCloseClickDetail = () => {
        setIsVisibleDetail(false);
    };

    // CSV 이벤트
    const [isVisibleCSV, setIsVisibleCSV] = useState(false);
    const handleAddClickCSV = () => {
        setIsVisibleCSV((prevState) => !prevState);
    };

    // 버튼 이벤트
    const [isVisible, setIsVisible] = useState(false);
    const handleAddClick = () => {
        setIsVisible(true);
    };
    const handleCloseClick = () => {
        setList([]); // 기존 목록 초기화
        setIsVisible(false);
    };



    // --- 수정 기능
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

    const handleUpdateClick = () => {
        axios.post('/customer/customerUpdate', modifyItem, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            setCustomer(response.data); // Update state with new data
            console.log('업데이트 성공:', response.data);
        })
        .catch(error => console.error('서버 요청 중 오류 발생', error))
        .finally(() => {
            setIsModifyModalVisible(false); // Hide modal
            window.location.reload(); // Refresh the page
        });
    };


    // 수정 창 모달
    const [isModifyModalVisible, setIsModifyModalVisible] = useState(false);

    const handleModify = (item) => {
        setModifyItem(item);
        setIsModifyModalVisible(true);
    }

    const handleModifyCloseClick = () => {
        setIsModifyModalVisible(false);
    }

    const handleModifyItemChange = (e) => {
        let copy = { ...modifyItem, [e.name]: e.value };
        console.log(modifyItem);
        setModifyItem(copy);
    }


    // 삭제 기능
    const [checkedIds, setCheckedIds] = useState([]);

    useEffect(() => {
        // 모든 체크된 체크박스를 선택합니다.
        const checkedCheckboxes = Array.from(document.querySelectorAll('input.mainCheckbox:checked'));

        // 체크된 체크박스의 ID 값을 배열로 저장합니다.
        const ids = checkedCheckboxes.map(checkbox => checkbox.id);

        // 상태를 업데이트하여 배열에 저장합니다.
        console.log(checkedIds);
        setCheckedIds(ids);
    }, [checkItem]);





    return (

        <div className='fade_effect'>
            <h1><i class="bi bi-person-lines-fill"></i> 고객 관리 </h1>
            <div className="main-container">

                <div className="filter-container">

                    <div className="filter-row">
                        <label className="filter-label" htmlFor="customerName">고객명</label>
                        <input className="filter-input" type="text" id="customerName" placeholder="고객명" value={filters.customerName} onChange={handleFilterChange} />
                    </div>

                    <div className="filter-row">
                        <label className="filter-label" htmlFor="customerTel">고객 연락처</label>
                        <input className="filter-input" type="text" id="customerTel" placeholder="고객 연락처" value={filters.customerTel} onChange={handleFilterChange} />
                    </div>
                    <div className="filter-row">
                        <label className="filter-label" htmlFor="businessRegistrationNo">사업자 등록 번호</label>
                        <input className="filter-input" type="text" id="businessRegistrationNo" placeholder="사업자 등록 번호" value={filters.businessRegistrationNo} onChange={handleFilterChange} />
                    </div>
                    <div className="filter-row">
                        <label className="filter-label" htmlFor="customerAddress">고객 주소</label>
                        <input className="filter-input" type="text" id="customerAddress" placeholder="고객 주소" value={filters.customerAddress} onChange={handleFilterChange} />
                    </div>
                    <div className="filter-row">
                        <label className="filter-label" htmlFor="postNum">우편번호</label>
                        <input className="filter-input" type="text" id="postNum" placeholder="우편번호" value={filters.postNum} onChange={handleFilterChange} />
                    </div>
                    <div className="filter-row">
                        <label className="filter-label" htmlFor="nation">국가</label>
                        <select className="filter-input" id="nation" value={filters.nation} onChange={handleFilterChange}>
                            <option value="" disabled>국가 선택</option>
                            <option value="KR">대한민국</option>
                            <option value="US">미국</option>
                            <option value="JP">일본</option>
                            <option value="CN">중국</option>
                        </select>
                    </div>
                    <div className="filter-row">
                        <label className="filter-label" htmlFor="picName">담당자명</label>
                        <input className="filter-input" type="text" id="picName" placeholder="담당자명" value={filters.picName} onChange={handleFilterChange} />
                    </div>
                    <div className="filter-row">
                        <label className="filter-label" htmlFor="picEmail">담당자 이메일</label>
                        <input className="filter-input" type="text" id="picEmail" placeholder="담당자 이메일" value={filters.picEmail} onChange={handleFilterChange} />
                    </div>
                    <div className="filter-row">
                        <label className="filter-label" htmlFor="picTel">담당자 연락처</label>
                        <input className="filter-input" type="text" id="picTel" placeholder="담당자 연락처" value={filters.picTel} onChange={handleFilterChange} />
                    </div>
                    <div className="filter-row">
                        <label className="filter-label" htmlFor="dealType">거래 유형</label>
                        <select className="filter-input" id="dealType" value={filters.dealType} onChange={handleFilterChange}>
                            <option value="" disabled>거래 유형 선택</option>
                            <option value="B2B">B2B</option>
                            <option value="B2C">B2C</option>
                            <option value="C2C">C2C</option>
                        </select>
                    </div>
                    <button className="filter-button">조회</button>
                </div>

                <button className="filter-button" id="add" type="button" onClick={handleAddClick}>
                    고객 등록
                </button>
                {/* 테이블 표 부분 */}
                <table className="seacrh-table">
                    {showDelete && <button className='delete-btn' onClick={handleDeleteClick}>삭제</button>}
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

                    
                        {sortedData.length > 0 ? (
                            sortedData.map((item, index) => (
                                <tr key={index} className={checkItem[index] ? 'selected-row' : ''} onDoubleClick={() => {
                                    handleModify(item)
                                }}>
                                    <td><input className="mainCheckbox" type="checkbox" id={item.customerNo} checked={checkItem[index] || false}
                                        onChange={handleCheckboxChange} /></td>
                                    <td style={{ display: 'none' }}>{index}</td>
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
                                    <td>{item.activated}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="13">등록된 상품이 없습니다<i class="bi bi-emoji-tear"></i></td>
                            </tr>
                        )}
                        <tr>
                            <td colSpan="12"></td>
                            <td colSpan="2"> {customer.length} 건</td>
                        </tr>



                    </tbody>

                </table>
            </div>


            {/* 여기 아래는 모달이다. */}
            {isVisible && (
            <div className="confirmRegist">
                <div className="fullBody">
                    <div className="form-container">
                        <button className="close-btn" onClick={handleCloseClick}> &times; </button>
                        <div className="form-header">
                            <h1>직원 등록</h1>
                            <div className="btns">
                                <div className="btn-add2">
                                    <button onClick={onClickRegister} disabled={list.length === 0}>등록하기</button>
                                </div>
                            </div>
                        </div>

                        <div className="RegistForm">
                            <table className="formTable">
                                <tbody>
                                    <tr>
                                        <th><label htmlFor="customerName">고객명</label></th>
                                        <td><input type="text" name="customerName" value={customer.customerName} onChange={handleInputChange} placeholder="고객명" /></td>

                                        <th><label htmlFor="customerNo">고객 번호</label></th>
                                        <td><input type="number" name="customerNo" value={customer.customerNo} onChange={handleInputChange} placeholder="고객 번호" /></td>
                                    </tr>
                                    <tr>
                                        <th><label htmlFor="customerTel">전화번호</label></th>
                                        <td><input type="text" name="customerTel" value={customer.customerTel} onChange={handleInputChange} placeholder="전화번호" /></td>

                                        <th><label htmlFor="customerAddr">주소</label></th>
                                        <td><input type="text" name="customerAddr" value={customer.customerAddr} onChange={handleInputChange} placeholder="주소" /></td>
                                    </tr>
                                    <tr>
                                        <th><label htmlFor="postNum">우편번호</label></th>
                                        <td><input type="text" name="postNum" value={customer.postNum} onChange={handleInputChange} placeholder="우편번호" /></td>

                                        <th><label htmlFor="businessRegistrationNo">사업자 등록번호</label></th>
                                        <td><input type="text" name="businessRegistrationNo" value={customer.businessRegistrationNo} onChange={handleInputChange} placeholder="사업자 등록번호" /></td>
                                    </tr>
                                    <tr>
                                        <th><label htmlFor="nation">국가</label></th>
                                        <td><input type="text" name="nation" value={customer.nation} onChange={handleInputChange} placeholder="국가" /></td>

                                        <th><label htmlFor="dealType">거래 유형</label></th>
                                        <td><input type="text" name="dealType" value={customer.dealType} onChange={handleInputChange} placeholder="거래 유형" /></td>
                                    </tr>
                                    <tr>
                                        <th><label htmlFor="picName">담당자 이름</label></th>
                                        <td><input type="text" name="picName" value={customer.picName} onChange={handleInputChange} placeholder="담당자 이름" /></td>

                                        <th><label htmlFor="picEmail">담당자 이메일</label></th>
                                        <td><input type="email" name="picEmail" value={customer.picEmail} onChange={handleInputChange} placeholder="담당자 이메일" /></td>
                                    </tr>
                                    <tr>
                                        <th><label htmlFor="picTel">담당자 전화번호</label></th>
                                        <td><input type="text" name="picTel" value={customer.picTel} onChange={handleInputChange} placeholder="담당자 전화번호" /></td>
                                    </tr>
                                </tbody>
                            </table>

                            <div className="btn-add">
                                <button onClick={onClickAddToList}>추가</button>
                            </div>
                        </div>

                        <div className="RegistFormList">
                            <div style={{ fontWeight: 'bold' }}>총 {list.length} 건</div>
                            <table className="formTableList">
                                <thead>
                                    <tr>
                                        <th>번호</th>
                                        <th>고객명</th>
                                        <th>고객 번호</th>
                                        <th>전화번호</th>
                                        <th>주소</th>
                                        <th>우편번호</th>
                                        <th>사업자 등록번호</th>
                                        <th>국가</th>
                                        <th>거래 유형</th>
                                        <th>담당자 이름</th>
                                        <th>담당자 이메일</th>
                                        <th>담당자 전화번호</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {list.map((item, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{item.customerName}</td>
                                            <td>{item.customerNo}</td>
                                            <td>{item.customerTel}</td>
                                            <td>{item.customerAddress}</td>
                                            <td>{item.postNum}</td>
                                            <td>{item.businessRegistrationNo}</td>
                                            <td>{item.nation}</td>
                                            <td>{item.dealType}</td>
                                            <td>{item.picName}</td>
                                            <td>{item.picEmail}</td>
                                            <td>{item.picTel}</td>
                                        </tr>
                                    ))}
                                    <tr style={{ fontWeight: 'bold' }}>
                                        <td colSpan="11">합계</td>
                                        <td>{list.length} 건</td>
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
                <div className="confirmRegist">
                    <div className="fullBody">
                        <div className="form-container">
                            <button className="close-btn" onClick={handleModifyCloseClick}> &times; </button>
                            <div className="form-header">
                                <h1>고객 수정</h1>
                                <div className="btns">
                                    <div className="btn-add2">
                                        <button type="button" onClick={handleUpdateClick}>수정하기</button>
                                    </div>
                                    <div className="btn-close">
                                        {/* 다른 버튼이 필요한 경우 여기에 추가 */}
                                    </div>
                                </div>
                            </div>
                            <div className="RegistForm">
                                <table className="formTable">
                                    <tbody>
                                        <tr>
                                            <th><label htmlFor="customerName">고객명</label></th>
                                            <td><input type="text" id="customerName" name="customerName" value={modifyItem.customerName} onChange={(e) => handleModifyItemChange(e.target)} /></td>

                                            <th><label htmlFor="customerNo">고객 연락처</label></th>
                                            <td><input type="text" id="customerNo" name="customerNo" value={modifyItem.customerNo} onChange={(e) => handleModifyItemChange(e.target)} /></td>

                                            <th><label htmlFor="businessRegistrationNo">사업자 등록 번호</label></th>
                                            <td><input type="text" id="businessRegistrationNo" name="businessRegistrationNo" value={modifyItem.businessRegistrationNo} onChange={(e) => handleModifyItemChange(e.target)} /></td>
                                        </tr>
                                        <tr>
                                            <th><label htmlFor="customerAddr">고객 주소</label></th>
                                            <td><input type="text" id="customerAddr" name="customerAddr" value={modifyItem.customerAddr} onChange={(e) => handleModifyItemChange(e.target)} /></td>

                                            <th><label htmlFor="postNum">우편번호</label></th>
                                            <td><input type="text" id="postNum" name="postNum" value={modifyItem.postNum} onChange={(e) => handleModifyItemChange(e.target)} /></td>

                                            <th><label htmlFor="nation">국가</label></th>
                                            <td><input type="text" id="nation" name="nation" value={modifyItem.nation} onChange={(e) => handleModifyItemChange(e.target)} /></td>
                                        </tr>
                                        <tr>
                                            <th><label htmlFor="picName">담당자명</label></th>
                                            <td><input type="text" id="picName" name="picName" value={modifyItem.picName} onChange={(e) => handleModifyItemChange(e.target)} /></td>

                                            <th><label htmlFor="picEmail">담당자 이메일</label></th>
                                            <td><input type="date" id="picEmail" name="picEmail" value={modifyItem.picEmail} onChange={(e) => handleModifyItemChange(e.target)} /></td>

                                            <th><label htmlFor="picTel">담당자 연락처</label></th>
                                            <td><input type="text" id="picTel" name="picTel" value={modifyItem.picTel} onChange={(e) => handleModifyItemChange(e.target)} /></td>
                                        </tr>
                                        <tr>
                                            <th><label htmlFor="dealType">거래 유형</label></th>
                                            <td><input type="text" id="dealType" name="dealType" value={modifyItem.dealType} onChange={(e) => handleModifyItemChange(e.target)} /></td>

                                            <th><label htmlFor="authorityGrade">권한</label></th>
                                            <td>
                                                <select id="authorityGrade" name="authorityGrade" value={modifyItem.authorityGrade} onChange={(e) => handleModifyItemChange(e.target)}>
                                                    <option value="">선택하세요</option>
                                                    <option value="S">S</option>
                                                    <option value="A">A</option>
                                                    <option value="B">B</option>
                                                    <option value="C">C</option>
                                                </select>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 모달창의 끝  */}

            {/* 새로운 모달창 － 담당자 확인*/}
            {
                isVisibleDetail && (

                    <div class="confirmRegist">
                        <div class="fullBody">
                            <div class="form-container-Detail">
                                <div>
                                    <button className="" onClick={handleCloseClickDetail}> &times; </button>
                                </div>

                                {/* 담당자 상세정보 */}
                                <h3>담당자 상세정보</h3>

                                <p>담당자 이름: 이현수</p>
                                <p>담당자 연락처 : 010-6648-2158</p>
                                <p>담당자 이메일 : bobo@naver.com</p>

                            </div>
                        </div>
                    </div>


                )
            }


        </div >
    );


}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Customer />
);