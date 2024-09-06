import React, { useState } from 'react';
import ReactDOM from "react-dom/client";
import './user.css'
import {useEffect} from 'react';


function User() {

// ---  모달창 띄우는 스크립트
  const [isVisible, setIsVisible] = useState(false);

  const handleAddClick = () => {
    setIsVisible(true);
  };

  const handleCloseClick = () => {
    setIsVisible(false);
  };

// --- 모달창 띄우는 스크립트


    let [employee, setEmployee] = useState([{
          employeeId: '',
            employeePw: '',
            employeeName: '',
            employeeTel: '',
            employeeEmail: '',
            employeeAddr: '',
            residentNum : '',
            hireDate: null,
            salary: 0,
            employeeManagerId: '',
            authorityGrade: ''
    }]);


useEffect( () => {
	    let effectEmployee = async () => {
            let data = await fetch('/employee/employee').then(res => res.json());
            setEmployee(data);
        }

        effectEmployee();
}, []);



  let handleBtn = async () => {
         alert('gg');
        let data = await fetch('/employee/employeeF').then(res => res.json());
        setEmployee(data);
    }


    return (
        <div>

            <div>
                <div>

                  </div>
            </div>


    <h1> <i className="bi bi-search"></i> 결재 리스트 </h1>

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


            <button className="filter-button" type="button" onClick="{handleBtn}">조회</button>
        </div>

      <button  className="filter-button" id="add" type="button" onClick={handleAddClick}>
        직원 등록
      </button>

            <table className="seacrh-table">
                <thead>
                    <tr>
                        <th><input type="checkbox"/></th>
                        <th> No.</th>
                        <th> 직원 아이디 </th>
                        <th> 직원 비밀번호 </th>
                        <th> 직원 이름 </th>
                        <th> 직원 번호 </th>
                        <th> 직원 이메일 </th>
                        <th> 직원 주소 </th>
                        <th> 주민등록번호 </th>
                        <th> 입사일 </th>
                        <th> 연봉 </th>
                        <th> 담당 매니저  </th>
                        <th> 권한 등급  </th>
                    </tr>
                </thead>

                <tbody>
                    {employee.map((item, index) => (
                        <tr key={item.employeeId}>
                            <td><input type="checkbox" /></td>
                             <td> {index + 1}</td>
                            <td>{item.employeeId}</td>
                            <td>{item.employeePw}</td>
                            <td>{item.employeeName}</td>
                            <td>{item.employeeTel}</td>
                            <td>{item.employeeEmail}</td>
                            <td>{item.employeeAddr}</td>
                            <td>{item.residentNum}</td>
                            <td>{item.hireDate}</td>
                            <td>{item.salary}</td>
                            <td>{item.employeeManagerId}</td>
                            <td>{item.authorityGrade}</td>
                        </tr>
                    ))}

                    </tbody>
            </table>
    </div>




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
        <button> 등록하기 </button>
      </div>
      <div class="btn-close">

      </div>
    </div>
    </div>


    <div class="RegistForm">
    <table class="formTable">

      <tr>

        <th colspan="1">    <label for="">직원 ID</label></th>
        <td colspan="3">   <input type="text" placeholder="필드 입력"/></td>

        <th colspan="1">    <label for="">직원 PW</label></th>
        <td colspan="3">    <input type="text" placeholder="필드 입력"/></td>

      </tr>



            <tr>
              <th>   <label for="">연락처</label></th>
              <td>    <input type="text" placeholder="필드 입력"/></td>


              <th>   <label for="">연락처</label></th>
              <td>    <input type="text" placeholder="필드 입력"/></td>


              <th>   <label for="">연락처</label></th>
              <td>    <input type="text" placeholder="필드 입력"/></td>
              <th>    <label for="">직원 ID</label></th>
              <td>   <input type="text" placeholder="필드 입력"/></td>

            </tr>



      <tr>
        <th colspan="1">   <label for="">연락처</label></th>
        <td colspan="3">    <input type="text" placeholder="필드 입력"/></td>

        <th colspan="1">   <label for="">연락처</label></th>
        <td colspan="3">    <input type="text" placeholder="필드 입력"/>  </td>
      </tr>



      <tr>

        <th colspan="1">   <label for="">연락처</label></th>
        <td colspan="3">        <select>
          <option>담당 직원</option>
        </select></td>

        <th colspan="1">   <label for="">연락처</label></th>
        <td colspan="3">       <select>
          <option>담당 직원</option>
        </select></td>
      </tr>





    </table>


    <div class="btn-add">
      <button>추가</button>
    </div>


  </div>

  <div class="RegistFormList">
      <div style={{fontWeight: 'bold'}}> 총 N 건 </div>
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
            <td><input type="checkbox"/> </td>
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
            <td colspan="12" > 합계 </td>
            <td colspan="2" > 13,000,000</td>
          </tr>

</tbody>
</table>
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
    <User />
);