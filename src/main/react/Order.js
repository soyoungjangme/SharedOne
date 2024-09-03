import React, { useState } from 'react'; //어느 컴포넌트이든 React임포트가 필요합니다.
import ReactDOM from 'react-dom/client';
import './Order.css';  // CSS 파일을 import 합니다.

function Order() {
    const [orders, setOrders] = useState([]);
    const [productName, setProductName] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [price, setPrice] = useState(0);
    const [error, setError] = useState('');

    const handleAddOrder = (e) => {
        e.preventDefault();

        // 입력 검증
        if (!productName || quantity <= 0 || price <= 0) {
            setError('모든 필드를 올바르게 입력해주세요.');
            return;
        }

        const newOrder = {
            id: orders.length + 1,
            productName,
            quantity,
            price,
            total: quantity * price,
        };

        setOrders([...orders, newOrder]);
        setProductName('');
        setQuantity(1);
        setPrice(0);
        setError('');
    };

    return (
        <div className="container">
            <h2>주문 관리</h2>
            <form onSubmit={handleAddOrder} className="form">
                <div className="inputGroup">
                    <label htmlFor="productName">제품명</label>
                    <input
                        type="text"
                        id="productName"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        className="input"
                        required
                    />
                </div>
                <div className="inputGroup">
                    <label htmlFor="quantity">수량</label>
                    <input
                        type="number"
                        id="quantity"
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value))}
                        className="input"
                        min="1"
                        required
                    />
                </div>
                <div className="inputGroup">
                    <label htmlFor="price">가격</label>
                    <input
                        type="number"
                        id="price"
                        value={price}
                        onChange={(e) => setPrice(parseFloat(e.target.value))}
                        className="input"
                        min="0"
                        required
                    />
                </div>
                {error && <div className="error">{error}</div>}
                <button type="submit" className="button">
                    주문 추가
                </button>
            </form>

            <div className="orderList">
                <h3>주문 목록</h3>
                {orders.length > 0 ? (
                    <table className="table">
                        <thead>
                        <tr>
                            <th>제품명</th>
                            <th>수량</th>
                            <th>가격</th>
                            <th>총액</th>
                        </tr>
                        </thead>
                        <tbody>
                        {orders.map((order) => (
                            <tr key={order.id}>
                                <td>{order.productName}</td>
                                <td>{order.quantity}</td>
                                <td>{order.price.toLocaleString()} 원</td>
                                <td>{order.total.toLocaleString()} 원</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                ) : (
                    <p>현재 주문이 없습니다.</p>
                )}
            </div>
        </div>
    );
}


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Order />
);