package it.smartcommunitylab.innoweee.engine.model;

import java.util.ArrayList;
import java.util.List;

public class Contribution {
	private String garbageCollectionId;
	private String garbageCollectionName;
	private List<ContributionPoint> donatedPoints = new ArrayList<>();
	private List<ContributionPoint> receivedPoints = new ArrayList<>();
	
	public String getGarbageCollectionId() {
		return garbageCollectionId;
	}
	public void setGarbageCollectionId(String garbageCollectionId) {
		this.garbageCollectionId = garbageCollectionId;
	}
	public String getGarbageCollectionName() {
		return garbageCollectionName;
	}
	public void setGarbageCollectionName(String garbageCollectionName) {
		this.garbageCollectionName = garbageCollectionName;
	}
	public List<ContributionPoint> getDonatedPoints() {
		return donatedPoints;
	}
	public void setDonatedPoints(List<ContributionPoint> donatedPoints) {
		this.donatedPoints = donatedPoints;
	}
	public List<ContributionPoint> getReceivedPoints() {
		return receivedPoints;
	}
	public void setReceivedPoints(List<ContributionPoint> receivedPoints) {
		this.receivedPoints = receivedPoints;
	}
	
	
}
