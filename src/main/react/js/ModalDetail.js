import React from "react";

function ModalDetail({ title, data }) {
    // 항목 이름을 매핑하기 위한 객체
    const columnMapping = title === 'product' ? {
        productName: '상품명',
        productWriter: '저자',
        productCategory: '카테고리',
        productPrice: '상품원가',
    } : {
        customerName: '고객명',
        customerAddr: '고객주소',
        customerTel: '고객연락처',
        postNum: '우편번호',
        businessRegistrationNo: '사업자등록번호',
        nation: '국가',
        picName: '담당자명',
        picEmail: '담당자이메일',
        picTel: '담당자연락처',
    };

    return (
        <div>
            <div className="form-header">
                <h1>{title === 'product' ? '상품 상세 정보' : '고객 상세 정보'}</h1>

                <div className="btns">
                    <div className="btn-close">
                    </div>
                </div>
            </div>

            <div className="RegistForm">
                <table className="formTable">
                    <tbody>
                        {
                            Object.entries(data).map(([key, dataValue]) => {
                                // productYn 항목은 렌더링하지 않음
                                if (key === 'productNo') return null;
                                if (key === 'productYn') return null;
                                if (key === 'customerNo') return null;
                                if (key === 'dealType') return null;
                                if (key === 'activated') return null;
                                return (
                                    <tr key={key}>
                                        <th>{columnMapping[key] || key}</th>
                                        <td>{dataValue}</td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ModalDetail;
