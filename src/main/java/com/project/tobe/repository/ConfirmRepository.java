package com.project.tobe.repository;

import com.project.tobe.entity.Confirm;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

public interface ConfirmRepository extends JpaRepository<Confirm, Long>{

}