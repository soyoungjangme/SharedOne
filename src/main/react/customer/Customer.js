import axios from 'axios';
import React, { useEffect, useState } from 'react';
import ReactDOM from "react-dom/client";
import useCheckboxManager from "../js/CheckboxManager";
import useSort from '../js/useSort';
import './Customer.css'
import './modalAdd.css'
import './modalDetail.css'
import AddressInput from './AddressInput';



function Customer() {

    const {
        allCheck,
        checkItem,
        showDelete,
        handleMasterCheckboxChange,
        handleCheckboxChange,
        handleDelete
    } = useCheckboxManager();

    // 메인 리스트
    let [customer, setCustomer] = useState([{
        customerNo: '',
        customerName: '',
        customerTel: '',
        customerAddr: '',
        postNum: '',
        businessRegistrationNo: '',
        nation: '',
        dealType: '',
        picName: '',
        picEmail: '',
        picTel: '',
        activated: ''
    }]);

    useEffect(() => {
        axios.get('/customer/customerALL')  // Spring Boot 엔드포인트와 동일한 URL로 요청
            .then(response => setCustomer(response.data))  // 응답 데이터를 상태로 설정
            .catch(error => console.error('Error fetching Customer data:', error));
    }, []);



    // =============================== 고객 조회 부분 ===============================

    // 검색,필터 기능
    let [customerSearch, setEmSearch] = useState({
        customerNo: '',
        customerName: '',
        customerTel: '',
        customerAddr: '',
        postNum: '',
        businessRegistrationNo: '',
        nation: '',
        dealType: '',
        picName: '',
        picEmail: '',
        picTel: '',
        activated: 'Y'
    });

    // 필터 변경 핸들러
    const handleInputChange = (e) => {
        const { id, value } = e.target;
        console.log(e.target);
        // 변경된 필드의 값을 업데이트합니다.
        setEmSearch((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    // 검색 리스트
    const handleSearchCustomer = () => {
        if (customerSearch) {
            axios.post('/customer/customerSearch', customerSearch, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => setCustomer(response.data))
                .catch(error => console.error('에러에러', error));
        } else {
            console.error('[핸들러 작동 잘 함]');
        }
    };

    // 엔터 키로 검색 처리
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // 기본 폼 제출 방지
            handleSearchCustomer();
        }
    };



    // =============================== 고객 등록 부분 ===============================

    // 고객 등록 리스트 상태
    const [regist, setRegist] = useState({
        customerNo: '',
        customerName: '',
        customerTel: '',
        customerAddr: '',
        postNum: '',
        businessRegistrationNo: '',
        nation: '',
        dealType: '',
        picName: '',
        picEmail: '',
        picTel: '',
        activated: 'Y' // 기본값
    });

    // 고객 등록 리스트
    const [list, setList] = useState([]);

    // 입력 핸들러
    const handleInputAddChange = (e) => {
        const { name, value } = e.target;
        setRegist((prevRegist) => ({
            ...prevRegist,
            [name]: value,
        }));
    };

    // 리스트에 등록된 고객 데이터 추가 핸들러
    const onClickListAdd = () => {
        setList((prevList) => [...prevList, regist]); // 기존 리스트에 새 고객 데이터 추가
        setRegist({
            customerNo: '',
            customerName: '',
            customerTel: '',
            customerAddr: '',
            postNum: '',
            businessRegistrationNo: '',
            nation: '',
            dealType: '',
            picName: '',
            picEmail: '',
            picTel: '',
            activated: 'Y'
        }); // 입력값 초기화
    };

    // 서버로 고객 등록 요청
    const onClickRegistBtn = () => {
        if (list.length > 0) {
            axios
                .post('/customer/customerRegist', list, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                .then((response) => {
                    console.log('등록 성공:', response.data);
                    setList([]); // 등록 후 리스트 초기화
                    window.location.reload(); // 페이지 새로고침
                })
                .catch((error) => {
                    console.error('등록 중 오류 발생:', error.response.data);
                });
        } else {
            console.error('등록할 항목이 없습니다.');
        }
    };


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

    // =============================== 고객 수정 부분 ===============================

    // --- 수정 기능
    const [modifyItem, setModifyItem] = useState(
        {
            customerNo: '',
            customerName: '',
            customerTel: '',
            customerAddr: '',
            postNum: '',
            businessRegistrationNo: '',
            nation: '',
            dealType: '',
            picName: '',
            picEmail: '',
            picTel: '',
            activated: 'Y'
        }
    );

    // 수정 기능
    const handleUpdateClick = () => {
        axios.post('/customer/customerUpdate', modifyItem, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                console.log('업데이트 성공:', response.data);
                // 서버 응답 데이터로 Customer 상태 업데이트
                setCustomer(prev => prev.map(item =>
                    item.customerNo === modifyItem.customerNo ? modifyItem : item
                ));
                setIsModifyModalVisible(false);
            })
            .catch(error => console.error('서버 요청 중 오류 발생', error));
    };



    // =============================== 수정 창 모달 ===============================

    const [isModifyModalVisible, setIsModifyModalVisible] = useState(false);

    const handleModify = (item) => {
        setModifyItem(item); // 선택한 고객 정보로 수정 아이템 설정
        setIsModifyModalVisible(true);
    }

    const handleModifyCloseClick = () => {
        setIsModifyModalVisible(false);
    }

    const handleModifyItemChange = (e) => {
        setModifyItem(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    }


    // =============================== 고객 삭제 부분 ===============================

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


    //삭제 기능
    const handleDeleteClick = () => {
        axios.post('/customer/customerDelete', checkedIds, {
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


    // =============================== 주소 모달 부분 ===============================

    const [isAddressModalVisible, setIsAddressModalVisible] = useState(false); // 주소 모달 상태 추가
    const [customerAddress, setCustomerAddress] = useState('');
    const [postNum, setPostNum] = useState('');

    const openAddressModal = () => setIsAddressModalVisible(true); // 주소 모달 열기
    const closeAddressModal = () => setIsAddressModalVisible(false); // 주소 모달 닫기

    const handleAddressConfirm = (addrObj, isRegistration) => {
        console.log('주소:', addrObj.fullAddress, '우편번호:', addrObj.zonecode);

        if (isRegistration) {
            // 등록 모달에서 사용할 경우
            setRegist((prev) => ({
                ...prev,
                customerAddr: addrObj.fullAddress,
                postNum: addrObj.zonecode
            }));
        } else {
            // 수정 모달에서 사용할 경우
            setModifyItem((prev) => ({
                ...prev,
                customerAddr: addrObj.fullAddress,
                postNum: addrObj.zonecode
            }));
        }

        closeAddressModal(); // 주소 입력 모달 닫기
    };


    return (
        <div className='fade_effect'>
            <h1><i className="bi bi-person-lines-fill"></i> 고객 관리</h1>
            <div className="main-container">
                <div className="filter-containers">
                    <div className="filter-container">
                        <div className="filter-items">
            <div className="filter-item">
                <label className="filter-label" htmlFor="customerName">고객명</label>
                <input
                    className="filter-input"
                    type="text"
                    id="customerName"
                    placeholder="고객명"
                    onChange={handleInputChange}
                    value={customerSearch.customerName}
                    onKeyPress={handleKeyPress}
                    required
                />
            </div>

            <div className="filter-item">
                <label className="filter-label" htmlFor="customerTel">고객연락처</label>
                <input
                    className="filter-input"
                    type="text"
                    id="customerTel"
                    placeholder="고객연락처"
                    onChange={handleInputChange}
                    value={customerSearch.customerTel}
                    onKeyPress={handleKeyPress}
                    required
                />
            </div>

            <div className="filter-item">
                <label className="filter-label" htmlFor="businessRegistrationNo">사업자등록번호</label>
                <input
                    className="filter-input"
                    type="text"
                    id="businessRegistrationNo"
                    placeholder="사업자등록번호"
                    onChange={handleInputChange}
                    value={customerSearch.businessRegistrationNo}
                    onKeyPress={handleKeyPress}
                    required
                />
            </div>

            <div className="filter-item">
                <label className="filter-label" htmlFor="customerAddr">고객주소</label>
                <input
                    className="filter-input"
                    type="text"
                    id="customerAddr"
                    placeholder="고객주소"
                    onChange={handleInputChange}
                    value={customerSearch.customerAddr}
                    onKeyPress={handleKeyPress}
                    required
                />
            </div>

            <div className="filter-item">
                <label className="filter-label" htmlFor="postNum">우편번호</label>
                <input
                    className="filter-input"
                    type="text"
                    id="postNum"
                    placeholder="우편번호"
                    onChange={handleInputChange}
                    value={customerSearch.postNum}
                    onKeyPress={handleKeyPress}
                    required
                />
            </div>

            <div className="filter-item">
                <label className="filter-label" htmlFor="nation">국가</label>
                <input
                    className="filter-input"
                    type="text"
                    id="nation"
                    placeholder="국가"
                    onChange={handleInputChange}
                    value={customerSearch.nation}
                    onKeyPress={handleKeyPress}
                    required
                />
            </div>

            <div className="filter-item">
                <label className="filter-label" htmlFor="picName">담당자명</label>
                <input
                    className="filter-input"
                    type="text"
                    id="picName"
                    placeholder="담당자명"
                    onChange={handleInputChange}
                    value={customerSearch.picName}
                    onKeyPress={handleKeyPress}
                    required
                />
            </div>

            <div className="filter-item">
                <label className="filter-label" htmlFor="picEmail">담당자 이메일</label>
                <input
                    className="filter-input"
                    type="text"
                    id="picEmail"
                    placeholder="담당자 이메일"
                    onChange={handleInputChange}
                    value={customerSearch.picEmail}
                    onKeyPress={handleKeyPress}
                    required
                />
            </div>

            <div className="filter-item">
                <label className="filter-label" htmlFor="picTel">담당자 연락처</label>
                <input
                    className="filter-input"
                    type="text"
                    id="picTel"
                    placeholder="담당자 연락처"
                    onChange={handleInputChange}
                    value={customerSearch.picTel}
                    onKeyPress={handleKeyPress}
                    required
                />
            </div>

            <div className="filter-item">
                <label className="filter-label" htmlFor="dealType">거래 유형</label>
                <select
                    id="dealType"
                    className="filter-input"
                    onChange={handleInputChange}
                    value={customerSearch.dealType}
                    required
                >
                    <option value="" disabled>거래 유형 선택</option>
                    <option value="B2B">B2B</option>
                    <option value="B2C">B2C</option>
                    <option value="C2C">C2C</option>
                </select>
            </div>

            <div className="button-container">
                <button type="button" className="search-btn" onClick={handleSearchCustomer}>
                    <i className="bi bi-search search-icon"></i>
                </button>
            </div>

                        </div>
                    </div>
                </div>

                <button className="btn-common add" type="button" onClick={handleAddClick}>
                    고객 등록
                </button>

                <table className="search-table" style={{ marginTop: "50px" }}>
                    {showDelete && <button className='delete-btn btn-common' onClick={handleDeleteClick}>삭제</button>}
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


                        </tr>
                    </thead>

                    <tbody>
                        {sortedData.length > 0 ? (
                            sortedData.map((item, index) => (
                                <tr key={index} className={checkItem[index] ? 'selected-row' : ''} onDoubleClick={() => {
                                    handleModify(item);
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
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colspan="12">등록된 상품이 없습니다<i className="bi bi-emoji-tear"></i></td>
                            </tr>
                        )}
                        <tr>
                            <td colspan="10"></td>
                            <td colspan="2"> {customer.length} 건</td>
                        </tr>
                    </tbody>
                </table>
            </div>


            {/* 고객 등록 모달 */}
            {isVisible && (
                <div className="confirmRegist">
                    <div className="fullBody">
                        <div className="form-container">
                            <button className="close-btn" onClick={handleCloseClick}> &times; </button>
                            <div className="form-header">
                                <h1> 고객 등록 </h1>
                                <div className="btns">
                                    <button type="button" onClick={onClickRegistBtn}> 등록하기 </button>
                                </div>
                            </div>

                            <div className="RegistForm">
                                <table className="formTable">
                                    <tbody>
                                        {/* 고객 번호 */}
                                        <tr>
                                            <th><label htmlFor="customerNo">고객 번호</label></th>
                                            <td><input type="number" placeholder="필드 입력" id="customerNo" name="customerNo" value={regist.customerNo} onChange={handleInputAddChange} /></td>

                                            <th><label htmlFor="customerName">고객명</label></th>
                                            <td><input type="text" placeholder="필드 입력" id="customerName" name="customerName" value={regist.customerName} onChange={handleInputAddChange} /></td>
                                        </tr>

                                        {/* 고객 주소 */}
                                        <tr>
                                            <th><label htmlFor="customerAddr">고객 주소</label></th>
                                            <td>
                                                <input type="text" placeholder="필드 입력" id="customerAddr" name="customerAddr" value={regist.customerAddr} readOnly />
                                                <button type="button" onClick={openAddressModal}>주소 찾기</button>
                                            </td>

                                            <th><label htmlFor="postNum">우편번호</label></th>
                                            <td><input type="text" placeholder="필드 입력" id="postNum" name="postNum" value={regist.postNum} readOnly /></td>
                                        </tr>

                                        {/* 나머지 필드들 */}
                                        <tr>
                                            <th><label htmlFor="customerTel">고객 연락처</label></th>
                                            <td><input type="text" placeholder="필드 입력" id="customerTel" name="customerTel" value={regist.customerTel} onChange={handleInputAddChange} /></td>

                                            <th><label htmlFor="businessRegistrationNo">사업자 등록 번호</label></th>
                                            <td><input type="text" placeholder="필드 입력" id="businessRegistrationNo" name="businessRegistrationNo" value={regist.businessRegistrationNo} onChange={handleInputAddChange} /></td>
                                        </tr>

                                        {/* 기타 필드 */}
                                        <tr>
                                            <th><label htmlFor="nation">국가</label></th>
                                            <td><input type="text" placeholder="필드 입력" id="nation" name="nation" value={regist.nation} onChange={handleInputAddChange} /></td>

                                            <th><label htmlFor="dealType">거래유형</label></th>
                                            <td><input type="text" placeholder="필드 입력" id="dealType" name="dealType" value={regist.dealType} onChange={handleInputAddChange} /></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className="btn-add">
                                <button className="btn-common btn-add-p" onClick={onClickListAdd}> 추가</button>
                            </div>

                            {/* 주소 모달 */}
                            {isAddressModalVisible && (
                                <div className="confirmRegist">
                                    <div className="fullBody">
                                        <div className="form-container">
                                            <button className="close-btn" onClick={closeAddressModal}> &times; </button>
                                            <div className="form-header">
                                                <h1>주소 입력</h1>
                                            </div>
                                            <AddressInput onAddressConfirm={(addrObj) => handleAddressConfirm(addrObj, true)} /> {/* 주소 입력 컴포넌트 */}
                                        </div>
                                    </div>
                                </div>
                            )}
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
                                <h1>고객 정보 수정</h1>
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
                                            <th colSpan="1"><label htmlFor="customerNo">고객 번호</label></th>
                                            <td colSpan="2"><input type="number" placeholder="필드 입력" id="customerNo" name="customerNo" value={modifyItem.customerNo || ''} onChange={handleModifyItemChange} /></td>

                                            <th colSpan="1"><label htmlFor="customerName">고객명</label></th>
                                            <td colSpan="2"><input type="text" placeholder="필드 입력" id="customerName" name="customerName" value={modifyItem.customerName || ''} onChange={handleModifyItemChange} /></td>

                                            <th colSpan="1"><label htmlFor="customerAddr">고객 주소</label></th>
                                            <td colSpan="2">
                                                <input
                                                    type="text"
                                                    placeholder="필드 입력"
                                                    id="customerAddr"
                                                    name="customerAddr"
                                                    value={modifyItem.customerAddr || ''} // 상태 값 사용
                                                    readOnly // 수동 입력 불가
                                                />
                                                <button type="button" onClick={openAddressModal}>주소 찾기</button> {/* 주소 찾기 버튼 */}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th colSpan="1"><label htmlFor="customerTel">고객 연락처</label></th>
                                            <td colSpan="2"><input type="text" placeholder="필드 입력" id="customerTel" name="customerTel" value={modifyItem.customerTel || ''} onChange={handleModifyItemChange} /></td>

                                            <th colSpan="1"><label htmlFor="postNum">우편번호</label></th>
                                            <td colSpan="2">
                                                <input
                                                    type="text"
                                                    placeholder="필드 입력"
                                                    id="postNum"
                                                    name="postNum"
                                                    value={modifyItem.postNum || ''} // 상태 값 사용
                                                    readOnly // 수동 입력 불가
                                                />
                                            </td>

                                            <th colSpan="1"><label htmlFor="businessRegistrationNo">사업자 등록 번호</label></th>
                                            <td colSpan="2"><input type="text" placeholder="필드 입력" id="businessRegistrationNo" name="businessRegistrationNo" value={modifyItem.businessRegistrationNo || ''} onChange={handleModifyItemChange} /></td>
                                        </tr>
                                        <tr>
                                            <th colSpan="1"><label htmlFor="nation">국가</label></th>
                                            <td colSpan="2"><input type="text" placeholder="필드 입력" id="nation" name="nation" value={modifyItem.nation || ''} onChange={handleModifyItemChange} /></td>

                                            <th colSpan="1"><label htmlFor="dealType">거래유형</label></th>
                                            <td colSpan="2"><input type="text" placeholder="필드 입력" id="dealType" name="dealType" value={modifyItem.dealType || ''} onChange={handleModifyItemChange} /></td>

                                            <th colSpan="1"><label htmlFor="picName">담당자명</label></th>
                                            <td colSpan="2"><input type="text" placeholder="필드 입력" id="picName" name="picName" value={modifyItem.picName || ''} onChange={handleModifyItemChange} /></td>
                                        </tr>
                                        <tr>
                                            <th colSpan="1"><label htmlFor="picEmail">담당자 이메일</label></th>
                                            <td colSpan="2"><input type="text" placeholder="필드 입력" id="picEmail" name="picEmail" value={modifyItem.picEmail || ''} onChange={handleModifyItemChange} /></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    {/* 주소 모달 */}
                    {isAddressModalVisible && (
                        <div className="confirmRegist">
                            <div className="fullBody">
                                <div className="form-container">
                                    <button className="close-btn" onClick={closeAddressModal}>
                                        &times;
                                    </button>
                                    <div className="form-header">
                                        <h1>주소 입력</h1>
                                    </div>
                                    <AddressInput onAddressConfirm={(addrObj) => handleAddressConfirm(addrObj, false)} /> {/* 주소 입력 컴포넌트 */}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}



            {/* 새로운 모달창 */}
            {isVisibleDetail && (
                <div> 추가 모달창  </div>
            )}
        </div>

    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Customer />
);