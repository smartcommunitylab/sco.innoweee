package it.smartcommunitylab.innoweee.engine.model;

import java.util.HashMap;
import java.util.Map;

public class Component {
	private String componentId;
	private String parentId;
	private String type;
	private Map<String, String> name = new HashMap<String, String>();
	private String imageUri;
	private Map<String, Double> costMap = new HashMap<String, Double>();
	
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
	public String getComponentId() {
		return componentId;
	}
	public void setComponentId(String componentId) {
		this.componentId = componentId;
	}
	public Map<String, Double> getCostMap() {
		return costMap;
	}
	public void setCostMap(Map<String, Double> costMap) {
		this.costMap = costMap;
	}
}
