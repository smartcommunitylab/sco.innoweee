package it.smartcommunitylab.innoweee.engine.security;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;

public class User {
	@Id
	private String id;
	private Date creationDate;
	private Date lastUpdate;
	private String subject;
	private String name;
	private String surname;
	private String email;
	private String cf;
	private Map<String, List<Authorization>> roles = new HashMap<String, List<Authorization>>();
	@Transient
	private List<String> tenants = new ArrayList<>();
	
	public Date getCreationDate() {
		return creationDate;
	}
	public void setCreationDate(Date creationDate) {
		this.creationDate = creationDate;
	}
	public Date getLastUpdate() {
		return lastUpdate;
	}
	public void setLastUpdate(Date lastUpdate) {
		this.lastUpdate = lastUpdate;
	}
	public String getSubject() {
		return subject;
	}
	public void setSubject(String subject) {
		this.subject = subject;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getSurname() {
		return surname;
	}
	public void setSurname(String surname) {
		this.surname = surname;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getCf() {
		return cf;
	}
	public void setCf(String cf) {
		this.cf = cf;
	}
	public Map<String, List<Authorization>> getRoles() {
		return roles;
	}
	public void setRoles(Map<String, List<Authorization>> roles) {
		this.roles = roles;
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public List<String> getTenants() {
		return tenants;
	}
	public void setTenants(List<String> tenants) {
		this.tenants = tenants;
	}
	
}
