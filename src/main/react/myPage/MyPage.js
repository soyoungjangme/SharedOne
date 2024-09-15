import React, { useEffect, useState } from 'react';
import ReactDOM from "react-dom/client";
import './MyPage.css';
import MonthlySalesChart from '../main/MonthlySalesChart';
import axios from 'axios';

function MyPage() {
  const [mypageAll, setMypageAll] = useState('');
  const [session, setSession] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    employeeId : '',
    employeeTel: '',
    employeeEmail: '',
    employeeAddr: '',
  }); // 수정용 데이터 상태

  // 메인 리스트 가져오기 axios
  useEffect(() => {
    axios.get('/mypage/mypageSession')
      .then(response => setSession(response.data))
      .catch(error => console.error('Error', error));
  }, []);

    // session 상태가 변경될 때마다 editData 업데이트
    useEffect(() => {
      if (session) {
        setEditData(prevData => ({
          ...prevData,
          employeeId: session
        }));
      }
    }, [session]);

  console.log(session);
  console.log(editData);

  // 세션 값이 업데이트되었을 때 메인 리스트 가져오기
  useEffect(() => {
    if (session) {
      axios.post('/mypage/mypageAll', null, {
        params: { employeeId: session }
      })
        .then(response => {
          setMypageAll(response.data);
          setEditData(response.data); // 수정용 데이터 초기화
        })
        .catch(error => console.error('Error fetching employee data:', error));
    }
  }, [session]);

  // 입력 필드 값 변경 핸들러
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditData({ ...editData, [name]: value });

  };
  console.log(editData);

  // 세션 값이 업데이트되었을 때 메인 리스트 가져오기

const employeeUpdateMypage = () => {
   if (window.confirm('수정하시겠습니까?')) {
     axios.post('/mypage/employeeUpdateMypage', editData)
       .then(response => {
         // 수정 완료 후 리스트를 새로 가져오기
         return axios.post('/mypage/mypageAll', null, {
           params: { employeeId: editData.employeeId }
         });
       })
       .then(response => {
         setMypageAll(response.data); // 수정된 데이터를 리스트에 반영
         alert("수정이 완료되었습니다.");
         setIsEditing(false);
       })
       .catch(error => console.error('Error updating employee data:', error));
   }
  };


  // 수정 모드 토글
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  // 수정 취소
  const handleCancel = () => {
    setIsEditing(false);
    setEditData(mypageAll); // 원래 데이터로 복원
  };

  // 수정 완료 (추후 서버에 업데이트 로직 추가 가능)
  const handleSave = () => {
    setMypageAll(editData);
    setIsEditing(false);
    // 여기에 서버로 수정된 데이터를 전송하는 로직 추가 가능
  };

  // 주민번호의 뒷자리를 마스킹하는 함수
  const maskSSN = (ssn) => {
    if (!ssn) return '';
    const [front, back] = ssn.split('-');
    return `${front}-******`;
  };

  return (
    <div>
      <h1 className="header"><i className="bi bi-tag"></i>마이페이지</h1>
      <div className="mypage-main">
        <div className="mypage-table">
          <table>
            <tr>
              <td><label htmlFor="employeeId">아이디</label></td>
              <td><input type="text" id="employeeId" name="employeeId" value={mypageAll.employeeId || ''} disabled /></td>
            </tr>
            <tr>
              <td><label htmlFor="employeePw">비밀번호</label></td>
              <td><input type="password" id="employeePw" name="employeePw" value={mypageAll.employeePw || ''} disabled /></td>
            </tr>
            <tr>
              <td><label htmlFor="employeeName">이름</label></td>
              <td><input type="text" id="employeeName" name="employeeName" value={mypageAll.employeeName || ''} disabled /></td>
            </tr>
            <tr>
              <td><label htmlFor="phone">전화번호</label></td>
              <td><input type="tel" id="phone" name="employeeTel" value={editData.employeeTel || ''} disabled={!isEditing} onChange={handleInputChange} /></td>
            </tr>
            <tr>
              <td><label htmlFor="email">이메일</label></td>
              <td><input type="email" id="email" name="employeeEmail" value={editData.employeeEmail || ''} disabled={!isEditing} onChange={handleInputChange} /></td>
            </tr>
            <tr>
              <td><label htmlFor="address">주소</label></td>
              <td><input type="text" id="address" name="employeeAddr" value={editData.employeeAddr || ''} disabled={!isEditing} onChange={handleInputChange} /></td>
            </tr>
            <tr>
              <td><label htmlFor="hireDate">입사일</label></td>
              <td><input type="date" id="hireDate" name="hireDate" value={mypageAll.hireDate || ''} disabled /></td>
            </tr>
            <tr>
              <td><label htmlFor="salary">급여</label></td>
              <td><input type="number" id="salary" name="salary" value={mypageAll.salary || ''} disabled /></td>
            </tr>
            <tr>
              <td><label htmlFor="supervisor">직속상사</label></td>
              <td><input type="text" id="supervisor" name="employeeManagerId" value={mypageAll.employeeManagerId || ''} disabled /></td>
            </tr>
            <tr>
              <td><label htmlFor="role">권한</label></td>
              <td><input type="text" id="role" name="authorityName" value={mypageAll.authorityName || ''} disabled /></td>
            </tr>
          </table>

          <div className="form-actions">
            {isEditing ? (
              <>
                <button type="button" className="submit-btn" onClick={employeeUpdateMypage}>수정완료</button>
                <button type="button" className="cancel-btn" onClick={handleCancel}>취소</button>
              </>
            ) : (
              <button type="button" className="submit-btn" onClick={handleEditToggle}>수정하기</button>
            )}
          </div>
        </div>

        <div className="mypage-chart">
          <h2 className="header"><i className="bi bi-graph-up"></i> 이번 달 실적</h2>
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
