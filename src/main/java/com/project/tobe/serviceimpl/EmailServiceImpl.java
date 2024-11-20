package com.project.tobe.serviceimpl;

import com.project.tobe.dto.EmailDTO;
import com.project.tobe.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@EnableAsync
public class EmailServiceImpl implements EmailService {
    private final JavaMailSender mailSender;
//    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    @Async
    public void sendMailReject(EmailDTO inDTO) throws Exception {
        boolean msg = false;

        SimpleMailMessage mailMessage = new SimpleMailMessage();

        mailMessage.setTo(inDTO.getTargetMail());
        mailMessage.setSubject(inDTO.getSubject());
        mailMessage.setFrom("coreops365@gmail.com");
        mailMessage.setText(inDTO.getBody());

//        logger.debug("debug log={}", inDTO);

        try {
            mailSender.send(mailMessage);
        } catch (Exception e) {
//            logger.error("error log={}", e.getMessage());
            System.out.println(e.getMessage());
        }
    }
}
