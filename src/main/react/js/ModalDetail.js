import React from "react";

function ModalDetail({ title, data }) {
    console.log(title);
    console.log(data);
        

    return (
        <div>
            <div className="form-header">
                <h1>{title === 'product' ? '상품 상세 정보' : '고객 상세 정보'}</h1>

                <div className="btns">
                    <div className="btn-close">
                        {/* Close button logic here */}
                    </div>
                </div>
            </div>

            <div className="RegistForm">
                <table className="formTable">
                    <thead>
                        <tr>
                            <th>항목</th>
                            <th>값</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            Object.entries(data).map(([key, dataValue]) => (
                                <tr key={key}>
                                    <th></th>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>

        </div>
    );
}

export default ModalDetail;
