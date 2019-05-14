package it.smartcommunitylab.innoweee.engine.model;

import java.util.Date;

import org.springframework.data.annotation.Id;

public class ItemEvent {
	@Id
	private String id;
	private String playerId;
	private String itemId;
	private String itemType;
	private boolean broken;
	private boolean switchingOn;
	private int age;
	private long timestamp;
	private Date saveTime; 
	private boolean reusable;
	private boolean valuable;
	private boolean manual;
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
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
	public String getItemType() {
		return itemType;
	}
	public void setItemType(String itemType) {
		this.itemType = itemType;
	}
	public boolean isBroken() {
		return broken;
	}
	public void setBroken(boolean broken) {
		this.broken = broken;
	}
	public boolean isSwitchingOn() {
		return switchingOn;
	}
	public void setSwitchingOn(boolean switchingOn) {
		this.switchingOn = switchingOn;
	}
	public int getAge() {
		return age;
	}
	public void setAge(int age) {
		this.age = age;
	}
	public boolean isManual() {
		return manual;
	}
	public void setManual(boolean manual) {
		this.manual = manual;
	}
	public Date getSaveTime() {
		return saveTime;
	}
	public void setSaveTime(Date saveTime) {
		this.saveTime = saveTime;
	}
}
