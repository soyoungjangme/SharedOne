package com.project.tobe.service;

import com.project.tobe.dto.OrderB;
import com.project.tobe.dto.OrderH;
import com.project.tobe.dto.OrderSearchDTO;
import com.project.tobe.dto.PriceDTO;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface OrderService {

    List<OrderH> getOrder(OrderSearchDTO criteria); //조건조회
    List<PriceDTO> getPrice(Integer iocn); //주문등록 판매가 가져오기

    /*유선화 START*/
    OrderH getOrderDetail(Long orderNo); // 상세 조회
    void updateOrder(Long orderNo, OrderH updatedOrderData); // 주문 업데이트
    /*유선화 END*/
}
