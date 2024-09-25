// 상품원가를 포맷팅하는 함수
export const formatPrice = (customPrice) => {
    return customPrice ? Number(customPrice).toLocaleString() : '';
};