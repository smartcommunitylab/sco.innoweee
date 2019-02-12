package it.smartcommunitylab.innoweee.engine.model;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Transient;

public class Player extends BaseObject {
	private String name;
	private String gameId;
	private boolean team;
	@Transient
	private List<Robot> robots = new ArrayList<>();
	
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getGameId() {
		return gameId;
	}
	public void setGameId(String gameId) {
		this.gameId = gameId;
	}
	public boolean isTeam() {
		return team;
	}
	public void setTeam(boolean team) {
		this.team = team;
	}
	public List<Robot> getRobots() {
		return robots;
	}
	public void setRobots(List<Robot> robots) {
		this.robots = robots;
	}
}
