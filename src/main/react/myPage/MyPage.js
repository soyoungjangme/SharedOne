import React from 'react';
import ReactDOM from "react-dom/client";
import './MyPage.css';
import{ useEffect, useState } from 'react';
import MonthlySalesChart from '../main/MonthlySalesChart';
import axios from 'axios';


function MyPage() {

  const [mypageAll, setMypageAll] = useState('');
  const [session, setSession] = useState('');

    // 메인 리스트 가져오기 axios
    useEffect(() => {
       axios.get('/mypage/mypageSession')  // Spring Boot 엔드포인트와 동일한 URL로 요청
              .then(response => setSession(response.data))  // 응답 데이터를 상태로 설정
              .catch(error => console.error('Error', error));
    }, []);

 // 세션 값이 업데이트되었을 때 메인 리스트 가져오기
    useEffect(() => {
        if (session) {  // session 값이 존재할 때만 요청
              axios.post('/mypage/mypageAll', null, {
                      params: { employeeId: session }
                  })
                .then(response => setMypageAll(response.data))
                .catch(error => console.error('Error fetching employee data:', error));
        }
    }, [session]);  // session 값이 변경될 때마다 실행

    console.log("세션이야" + session);
    console.log("세션이야" + JSON.stringify(mypageAll));


  // 주민번호의 뒷자리를 마스킹하는 함수
  const maskSSN = (ssn) => {
    if (!ssn) return '';
    const [front, back] = ssn.split('-');
    return `${front}-******`;
  };

    return (

        <div>
 <h1 className="header"><i class="bi bi-tag"></i>마이페이지  </h1>
  <div className="mypage-main">

<div className="mypage-table">
        <table>
            <tr>
                <td><label for="employeeId">아이디</label></td>
                <td><input type="text" id="employeeId" name="employeeId" value={mypageAll.employeeId || ''} disabled /></td>
            </tr>
            <tr>
                <td><label for="employeePw">비밀번호</label></td>
                <td><input type="password" id="employeePw" name="employeePw" value={mypageAll.employeePw || ''} disabled/></td>

            </tr>
            <tr>
                <td><label for="employeeName">이름</label></td>
                <td><input type="text" id="employeeName" name="employeeName" value={mypageAll.employeeName || ''} disabled/></td>
            </tr>
            <tr>
                <td><label for="phone">전화번호</label></td>
                <td><input type="tel" id="phone" name="phone" value={mypageAll.employeeTel || ''} disabled/></td>
            </tr>
            <tr>
                <td><label for="email">이메일</label></td>
                <td><input type="email" id="email" name="email" value={mypageAll.employeeEmail || ''} disabled/></td>
            </tr>
            <tr>
                <td><label for="address">주소</label></td>
                <td><input type="text" id="address" name="address" value={mypageAll.employeeAddr || ''} disabled/></td>
            </tr>
       {/*     <tr>
              <td><label for="ssn">주민번호</label></td>
              <td>
                  <input
                      type="text"
                      id="ssn"
                      name="ssn"
                      value={maskSSN(mypageAll.residentNum) || ''}
                      disabled
                      />
              </td>
            </tr>*/}
            <tr>
                <td><label for="hireDate">입사일</label></td>
                <td><input type="date" id="hireDate" name="hireDate" value={mypageAll.hireDate || ''} disabled/></td>
            </tr>
            <tr>
                <td><label for="salary">급여</label></td>
                <td><input type="number" id="salary" name="salary" value={mypageAll.salary || ''} disabled/></td>
            </tr>
            <tr>
                <td><label for="supervisor">직속상사</label></td>
                <td><input type="text" id="supervisor" name="supervisor" value={mypageAll.employeeManagerId || ''} disabled/></td>
            </tr>
            <tr>
                <td><label for="role">권한</label></td>
               <td><input type="text" id="supervisor" name="supervisor" value={mypageAll.authorityName || ''} disabled/></td>
            </tr>
        </table>

        <div className="form-actions">
            <button type="submit" className="submit-btn">수정하기</button>

        </div>
</div>

    <div className="mypage-chart">
      <h2 className="header"><i class="bi bi-graph-up"></i> 이번 달 실적  </h2>
                <MonthlySalesChart />

    </div>

</div>

</div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <MyPage />
);