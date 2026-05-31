package com.chuch.Orderly;

import org.springframework.boot.SpringApplication;

public class TestOrderlyApplication {

	public static void main(String[] args) {
		SpringApplication.from(OrderlyApplication::main).with(TestcontainersConfiguration.class).run(args);
	}

}
