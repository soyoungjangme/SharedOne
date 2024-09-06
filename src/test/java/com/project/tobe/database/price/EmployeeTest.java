package com.project.tobe.database.price;

import com.project.tobe.repository.EmployeeRepository;
import com.project.tobe.repository.PriceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class EmployeeTest {
  @Autowired
  private EmployeeRepository employeeRepository;
}
