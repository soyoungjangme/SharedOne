package com.project.tobe.entity;

import lombok.*;

<<<<<<< HEAD
import javax.persistence.*;
import java.util.List;


@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Builder

public class Customer {


=======
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "customer")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Setter
@Getter
@ToString
public class Customer {
    @Id
>>>>>>> main
    private Long customerNo;
    private String customerName;
    private String customerAddr;
    private String customerTel;
<<<<<<< HEAD
    private String postNum;
    private String businessRegistrationNo;
    private String nation;
    private String dealType;
    private String picName;
    private String picEmail;
    private String picTel;
    private String activated;
    private String businessRegistration;
=======
    private Integer postNum;
    private String businessRegistrationNo; // 수정된 필드 이름
    private String nation;
    private String dealType; // 수정된 필드 이름
    private String picName;
    private String picEmail;
    private String picTel; // 수정된 타입
    private String activated;
>>>>>>> main

}
