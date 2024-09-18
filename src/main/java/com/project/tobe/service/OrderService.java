package com.project.tobe.service;

import com.project.tobe.dto.*;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface OrderService {

    List<OrderHDTO> getOrder(OrderSearchDTO criteria); //jsy 조건조회
    List<PriceDTO> getPrice(Integer iocn); //jsy 주문등록 판매가 가져오기
    Long registOrder(OrderRegistDTO orderRegistDTO); //jsy 주문 등록하기


    /*유선화 START*/
    OrderHDTO getOrderDetail(Long orderNo); // 상세 조회
    //void updateOrder(Long orderNo, OrderHDTO updatedOrderData);
    void updateOrder(OrderUp1DTO orderH); // 바디 업데이트// 주문 업데이트
    /*유선화 END*/
}
