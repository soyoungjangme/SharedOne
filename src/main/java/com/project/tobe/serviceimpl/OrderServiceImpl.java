package com.project.tobe.serviceimpl;

import com.project.tobe.dto.*;
import com.project.tobe.mapper.OrderMapper;
import com.project.tobe.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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
    public List<PriceDTO> getPrice(Long iocn, String delDate) {
        return orderMapper.getPrice(iocn, delDate);
    }

    //jsy 주문등록 - 등록하기
    @Override
    @Transactional
    public Map<String, Long>  registOrder(OrderRegistDTO orderRequest) {
        //헤더 등록
        OrderHDTO header = OrderHDTO.builder()
                .orderNo(orderRequest.getInputOrderNo())
                .delDate(orderRequest.getInputDelDate())
                .customerNo(orderRequest.getInputCustomerNo())
                .employeeId(orderRequest.getInputManager())
                .confirmerId(orderRequest.getInputConfirmer())
                .confirmStatus(orderRequest.getInputStatus())
                .build();

        orderMapper.registOrderH(header); //헤더 등록
        Long orderNo = header.getOrderNo(); //등록 된 주문번호
        Long ohNo = header.getOhNo(); //등록 된 주문시퀀스
        System.out.println("등록된 헤더: orderNo=" + orderNo + ", ohNo=" + ohNo);


        //주문번호 추가 후 바디는 배치로 처리하기
        List<OrderBDTO> obList = orderRequest.getOrderBList().stream()
                        .map(orderBody -> OrderBDTO.builder()
                                .ohNo(ohNo)
                                .orderNo(orderNo)
                                .productNo(orderBody.getProductNo())
                                .orderProductQty(orderBody.getOrderProductQty())
                                .prodTotal(orderBody.getProdTotal())
                                .build())
                        .collect(Collectors.toList());

        orderMapper.registOrderB(obList); //배치 인서트 처리
        System.out.println("주문 바디 리스트: " + obList);


        // orderNo과 ohNo를 함께 반환
        Map<String, Long> result = new HashMap<>();
        result.put("orderNo", header.getOrderNo()); // 시퀀스로 생성된 orderNo
        result.put("ohNo", header.getOhNo()); // OH 번호 (필요시 DTO에서 가져오기)

        return result;
    }

    @Override
    public String getMyName(String myId) {
        return orderMapper.getMyName(myId);
    }

    /* 유선화 START */

// 특정 주문 상세 정보
    @Override
    public OrderHDTO getOrderDetail(Long ohNo) {
        System.out.println(orderMapper.getOrderDetail(ohNo));
        return orderMapper.getOrderDetail(ohNo);
    }


// 결재 여부 업데이트
    @Override
    @Transactional
    public boolean updateApproval(Long ohNo, Long orderNo, String confirmStatus, LocalDateTime confirmChangeDate, String remarks) {
        try {
            int updatedRows = orderMapper.updateApproval(ohNo, orderNo, confirmStatus, confirmChangeDate, remarks);
            return updatedRows > 0;
        } catch (Exception e) {
            System.out.println("updateApproval 오류");
            return false;
        }
    }

    @Override
    @Transactional
    public OrderHDTO updateOrder(OrderUp1DTO orderUp1DTO) {
        try {
            System.out.println("OrderBList: " + orderUp1DTO.getOrderBList());

            System.out.println("OrderUp1DTO 전체 데이터: " + orderUp1DTO);
            System.out.println("주문 헤더 업데이트 전 데이터: " + orderUp1DTO);
            orderMapper.updateOrderHeader(orderUp1DTO);
            System.out.println("주문 헤더 업데이트 완료");

            System.out.println("ohNo 로그 (삭제 전): " + orderUp1DTO.getOhNo() + ", 주문 번호: " + orderUp1DTO.getOrderNo());

            System.out.println("기존 주문 상세 삭제 중... 주문 번호: " + orderUp1DTO.getOrderNo());
            orderMapper.deleteOrderDetails(orderUp1DTO.getOrderNo());
            System.out.println("기존 주문 상세 삭제 완료");

            for (OrderUp2DTO detail : orderUp1DTO.getOrderBList()) {
                detail.setOrderNo(orderUp1DTO.getOrderNo());
                detail.setOhNo(orderUp1DTO.getOhNo());

                System.out.println("ohNo 로그 (삽입 전): " + detail.getOhNo() + ", 주문 번호: " + detail.getOrderNo());


                System.out.println("추가할 상품 정보: " + detail);
                orderMapper.insertOrderDetail(orderUp1DTO.getOhNo(), orderUp1DTO.getOrderNo(), detail);
            }

            System.out.println("최종 업데이트된 주문 정보 조회 중... 주문 번호: " + orderUp1DTO.getOrderNo());
            System.out.println("업데이트된 주문 정보: " + orderMapper.getOrderDetail(orderUp1DTO.getOrderNo()));
            return orderMapper.getOrderDetail(orderUp1DTO.getOrderNo());

        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("오류 제발 그만 나: " + e.getMessage());
            return null;
        }
    }


/*    @Transactional
    @Override
    public void insertBack(OrderUp1DTO orderUp1DTO) {
        // 1. 주문 헤더 삽입
        System.out.println("서비스 도착 ");
        orderMapper.insertBack1(orderUp1DTO);

        // 2. 생성된 주문 번호 가져오기
        Long orderNo = orderUp1DTO.getOrderNo();

        orderMapper.insertBack2(orderUp1DTO.getOrderBList(), orderNo);
    }
 */

    @Transactional
    @Override
    public OrderHDTO updateTempOrder(OrderHDTO orderHDTO) {
        // 주문 헤더 업데이트
        int updatedRows = orderMapper.updateTempOrder(orderHDTO);

        // 기존 주문 상세 삭제
        orderMapper.deleteOrderDetails(orderHDTO.getOhNo());

        // 새로운 주문 상세 삽입
        if (orderHDTO.getOrderBList() != null && !orderHDTO.getOrderBList().isEmpty()) {
            orderMapper.insertOrderDetails(orderHDTO.getOrderBList());
        }

        // 업데이트된 주문 정보 조회 및 반환
        return orderMapper.getOrderDetail(orderHDTO.getOhNo());
    }

    @Override
    public boolean deleteOrder(Long ohNo) {
        int deletedRows = orderMapper.deleteOrder(ohNo);
        return deletedRows > 0; // 삭제된 행이 1개 이상이면 true 반환
    }

    @Override
    public EmployeeRankDTO getTopOfMonth() {
        return orderMapper.getEmployeeTopOfMonth();
    }

    @Override
    public List<SalesByMonth> getSalesByMonth() {
        return orderMapper.getSalesByMonth();
    }

    @Override
    public List<EmployeeRankDTO> getEmployeeRank() {
        return orderMapper.getEmployeeRank();
    }

    @Override
    public List<ProductSaleRank> getProductRank() {
        return orderMapper.getProductRank();
    }
}