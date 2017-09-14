package aus.web.controller;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import aus.web.utils.CookiesUtil;
import aus.web.utils.VerifyCodeUtils;
@Controller
@RequestMapping
public class VerifyCodeController{
	    //获取验证码
	    @RequestMapping("/getVerifyCode.do")
	    @ResponseBody
	    public String getSysManageLoginCode(HttpServletResponse response,
	            HttpServletRequest request) {
	    	System.out.println("getVerifyCode()");
	        response.setContentType("image/jpeg");// 设置相应类型,告诉浏览器输出的内容为图片
	        response.setHeader("Pragma", "No-cache");// 设置响应头信息，告诉浏览器不要缓存此内容
	        response.setHeader("Cache-Control", "no-cache");
	        response.setHeader("Set-Cookie", "name=value; HttpOnly");//设置HttpOnly属性,防止Xss攻击
	        response.setDateHeader("Expire", 0);
	      //生成随机字串 
	        String verifyCode = VerifyCodeUtils.generateVerifyCode(4); 
	        //存入会话session 
	        HttpSession session = request.getSession(true); 
	        //删除以前的
	        
	        CookiesUtil.addCookie(response, "VerifyCode", verifyCode, 0);
	        session.removeAttribute("verCode");
	        session.setAttribute("verCode", verifyCode.toLowerCase()); 
	        //生成图片 
	        int w = 100, h = 30; 
	      
	        try {
	        	  VerifyCodeUtils.outputImage(w, h, response.getOutputStream(), verifyCode);
	        } catch (Exception e) {
	            e.printStackTrace();
	        }
	        return "";
	    }

	    //验证码验证
	    @RequestMapping(value = "/checkimagecode")
	    @ResponseBody
	    public String checkTcode(HttpServletRequest request,HttpServletResponse response) {
	        String validateCode = request.getParameter("validateCode");
	        String code = null;
	        //1:获取cookie里面的验证码信息
	        Cookie[] cookies = request.getCookies();
	        for (Cookie cookie : cookies) {
	            if ("imagecode".equals(cookie.getName())) {
	                code = cookie.getValue();
	                break;
	            }
	        }
	        //1:获取session验证码的信息
	        //String code1 = (String) request.getSession().getAttribute("");
	        //2:判断验证码是否正确
	        if(validateCode.equals(code)){
	            return "ok";    

	        }
	        return "error";
	        //这里我没有进行字母大小模糊的验证处理，感兴趣的你可以去试一下！
	    }
}
