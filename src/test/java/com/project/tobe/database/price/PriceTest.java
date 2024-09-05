package com.project.tobe.database.price;

import com.project.tobe.entity.Price;
import com.project.tobe.repository.PriceRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class PriceTest {
    @Autowired
    private PriceRepository priceRepository;
}
