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
	
	@Override
	public String toString() {
		return "reduce:" + reduceCoin + "-resuse:" + reuseCoin + "-recycle:" + recycleCoin;
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
	
	public void addCoinMap(CoinMap coinMap) {
		this.reduceCoin += coinMap.getReduceCoin();
		this.reuseCoin += coinMap.getReuseCoin();
		this.recycleCoin += coinMap.getRecycleCoin();		
	}
	
	public void subCoinMap(CoinMap coinMap) {
		this.reduceCoin -= coinMap.getReduceCoin();
		this.reuseCoin -= coinMap.getReuseCoin();
		this.recycleCoin -= coinMap.getRecycleCoin();		
	}

}
