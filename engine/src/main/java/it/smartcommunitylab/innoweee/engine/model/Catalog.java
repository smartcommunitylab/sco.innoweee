package it.smartcommunitylab.innoweee.engine.model;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;

public class Catalog {
	@Id
	private String id;
	private List<Component> components = new ArrayList<>();
	
	public List<Component> getComponents() {
		return components;
	}
	public void setComponents(List<Component> components) {
		this.components = components;
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
}
