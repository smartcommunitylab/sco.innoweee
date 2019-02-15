package it.smartcommunitylab.innoweee.engine.model;

import java.util.HashMap;
import java.util.Map;

public class Category {
	private String id;
	private Map<String, Double> materialsConversion = new HashMap<String, Double>();
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public Map<String, Double> getMaterialsConversion() {
		return materialsConversion;
	}
	public void setMaterialsConversion(Map<String, Double> materialsConversion) {
		this.materialsConversion = materialsConversion;
	}

}
