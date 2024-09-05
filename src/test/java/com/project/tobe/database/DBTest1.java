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
public class DBTest1 {
    @Autowired
    TestRepository testRepository;

    @Test
    void testDB() {
        Assertions.assertThat(testRepository.findById(1)).isNotEmpty();
    }

    @BeforeEach
    public void setUp() {
        for (int i = 1; i <= 10; i++) {
            testRepository.save(TestDB.builder().id(i).pw(i * 10).build());
        }
    }

    @AfterEach
    public void clear() {
        for (int i = 1; i <= 10; i++) {
            testRepository.deleteById(i);
        }
    }
}
