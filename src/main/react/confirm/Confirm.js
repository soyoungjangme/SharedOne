import React, {useState} from 'react';
import ReactDOM from "react-dom/client";
import './Confirm.css';

function Confirm() {

    /*li 태그로 값 불러오기 연습 */
    let [confirmList, setConfirmList] = useState([]);
    const handleClick = async () => {
        let response = await fetch('/confirm/get?allId=1,2,3');
        let data = await response.json();

        if (Array.isArray(data)) {
            setConfirmList(data);
        }
    };

    /*모달 창 띄우기 연습*/
    const [openModal, setOpenModal] = useState(false);
    const handleOpenClick = () => {
        setOpenModal(true);
    };
    const handleCloseClick = () => {
        setOpenModal(false);
    };


    return (
        <div>
            <div>
                {confirmList.map(item => (
                    <li key={item.confirmNo}>결재 번호: {item.confirmNo} | 결재 여부: {item.confirmStatus} | 결재
                        제목: {item.confirmTitle} | 결재 내용 : {item.confirmContent} | 결재 요청일 : {item.confirmRegDate}</li>
                ))}
            </div>

            <h1> 결재 리스트 </h1>

            <div className="main-container">
                <div className="filter-container">

                    <div className="filter-row">
                        <label className="filter-label" htmlFor="customerName">고객명</label>
                        <input className="filter-input" type="text" id="customerName" placeholder="고객명"
                               required/>
                    </div>

                    <div className="filter-row">
                        <label className="filter-label" htmlFor="employeeName">담당자</label>
                        <input className="filter-input" type="text" id="employeeName" placeholder="담당자"
                               required/>
                    </div>

                    <div className="filter-row">
                        <label className="filter-label" htmlFor="confirmRegDate">등록 일자</label>
                        <input className="filter-input" type="date" id="confirmRegDate" required/>
                    </div>

                    <div className="filter-row">
                        <label className="filter-label" htmlFor="confirmConfirmDate">승인 일자</label>
                        <input className="filter-input" type="date" id="confirmConfirmDate" required/>
                    </div>

                    <div className="filter-row">
                        <label className="filter-label" htmlFor="confirmStatus">결재 여부</label>
                        <select className="filter-select" id="confirmStatus" required>
                            <option value="승인">승인</option>
                            <option value="진행 중">대기</option>
                            <option value="반려">반려</option>
                        </select>
                    </div>

                    <button className="filter-button" onClick={handleClick}>조회</button>
                </div>

                <button type="button" className="confirm-selected" onClick={handleOpenClick}>수정</button>

                <table className="seacrh-table">
                    <thead>
                    <tr>
                        <th>No.</th>
                        <th>고객명</th>
                        <th>상품 종류</th>
                        <th>상품명</th>
                        <th>상품 수량</th>
                        <th>판매가(원)</th>
                        <th>총 금액(원)</th>
                        <th>담당자</th>
                        <th>담당자 연락처</th>
                        <th>결재자</th>
                        <th>결재 여부</th>
                        <th>비고</th>
                        <th>결재 승인일</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>1</td>
                        <td>교보문고 강남점</td>
                        <td>도서</td>
                        <td>삼국지 -상-</td>
                        <td>1500</td>
                        <td>1000</td>
                        <td>1,500,000</td>
                        <td>유선화</td>
                        <td>010-1234-5678</td>
                        <td>이기성</td>
                        <td>승인</td>
                        <td></td>
                        <td>2024-09-06</td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>알라딘 선릉점</td>
                        <td>도서</td>
                        <td>인간실격</td>
                        <td>11000</td>
                        <td>100</td>
                        <td>1,100,000</td>
                        <td>홍길동</td>
                        <td>010-1111-5578</td>
                        <td>이기성</td>
                        <td>승인</td>
                        <td></td>
                        <td>2024-09-06</td>
                    </tr>
                    <tr>
                        <td>3</td>
                        <td>교보문고 이대점</td>
                        <td>도서</td>
                        <td>무인도에서 살아남기1</td>
                        <td>10000</td>
                        <td>1000</td>
                        <td>10,000,000</td>
                        <td>이순신</td>
                        <td>010-5464-5545</td>
                        <td>이기성</td>
                        <td>대기</td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>4</td>
                        <td>YES24 신림점</td>
                        <td>도서</td>
                        <td>나는 누구인가</td>
                        <td>8000</td>
                        <td>100</td>
                        <td>800,000</td>
                        <td>아무개</td>
                        <td>010-2134-5655</td>
                        <td>이기성</td>
                        <td>반려</td>
                        <td>재고 부족</td>
                        <td></td>
                    </tr>
                    </tbody>
                </table>
            </div>

{/*모달 창 띄우기 연습2*/}
            {openModal && (
                <div className="confirmRegist">
                    <div className="fullBody">
                        <div className="form-container">
                            <div className="form-header">
                                <h1>주문 및 결재 상세 조회</h1>

                                <div className="btns">
                                    <div className="btn-add">
                                        <button>수정</button>
                                    </div>
                                    <div className="btn-close" onClick={handleCloseClick}>
                                        <button> x </button>
                                    </div>
                                </div>
                            </div>

                            <div className="RegistForm">
                                <table className="formTable">
                                    <tr>
                                        <th colSpan="1"><label htmlFor="">고객사명</label></th>
                                        <td colSpan="3"><input type="text" placeholder="필드 입력" /></td>
                                        <th colSpan="1"><label htmlFor="">담당자명</label></th>
                                        <td colSpan="3"><input type="text" placeholder="필드 입력" /></td>
                                    </tr>

                                    <tr>
                                        <th><label htmlFor="">상품종류</label></th>
                                        <td>
                                            <select>
                                                <option>도서</option>
                                                <option>MD</option>
                                                <option>기타</option>
                                            </select>
                                        </td>
                                        <th><label htmlFor="">상품명</label></th>
                                        <td><input type="text" placeholder="필드 입력"/></td>
                                        <th><label htmlFor="">상품수량</label></th>
                                        <td><input type="text" placeholder="필드 입력"/></td>
                                    </tr>

                                    <tr>
                                        <th><label htmlFor="">총 금액</label></th>
                                        <td><input type="text" placeholder="필드 입력"/></td>
                                        <th><label htmlFor="">납품요청일</label></th>
                                        <td><input type="date" placeholder="필드 입력"/></td>
                                        <th><label htmlFor="">판매 시작날짜</label></th>
                                        <td><input type="date" placeholder="필드 입력"/></td>
                                        <th><label htmlFor="">판매 종료날짜</label></th>
                                        <td><input type="date" placeholder="필드 입력"/></td>
                                    </tr>

                                    <tr>
                                        <th><label htmlFor="">결재자</label></th>
                                        <td><input type="text" placeholder="필드 입력" /></td>
                                        <th><label htmlFor="">결재 여부</label></th>
                                        <td>
                                            <select>
                                                <option value="pending">진행 중</option>
                                                <option value="approved">승인</option>
                                                <option value="rejected">반려</option>
                                            </select>
                                        </td>
                                        <th><label htmlFor="">결재 승인일</label></th>
                                        <td><input type="date" placeholder="필드 입력" /></td>
                                    </tr>

                                    <tr>
                                        <th colSpan="1"><label htmlFor="">비고</label></th>
                                        <td colSpan="7">
                                            <input type="text" placeholder="필드 입력" />
                                        </td>
                                    </tr>
                                </table>

                                <div className="btn-add">
                                    <button>추가</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Confirm/>
);