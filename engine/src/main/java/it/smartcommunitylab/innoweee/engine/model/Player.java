package it.smartcommunitylab.innoweee.engine.model;

import java.util.ArrayList;
import java.util.List;

public class Player extends BaseObject {
	private String name;
	private String gameId;
	private boolean team;
	private Robot robot;
	private List<Contribution> contributions = new ArrayList<>();
	
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
	public Robot getRobot() {
		return robot;
	}
	public void setRobot(Robot robot) {
		this.robot = robot;
	}
	public List<Contribution> getContributions() {
		return contributions;
	}
	public void setContributions(List<Contribution> contributions) {
		this.contributions = contributions;
	}
}
