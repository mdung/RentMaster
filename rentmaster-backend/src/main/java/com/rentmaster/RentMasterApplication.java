package com.rentmaster;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class RentMasterApplication {

    public static void main(String[] args) {
        SpringApplication.run(RentMasterApplication.class, args);
    }
}


