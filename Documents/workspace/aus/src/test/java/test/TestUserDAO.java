package test;

import java.util.List;

import org.junit.Before;
import org.junit.Test;

import aus.web.dao.UserDAO;
import aus.web.entity.User;

public class TestUserDAO extends TestBase {
	private UserDAO dao;
	@Before
	public void init(){
		dao = super.getContext().getBean("userDAO", UserDAO.class);
	}
	@Test
	public void test(){
		User user = dao.findByUserName("admin");
		System.out.println(user);
	}
	@Test
	public void test1(){
		List<User> list = dao.findAll();
		for(User user:list){		
			System.out.println(user);
		}
	}
}
