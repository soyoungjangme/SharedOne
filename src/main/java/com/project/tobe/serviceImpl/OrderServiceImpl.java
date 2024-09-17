package com.project.tobe.serviceImpl;

import com.project.tobe.dto.*;
import com.project.tobe.entity.OrderH;
import com.project.tobe.mapper.OrderMapper;
import com.project.tobe.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service("orderService")
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderMapper orderMapper;

    //jsy 모든 주문 목록 조회
    @Override
    public List<OrderHDTO> getOrder(OrderSearchDTO criteria) {
        System.out.println("orderList서비스 실행됨");
        return orderMapper.getOrder(criteria);
    }

    //jsy 주문등록 - 고객 별 판매가 리스트
    @Override
    public List<PriceDTO> getPrice(Integer iocn) {
        System.out.println("getPrice서비스 실행됨");
        return orderMapper.getPrice(iocn);
    }

    //jsy 주문등록 - 등록하기
    @Override
    @Transactional
    public void registOrder(OrderRegistDTO orderRequest) {
        OrderHDTO header = OrderHDTO.builder()
                .delDate(orderRequest.getInputDelDate())
                .customerNo(orderRequest.getInputCustomerNo())
                .employeeId(orderRequest.getInputManager())
                .confirmerId(orderRequest.getInputConfirmer())
                .confirmStatus(orderRequest.getInputStatus())
                .build();
        orderMapper.registOrderH(header); //헤더 등록
        Long orderNo = header.getOrderNo(); //시퀀스로 생성된 orderNo

        OrderBDTO body = OrderBDTO.builder()
                .orderNo(orderNo) //헤더에서 생성된 orderNo를 body에 연결
                .priceNo(orderRequest.getInputPriceNo())
                .productNo(orderRequest.getInputProdNo())
                .orderProductQty(orderRequest.getInputProdQty())
                .prodTotal(orderRequest.getInputProdTotal())
                .build();

        orderMapper.registOrderB(body);
    }

    /* 유선화 START */

// 특정 주문 상세 정보
    @Override
    public OrderHDTO getOrderDetail(Long orderNo) {
        return orderMapper.getOrderDetail(orderNo);
    }


// 결재 여부 업데이트
    @Override
    @Transactional
    public boolean updateApproval(Long orderNo, String confirmStatus, LocalDate confirmChangeDate) {
        try {
            int updatedRows = orderMapper.updateApproval(orderNo, confirmStatus, confirmChangeDate);
            return updatedRows > 0;
        } catch (Exception e) {
            System.out.println("updateApproval 오류");
            return false;
        }
    }

    @Override
    public void updateOrder(OrderHDTO orderHDTO) {

    }

    /* 유선화 END */
}