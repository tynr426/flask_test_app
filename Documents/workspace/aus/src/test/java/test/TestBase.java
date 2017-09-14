package test;

import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class TestBase {
	public ApplicationContext getContext(){
		String[] conf = {"spring-mvc.xml","spring-mybatis.xml"};
		ApplicationContext ctx = new ClassPathXmlApplicationContext(conf);
		return ctx;	
	}
}
