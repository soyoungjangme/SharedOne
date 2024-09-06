package com.project.tobe.entity;

import lombok.*;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.sql.Date;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Builder
@Table(name="order_header")
public class OrderH {

    @Id
    private int orderNo; //주문 번호
    private Date regDate; //주문등록일
    private Date delDate; //납품일
    private String customerNo; //고객 번호

}
