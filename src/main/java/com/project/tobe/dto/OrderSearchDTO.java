package com.project.tobe.dto;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class OrderSearchDTO { //주문관리- 조건에서 들어오는 매개변수임
    private LocalDate inputDate;
    private String inputOrderNo;
    private String inputProdName;
    private String inputManager;
    private String inputCustomerName;
    private String inputState;
    private String inputMyId;
}
