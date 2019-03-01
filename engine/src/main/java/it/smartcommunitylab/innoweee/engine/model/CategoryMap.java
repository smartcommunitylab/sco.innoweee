package it.smartcommunitylab.innoweee.engine.model;

import java.util.HashMap;
import java.util.Map;

import org.springframework.data.annotation.Id;

public class CategoryMap {
	@Id
	private String id;
	private String tenantId;
	private Map<String, Category> categories = new HashMap<>();
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public Map<String, Category> getCategories() {
		return categories;
	}
	public void setCategories(Map<String, Category> categories) {
		this.categories = categories;
	}
	public String getTenantId() {
		return tenantId;
	}
	public void setTenantId(String tenantId) {
		this.tenantId = tenantId;
	}
}
