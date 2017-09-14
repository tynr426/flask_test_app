package aus.web.controller;

import javax.annotation.Resource;
import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import aus.web.entity.User;
import aus.web.service.NameException;
import aus.web.service.PasswordException;
import aus.web.service.UserService;
import aus.web.utils.JsonResult;
import aus.web.utils.PageInfo;

@Controller
@RequestMapping("/user")
public class UserController extends ExceptionController{
	@Resource
	private UserService userService;
	@RequestMapping("/login.do")
	@ResponseBody
	public Object login(String username,String password,String verifyCode,HttpSession session){
		User user = userService.login(username, password,verifyCode);
		session.setAttribute("loginUser", user);
		return new JsonResult(user);
	}
	
	
	@RequestMapping("/loginOut.do")
	@ResponseBody
	public Object loginOut(){
		return new JsonResult(userService.loginOut());	
	}
	@RequestMapping("/showUserPage.do")
	@ResponseBody
	public Object getUserPage(int index,int size){
		PageInfo<User> pi = userService.getUserPage(index, size);
		return new JsonResult(pi);	
	}
	
	@ExceptionHandler(NameException.class)
	@ResponseBody
	public Object nameExp(NameException e){
		e.printStackTrace();		
		return new JsonResult(2,e);	
	}
	@ExceptionHandler(PasswordException.class)
	@ResponseBody
	public Object pwdExp(PasswordException e){
		e.printStackTrace();		
		return new JsonResult(3,e);	
	}
	@RequestMapping("/regist.do")
	@ResponseBody	
	public JsonResult regist(String userName, String password, String nickName, Integer status, String email, String mobile){
		int n = userService.regist(userName, password, nickName, status, email, mobile);
		return new JsonResult(n==1?userName:"");	
	}
	@RequestMapping("/getUser.do")
	@ResponseBody	
	public JsonResult getUser(int Id){
		User user = userService.getUser(Id);	
		return new JsonResult(user);
	}
	@RequestMapping("/update.do")
	@ResponseBody	
	public JsonResult updateUser(Integer Id,String nickName, String email, String mobile, Integer status){
		boolean success = userService.updateUser(Id, nickName, status, email, mobile);	
		return new JsonResult(success);
	}
	@RequestMapping("/delete.do")
	@ResponseBody
	public JsonResult deleteUser(Integer Id){
		boolean b = userService.deleteUser(Id);
		return new JsonResult(b);
	}
	@RequestMapping("/switchStatus.do")
	@ResponseBody
	public JsonResult updateStatus(Integer id,int status){
		int n =userService.updateStatus(id, status);
		return new JsonResult(n);
	}
	
	
}
