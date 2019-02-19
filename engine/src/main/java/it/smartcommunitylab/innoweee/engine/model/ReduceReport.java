package it.smartcommunitylab.innoweee.engine.model;

public class ReduceReport extends BaseObject {
	private String playerId;
	private Integer reduceCoin;
	private String garbageCollectionId;
	private long timestamp;
	
	public String getPlayerId() {
		return playerId;
	}
	public void setPlayerId(String playerId) {
		this.playerId = playerId;
	}
	public Integer getReduceCoin() {
		return reduceCoin;
	}
	public void setReduceCoin(Integer reduceCoin) {
		this.reduceCoin = reduceCoin;
	}
	public String getGarbageCollectionId() {
		return garbageCollectionId;
	}
	public void setGarbageCollectionId(String garbageCollectionId) {
		this.garbageCollectionId = garbageCollectionId;
	}
	public long getTimestamp() {
		return timestamp;
	}
	public void setTimestamp(long timestamp) {
		this.timestamp = timestamp;
	}
}
