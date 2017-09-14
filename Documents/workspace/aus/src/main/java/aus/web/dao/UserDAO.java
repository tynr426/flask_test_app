package aus.web.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;

import aus.web.entity.User;


public interface UserDAO {
	public User findByUserName(String username);
	public List<User> findAll();
	public int updateUser(User user);
	public User findByEmail(String email);
	public User findByEmail(
			@Param("Id")int Id,
			@Param("email")String email);
	public User findById(int Id);
	public User findByMobile(String mobile);
	public User findByMobile(
			@Param("Id")int Id,
			@Param("mobile")String mobile);
	public int addUser(User user);
	public int delete(Integer Id);
	public int findUserCount();
	public List<User> findByLimit(
			@Param("begin") Integer begin,
			@Param("size") Integer size
			);
	public int updateStatus(User user);
}
