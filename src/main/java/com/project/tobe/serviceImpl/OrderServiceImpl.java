package com.project.tobe.serviceImpl;

import com.project.tobe.dto.*;
import com.project.tobe.mapper.OrderMapper;
import com.project.tobe.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service("orderService")
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderMapper orderMapper;

    @Override
    public List<OrderHDTO> getOrder(OrderSearchDTO criteria) {
        System.out.println("orderList서비스 실행됨");
        return orderMapper.getOrder(criteria);
    }

    @Override
    public List<PriceDTO> getPrice(Integer iocn) {
        System.out.println("getPrice서비스 실행됨");
        return orderMapper.getPrice(iocn);
    }

    /* 유선화 START */

    // 특정 주문 상세 정보
    @Override
    public OrderHDTO getOrderDetail(Long orderNo) {
        return orderMapper.getOrderDetail(orderNo);
    }

    @Transactional
    @Override
    public void updateOrder(OrderUp1DTO orderH) {
        // 주문 헤더 업데이트
        orderMapper.updateOrderHeader(orderH);

        // orderNo를 orderH에서 추출
        Long orderNo = orderH.getOrderNo();

        // 주문 바디 업데이트
        orderMapper.updateOrderBody(orderNo, orderH.getOrderB());

        System.out.println("오더 서비스");
    }

//    @Override
//    public void updateOrder(Long orderNo, OrderHDTO updatedOrderData) {
//
//        // 기존 데이터와 수정된 데이터를 비교하고 필요한 경우 업데이트
//        OrderHDTO existingOrder = orderMapper.getOrderDetail(orderNo);
//
//        if (existingOrder != null) {
//            // 필요한 필드 업데이트
//            existingOrder.setRegDate(updatedOrderData.getRegDate());
//            existingOrder.setDelDate(updatedOrderData.getDelDate());
//            existingOrder.setRemarks(updatedOrderData.getRemarks());
//            existingOrder.setConfirmStatus(updatedOrderData.getConfirmStatus());
//
//            // 주문 본문 리스트도 업데이트
//            for (OrderBDTO orderB : updatedOrderData.getOrderBList()) {
//                // 상ㅇ품 번호에 따라 본문을 업데이트
////                orderMapper.updateOrderBody(orderNo, orderB);
//            }
//
//            // 헤더 정보 업데이트
//            orderMapper.updateOrderHeader(existingOrder);
//        } else {
//            throw new RuntimeException("주문을 찾을 수 없습니다.");
//        }
//    }
    /* 유선화 END */
}