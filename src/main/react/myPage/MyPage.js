import React, { useEffect, useState } from 'react';
import ReactDOM from "react-dom/client";
import './MyPage.css';
import MonthlySalesChart from '../main/MonthlySalesChart';
import axios from 'axios';

function MyPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [error, setError] = useState('');

    const [mypageAll, setMypageAll] = useState('');
    const [session, setSession] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
      employeeId : '',
      employeeTel: '',
      employeeEmail: '',
      employeeAddr: '',
      employeePw: ''
    }); // 수정용 데이터 상태

  // Handle modal open/close
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  console.log(currentPassword);

  console.log(newPassword);
 console.log(mypageAll.employeePw);



const verifyCurrentPassword = async (currentPassword) => {
    console.log(currentPassword);
  try {
    // 현재 비밀번호를 서버에 요청
       const response = await axios.post('/mypage/mypagePwTest', currentPassword, {
         headers: {
           'Content-Type': 'application/json',
         },
       });


    // 서버로부터 받은 응답이 true(비밀번호 일치)인 경우
    if (response.data) {
      console.log('비밀번호가 일치합니다.');
      return true;
    } else {
      console.error('비밀번호가 일치하지 않습니다.');
      return false;
    }
  } catch (error) {
    console.error('비밀번호 검증 중 오류 발생:', error);
    return false;
  }
};


const handleSubmit = async () => {
  // 1. 모든 입력 필드가 채워졌는지 확인
  if (currentPassword === '' || newPassword === '' || confirmNewPassword === '') {
    setError('모든 입력 필드를 채워주세요.');
    return;
  }

  // 2. 기존 비밀번호가 일치하는지 확인
  const isPasswordValid = await verifyCurrentPassword(currentPassword);

  if (!isPasswordValid) {
    setError('기존 비밀번호가 일치하지 않습니다.');
    return;
  }

  // 3. 새로운 비밀번호와 확인 비밀번호가 일치하는지 확인
  if (newPassword !== confirmNewPassword) {
    setError('새로운 비밀번호와 비밀번호 확인이 일치하지 않습니다.');
    return;
  }

  // 비밀번호 변경 처리
  try {
    // editData 업데이트

    // 서버에 비밀번호 변경 요청
    await axios.post('/mypage/employeeUpdateMypagePw', {employeePw: newPassword , employeeId : session}, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    alert('비밀번호가 성공적으로 변경되었습니다.');
    setNewPassword('');
    setCurrentPassword('');
    setConfirmNewPassword('');
    closeModal(); // 모달 닫기
  } catch (err) {
    console.error('Error changing password:', err);
    setError('비밀번호 변경에 실패했습니다.');
  }
};

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

              <td>
                <button class="pw-btn" onClick={openModal}>비밀번호 변경</button>
              </td>
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
              <td><label htmlFor="residentNum">주민번호</label></td>
              <td>  <input
                      type="text"
                      id="residentNum"
                      name="residentNum"
                      value={maskSSN(mypageAll.residentNum) || ''}
                      disabled
                    /></td>
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



        {isModalOpen && (
              <div className="modal">
                <div className="modal-content">
                  <span className="close" onClick={closeModal}>&times;</span>
                  <h2>비밀번호 변경</h2>
                  <form>
                    <div>
                      <label>현재 비밀번호:</label>
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                    </div>
                    <div>
                      <label>새로운 비밀번호:</label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                    <div>
                      <label>새로운 비밀번호 확인:</label>
                      <input
                        type="password"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                      />
                    </div>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <button type="button" onClick={handleSubmit}>변경</button>
                    <button type="button" onClick={closeModal}>취소</button>
                  </form>
                </div>
              </div>
            )}

            {/* Add CSS styles for modal */}
            <style jsx>{`
              .modal {
                display: flex;
                justify-content: center;
                align-items: center;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
              }
              .modal-content {
                background: white;
                padding: 20px;
                border-radius: 5px;
                width: 300px;
                text-align: center;
              }
              .close {
                position: absolute;
                top: 10px;
                right: 10px;
                font-size: 20px;
                cursor: pointer;
              }
              form div {
                margin-bottom: 15px;
              }
              input {
                width: 100%;
                padding: 8px;
                box-sizing: border-box;
              }
              button {
                margin: 5px;
              }
            `}</style>




    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <MyPage />
);
