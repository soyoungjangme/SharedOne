import React from "react";


function ModalDetail() {


    return (
        <div className="confirmRegist">
            <div className="fullBody">
                <div className="form-container">
                    <button className="close-btn" onClick={handleCloseClickDetail}> &times;
                    </button>
                    <div className="form-header">
                        <h1> 고객 상세보기 </h1>

                        <div className="btns">
                            <div className="btn-close">

                            </div>
                        </div>
                    </div>

                    <div className="RegistForm">
                        <table className="formTable">
                            <tr>
                                <th colSpan="1"><label htmlFor="productNo">상품</label></th>
                                <td colSpan="3"><input type="text" placeholder="필드 입력" id="productNo"
                                                       value={modifyItem.productNo} onChange={(e) => {
                                    handleModifyItemChange(e.target)
                                }}/></td>

                                <th colSpan="1"><label htmlFor="customerNo">고객</label></th>
                                <td colSpan="3"><input type="text" placeholder="필드 입력" id="customerNo"
                                                       value={modifyItem.customerNo} onChange={(e) => {
                                    handleModifyItemChange(e.target)
                                }}/></td>
                            </tr>
                            <tr>
                                <th><label htmlFor="customPrice">가격</label></th>
                                <td><input type="number" placeholder="필드 입력" id="customPrice"
                                           value={modifyItem.customPrice} onChange={(e) => {
                                    handleModifyItemChange(e.target)
                                }}/></td>

                                <th><label htmlFor="currency">통화</label></th>
                                <td><input type="text" placeholder="필드 입력" id="currency"
                                           value={modifyItem.currency} onChange={(e) => {
                                    handleModifyItemChange(e.target)
                                }}/></td>

                                <th><label htmlFor="discount">할인율(%)</label></th>
                                <td><input type="number" placeholder="필드 입력" id="discount"
                                           value={modifyItem.discount} onChange={(e) => {
                                    handleModifyItemChange(e.target)
                                }}/></td>
                            </tr>
                            <tr>
                                <th colSpan="1"><label htmlFor="registStartDate">연락처</label></th>
                                <td colSpan="3"><input type="text" placeholder="필드 입력" id="registStartDate"
                                                       value={modifyItem.startDate} onChange={(e) => {
                                    handleModifyItemChange(e.target)
                                }}/>
                                </td>

                                <th colSpan="1"><label htmlFor="registEndDate">연락처</label></th>
                                <td colSpan="3"><input type="text" placeholder="필드 입력" id="registEndDate"
                                                       value={modifyItem.endDate} onChange={(e) => {
                                    handleModifyItemChange(e.target)
                                }}/></td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ModalDetail;