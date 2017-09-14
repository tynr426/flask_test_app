package aus.web.service;


import java.util.List;

import aus.web.entity.User;
import aus.web.utils.PageInfo;

public interface UserService {
	public User login(String username,String password,String verifyCode) throws VerifyCodeException,NameException,PasswordException;
	public int loginOut();
	public List<User> showUser();
	public int regist(String userName,String password,String nickName,Integer status,String email,String mobile)throws NameException,PasswordException,EmailException,MobileException;
	public boolean updateUser(Integer Id, String nickName, Integer status, String email, String mobile);
	public User getUser(int Id);
	public boolean deleteUser(Integer Id);
	public PageInfo<User> getUserPage(int index,int size);
	public int updateStatus(Integer id,int status);
}
