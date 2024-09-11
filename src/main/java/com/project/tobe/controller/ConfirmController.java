package com.project.tobe.controller;
import com.project.tobe.entity.Confirm;
import com.project.tobe.service.ConfirmService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/confirm")
public class ConfirmController {

    private final ConfirmService confirmService;

    @Autowired
    public ConfirmController(ConfirmService confirmService) {
        this.confirmService = confirmService;
    }

    @PostMapping("/batch")
    public List<Confirm> createConfirms(@RequestBody List<Confirm> confirms) {
        return confirmService.saveConfirms(confirms);
    }

    @GetMapping
    public List<Confirm> getAllConfirms() {
        return confirmService.getAllConfirms();
    }

}
