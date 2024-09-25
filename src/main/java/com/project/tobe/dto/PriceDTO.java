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
public class PriceDTO {
    private Long priceNo;
    private LocalDateTime registerDate;
    private String productNo;
    private String productName;
    private String customerNo;
    private String customerName;
    private Double customPrice;
    private Double discount;
    private LocalDate startDate;
    private LocalDate endDate;
    private YesNo activated;

    private int page = 1;
    private int amount = 50;

    public PriceDTO(String productNo, String customerNo, Double customPrice, Double discount, LocalDate startDate, LocalDate endDate) {
        this.productNo = productNo;
        this.customerNo = customerNo;
        this.customPrice = customPrice;
        this.discount = discount;
        this.startDate = startDate;
        this.endDate = endDate;
    }

    //jsy 객체 필요
    private ProductDTO product;
}
