
package com.project.tobe.entity;

import lombok.*;
import org.springframework.data.relational.core.sql.In;

import javax.persistence.*;
import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@ToString
@Builder
@Entity
@Table(name = "confirm")
@SequenceGenerator(
        name = "seqConfirm",
        sequenceName = "seq_confirm",
        initialValue = 1,
        allocationSize = 1
)
public class Confirm {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seqConfirm")
    private Long confirmNo;

    private String confirmStatus; // 대기, 반려, 승인 3가지 있음

    private String confirmTitle;
    private LocalDate confirmRegDate;
    private LocalDate confirmDate;
    private String remarks;

    @ManyToOne
    @JoinColumn (name = "price_no")
    private Price price;


    private String confirmContent;
    private LocalDate confirmConfirmDate;

    private Long orderNo; //fk

    @ManyToOne
    @JoinColumn (name = "employee_id")
    private Employee employee;

    private Integer customPrice = 0;
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