package com.project.tobe.entity;

import lombok.*;

import java.io.Serializable;
import java.util.Objects;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class OrderBId implements Serializable {

    private int orderNo;
    private int productNo;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        OrderBId orderBId = (OrderBId) o;
        return orderNo == orderBId.orderNo &&
                productNo == orderBId.productNo;
    }

    @Override
    public int hashCode() {
        return Objects.hash(orderNo, productNo);
    }

}
