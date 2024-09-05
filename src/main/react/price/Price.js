import axios from 'axios';
import React, {useState} from 'react';
import ReactDOM from "react-dom/client";
import './Price.css'

function Price() {
    let [price, setPrice] = useState(0);
    let [user, setUser] = useState({id:0, pw:0});

    let handleBtn = async () => {
        // let data = await fetch('/test/get').then(res => res.json());
        let {data} = await axios.get('/test/get');
        console.log(data);

        setUser({id:data.id, pw:data.pw});
    }

    return (

        <div>
            <div>
                <button type="button" onClick={handleBtn}>test</button>
                <h1>{user.id} - {user.pw}</h1>
            </div>

            <h1><i className="bi bi-search"></i> 결재 리스트 </h1>

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
                        <input className="filter-input" type="date" id="date" required/>
                    </div>

                    <div className="filter-row">
                        <label className="filter-label" for="manager">담당자</label>
                        <input className="filter-input" type="text" id="manager" placeholder="담당자" required/>
                    </div>

                    <div className="filter-row">
                        <label className="filter-label" for="warehouse">창고</label>
                        <input className="filter-input" type="text" id="warehouse" placeholder="출하창고" required/>
                    </div>

                    <div className="filter-row">
                        <label className="filter-label" for="transaction">거래처</label>
                        <input className="filter-input" type="text" id="transaction" placeholder="거래처" required/>
                    </div>

                    <div className="filter-row">
                        <label className="filter-label" for="department">부서</label>
                        <input className="filter-input" type="text" id="department" placeholder="부서" required/>
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
                        <input className="filter-input" type="text" id="warehouse" placeholder="출하창고" required/>
                    </div>

                    <div className="filter-row">
                        <label className="filter-label" for="transaction">거래처</label>
                        <input className="filter-input" type="text" id="transaction" placeholder="거래처" required/>
                    </div>

                    <div className="filter-row">
                        <label className="filter-label" for="department">부서</label>
                        <input className="filter-input" type="text" id="department" placeholder="부서" required/>
                    </div>


                    <button className="filter-button">조회</button>
                </div>


                <table className="seacrh-table">
                    <thead>
                    <tr>
                        <th><input type="checkbox"/></th>
                        <th> No.</th>
                        <th>고객 번호</th>
                        <th>업체명</th>
                        <th>업체주소</th>
                        <th>우편번호</th>
                        <th>사업자등록번호</th>
                        <th>업체 연락처</th>
                        <th>담당자명</th>
                        <th>부담당자명</th>
                        <th>담당자 이메일</th>
                        <th>담당자 번호</th>
                        <th>담당자 이메일</th>
                        <th>담당자 번호</th>
                        <th> 국가</th>
                        <th>거래유형</th>
                    </tr>
                    </thead>
                    <tbody>
                    {/*<tr>*/}
                    {/*    <td> <input type="checkbox"/></td>*/}
                    {/*    <td>1</td>*/}
                    {/*    <td>삼국지</td>*/}
                    {/*    <td>1234</td>*/}
                    {/*    <td>반려됨</td>*/}
                    {/*    <td>12345</td>*/}
                    {/*    <td>123-45-67890</td>*/}
                    {/*    <td>02-1234-5678</td>*/}
                    {/*    <td><i className="bi bi-search"></i></td>*/}
                    {/*    <td>이영희</td>*/}
                    {/*    <td>kim@abc.com</td>*/}
                    {/*    <td>010-1234-5678</td>*/}
                    {/*    <td>lee@abc.com</td>*/}
                    {/*    <td>010-8765-4321</td>*/}
                    {/*    <td>대한민국</td>*/}
                    {/*    <td>수출</td>*/}
                    {/*</tr>*/}

                    <tr>
                        <td><input type="checkbox"/></td>
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
                        <td>010-1234-5678</td>
                        <td>lee@abc.com</td>
                        <td>010-8765-4321</td>
                        <td>대한민국</td>
                        <td>수출</td>
                    </tr>
                    </tbody>
                </table>
            </div>


        </div>

    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Price/>
);