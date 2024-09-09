package com.project.tobe.controller;
import com.project.tobe.entity.Confirm;
import com.project.tobe.repository.ConfirmRepository;
import com.project.tobe.service.ConfirmService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/confirm")
public class ConfirmController {

    @Autowired
    private ConfirmService confirmService;

    @GetMapping
    public ResponseEntity<List<Confirm>> getAllConfirms() {
        return ResponseEntity.ok(confirmService.getAllConfirms());
    }

    @PostMapping
    public ResponseEntity<Confirm> createConfirm(@RequestBody Confirm confirm) {
        return ResponseEntity.ok(confirmService.saveConfirm());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Confirm> updateConfirm(@PathVariable Long id, @RequestBody Confirm confirm) {
        return ResponseEntity.ok(confirmService.updateConfirm(id, confirm));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteConfirm(@PathVariable Long id) {
        confirmService.deleteConfirm(id);
        return ResponseEntity.ok().build();
    }

}
