package it.smartcommunitylab.innoweee.engine.model;

public class ReduceReport extends BaseObject {
	private String playerId;
	private double reduceCoin;
	private String garbageCollectionId;
	private long timestamp;
	
	public String getPlayerId() {
		return playerId;
	}
	public void setPlayerId(String playerId) {
		this.playerId = playerId;
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
	public double getReduceCoin() {
		return reduceCoin;
	}
	public void setReduceCoin(double reduceCoin) {
		this.reduceCoin = reduceCoin;
	}
}
