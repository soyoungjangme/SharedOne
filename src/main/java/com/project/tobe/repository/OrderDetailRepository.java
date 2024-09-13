package com.project.tobe.repository;

import com.project.tobe.entity.OrderH;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderDetailRepository extends JpaRepository <OrderH, Long> {
    Optional<OrderH> findByOrderNo(Long orderNo);

}