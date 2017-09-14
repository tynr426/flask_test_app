package aus.web.entity;

import java.util.Date;

public class User {
	private Integer Id;
	private String UserName;
	private String Password;
	private String NickName;
	private Integer Sex;
    private String Face;
    private Integer TypeId;
    private String Mobile;
    private Boolean MobileValidated;
    private String Email;
    private Boolean EmailValidated;
    private Integer Errors;
    private Date ErrorTime;
    private String LoginIP;
    private Date LoginTime;
    private String LastLoginIP;
    private Date LastLoginTime;
    private Integer LoginCount;
    private String Question;
    private String Answer;
    private Date AddTime;
    private Integer Status;
    private String Remark;
    public User(){
    	
    }
	public Integer getId() {
		return Id;
	}
	public void setId(Integer id) {
		Id = id;
	}
	public String getUserName() {
		return UserName;
	}
	public void setUserName(String userName) {
		UserName = userName;
	}
	public String getPassword() {
		return Password;
	}
	public void setPassword(String password) {
		Password = password;
	}
	public String getNickName() {
		return NickName;
	}
	public void setNickName(String nickName) {
		NickName = nickName;
	}
	public Integer getSex() {
		return Sex;
	}
	public void setSex(Integer sex) {
		Sex = sex;
	}
	public String getFace() {
		return Face;
	}
	public void setFace(String face) {
		Face = face;
	}
	public Integer getTypeId() {
		return TypeId;
	}
	public void setTypeId(Integer typeId) {
		TypeId = typeId;
	}
	public String getMobile() {
		return Mobile;
	}
	public void setMobile(String mobile) {
		Mobile = mobile;
	}
	public Boolean getMobileValidated() {
		return MobileValidated;
	}
	public void setMobileValidated(Boolean mobileValidated) {
		MobileValidated = mobileValidated;
	}
	public String getEmail() {
		return Email;
	}
	public void setEmail(String email) {
		Email = email;
	}
	public Boolean getEmailValidated() {
		return EmailValidated;
	}
	public void setEmailValidated(Boolean emailValidated) {
		EmailValidated = emailValidated;
	}
	public Integer getErrors() {
		return Errors;
	}
	public void setErrors(Integer errors) {
		Errors = errors;
	}
	public Date getErrorTime() {
		return ErrorTime;
	}
	public void setErrorTime(Date errorTime) {
		ErrorTime = errorTime;
	}
	public String getLoginIP() {
		return LoginIP;
	}
	public void setLoginIP(String loginIP) {
		LoginIP = loginIP;
	}
	public Date getLoginTime() {
		return LoginTime;
	}
	public void setLoginTime(Date loginTime) {
		LoginTime = loginTime;
	}
	public String getLastLoginIP() {
		return LastLoginIP;
	}
	public void setLastLoginIP(String lastLoginIP) {
		LastLoginIP = lastLoginIP;
	}
	public Date getLastLoginTime() {
		return LastLoginTime;
	}
	public void setLastLoginTime(Date lastLoginTime) {
		LastLoginTime = lastLoginTime;
	}
	public Integer getLoginCount() {
		return LoginCount;
	}
	public void setLoginCount(Integer loginCount) {
		LoginCount = loginCount;
	}
	public String getQuestion() {
		return Question;
	}
	public void setQuestion(String question) {
		Question = question;
	}
	public String getAnswer() {
		return Answer;
	}
	public void setAnswer(String answer) {
		Answer = answer;
	}
	public Date getAddTime() {
		return AddTime;
	}
	public void setAddTime(Date addTime) {
		AddTime = addTime;
	}
	public Integer getStatus() {
		return Status;
	}
	public void setStatus(Integer status) {
		Status = status;
	}
	public String getRemark() {
		return Remark;
	}
	public void setRemark(String remark) {
		Remark = remark;
	}
	@Override
	public String toString() {
		return "User [Id=" + Id + ", UserName=" + UserName + ", Password=" + Password + ", NickName=" + NickName
				+ ", Sex=" + Sex + ", Face=" + Face + ", TypeId=" + TypeId + ", Mobile=" + Mobile + ", MobileValidated="
				+ MobileValidated + ", Email=" + Email + ", EmailValidated=" + EmailValidated + ", Errors=" + Errors
				+ ", ErrorTime=" + ErrorTime + ", LoginIP=" + LoginIP + ", LoginTime=" + LoginTime + ", LastLoginIP="
				+ LastLoginIP + ", LastLoginTime=" + LastLoginTime + ", LoginCount=" + LoginCount + ", Question="
				+ Question + ", Answer=" + Answer + ", AddTime=" + AddTime + ", Status=" + Status + ", Remark=" + Remark
				+ "]";
	}
	public User(String userName, String password, String nickName, String mobile, String email, Integer status) {
		super();
		UserName = userName;
		Password = password;
		NickName = nickName;
		Mobile = mobile;
		Email = email;
		Status = status;
	}
    
}
