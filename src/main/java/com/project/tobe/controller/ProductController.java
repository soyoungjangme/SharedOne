package com.project.tobe.controller;

import com.project.tobe.entity.Product;
import com.project.tobe.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/product")
public class ProductController {

    @Autowired
    private  ProductRepository productRepository;

    @GetMapping("/products")
    public Product getProducts() {
        return productRepository.findById(20).orElse(null);
    }
}
