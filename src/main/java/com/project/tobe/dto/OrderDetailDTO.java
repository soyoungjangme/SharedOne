package com.project.tobe.dto;

import lombok.Data;
import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@Data
public class OrderDetailDTO {
    // OrderH 필드
    private Long orderNo;
    private Date regDate;
    private Date delDate;
    private Long customerNo;
    private String confirmStatus;
    private LocalDate confirmChangeDate;
    private String remarks;
    private String employeeId;

    // 고객 DTO와 직원 DTO에서 필요한 필드
    private String customerName;
    private String employeeName;

    // OrderB에 들어갈 내용 내부 클래스 처리
    @Data
    public static class OrderProductDetail {
        private Long productNo;
        private String productName;
        private int orderProductQty;
        private Double customPrice;
        private String currency;
        private Double discount;
        private LocalDate priceStartDate;
        private LocalDate priceEndDate;
    }

    // OrderB 리스트
    private List<OrderProductDetail> orderProductDetail;

    // 총 주문 금액
    private double totalAmount;
}