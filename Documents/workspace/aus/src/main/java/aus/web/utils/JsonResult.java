package aus.web.utils;

import java.io.Serializable;

public class JsonResult implements Serializable{
	private static final long serialVersionUID = 4355125887616175683L;
	public static final int SUCCESS=0;
	public static final int ERROR=1;
	
	private int state;
	private Object data;
	private String message;
	public JsonResult(int state, Object data, String message) {
		super();
		this.state = state;
		this.data = data;
		this.message = message;
	}
	public JsonResult() {
	}
	public JsonResult(Throwable e) {
		state=ERROR;
		data="";
		message = e.getMessage();
	}
	public JsonResult(Object data) {
		state=SUCCESS;
		this.data=data;
		message="";
	}
	public JsonResult(int state,Throwable e) {
		this.state=state;
		data=null;
		message=e.getMessage();
	}
	public int getState() {
		return state;
	}
	public void setState(int state) {
		this.state = state;
	}
	public Object getData() {
		return data;
	}
	public void setData(Object data) {
		this.data = data;
	}
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	@Override
	public String toString() {
		return "JsonResult [state=" + state + ", data=" + data + ", message=" + message + "]";
	}
	
}
