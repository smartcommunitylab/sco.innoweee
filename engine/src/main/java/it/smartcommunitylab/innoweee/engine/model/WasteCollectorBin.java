package it.smartcommunitylab.innoweee.engine.model;

import org.springframework.data.annotation.Id;

public class WasteCollectorBin {
	@Id
	private String objectId;
	private String binId;
	private String binType;
	private String gameId;
	
	public String getObjectId() {
		return objectId;
	}
	public void setObjectId(String objectId) {
		this.objectId = objectId;
	}
	public String getBinId() {
		return binId;
	}
	public void setBinId(String binId) {
		this.binId = binId;
	}
	public String getBinType() {
		return binType;
	}
	public void setBinType(String binType) {
		this.binType = binType;
	}
	public String getGameId() {
		return gameId;
	}
	public void setGameId(String gameId) {
		this.gameId = gameId;
	}
	
	
}
