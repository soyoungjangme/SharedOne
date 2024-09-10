package com.project.tobe.controller;

import com.project.tobe.customer.CustomerService;
import com.project.tobe.dto.PriceProductCustomerDTO;
import com.project.tobe.dto.PriceDTO;
import com.project.tobe.entity.Customer;
import com.project.tobe.entity.Product;
import com.project.tobe.service.PriceService;
import com.project.tobe.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.project.tobe.util.constants.URLConstants.*;

@RestController
@RequestMapping(PRICE_HOME)
public class PriceController {
    @Autowired
    private PriceService priceService;
    @Autowired
    private CustomerService customerService;
    @Autowired
    private ProductService productService;

    @GetMapping(PRICE_ALL)
    public Map<String, List<?>> getAllPrice() {
        List<PriceProductCustomerDTO> priceList = priceService.getPriceProductCustomerDTO(new PriceDTO());
        List<Product> productList = productService.getProductList();
        List<Customer> customerList = customerService.getList();

        Map<String, List<?>> map = new HashMap<>();
        map.put("priceList", priceList);
        map.put("productList", productList);
        map.put("customerList", customerList);

        return map;
    }

    @PostMapping(value=SEARCH_PRICE , produces = "application/json", consumes = "application/json")
    public List<PriceProductCustomerDTO> searchPrice(@RequestBody PriceDTO dto) {
        System.out.println(dto);
        return priceService.getPriceProductCustomerDTO(dto);
    }

    @PostMapping(value=MODIFY_PRICE , produces = "application/json", consumes = "application/json")
    public ResponseEntity<String> savePrice(@RequestBody PriceDTO dto) {
        System.out.println(dto);
        return priceService.updatePrice(dto);
    }
}
