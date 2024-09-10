package com.project.tobe.controller;

import com.project.tobe.entity.Product;
import com.project.tobe.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/product")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @GetMapping("/products")
    public List<Product> getProducts() {
        return productRepository.findAll();
    }

    @PostMapping("/updateProductYn")
    public void updateProductYn(@RequestBody List<Long> productNos) {
        productRepository.updateProductYn(productNos);
    }

    @PostMapping("/addProduct")
    public Product addProduct(@RequestBody Product product) {
        return productRepository.save(product);
    }
}
