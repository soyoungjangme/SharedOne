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


    useEffect(() => {
        axios.get('/employee/employeeALL')  // Spring Boot 엔드포인트와 동일한 URL로 요청
          .then(response => setEmployee(response.data))  // 응답 데이터를 상태로 설정
          .catch(error => console.error('Error fetching employee data:', error));
      }, []);







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
      {employee.map((employee, index) => (
        <div key={index}>
          <p>아이디: {employee.employeeId}</p>
          <p>비밀번호: {employee.employeePw}</p>
          <p>이름: {employee.employeeName}</p>
          <p>전화번호: {employee.employeeTel}</p>
          <p>이메일: {employee.employeeEmail}</p>
          <p>주소: {employee.employeeAddr}</p>
          <p>주민번호: {employee.residentNum}</p>
          <p>입사일: {employee.hireDate}</p>
          <p>연봉: {employee.salary}</p>
          <p>관리자 ID: {employee.employeeManagerId}</p>
          <p>권한 등급: {employee.authorityGrade}</p>
          <hr />
        </div>
      ))}

        </div>

    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <User />
);