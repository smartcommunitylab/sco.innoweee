package it.smartcommunitylab.innoweee.engine.model;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.annotation.Id;

public class ItemValuableMap {
	@Id
	private String id;
	private String tenantId;
	private String collectionName;
	private Map<String, List<ItemValuable>> items = new HashMap<>();
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getCollectionName() {
		return collectionName;
	}
	public void setCollectionName(String collectionName) {
		this.collectionName = collectionName;
	}
	public Map<String, List<ItemValuable>> getItems() {
		return items;
	}
	public void setItems(Map<String, List<ItemValuable>> items) {
		this.items = items;
	}
	public String getTenantId() {
		return tenantId;
	}
	public void setTenantId(String tenantId) {
		this.tenantId = tenantId;
	}
	
}
