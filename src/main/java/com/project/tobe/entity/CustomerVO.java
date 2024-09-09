package com.project.tobe.entity;

import lombok.*;

import javax.persistence.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "customer") // 데이터베이스 테이블과 매핑
public class CustomerVO {

    @Id
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
