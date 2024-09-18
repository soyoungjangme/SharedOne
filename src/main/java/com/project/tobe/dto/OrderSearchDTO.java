package com.project.tobe.dto;

import lombok.*;

import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class OrderSearchDTO { //주문관리- 조건에서 들어오는 매개변수임
    private LocalDate inputDate;
    private String inputOrderNo;
    private Integer inputProdNo;
    private String inputManager;
    private Integer inputCustomerNo;
    private String inputState;
}
