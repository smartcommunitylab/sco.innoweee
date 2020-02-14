package it.smartcommunitylab.innoweee.engine.model;

import java.util.Date;

public class ItemAction {
	private String actionType;
	private Date timestamp;
	
	public String getActionType() {
		return actionType;
	}
	public void setActionType(String actionType) {
		this.actionType = actionType;
	}
	public Date getTimestamp() {
		return timestamp;
	}
	public void setTimestamp(Date timestamp) {
		this.timestamp = timestamp;
	}
}
