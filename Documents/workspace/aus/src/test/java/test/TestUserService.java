package test;

import org.junit.Before;
import org.junit.Test;

import aus.web.entity.User;
import aus.web.service.UserService;

public class TestUserService extends TestBase{
	private UserService service;
	@Before
	public void init(){
		service = super.getContext().getBean("userService", UserService.class);
	}
	
}
