package it.smartcommunitylab.innoweee.engine.model;

import java.util.HashMap;
import java.util.Map;

import org.springframework.data.annotation.Id;

public class GarbageMap {
	@Id
	private String id;
	private String tenantId;
	private Map<String, Garbage> items = new HashMap<>();
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public Map<String, Garbage> getItems() {
		return items;
	}
	public void setItems(Map<String, Garbage> items) {
		this.items = items;
	}
	public String getTenantId() {
		return tenantId;
	}
	public void setTenantId(String tenantId) {
		this.tenantId = tenantId;
	} 
}
