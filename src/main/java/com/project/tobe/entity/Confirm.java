
package com.project.tobe.entity;

import lombok.*;

import javax.persistence.*;
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
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seqConfirm")
    private Long confirmNo;

//    @ManyToOne
//    @JoinColumn(name = "employee_id")
//    private Employee approver; // 결재자

//    @ManyToOne
//    @JoinColumn(name = "order_id")
//    private Order order; // 주문 정보

    private String confirmStatus;
    private String confirmContent;
    private LocalDate confirmRegDate;
    private LocalDate confirmConfirmDate;
}