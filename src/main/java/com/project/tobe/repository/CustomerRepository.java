package com.project.tobe.repository;

import com.project.tobe.entity.CustomerVO;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository extends JpaRepository<CustomerVO, Long> {
}
