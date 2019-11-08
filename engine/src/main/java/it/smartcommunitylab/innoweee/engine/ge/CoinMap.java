package it.smartcommunitylab.innoweee.engine.ge;

public class CoinMap {
	private double reduceCoin;
	private double reuseCoin;
	private double recycleCoin;
	
	public CoinMap(double reduceCoin, double reuseCoin, double recycleCoin) {
		this.reduceCoin = reduceCoin;
		this.reuseCoin = reuseCoin;
		this.recycleCoin = recycleCoin;
	}
	
	public double getReduceCoin() {
		return reduceCoin;
	}
	public double getReuseCoin() {
		return reuseCoin;
	}
	public double getRecycleCoin() {
		return recycleCoin;
	}

}
