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
	private long timestamp;
	private boolean reusable;
	private boolean valuable;
	
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
	public long getTimestamp() {
		return timestamp;
	}
	public void setTimestamp(long timestamp) {
		this.timestamp = timestamp;
	}
	public boolean isReusable() {
		return reusable;
	}
	public void setReusable(boolean reusable) {
		this.reusable = reusable;
	}
	public boolean isValuable() {
		return valuable;
	}
	public void setValuable(boolean valuable) {
		this.valuable = valuable;
	}
}
