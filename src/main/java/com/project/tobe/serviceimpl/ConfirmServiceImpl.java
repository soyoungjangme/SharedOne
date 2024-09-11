package com.project.tobe.serviceimpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.project.tobe.entity.Confirm;
import com.project.tobe.repository.ConfirmRepository;
import com.project.tobe.service.ConfirmService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ConfirmServiceImpl implements ConfirmService {
    @Autowired
    private ConfirmRepository confirmRepository;

//    public ConfirmServiceImpl(ConfirmRepository confirmRepository) {
//        this.confirmRepository = confirmRepository;
//    }

    @Override
    public List<Confirm> saveConfirms(List<Confirm> confirms) {
        return confirmRepository.saveAll(confirms);
    }

    @Override
    public List<Confirm> getAllConfirms() {
        return confirmRepository.findAll();
    }
}
