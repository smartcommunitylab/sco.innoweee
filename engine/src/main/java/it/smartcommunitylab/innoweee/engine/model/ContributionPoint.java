package it.smartcommunitylab.innoweee.engine.model;

import java.util.HashMap;
import java.util.Map;

public class ContributionPoint {
	private String playerName;
	private String playerId;
	private Map<String, Double> costMap = new HashMap<String, Double>();
	
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
	public Map<String, Double> getCostMap() {
		return costMap;
	}
	public void setCostMap(Map<String, Double> costMap) {
		this.costMap = costMap;
	}

	
}
