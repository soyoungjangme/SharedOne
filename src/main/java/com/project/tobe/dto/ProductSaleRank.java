package com.project.tobe.dto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Builder
public class ProductSaleRank {
    private String productNo;
    private String productName;
    private String monthlySales;
}
