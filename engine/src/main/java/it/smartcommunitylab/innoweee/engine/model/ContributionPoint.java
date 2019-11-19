package it.smartcommunitylab.innoweee.engine.model;

import java.util.Date;

import it.smartcommunitylab.innoweee.engine.ge.CoinMap;

public class ContributionPoint {
	private String playerName;
	private String playerId;
	private CoinMap coinMap;
	private Date timestamp; 
	
	public String getPlayerName() {
		return playerName;
	}
	public void setPlayerName(String playerName) {
		this.playerName = playerName;
	}
	public String getPlayerId() {
		return playerId;
	}
	public void setPlayerId(String playerId) {
		this.playerId = playerId;
	}
	public Date getTimestamp() {
		return timestamp;
	}
	public void setTimestamp(Date timestamp) {
		this.timestamp = timestamp;
	}
	public CoinMap getCoinMap() {
		return coinMap;
	}
	public void setCoinMap(CoinMap coinMap) {
		this.coinMap = coinMap;
	}
	
}
