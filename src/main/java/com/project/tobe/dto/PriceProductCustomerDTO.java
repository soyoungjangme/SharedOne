package com.project.tobe.dto;

import com.project.tobe.util.constants.YesNo;
import lombok.*;


import java.time.LocalDate;
import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Builder
public class PriceProductCustomerDTO {
    private LocalDateTime registerDate;
    private Long priceNo;
    private Long productNo;
    private String productName;
    private Long customerNo;
    private String customerName;
    private Double customPrice;
    private Double discount;
    private LocalDate startDate;
    private LocalDate endDate;
    private YesNo activated;
}
