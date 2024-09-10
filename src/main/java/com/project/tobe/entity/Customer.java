package com.project.tobe.entity;

import lombok.*;

import javax.persistence.*;
import java.util.List;


@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Builder

public class Customer {


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
