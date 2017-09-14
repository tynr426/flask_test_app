package aus.web.service;

import aus.web.entity.Application;
import aus.web.utils.PageInfo;

public interface ApplicationService {
	public PageInfo<Application> getApplicationPage(Integer index,Integer size);
}
