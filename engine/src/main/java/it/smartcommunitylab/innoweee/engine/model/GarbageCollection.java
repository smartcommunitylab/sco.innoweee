package it.smartcommunitylab.innoweee.engine.model;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class GarbageCollection extends BaseObject {
	private String gameId;
	private Date from;
	private Date to;
	private String nameGE;
	private Map<String, String> message = new HashMap<String, String>();
	private List<String> items = new ArrayList<>();
	private List<Link> links = new ArrayList<>();
	
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
	public List<String> getItems() {
		return items;
	}
	public void setItems(List<String> items) {
		this.items = items;
	}
	public List<Link> getLinks() {
		return links;
	}
	public void setLinks(List<Link> links) {
		this.links = links;
	}
	public String getGameId() {
		return gameId;
	}
	public void setGameId(String gameId) {
		this.gameId = gameId;
	}
	public String getNameGE() {
		return nameGE;
	}
	public void setNameGE(String nameGE) {
		this.nameGE = nameGE;
	}
	public Map<String, String> getMessage() {
		return message;
	}
	public void setMessage(Map<String, String> message) {
		this.message = message;
	}
	
}
