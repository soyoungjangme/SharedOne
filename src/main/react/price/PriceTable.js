import React from 'react';
import PriceTableBody from "./PriceTableBody";
import PropTypes from "prop-types";

const PriceTable = ({
                        currentPage,
                        amount,
                        totalItems,
                        price,
                        handleAddClickDetail,
                        sortData,
                        getSortDirection,
                        sortConfig,
                    }) => {


    const tableHead = <tr>
        <th>No.</th>
        <th>
            {"등록일"}
            <button
                className="sortBtn"
                onClick={
                    () => sortData('registerDate')
                }>
                {sortConfig.key === 'registerDate' ? (getSortDirection()) : '-'}
            </button>
        </th>
        <th>
            {"상품명"}
            <button className="sortBtn" onClick={() => sortData('productName')}>
                {sortConfig.key === 'productName' ? (getSortDirection()) : '-'}
            </button>
        </th>
        <th>
            {"업체명"}
            <button className="sortBtn" onClick={() => sortData('customerName')}>
                {sortConfig.key === 'customerName' ? (getSortDirection()) : '-'}
            </button>
        </th>
        <th>
            {"가격"}
            <button className="sortBtn" onClick={() => sortData('customPrice')}>
                {sortConfig.key === 'customPrice' ? (getSortDirection()) : '-'}
            </button>
        </th>
        <th>
            {"할인율( %)"}
            <button className="sortBtn" onClick={() => sortData('discount')}>
                {sortConfig.key === 'discount' ? (getSortDirection()) : '-'}
            </button>
        </th>
        <th>
            {"시작일"}
            <button className="sortBtn" onClick={() => sortData('startDate')}>
                {sortConfig.key === 'startDate' ? (getSortDirection()) : '-'}
            </button>
        </th>
        <th>
            {"종료일"}
            <button className="sortBtn" onClick={() => sortData('endDate')}>
                {sortConfig.key === 'endDate' ? (getSortDirection()) : '-'}
            </button>
        </th>
    </tr>;

    return (
        <table className="search-table" style={{marginTop: '50px'}}>
            <thead>
            {tableHead}
            </thead>
            <tbody>
            <PriceTableBody price={price} currentPage={currentPage} amount={amount}
                            handleAddClickDetail={handleAddClickDetail}/>
            <tr>
                <td colSpan="7"></td>
                <td colSpan="1"> {totalItems} 건</td>
            </tr>
            </tbody>
        </table>
    );
};

PriceTable.propTypes = {
    currentPage: PropTypes.number,
    amount: PropTypes.number,
    totalItems: PropTypes.number,
    price: PropTypes.array,
    handleAddClickDetail: PropTypes.func,
    sortData: PropTypes.func,
    sortConfig: PropTypes.object,
    getSortDirection: PropTypes.func,
}

export default PriceTable;
