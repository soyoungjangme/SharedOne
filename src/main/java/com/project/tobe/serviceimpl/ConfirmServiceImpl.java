package com.project.tobe.serviceimpl;

import com.project.tobe.entity.Confirm;
import com.project.tobe.repository.ConfirmRepository;
import com.project.tobe.service.ConfirmService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ConfirmServiceImpl implements ConfirmService {

    @Autowired
    private ConfirmMapper confirmMapper;

    @Override
    public List<Confirm> getAllConfirms() {
        return confirmMapper.getAllConfirms();
    }

    @Override
    public Confirm getConfirmById(Long id) {
        return confirmMapper.getConfirmById(id);
    }

    @Override
    public int saveConfirm(Confirm confirm) {
        if (confirm.getId() == null) {
            return confirmMapper.insertConfirm(confirm);
        } else {
            return confirmMapper.updateConfirm(confirm);
        }
    }

    @Override
    public int deleteConfirm(Long id) {
        return confirmMapper.deleteConfirm(id);
    }

    @Override
    public List<Confirm> findByProductTypeAndMinimumQuantity(String productType, int minQty) {
        return confirmMapper.findByProductTypeAndMinimumQuantity(productType, minQty);
    }
}
