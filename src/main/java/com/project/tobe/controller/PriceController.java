package com.project.tobe.controller;

import com.project.tobe.dto.PriceSearchDTO;
import com.project.tobe.entity.Price;
import com.project.tobe.service.PriceService;
import com.project.tobe.util.constants.URLConstants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.project.tobe.util.constants.URLConstants.*;

@RestController
@RequestMapping(PRICE_HOME)
public class PriceController {
    @Autowired
    private PriceService priceService;

    @GetMapping(PRICE_ALL)
    public List<Price> getAllPrice() {
        return priceService.getAllPrice();
    }

    @PostMapping(SEARCH_PRICE)
    public List<Price> searchPrice(@RequestBody PriceSearchDTO dto) {
        System.out.println(dto);
        return priceService.getPriceByDTO(dto);
    }
}
