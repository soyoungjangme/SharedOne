package com.project.tobe.serviceImpl;

import com.project.tobe.dto.*;
import com.project.tobe.entity.OrderH;
import com.project.tobe.mapper.OrderMapper;
import com.project.tobe.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service("orderService")
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderMapper orderMapper;

    //jsy 모든 주문 목록 조회
    @Override
    public List<OrderHDTO> getOrder(OrderSearchDTO criteria) {
        return orderMapper.getOrder(criteria);
    }

    //jsy 주문등록 - 고객 별 판매가 리스트
    @Override
    public List<PriceDTO> getPrice(Integer iocn) {
        return orderMapper.getPrice(iocn);
    }

    //jsy 주문등록 - 등록하기
    @Override
    @Transactional
    public Long registOrder(OrderRegistDTO orderRequest) {
        //헤더 등록
        OrderHDTO header = OrderHDTO.builder()
                .delDate(orderRequest.getInputDelDate())
                .customerNo(orderRequest.getInputCustomerNo())
                .employeeId(orderRequest.getInputManager())
                .confirmerId(orderRequest.getInputConfirmer())
                .confirmStatus(orderRequest.getInputStatus())
                .build();
        orderMapper.registOrderH(header); //헤더 등록
        Long orderNo = header.getOrderNo(); //시퀀스로 생성된 orderNo

        //주문번호 추가 후 바디는 배치로 처리하기
        List<OrderBDTO> obList = orderRequest.getOrderBList().stream()
                        .map(orderBody -> OrderBDTO.builder()
                                .orderNo(orderNo)
                                .priceNo(orderBody.getPriceNo())
                                .productNo(orderBody.getProductNo())
                                .orderProductQty(orderBody.getOrderProductQty())
                                .prodTotal(orderBody.getProdTotal())
                                .build())
                                .collect(Collectors.toList());

        orderMapper.registOrderB(obList); //배치 인서트 처리

        return orderNo;
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