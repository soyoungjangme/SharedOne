package com.project.tobe.controller;
import com.project.tobe.entity.Confirm;
import com.project.tobe.repository.ConfirmRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/confirm")
public class ConfirmController {
    @Autowired
    ConfirmRepository confirmRepository;

    @GetMapping("/get")
    public List<Confirm> getData(@RequestParam List<Integer> allId) {

        return confirmRepository.findAllById(allId);
    }
}
