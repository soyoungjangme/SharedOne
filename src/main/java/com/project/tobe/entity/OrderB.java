package com.project.tobe.entity;

import lombok.*;

import javax.persistence.*;
import java.io.Serializable;
import java.util.List;


@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Builder

@IdClass(OrderBId.class)
public class OrderB {

    @Id
    @Column(name = "ORDER_NO")  // orderNo의 매핑을 명확히 지정
    private Long orderNo;
    @Id
    @Column(name = "PRODUCT_NO")  // productNo 매핑
    private Long productNo;
    @Column(name = "ORDER_PRODUCT_QTY")
    private int orderProductQty;

    @ManyToOne
    @JoinColumn(name = "ORDER_NO", insertable = false, updatable = false)
    private OrderH orderH; // 주문 헤더와의 연관 관계

    @ManyToOne
    @JoinColumn(name = "PRODUCT_NO", insertable = false, updatable = false)
    private Product product;

}
