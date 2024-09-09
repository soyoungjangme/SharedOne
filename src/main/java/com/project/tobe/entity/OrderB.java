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
public class OrderB {
    private Long orderNo;
    private Long productNo;
    private int orderProductQty;


    private Product product;

}
