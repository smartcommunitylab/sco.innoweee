package it.smartcommunitylab.innoweee.engine.model;

import java.util.ArrayList;
import java.util.List;

public class Robot extends BaseObject {
	private String playerId;
	private String gameId;
	private List<Component> components = new ArrayList<Component>();
	
	public String getPlayerId() {
		return playerId;
	}
	public void setPlayerId(String playerId) {
		this.playerId = playerId;
	}
	public String getGameId() {
		return gameId;
	}
	public void setGameId(String gameId) {
		this.gameId = gameId;
	}
	public List<Component> getComponents() {
		return components;
	}
	public void setComponents(List<Component> components) {
		this.components = components;
	}
}
