package it.smartcommunitylab.innoweee.engine.model;

public class PlayerReport {
	private int totalItems = 0; 
	private int confirmedItems = 0;
	
	public int getTotalItems() {
		return totalItems;
	}
	public void setTotalItems(int totalItems) {
		this.totalItems = totalItems;
	}
	public int getConfirmedItems() {
		return confirmedItems;
	}
	public void setConfirmedItems(int confirmedItems) {
		this.confirmedItems = confirmedItems;
	}
	
	public void addItem() {
		totalItems++;
	}
	
	public void addConfirmedItem() {
		totalItems++;
		confirmedItems++;
	}
}
