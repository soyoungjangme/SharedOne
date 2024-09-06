package com.project.tobe.repository;

import com.project.tobe.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, List<Product>> {
}
