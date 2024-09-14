package com.project.tobe.service;

import com.project.tobe.dto.EmailDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender mailSender;

    @Async
    public boolean sendMailReject(EmailDTO inDTO) throws Exception {
        boolean msg = false;

        SimpleMailMessage mailMessage = new SimpleMailMessage();

        mailMessage.setTo("kjn0406@naver.com");
        mailMessage.setSubject("메일 전송 테스트");
        mailMessage.setFrom("coreops365@gmail.com");
        mailMessage.setText(inDTO.getSubject() + "mail test");

        try {
            mailSender.send(mailMessage);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return msg;
        }

        return true;
    }
}
