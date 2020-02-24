package it.smartcommunitylab.innoweee.engine.model;

public class CollectorReport {
	private int totaleConferiti;
	private int totaleAttesi;
	private int totaleCorrispondenti;
	private int totaleInattesi;
	
	public int getTotaleConferiti() {
		return totaleConferiti;
	}
	public void setTotaleConferiti(int totaleConferiti) {
		this.totaleConferiti = totaleConferiti;
	}
	public int getTotaleAttesi() {
		return totaleAttesi;
	}
	public void setTotaleAttesi(int totaleAttesi) {
		this.totaleAttesi = totaleAttesi;
	}
	public int getTotaleCorrispondenti() {
		return totaleCorrispondenti;
	}
	public void setTotaleCorrispondenti(int totaleCorrispondenti) {
		this.totaleCorrispondenti = totaleCorrispondenti;
	}
	public int getTotaleInattesi() {
		return totaleInattesi;
	}
	public void setTotaleInattesi(int totaleInattesi) {
		this.totaleInattesi = totaleInattesi;
	}
	
	@Override
	public String toString() {
		return "conf:" + totaleConferiti + ",att:" + totaleAttesi + ",corr:" + totaleCorrispondenti + ",inat:" + totaleInattesi;
	}
}
