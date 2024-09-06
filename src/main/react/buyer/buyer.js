import React, { useState } from 'react'; //어느 컴포넌트이든 React임포트가 필요합니다.
import ReactDOM from 'react-dom/client'; //root에 리액트 돔방식으로 렌더링시 필요합니다.
import './buyer.css' //css파일 임포트
import axios from 'axios';

function Buyer() {

    //데이터 초기값
    let [customer, setCustomer] = useState({
        customerNo: 333, //고객번호
        customerName: "bana", //고객명
        customerAddr: "good", //고객주소
        customerTel: "010-1234-1234", //고객 연락처
        postNum: "12345", //우편번호
        businessRegistraionNo: "1212-2424", //사업자 등록 번호
        nation: "한국", //국가
        dealType: "거래", //거래 유형

        picName: "픽네임", //담당자명
        picEmail: "123", //담당자 이메일
        picTel: "3252", //담당자 연락처
        activated: "Y" //활성화
    });

    let handleBtn = async () => {
         let data = await fetch('/Customer_test/customer').then(res => res.json());
        console.log(data);
        console.log(customer.customerName);
        setCustomer(data);
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
                        <tr>

                            <td> <input type="checkbox" /></td>
                            <td>{customer.customerNo}</td>
                            <td>{customer.customerName}</td>
                            <td>{customer.customerAddr}</td>
                            <td>{customer.customerTel}</td>
                            <td>{customer.postNum}</td>
                            <td>{customer.businessRegistraionNo}</td>
                            <td>{customer.nation}</td>
                            <td><i className="bi bi-search">{customer.dealType}</i></td>
                            <td>{customer.picName}</td>
                            <td>{customer.picEmail}</td>
                            <td>{customer.picTel}</td>
                            <td>{customer.activated}</td>
                        </tr>

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
    <Buyer />
);


