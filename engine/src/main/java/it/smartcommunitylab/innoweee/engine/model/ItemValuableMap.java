package it.smartcommunitylab.innoweee.engine.model;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.annotation.Id;

public class ItemValuableMap {
	@Id
	private String id;
	private String tenantId;
	private List<String> collectionNames = new ArrayList<String>();
	private Map<String, List<ItemValuable>> items = new HashMap<>();
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
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
	public List<String> getCollectionNames() {
		return collectionNames;
	}
	public void setCollectionNames(List<String> collectionNames) {
		this.collectionNames = collectionNames;
	}
	
}
