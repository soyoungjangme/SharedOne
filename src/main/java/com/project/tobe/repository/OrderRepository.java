package com.project.tobe.repository;

import com.project.tobe.entity.OrderH;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<OrderH, Integer> { //객체 클래스, pk타입

}
