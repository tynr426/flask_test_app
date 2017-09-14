package aus.web.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import aus.web.entity.Application;

public interface ApplicationDAO {
	public int findByApplicationCount();
	public List<Application> findByLimit(
			@Param("begin") Integer begin,
			@Param("size") Integer size
			);
}
