package com.project.tobe.entity;

import lombok.*;

import javax.persistence.*;
import java.sql.Date;
import java.util.ArrayList;
import java.util.List;


@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Builder
public class OrderH {


    private Long orderNo; //주문 번호
    private Date regDate; //주문등록일
    private Date delDate; //납품일
    private Long customerNo;//fk

    private Customer customer;
    private List<OrderB> orderBList;
    private List<Confirm> confirmList;

}
