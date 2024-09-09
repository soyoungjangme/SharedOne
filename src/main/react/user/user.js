import React, { useState } from 'react';
import ReactDOM from "react-dom/client";
import './user.css'
import {useEffect} from 'react';
import useCheckboxManager from "../js/CheckboxManager";
import axios from 'axios';


function User() {

    let [employee, setEmployee] = useState([{
          employeeId: '',
            employeePw: '',
            employeeName: '',
            employeeTel: '',
            employeeEmail: '',
            employeeAddr: '',
            residentNum: '',
            hireDate: null,
            salary: 0,
            employeeManagerId: '',
            authorityGrade: ''
    }]);


    let [emSearch, setEmSearch] = useState({
          employeeId: '',
            employeeName: '',
            employeeTel: '',
            employeeEmail: '',
            employeeAddr: '',
            hireDate: null,
            employeeManagerId: '',
            authorityGrade: ''
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



    useEffect(() => {
        axios.get('/employee/employeeALL')  // Spring Boot 엔드포인트와 동일한 URL로 요청
          .then(response => setEmployee(response.data))  // 응답 데이터를 상태로 설정
          .catch(error => console.error('Error fetching employee data:', error));
      }, []);


const handleSearchEmployee = () => {
  if (emSearch) {
    axios.post('/employee/employeeSearch', emSearch, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => setEmployee(response.data))
    .catch(error => console.error('에러에러', error));
  } else {
    console.error('[핸들러 작동 잘 함]');
  }
};



//
//
//useEffect( () => {
//	    let effectEmployee = async () => {
//            let data = await fetch('/employee/employee').then(res => res.json());
//            console.log(JSON.stringify(data));
//
//            setEmployee(data);
//            setOrder(data);
////              console.log('Type of data.employeeId:', typeof data.employeeId);
//
//        }
//
//        effectEmployee();
//}, []);



    return (
        <div>

  <h1>직원 목록</h1>

            <div className="pageHeader"><h1><i className="bi bi-search"></i>상품 관리</h1></div>

            <div className="main-container">
                <div className="filter-container">

                    {/* <div className="filter-row">
                        <label className="filter-label" htmlFor="date">일자</label>
                        <input className="filter-input" type="date" id="date" required />
                    </div> */}

                    <div className="filter-row">
                        <label className="filter-label" htmlFor="employeeId" >직원아이디</label>
                        <input className="filter-input" type="text" id="employeeId" placeholder="" onChange={handleInputChange}  value={emSearch.employeeId} required/>
                    </div>

                    <div className="filter-row">
                        <label className="filter-label" htmlFor="employeeName">직원이름</label>
                        <input className="filter-input" type="text" id="employeeName" placeholder="" onChange={handleInputChange}  value={emSearch.employeeName} r required/>
                    </div>

                    <div className="filter-row">
                        <label className="filter-label" htmlFor="employeeTel">직원전화번호</label>
                        <input className="filter-input" type="text" id="employeeTel" placeholder="" onChange={handleInputChange}  value={emSearch.employeeTel}  required/>
                    </div>

                    <div className="filter-row">
                        <label className="filter-label" htmlFor="employeeEmail">직원이메일</label>
                        <input className="filter-input" type="text" id="employeeEmail" placeholder="" onChange={handleInputChange}  value={emSearch.employeeEmail}  required/>
                    </div>

                    <div className="filter-row">
                        <label className="filter-label" htmlFor="employeeAddr">주소</label>
                        <input className="filter-input" type="text" id="employeeAddr" placeholder="" onChange={handleInputChange}  value={emSearch.employeeAddr}  required/>
                    </div>

                    <div className="filter-row">
                        <label className="filter-label" htmlFor="hireDate">입사일</label>
                        <input className="filter-input" type="text" id="hireDate" placeholder=""  onChange={handleInputChange}  value={emSearch.hireDate}  required/>
                    </div>


                          <div className="filter-row">
                              <label className="filter-label" htmlFor="employeeManagerId">직속 상사</label>
                              <input className="filter-input" type="text" id="employeeManagerId" placeholder=""  onChange={handleInputChange}  value={emSearch.employeeManagerId}  required/>
                          </div>
                     <div className="filter-row">
                       <label htmlFor="authorityGrade">권한</label>
                       <select id="authorityGrade" onChange={handleInputChange} value={emSearch.authorityGrade}>
                         <option value="">선택하세요</option>


                         <option value="S">S</option>
                          <option value="A">A</option>
                        <option value="B">C</option>
                         <option value="C">C</option>

                       </select>
                     </div>


                    <button className="filter-button" onClick={handleSearchEmployee}> 조회 </button>
                </div>

                <table className="seacrh-table">
                    <thead>
                    <tr>
                        <th><input type="checkbox"/></th>
                        <th> No.</th>
                        <th>상품코드
                        </th>
                        <th>상품명
                        </th>
                        <th>상품저자
                        </th>
                        <th>상품카테고리
                        </th>
                        <th>상품수량
                        </th>
                        <th>상품종류
                        </th>
                        <th>상품원가
                        </th>
                        <th>상품활성화
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                  {employee.length > 0 ? (
                    employee.map((employee, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{employee.employeeId}</td>
                        <td>{employee.employeePw}</td>
                        <td>{employee.employeeName} <i className="bi bi-search details" /></td>
                        <td>{employee.employeeTel}</td>
                        <td>{employee.employeeEmail}</td>
                        <td>{employee.employeeAddr}</td>
                        <td>{employee.residentNum}</td>
                        <td>{employee.hireDate}</td>
                        <td>{employee.salary}</td>
                        <td>{employee.employeeManagerId}</td>
                        <td>{employee.authorityGrade}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="12">등록된 직원이 없습니다😭</td>
                    </tr>
                  )}
                    <tr>
                        <td colspan="9"></td>
                        <td colspan="1"> {employee.length} 건</td>
                    </tr>

                    </tbody>
                </table>

        </div>
      ))}




















        </div>


    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <User />
);