package it.smartcommunitylab.innoweee.engine.model;

import java.util.HashMap;
import java.util.Map;

public class Robot {
	private Map<String, Component> components = new HashMap<String, Component>();
	
	public Map<String, Component> getComponents() {
		return components;
	}
	public void setComponents(Map<String, Component> components) {
		this.components = components;
	}
}
