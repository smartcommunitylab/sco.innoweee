package it.smartcommunitylab.innoweee.engine.model;

import java.util.HashMap;
import java.util.Map;

import org.springframework.data.annotation.Id;

public class Catalog {
	@Id
	private String id;
	private String tenantId;
	private Map<String, Component> components = new HashMap<String, Component>();
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public Map<String, Component> getComponents() {
		return components;
	}
	public void setComponents(Map<String, Component> components) {
		this.components = components;
	}
	public String getTenantId() {
		return tenantId;
	}
	public void setTenantId(String tenantId) {
		this.tenantId = tenantId;
	}
}
