package com.project.tobe.database;

import com.project.tobe.entity.TestDB;
import com.project.tobe.repository.TestRepository;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class DBTest2 {
  @Autowired
  TestRepository testRepository;

  @Test
  void testDB() {
    Assertions.assertThat(testRepository.findById(1)).isNotEmpty();
  }

  @BeforeEach
  public void setUp() {
    testRepository.save(TestDB.builder().id(12343).pw(2222).build());
    testRepository.save(TestDB.builder().id(123).pw(3333).build());
    testRepository.save(TestDB.builder().id(14).pw(333).build());
  }

  @AfterEach
  public void clear() {
  }
}
