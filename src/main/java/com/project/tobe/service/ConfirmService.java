package com.project.tobe.service;

import com.project.tobe.entity.Confirm;
import com.project.tobe.repository.ConfirmRepository;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

public interface ConfirmService {

    public List<Confirm> getAllConfirms();

    public Confirm getConfirmById(Long id);

    public int saveConfirm(Confirm confirm);

    public int deleteConfirm(Long id);

    public List<Confirm> findByProductTypeAndMinimumQuantity(String productType, int minQty);
}
