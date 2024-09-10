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


        </div>

    );


}



//페이지 root가 되는 JS는 root에 삽입되도록 처리
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Customer />
);


