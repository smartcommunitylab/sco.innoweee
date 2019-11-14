package it.smartcommunitylab.innoweee.engine.model;

import java.util.ArrayList;
import java.util.List;

public class TenantData {
	private String instituteId;
	private String instituteName;
	private String schoolId;
	private String schoolName;
	private List<String> classes = new ArrayList<String>();
	private List<GarbageCollection> collections = new ArrayList<GarbageCollection>(); 
	
	public String getInstituteName() {
		return instituteName;
	}
	public void setInstituteName(String instituteName) {
		this.instituteName = instituteName;
	}
	public String getSchoolName() {
		return schoolName;
	}
	public void setSchoolName(String schoolName) {
		this.schoolName = schoolName;
	}
	public List<String> getClasses() {
		return classes;
	}
	public void setClasses(List<String> classes) {
		this.classes = classes;
	}
	public List<GarbageCollection> getCollections() {
		return collections;
	}
	public void setCollections(List<GarbageCollection> collections) {
		this.collections = collections;
	}
	public String getInstituteId() {
		return instituteId;
	}
	public void setInstituteId(String instituteId) {
		this.instituteId = instituteId;
	}
	public String getSchoolId() {
		return schoolId;
	}
	public void setSchoolId(String schoolId) {
		this.schoolId = schoolId;
	}
}
