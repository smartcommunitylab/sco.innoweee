package it.smartcommunitylab.innoweee.engine.model;

import java.util.HashMap;
import java.util.Map;

public class Garbage {
	private String id;
	private String category;
	private String name;
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
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
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
	
}
