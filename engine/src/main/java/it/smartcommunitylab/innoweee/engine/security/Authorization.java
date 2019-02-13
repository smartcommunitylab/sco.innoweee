package it.smartcommunitylab.innoweee.engine.security;

import java.util.ArrayList;
import java.util.List;

public class Authorization {
	private String role;
	private String tenantId;
	private String instituteId;
	private String schoolId;
	private String gameId;
	private List<String> resources = new ArrayList<>();
	private List<String> actions  = new ArrayList<>();
	
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
	public String getGameId() {
		return gameId;
	}
	public void setGameId(String gameId) {
		this.gameId = gameId;
	}
	public List<String> getActions() {
		return actions;
	}
	public void setActions(List<String> actions) {
		this.actions = actions;
	}
	public List<String> getResources() {
		return resources;
	}
	public void setResources(List<String> resources) {
		this.resources = resources;
	}
	public String getRole() {
		return role;
	}
	public void setRole(String role) {
		this.role = role;
	}
	public String getTenantId() {
		return tenantId;
	}
	public void setTenantId(String tenantId) {
		this.tenantId = tenantId;
	}
}
