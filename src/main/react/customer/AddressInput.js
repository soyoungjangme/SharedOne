import React, { useState } from 'react';
import DaumPostcode from 'react-daum-postcode';
import './AddressInput.css'; // CSS 파일 임포트

const AddressInput = (props) => {
  const [zonecode, setZonecode] = useState('');
  const [address, setAddress] = useState('');
  const [detailedAddress, setDetailedAddress] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const themeObj = {
    bgColor: '#FFFFFF', 
    pageBgColor: '#FFFFFF', 
    postcodeTextColor: '#C05850',
    emphTextColor: '#222222',
  };

  const postCodeStyle = {
    width: '360px',
    height: '480px',
  };

  const completeHandler = (data) => {
    const { address, zonecode } = data;
    setZonecode(zonecode);
    setAddress(address);
  };

  const closeHandler = (state) => {
    if (state === 'FORCE_CLOSE' || state === 'COMPLETE_CLOSE') {
      setIsOpen(false);
    }
  };

  const toggleHandler = () => {
    setIsOpen((prevOpenState) => !prevOpenState);
  };

  const inputChangeHandler = (event) => {
    setDetailedAddress(event.target.value);
  };

  const handleConfirm = () => {
    const fullAddress = `${address} ${detailedAddress}`;
    console.log('확인된 주소:', fullAddress);

    // 부모 컴포넌트로 주소 전달
    if (props.onAddressConfirm) {
      props.onAddressConfirm(fullAddress);
    }

    setIsOpen(false); // 모달 닫기
  };

  return (
    <div className="address-container">
      <div className="address-header">주소 입력</div>
      <div className="address-content">
        <div className="zipcode-container">
          <div className="zipcode">{zonecode}</div>
          <button
            type="button"
            className="search-button"
            onClick={toggleHandler}
          >
            주소 찾기
          </button>
        </div>
        {isOpen && (
          <div className="postcode-container">
            <DaumPostcode
              theme={themeObj}
              style={postCodeStyle}
              onComplete={completeHandler}
              onClose={closeHandler}
            />
          </div>
        )}
        <div className="address-container">{address}</div>
        <div className="detailed-address-container">
          <input
            className="detailed-address-input"
            value={detailedAddress}
            onChange={inputChangeHandler}
            placeholder="상세 주소 입력"
          />
        </div>
        <button
          type="button"
          className="confirm-button"
          onClick={handleConfirm}
        >
          확인
        </button>
      </div>
    </div>
  );
};

export default AddressInput;
