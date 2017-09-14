package aus.web.controller;

import javax.annotation.Resource;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import aus.web.entity.Application;
import aus.web.service.ApplicationService;
import aus.web.utils.JsonResult;
import aus.web.utils.PageInfo;

@Controller
@RequestMapping("/app")
public class ApplicationController extends ExceptionController{
	@Resource
	private ApplicationService applicationService;
	@RequestMapping("/showApplicationPage.do")
	@ResponseBody
	public Object getApplicationPage(Integer index,Integer size){
		PageInfo<Application> pi = applicationService.getApplicationPage(index, size);		
		return new JsonResult(pi);
	}
}
