package com.project.tobe.database.price;

import com.project.tobe.entity.Price;
import com.project.tobe.repository.PriceRepository;
import com.project.tobe.util.constants.YesNo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDate;

@SpringBootTest
public class PriceTest {
    @Autowired
    private PriceRepository priceRepository;

    @Test
    public void test1() {
        Price price1 = Price.builder()
                .registerDate(LocalDate.now())
                .productNo(1001L)
                .customerNo(2001L)
                .customPrice(150.75)
                .currency("USD")
                .discount(10.5)
                .startDate(LocalDate.of(2024, 1, 1))
                .endDate(LocalDate.of(2024, 12, 31))
                .activated(YesNo.Y)
                .build();

        Price price2 = Price.builder()
                .registerDate(LocalDate.now())
                .productNo(1002L)
                .customerNo(2002L)
                .customPrice(250.00)
                .currency("EUR")
                .discount(5.0)
                .startDate(LocalDate.of(2024, 2, 1))
                .endDate(LocalDate.of(2024, 11, 30))
                .activated(YesNo.N)
                .build();

        priceRepository.save(price1);
        priceRepository.save(price2);
    }
}