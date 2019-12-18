package it.smartcommunitylab.innoweee.engine.model;

import java.util.ArrayList;
import java.util.List;

public class GameStatus {
	private String gameId;
	private List<Player> players = new ArrayList<>();
	
	public String getGameId() {
		return gameId;
	}
	public void setGameId(String gameId) {
		this.gameId = gameId;
	}
	public List<Player> getPlayers() {
		return players;
	}
	public void setPlayers(List<Player> players) {
		this.players = players;
	}
}
