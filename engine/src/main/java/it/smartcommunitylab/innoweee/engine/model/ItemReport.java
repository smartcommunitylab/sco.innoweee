package it.smartcommunitylab.innoweee.engine.model;

public class ItemReport {
	private String playerId;
	private String playerName;
	private String schoolName;
	private String itemId;
	private String itemType;
	private long timestamp;
	private boolean broken;
	private boolean switchingOn;
	private int age;
	private boolean reusable;
	private boolean valuable;
	private int state;
	
	public ItemReport() {}
	
	public ItemReport(ItemEvent event) {
		this.playerId = event.getPlayerId();
		this.itemId = event.getItemId();
		this.itemType = event.getItemType();
		this.timestamp = event.getTimestamp();
		this.broken = event.isBroken();
		this.switchingOn = event.isSwitchingOn();
		this.age = event.getAge();
		this.reusable = event.isReusable();
		this.valuable = event.isValuable();
		this.state = event.getState();
	}
	
	public String getPlayerId() {
		return playerId;
	}
	public void setPlayerId(String playerId) {
		this.playerId = playerId;
	}
	public String getPlayerName() {
		return playerName;
	}
	public void setPlayerName(String playerName) {
		this.playerName = playerName;
	}
	public String getItemId() {
		return itemId;
	}
	public void setItemId(String itemId) {
		this.itemId = itemId;
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
	public int getState() {
		return state;
	}
	public void setState(int state) {
		this.state = state;
	}
	public String getSchoolName() {
		return schoolName;
	}
	public void setSchoolName(String schoolName) {
		this.schoolName = schoolName;
	}

	public long getTimestamp() {
		return timestamp;
	}

	public void setTimestamp(long timestamp) {
		this.timestamp = timestamp;
	}
}
