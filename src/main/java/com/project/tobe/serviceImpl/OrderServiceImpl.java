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
    public void registOrder(OrderRegistDTO orderRequest) {
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