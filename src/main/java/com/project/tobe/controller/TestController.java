package com.project.tobe.controller;

import com.project.tobe.entity.TestDB;
import com.project.tobe.repository.TestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/test")
public class TestController {
    @Autowired
    private TestRepository testRepository;

    @GetMapping("/get")
    public TestDB getData() {
        return testRepository.findById(1).orElse(null);
    }
}
