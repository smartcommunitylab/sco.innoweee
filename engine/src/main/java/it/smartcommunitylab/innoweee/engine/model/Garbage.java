package it.smartcommunitylab.innoweee.engine.model;

import java.util.HashMap;
import java.util.Map;

public class Garbage {
	private String id;
	private String category;
	private Map<String, String> name = new HashMap<String, String>();
	private Map<String, String> description = new HashMap<String, String>();
	private double weight;
	private double co2;
	private Map<String, Double> materialsConversion = new HashMap<String, Double>();
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
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
	public double getCo2() {
		return co2;
	}
	public void setCo2(double co2) {
		this.co2 = co2;
	}
	public Map<String, Double> getMaterialsConversion() {
		return materialsConversion;
	}
	public void setMaterialsConversion(Map<String, Double> materialsConversion) {
		this.materialsConversion = materialsConversion;
	}
	public Map<String, String> getName() {
		return name;
	}
	public void setName(Map<String, String> name) {
		this.name = name;
	}
	public Map<String, String> getDescription() {
		return description;
	}
	public void setDescription(Map<String, String> description) {
		this.description = description;
	}
	
}
