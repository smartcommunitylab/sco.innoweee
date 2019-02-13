package it.smartcommunitylab.innoweee.engine.model;

import java.util.HashMap;
import java.util.Map;

public class Component {
	private String id;
	private String parentId;
	private String type;
	private Map<String, String> name = new HashMap<String, String>();
	private String imageUri;
	private Map<String, Integer> costMap = new HashMap<String, Integer>();
	
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getImageUri() {
		return imageUri;
	}
	public void setImageUri(String imageUri) {
		this.imageUri = imageUri;
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
	public Map<String, String> getName() {
		return name;
	}
	public void setName(Map<String, String> name) {
		this.name = name;
	}
}
