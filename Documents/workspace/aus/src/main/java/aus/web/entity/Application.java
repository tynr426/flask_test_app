package aus.web.entity;

public class Application {
	private int Id;
	private String Name;
	private boolean PrimaryApp;
	private int PrimaryId;
	private String CodeMark;
	private String System;
	private String OSVersion;
	private String Company;
	private String Language;
	private int Status;
	private short SchemaMode;
	public Application(){
		
	}
	public int getId() {
		return Id;
	}
	public void setId(int id) {
		Id = id;
	}
	public String getName() {
		return Name;
	}
	public void setName(String name) {
		Name = name;
	}
	public boolean isPrimaryApp() {
		return PrimaryApp;
	}
	public void setPrimaryApp(boolean primaryApp) {
		PrimaryApp = primaryApp;
	}
	public int getPrimaryId() {
		return PrimaryId;
	}
	public void setPrimaryId(int primaryId) {
		PrimaryId = primaryId;
	}
	public String getCodeMark() {
		return CodeMark;
	}
	public void setCodeMark(String codeMark) {
		CodeMark = codeMark;
	}
	public String getSystem() {
		return System;
	}
	public void setSystem(String system) {
		System = system;
	}
	public String getOSVersion() {
		return OSVersion;
	}
	public void setOSVersion(String oSVersion) {
		OSVersion = oSVersion;
	}
	public String getCompany() {
		return Company;
	}
	public void setCompany(String company) {
		Company = company;
	}
	public String getLanguage() {
		return Language;
	}
	public void setLanguage(String language) {
		Language = language;
	}
	public int getStatus() {
		return Status;
	}
	public void setStatus(int status) {
		Status = status;
	}
	public short getSchemaMode() {
		return SchemaMode;
	}
	public void setSchemaMode(short schemaMode) {
		SchemaMode = schemaMode;
	}
	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + Id;
		return result;
	}
	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Application other = (Application) obj;
		if (Id != other.Id)
			return false;
		return true;
	}
	@Override
	public String toString() {
		return "Application [Id=" + Id + ", Name=" + Name + ", PrimaryApp=" + PrimaryApp + ", PrimaryId=" + PrimaryId
				+ ", CodeMark=" + CodeMark + ", System=" + System + ", OSVersion=" + OSVersion + ", Company=" + Company
				+ ", Language=" + Language + ", Status=" + Status + ", SchemaMode=" + SchemaMode + "]";
	}
	
}
