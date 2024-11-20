package com.project.tobe.dto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Builder
public class SalesByMonth {
    private String salesMonth;
    private String totalSales;
}
