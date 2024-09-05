package com.project.tobe.repository;

import com.project.tobe.entity.TestDB;
import org.springframework.data.jpa.repository.JpaRepository;


public interface TestRepository extends JpaRepository<TestDB, Integer> {

}
