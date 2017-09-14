package aus.web.service;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import aus.web.dao.ApplicationDAO;
import aus.web.entity.Application;
import aus.web.utils.PageInfo;
@Service("applicationService")
public class ApplicationServiceImpl implements ApplicationService{
	@Resource
	private ApplicationDAO applicationDAO;

	public PageInfo<Application> getApplicationPage(Integer index, Integer size) {
		PageInfo<Application> pi = new PageInfo<Application>();
		pi.setPageIndex(index);
		pi.setPageSize(size);
		pi.setCount(applicationDAO.findByApplicationCount());
		pi.setList(applicationDAO.findByLimit(pi.getBegin(), size));
		return pi;
	}
	
}
