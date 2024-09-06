package com.project.tobe.entity;

import lombok.*;

import javax.persistence.*;

@Entity
@Table(name = "customer")
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
@SequenceGenerator(name = "seqCustomer", sequenceName = "seq_customer", initialValue = 1, allocationSize = 1)
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seqCustomer")
    private Long customerNo;
    private String customerName;
    private String customerAddr;
    private String customerTel;
    private int postNum;
    private String businessRegistrationNo; // 수정된 필드 이름
    private String nation;
    private String dealType; // 수정된 필드 이름
    private String picName;
    private String picEmail;
    private String picTel; // 수정된 타입
    private char activated;

}
