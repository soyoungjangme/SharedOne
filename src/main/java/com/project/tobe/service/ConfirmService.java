package com.project.tobe.service;

import com.project.tobe.entity.Confirm;

import java.util.List;

public interface ConfirmService {
       List<Confirm> saveConfirms(List<Confirm> confirms);
       List<Confirm> getAllConfirms();
}
