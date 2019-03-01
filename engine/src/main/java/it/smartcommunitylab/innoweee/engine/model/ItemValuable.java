package it.smartcommunitylab.innoweee.engine.model;

public class ItemValuable {
	private boolean broken;
	private boolean switchingOn;
	private int age;
	
	public boolean isBroken() {
		return broken;
	}
	public void setBroken(boolean broken) {
		this.broken = broken;
	}
	public boolean isSwitchingOn() {
		return switchingOn;
	}
	public void setSwitchingOn(boolean switchingOn) {
		this.switchingOn = switchingOn;
	}
	public int getAge() {
		return age;
	}
	public void setAge(int age) {
		this.age = age;
	}
}
