import React, {useState} from 'react';
import Select from "react-select";
import PropTypes from "prop-types";

const SearchForm = ({ searchPrice, setSearchPrice, productOptions, customerOptions, handleSearchBtn, getSearchItems }) => {
    console.log(typeof getSearchItems);

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSearchPrice((prev) => ({ ...prev, [name]: value }));
    };

    const handleSearchPriceChange = (name, item) => {
        if (name === 'productNo') setSelectedProduct(item);
        if (name === 'customerNo') setSelectedCustomer(item);

        console.log(selectedProduct);
        setSearchPrice((prev) => ({...prev, [name]: item.value}));
    }

    const handleSearchResetBtn = () => {
        setSelectedProduct(null);
        setSelectedCustomer(null);

        const resetData = {
            registerDate: '',
            productNo: '',
            customerNo: '',
            startDate: '',
            endDate: '',
            page: 1,
            amount: 30,
            activated: 'Y'
        };
        setSearchPrice(resetData);
        getSearchItems(resetData);
    }

    const handleHistoryBtn = () => {
        const resetData = {
            registerDate: '',
            productNo: searchPrice.productNo,
            customerNo: searchPrice.customerNo,
            startDate: '',
            endDate: '',
            page: 1,
            amount: 30,
        };

        getSearchItems(resetData);
    }

    return (
        <div className="main-container">
            <div className="filter-containers">
                <div className="filter-container">
                    <div className="filter-items">
                        {/* Product Filter */}
                        <div className="filter-item">
                            <label className="filter-label" htmlFor="product">상품</label>
                            <Select
                                value={selectedProduct}
                                id="product"
                                className="filter-input"
                                name="productNo"
                                options={productOptions}
                                placeholder="상품 선택"
                                onChange={(option) => {handleSearchPriceChange('productNo', option)}}
                            />
                        </div>

                        {/* Customer Filter */}
                        <div className="filter-item">
                            <label className="filter-label" htmlFor="customer">업체</label>
                            <Select
                                id="customer"
                                value={selectedCustomer}
                                className="filter-input"
                                name="customerNo"
                                options={customerOptions}
                                placeholder="고객 선택"
                                onChange={(option) => handleSearchPriceChange('customerNo', option)}
                            />
                        </div>

                        {/* History Filter */}
                        <div className="filter-item">
                            <label className="filter-label" htmlFor="history">판매가<br/>이력</label>
                            { searchPrice.productNo !== '' && searchPrice.customerNo !== '' &&
                                <button type="button" className="search-btn" onClick={handleHistoryBtn} id="history">
                                    <i className="bi bi-clock-history"></i>
                                </button>
                            }
                        </div>

                        {/* Date Filters */}
                        <div className="filter-item">
                            <label className="filter-label" htmlFor="registerDate">등록일자</label>
                            <input
                                name="registerDate"
                                className="filter-input"
                                type="date"
                                id="registerDate"
                                value={searchPrice.registerDate}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="filter-item">
                            <label className="filter-label" htmlFor="startDate">시작일자</label>
                            <input
                                name="startDate"
                                className="filter-input"
                                type="date"
                                id="startDate"
                                value={searchPrice.startDate}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="filter-item">
                            <label className="filter-label" htmlFor="endDate">종료일자</label>
                            <input
                                name="endDate"
                                className="filter-input"
                                type="date"
                                id="endDate"
                                value={searchPrice.endDate}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                </div>
                <div className="button-container">
                    <button type="button" className="reset-btn" onClick={handleSearchResetBtn}>
                        <i className="bi bi-arrow-clockwise"></i>
                    </button>
                    <button type="button" className="search-btn" onClick={handleSearchBtn}>
                        <i className="bi bi-search search-icon"></i>
                    </button>
                </div>
            </div>
        </div>
    );
};

SearchForm.propTypes = {
    searchPrice: PropTypes.shape({
        productNo: PropTypes.string,
        customerNo: PropTypes.string,
        registerDate: PropTypes.string,
        startDate: PropTypes.string,
        endDate: PropTypes.string,
        currentPage: PropTypes.number,
        amount: PropTypes.number,
    }),

    setSearchPrice: PropTypes.func,
    productOptions: PropTypes.array,
    customerOptions: PropTypes.array,
    handleSearchBtn: PropTypes.func,
    getSearchItems: PropTypes.func,
}

export default SearchForm;
