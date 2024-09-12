import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client'; // Ensure you have the correct import path and version
import axios from 'axios';
import useSort from '../js/useSort';
import useCheckboxManager from '../js/CheckboxManager';

import './Customer.css';
import './modalAdd.css';
import './modalDetail.css';


function Customer() {

    //차트옵션
    const options = {
        responsive: true,
        scales: {
            x: {
                grid: {
                    display: false
                }
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: '#e0e0e0'
                }
            }
        },
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: '#333'
                }
            }
        }
    };

    //체크박스 관련
    const {
        allCheck,
        checkItem,
        showDelete,
        handleMasterCheckboxChange,
        handleCheckboxChange,
        handleDelete
    } = useCheckboxManager();

    // 고객 리스트
    let [customer, setCustomer] = useState([
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

    useEffect(() => {
        axios.get('/customer/customerALL')  // Spring Boot 엔드포인트와 동일한 URL로 요청
            .then(response => setCustomer(response.data))  // 응답 데이터를 상태로 설정
            .catch(error => console.error('Error fetching customer data:', error));
    }, []);

    // 메인 리스트 가져오기 axios
    // useEffect(() => {
    //     fetchData();
    // }, []);

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
        customerNo: 0,
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
        setCustomerRegist(prev => ({
            ...prev,
            [id]: value,
        }));
        console.log('추가 핸들', customerRegist);
    };

    // 리스트에 입력값 추가 핸들러
    const onClickListAdd = () => {
        setList(prevList => [...prevList, test]);
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
            picTel: ''
        }); // 입력값 초기화

        console.log('리스트:', JSON.stringify(list));
    };

// 등록 버튼 클릭 핸들러
const onClickRegister = () => {
    if (list.length > 0) {
        axios.post('/customer/customerRegist', list, {
            headers: { 'Content-Type': 'application/json' }
        })
        .then(response => {
            console.log('등록 성공:', response.data);
        })
        .catch(error => console.error('서버 요청 중 오류 발생', error))
        .finally(() => {
            setIsVisible(false); // 요청 완료 후 모달 닫기
            setList([]); // 기존 목록 초기화
        });
        window.location.reload(); // 페이지 새로고침
    } else {
        console.error('등록할 항목이 없습니다');
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
        console.log(modifyItem);

        axios.post('/customer/customerUpdate', modifyItem, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                setCustomer(response.data);  // 서버 응답 데이터로 customer 상태 업데이트
                console.log('업데이트 성공:', response.data);
            })
            .catch(error => console.error('서버 요청 중 오류 발생', error))
            .finally(() => {
                setIsModifyModalVisible(false);
                window.location.reload();// 모달 숨기기
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



    const handleDeleteClick = () => {
        const numericCheckedIds = checkedIds.map(id => Number(id)); // 문자열을 숫자로 변환
        axios.post('/customer/customerDelete', numericCheckedIds, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            console.log('삭제 요청 성공', response.data);
            window.location.reload();
        })
        .catch(error => {
            console.error('서버 요청 중 오류 발생', error);
        });
    }
    

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
                    <button className="filter-button" onClick={handleSearchcustomer}>조회</button>
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
                                    <td>{item.picTel}</td>
                                    <td>{item.activated}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="13">등록된 상품이 없습니다<i class="bi bi-emoji-tear"></i></td>
                            </tr>
                        )}
                        <tr>
                            <td colSpan="13"></td>
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