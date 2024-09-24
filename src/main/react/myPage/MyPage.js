import React, { useEffect, useState } from 'react';
import ReactDOM from "react-dom/client";
import './MyPage.css';
import axios from 'axios';
import './MyPage_password.css';
import EmployeeMonthlySalesChart from "./EmployeeMonthlySalesChart";


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
    employeeId: '',
    employeeTel: '',
    employeeEmail: '',
    employeeAddr: '',
    employeePw: ''
  }); // 수정용 데이터 상태

  // Handle modal open/close
  const openModal = () => setIsModalOpen(true);
  const closeModal = () =>  {
    setIsModalOpen(false);

    // 비번 에러메시지, 입력필드 초기화
    setError('');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
  }

  //   // 세션 정보 가져오기
  //   useEffect(() => {
  //     const fetchSession = async () => {
  //         try {
  //             const response = await axios.get('/mypage/mypageSession');
  //             setSession(response.data);
  //         } catch (error) {
  //             console.error('Error fetching session:', error);
  //         }
  //     };
  //     fetchSession();
  // }, []);

  // // 사용자 정보 가져오기
  // useEffect(() => {
  //     if (session) {
  //         const fetchMypageData = async () => {
  //             try {
  //                 const response = await axios.post('/mypage/mypageAll', null, { params: { employeeId: session } });
  //                 setMypageAll(response.data);
  //                 setEditData(response.data);
  //             } catch (error) {
  //                 console.error('Error fetching employee data:', error);
  //             }
  //         };
  //         fetchMypageData();
  //     }
  // }, [session]);


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


  // 체크 카운트를 계산하는 함수
  const getCheckCount = (password) => {
    return [
      !/(.)\1{2,}/.test(password),  // 3자리 연속 문자 확인
      password.length >= 5,          // 비밀번호 길이 확인
      validPattern.test(password)    // 유효한 패턴 확인
    ].filter(Boolean).length;
  };



  // 아이디 및 비밀번호 문자 검증
  const validPattern = /^[a-zA-Z0-9!@#$%^&*()_+{}[\]:;"'<>,.?/~`|-]+$/;

  const handleSubmit = async () => {
    // 1. 모든 입력 필드가 채워졌는지 확인
    if (currentPassword === '' || newPassword === '' || confirmNewPassword === '') {
      setError('비밀번호를 입력해주세요.');
      return;
    }

    // 2. 현재 비밀번호가 일치하는지 확인
    const isPasswordValid = await verifyCurrentPassword(currentPassword);

    if (!isPasswordValid) {
      setError('현재 비밀번호가 일치하지 않습니다.');
      return;
    }

    // 3. 새로운 비밀번호와 확인 비밀번호가 일치하는지 확인
    if (newPassword !== confirmNewPassword) {
      setError('신규 비밀번호가 일치하지 않습니다.');
      return;
    }

    // 현재 비밀번호와 신규 비밀번호가 같은지 확인
    if (currentPassword === newPassword) {
      setError('현재 비밀번호와 동일한 비밀번호로는 변경할 수 없습니다.');
      return;
    }

    // 비밀번호 유효성 검사 - 3개의 조건을 모두 충족하는지 확인
    const checkCount = getCheckCount(newPassword);

    if (checkCount < 3) {
      setError('비밀번호가 요구 조건에 맞지 않습니다.');
      return;
    }

    if (!confirm('비밀번호를 변경하시겠습니까?')) {
      return;
    }

    try {
      await axios.post('/mypage/employeeUpdateMypagePw', { employeePw: newPassword, employeeId: session }, {
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
  useEffect(async () => {
    let {data} = await axios.get('/mypage/mypageSession')
      .then(response => setSession(response.data))
      .catch(error => console.error('Error', error));

    // 월별 실적 가져오기
    await axios.get('/mypage/getMySalesByMonth?employeeId=' + data).then(respponse => setSalesByMonth(respponse.data));
  }, []);

  // 차트 월별 데이터 저장 변수
  const [salesByMonth, setSalesByMonth] = useState([]);

  // session 상태가 변경될 때마다 editData 업데이트
  useEffect( () => {
    if (session) {
      setEditData(prevData => ({
        ...prevData,
        employeeId: session
      }));

      // 월별 실적 가져오기
      // let {data} = axios.get('/mypage/getMySalesByMonth?employeeId=' + session);
      // setSalesByMonth(data);
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


  //유효성 검사 체크 카운트
  const checkCount = [
    !/(.)\1{2,}/.test(newPassword),
    newPassword.length >= 5,
    validPattern.test(newPassword)
  ].filter(Boolean).length;


  return (
    <div>
      <h1 className="header my-page-header"><i className="bi bi-tag-fill"></i>마이페이지</h1>
      <div className="mypage-main">
        <div className="mypage-table">

          <h2 className="header">내 정보</h2>
          
          <table>
            <tbody>
              <tr>
                <td><label htmlFor="employeeId">아이디</label></td>
                <td><input type="text" id="employeeId" name="employeeId" value={mypageAll.employeeId || ''} disabled /></td>
              </tr>
              <tr>
                <td><label htmlFor="employeePw">비밀번호</label></td>
                <td className="password-row">
                  <input type="password" id="employeePw" name="employeePw" value="**************" disabled />
                  <button className="pw-btn" onClick={openModal}>비밀번호 변경</button>
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
            </tbody>


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
          <h2 className="header">
            {/* <i className="bi bi-graph-up"></i>  */}
            <i className="bi bi-bar-chart-line-fill"></i>
            이번 달 실적</h2>
          <EmployeeMonthlySalesChart salesByMonth={salesByMonth}/>
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
                  placeholder="현재 비밀번호"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>

              <div>
                <label>신규 비밀번호:</label>
                <input
                  type="password"
                  placeholder="신규 비밀번호"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <div className="password-check-indicators">
                <div className={`check-item ${checkCount >= 1 ? 'active' : ''}`}></div>
                <div className={`check-item ${checkCount === 2 ? 'yellow' : (checkCount === 3 ? 'active' : '')}`}></div>
                <div className={`check-item ${checkCount === 3 ? 'active' : ''}`}></div>
              </div>

              <div className="password-checks">
                <p style={{ color: !/(.)\1{2,}/.test(newPassword) ? '#00CC00' : '#FF4D4D' }}>
                  {!/(.)\1{2,}/.test(newPassword) ? '🟢' : '🔴'} 비밀번호는 3자리 연속된 문자, 숫자를 쓸 수 없습니다.
                </p>
                <p style={{ color: validPattern.test(newPassword) ? '#00CC00' : '#FF4D4D' }}>
                  {validPattern.test(newPassword) ? '🟢' : '🔴'} 비밀번호는 대소문자, 숫자, 특수문자만 가능합니다.
                </p>
                <p style={{ color: newPassword.length >= 5 ? '#00CC00' : '#FF4D4D' }}>
                  {newPassword.length >= 5 ? '🟢' : '🔴'} 비밀번호는 5자 이상입니다.
                </p>
              </div>

              <div>
                <label>신규 비밀번호 확인:</label>
                <input
                  type="password"
                  placeholder="신규 비밀번호 확인"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                />
              </div>

              {error && <p style={{ color: 'red', fontSize: '14px' }}> ⚠️ {error}</p>}

              <button type="button" className='btn-change-modal' onClick={handleSubmit}>변경</button>
              <button type="button" className='btn-cancel-modal' onClick={closeModal}>취소</button>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <MyPage />
);
