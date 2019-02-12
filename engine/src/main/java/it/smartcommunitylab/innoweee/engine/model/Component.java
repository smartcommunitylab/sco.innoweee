package it.smartcommunitylab.innoweee.engine.model;

import java.util.HashMap;
import java.util.Map;

public class Component {
	private String id;
	private String parentId;
	private String type;
	private String name;
	private String imageUri;
	private String customization;
	private Map<String, Integer> costMap = new HashMap<String, Integer>();
	
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getImageUri() {
		return imageUri;
	}
	public void setImageUri(String imageUri) {
		this.imageUri = imageUri;
	}
	public String getCustomization() {
		return customization;
	}
	public void setCustomization(String customization) {
		this.customization = customization;
	}
	public Map<String, Integer> getCostMap() {
		return costMap;
	}
	public void setCostMap(Map<String, Integer> costMap) {
		this.costMap = costMap;
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getParentId() {
		return parentId;
	}
	public void setParentId(String parentId) {
		this.parentId = parentId;
	}
}
