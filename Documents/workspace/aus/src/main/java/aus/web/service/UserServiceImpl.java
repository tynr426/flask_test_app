package aus.web.service;

import java.util.List;

import javax.annotation.Resource;
import javax.servlet.annotation.HttpConstraint;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import aus.web.dao.UserDAO;
import aus.web.entity.User;
import aus.web.utils.CookiesUtil;
import aus.web.utils.Md5;
import aus.web.utils.PageInfo;


@Service("userService")
public class UserServiceImpl implements UserService{
	@Resource
	private UserDAO userDAO;
	@HttpConstraint
	public User login(String username, String password,String verifyCode) throws VerifyCodeException,NameException, PasswordException{
		if(username==null||username.trim().isEmpty()){
			throw new NameException("�û���Ϊ��");
		}
		if(password==null||password.trim().isEmpty()){
			throw new PasswordException("����Ϊ��");
		}
		User user = userDAO.findByUserName(username);
		if(user==null){
			throw new NameException("�û�������ȷ");
		}
		HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
		Cookie cookie = CookiesUtil.getCookieByName(request, "VerifyCode");
		
        if(cookie==null){
            throw new VerifyCodeException("��֤�����");   
        }else if(!verifyCode.equals(cookie.getValue().toLowerCase())){
        	throw new VerifyCodeException("��֤���������"); 
        }
        
		String md5Password = Md5.getMd5(password);
		if(user.getPassword().equals(md5Password)){			
			request.getSession().setAttribute("user",user );
			return user;
		}else {
			throw new PasswordException("�������");
		}
	}
	public int loginOut() {
		HttpServletRequest request = ((ServletRequestAttributes)RequestContextHolder.getRequestAttributes()).getRequest();
		request.getSession().removeAttribute("user");
		return 0;
	}
	public List<User> showUser() {
		List<User> list = userDAO.findAll();
		return list;
	}
	public int regist(String userName, String password, String nickName, Integer status, String email, String mobile)
			throws NameException, PasswordException, EmailException, MobileException {
		if(userName==null||userName.trim().isEmpty()){
			throw new NameException("�û���Ϊ��");
		}
		User one = userDAO.findByUserName(userName);
		if(one!=null){
			throw new NameException("�û��Ѵ���");
		}
		if(password==null||password.trim().isEmpty()){
			throw new PasswordException("���벻��Ϊ��");
		}
		if(nickName==null||nickName.trim().isEmpty()){
			throw new NameException("�ǳƲ���Ϊ��");
		}
		if(!email.trim().isEmpty()){		
			User two = userDAO.findByEmail(email);
			if(two!=null){
				throw new EmailException("�����Ѵ���");
			}
		}
		if(!mobile.trim().isEmpty()){		
			User three = userDAO.findByMobile(mobile);
			if(three!=null){
				throw new MobileException("�ֻ����Ѵ���");
			}
		}
		password = Md5.getMd5(password);
		User user = new User(userName, password, nickName, mobile, email, status);
		int n = userDAO.addUser(user);
		return n;
	}
	public boolean updateUser(Integer Id, String nickName, Integer status, String email, String mobile){
		User data = userDAO.findById(Id);
		if(data==null){
			throw new NameException("�û�������");
		}
		if(!email.trim().isEmpty()){
			data = userDAO.findByEmail(Id,email);
			if(data!=null){
				throw new EmailException("���䱻ռ��");
			}
		}		
		if(!mobile.trim().isEmpty()){
			data = userDAO.findByMobile(Id, mobile);
			if(data!=null){
				throw new MobileException("�ֻ��ű�ռ��");
			}
		}
		User user = userDAO.findById(Id);
		user.setNickName(nickName);
		user.setStatus(status);
		user.setEmail(email);
		user.setMobile(mobile);
		int n =userDAO.updateUser(user);
		return n==1;	
	}
	public User getUser(int Id) {
		User user = userDAO.findById(Id);
		return user;
	}
	public boolean deleteUser(Integer Id) {
		if(Id==null){
			throw new NameException("ID����Ϊ��");
		}
		User user = userDAO.findById(Id);
		if(user==null){
			throw new NameException("�û�������");
		}
		int n = userDAO.delete(Id);
		return n==1;
	}
	public PageInfo<User> getUserPage(int index, int size) {
		PageInfo<User> pi = new PageInfo<User>();
		pi.setPageIndex(index);
		pi.setPageSize(size);
		pi.setCount(userDAO.findUserCount());
		pi.setList(userDAO.findByLimit(pi.getBegin(), size));
		return pi;
	}
	public int updateStatus(Integer id, int status) {
		User user = userDAO.findById(id);
		if(user==null){
			throw new NameException("�û�������");
		}
		user.setStatus(status);
		int n =userDAO.updateStatus(user);
		return n;
	}
	
}
