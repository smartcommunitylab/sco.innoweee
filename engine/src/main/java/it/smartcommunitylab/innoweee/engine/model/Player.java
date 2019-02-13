package it.smartcommunitylab.innoweee.engine.model;

public class Player extends BaseObject {
	private String name;
	private String gameId;
	private boolean team;
	private Robot robot;
	
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
}
