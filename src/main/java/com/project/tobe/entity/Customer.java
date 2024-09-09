package com.project.tobe.entity;

import lombok.*;

import javax.persistence.*;
import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Builder
@Table(name="Customer")
public class Customer {

    @Id
    private Long customerNo;
    private String customerName;
    private String customerAddr;
    private String customerTel;
    private String postNum;
    private String businessRegistrationNo;
    private String nation;
    private String dealType;
    private String picName;
    private String picEmail;
    private String picTel;
    private String activated;
    private String businessRegistration;

}
