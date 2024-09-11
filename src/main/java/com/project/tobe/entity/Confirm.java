
package com.project.tobe.entity;

import lombok.*;
import org.springframework.data.relational.core.sql.In;

import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@ToString
@Builder
@Entity
@Table (name = "confirm")
@SequenceGenerator(
        name = "seqConfirm",
        sequenceName = "seq_confirm",
        initialValue = 1,
        allocationSize = 1
)
public class Confirm {

    private Long confirmNo;

    private String confirmStatus; // 대기, 반려, 승인 3가지 있음

    private String confirmTitle;
    private LocalDate confirmRegDate;
    private LocalDate confirmDate;
    private String remarks;

//    일단 주석 처리
//    @ManyToOne
//    @JoinColumn (name = "price_no")
//    private Price price;

//    @ManyToOne
//    @JoinColumn (name = "employee_id")
//    private Employee employee;
    private String confirmStatus;
    private String confirmTitle;
    private String confirmContent;
    private LocalDate confirmRegDate;
    private LocalDate confirmConfirmDate;

    private String employeeId;//fk
    private Long orderNo; //fk

    private Employee employee;
//    @ManyToOne
//    @JoinColumn (name = "employee_id")
//    private Employee approver;

    private Integer customPrice = 0;
    private Long orderNo;
    private LocalDate delDate;

    private String productName;
    private String productType;

    private String customerName;
    private Integer orderQty = 0;
    private String employeeName;


    @Transient
    public double getTotalAmount() {
        return (orderQty != null ? orderQty : 0) * (customPrice != null ? customPrice : 0);
    }
}