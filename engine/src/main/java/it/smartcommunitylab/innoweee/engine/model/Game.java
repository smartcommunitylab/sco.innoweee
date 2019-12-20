package it.smartcommunitylab.innoweee.engine.model;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

public class Game extends BaseObject {
	private String instituteId;
	private String schoolId;
	private String teamName;
	private String geGameId;
	private String gameName;
	private String gameDescription;
	private String gameOwner;
	private Date from;
	private Date to;
	private boolean deployed;
	private String confTemplateId;
	private Map<String, String> params = new HashMap<>();
	private String shortName;
	private String checkCode;
	
	public String getInstituteId() {
		return instituteId;
	}
	public void setInstituteId(String instituteId) {
		this.instituteId = instituteId;
	}
	public String getSchoolId() {
		return schoolId;
	}
	public void setSchoolId(String schoolId) {
		this.schoolId = schoolId;
	}
	public String getGameName() {
		return gameName;
	}
	public void setGameName(String gameName) {
		this.gameName = gameName;
	}
	public String getGameDescription() {
		return gameDescription;
	}
	public void setGameDescription(String gameDescription) {
		this.gameDescription = gameDescription;
	}
	public String getGameOwner() {
		return gameOwner;
	}
	public void setGameOwner(String gameOwner) {
		this.gameOwner = gameOwner;
	}
	public Date getFrom() {
		return from;
	}
	public void setFrom(Date from) {
		this.from = from;
	}
	public Date getTo() {
		return to;
	}
	public void setTo(Date to) {
		this.to = to;
	}
	public boolean isDeployed() {
		return deployed;
	}
	public void setDeployed(boolean deployed) {
		this.deployed = deployed;
	}
	public String getConfTemplateId() {
		return confTemplateId;
	}
	public void setConfTemplateId(String confTemplateId) {
		this.confTemplateId = confTemplateId;
	}
	public Map<String, String> getParams() {
		return params;
	}
	public void setParams(Map<String, String> params) {
		this.params = params;
	}
	public String getShortName() {
		return shortName;
	}
	public void setShortName(String shortName) {
		this.shortName = shortName;
	}
	public String getGeGameId() {
		return geGameId;
	}
	public void setGeGameId(String geGameId) {
		this.geGameId = geGameId;
	}
	public String getTeamName() {
		return teamName;
	}
	public void setTeamName(String teamName) {
		this.teamName = teamName;
	}
	public String getCheckCode() {
		return checkCode;
	}
	public void setCheckCode(String checkCode) {
		this.checkCode = checkCode;
	}

}
