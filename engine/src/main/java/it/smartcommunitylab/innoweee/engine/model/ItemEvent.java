package it.smartcommunitylab.innoweee.engine.model;

import java.util.HashMap;
import java.util.Map;

import org.springframework.data.annotation.Id;

public class ItemEvent {
	@Id
	private String id;
	private String playerId;
	private String itemId;
	private Map<String, Object> attributes = new HashMap<>();
	private long updateTime;
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public Map<String, Object> getAttributes() {
		return attributes;
	}
	public void setAttributes(Map<String, Object> attributes) {
		this.attributes = attributes;
	}
	public long getUpdateTime() {
		return updateTime;
	}
	public void setUpdateTime(long updateTime) {
		this.updateTime = updateTime;
	}
	public String getPlayerId() {
		return playerId;
	}
	public void setPlayerId(String playerId) {
		this.playerId = playerId;
	}
	public String getItemId() {
		return itemId;
	}
	public void setItemId(String itemId) {
		this.itemId = itemId;
	}
}
