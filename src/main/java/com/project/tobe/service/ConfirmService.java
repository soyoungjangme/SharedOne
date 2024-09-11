package com.project.tobe.service;

import com.project.tobe.entity.Confirm;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
@Service
public interface ConfirmService {
       List<Confirm> saveConfirms(List<Confirm> confirms);
       List<Confirm> getAllConfirms();
}
