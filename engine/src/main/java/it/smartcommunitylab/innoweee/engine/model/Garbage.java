package it.smartcommunitylab.innoweee.engine.model;

import java.util.HashMap;
import java.util.Map;

public class Garbage {
	private String itemId;
	private String category;
	private Map<String, String> name = new HashMap<String, String>();
	private double weight;
	
	public String getCategory() {
		return category;
	}
	public void setCategory(String category) {
		this.category = category;
	}
	public double getWeight() {
		return weight;
	}
	public void setWeight(double weight) {
		this.weight = weight;
	}
	public Map<String, String> getName() {
		return name;
	}
	public void setName(Map<String, String> name) {
		this.name = name;
	}
	public String getItemId() {
		return itemId;
	}
	public void setItemId(String itemId) {
		this.itemId = itemId;
	}
	
}
