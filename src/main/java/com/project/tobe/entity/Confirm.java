
package com.project.tobe.entity;

import lombok.*;

import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@ToString
@Builder
public class Confirm {

    private Long confirmNo;

//    @ManyToOne
//    @JoinColumn(name = "employee_id")
//    private Employee approver; // 결재자

//    @ManyToOne
//    @JoinColumn(name = "order_id")
//    private Order order; // 주문 정보

    private String confirmStatus;
    private String confirmTitle;
    private String confirmContent;
    private LocalDate confirmRegDate;
    private LocalDate confirmConfirmDate;

    private String employeeId;//fk
    private Long orderNo; //fk

    private Employee employee;

}