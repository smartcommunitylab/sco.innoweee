package it.smartcommunitylab.innoweee.engine.ge;

public class PointStatus {
	private String playerId;
	private CoinMap coinMap;
	private double rank;
	
	public PointStatus(String playerId, double rank) {
		this.playerId = playerId;
		this.rank = rank;
	}
	
	@Override
	public String toString() {
		return playerId + ":" + rank;
	}
	
	public String getPlayerId() {
		return playerId;
	}
	public void setPlayerId(String playerId) {
		this.playerId = playerId;
	}
	public CoinMap getCoinMap() {
		return coinMap;
	}
	public void setCoinMap(CoinMap coinMap) {
		this.coinMap = coinMap;
	}
	public double getRank() {
		return rank;
	}
	public void setRank(double rank) {
		this.rank = rank;
	}
}
