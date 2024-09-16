package com.project.tobe.dto;

import com.project.tobe.entity.Product;
import lombok.*;


@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Builder
public class OrderBDTO {
    private Long orderNo;
    private Long productNo;
    private int orderProductQty;
    private ProductDTO product;
    private PriceDTO price;

}
