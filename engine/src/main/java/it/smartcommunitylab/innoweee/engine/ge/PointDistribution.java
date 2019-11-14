package it.smartcommunitylab.innoweee.engine.ge;

import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import it.smartcommunitylab.innoweee.engine.common.Utils;

public class PointDistribution {
	private List<PointStatus> pointStatusList = null;
	private int count;
	
	public PointDistribution(List<PointStatus> pointStatusList) {
		this.pointStatusList = pointStatusList;
		count = pointStatusList.size() >= 3 ? 3 : pointStatusList.size();
		this.pointStatusList.sort(Comparator.comparing(PointStatus::getRank));
	}
	
	public boolean checkLastPositions(String playerId) {
		for(int i=0; i < count; i++) {
			PointStatus pointStatus = pointStatusList.get(i);
			if(pointStatus.getPlayerId().equals(playerId)) {
				return true;
			}
		}
		return false;
	}

	public Map<String, CoinMap> distribute(String contributorId, CoinMap contributorCoinMap) {
		Map<String, CoinMap> result = new HashMap<>();
		double Z = 0;
		for(int i=0; i < count; i++) {
			PointStatus pointStatus = pointStatusList.get(i);
			Z += pointStatus.getRank();
		}
		double[] WList = new double[count];
		for(int i=0; i < count; i++) {
			PointStatus pointStatus = pointStatusList.get(i);
			WList[i] = Z - pointStatus.getRank();
		}
		double W = 0;
		for(int i=0; i < count; i++) {
			W += WList[i];
		}
		double[] XList = new double[count];
		for(int i=0; i < count; i++) {
			XList[i] = WList[i] / W;
		}
		if(count == 1) {
			result.put(pointStatusList.get(0).getPlayerId(), contributorCoinMap);
		} else {
			double lastReduceCoin = contributorCoinMap.getReduceCoin();
			double lastReuseCoin = contributorCoinMap.getReuseCoin();
			double lastRecycleCoin = contributorCoinMap.getRecycleCoin();
			for(int i=0; i < (count - 1); i++) {
				double reduceCoin = Math.ceil(contributorCoinMap.getReduceCoin() * XList[i]);
				double reuseCoin = Math.ceil(contributorCoinMap.getReuseCoin() * XList[i]);
				double recycleCoin = Math.ceil(contributorCoinMap.getRecycleCoin() * XList[i]);
				CoinMap coinMap = new CoinMap(reduceCoin, reuseCoin, recycleCoin);
				if(!Utils.isEmpty(coinMap)) {
					result.put(pointStatusList.get(i).getPlayerId(), coinMap);
				}
				lastReduceCoin -= reduceCoin;
				lastReuseCoin -= reuseCoin;
				lastRecycleCoin -= recycleCoin;
			}
			CoinMap coinMap = new CoinMap(lastReduceCoin, lastReuseCoin, lastRecycleCoin);
			result.put(pointStatusList.get(count - 1).getPlayerId(), coinMap);
		}
		return result;
	}
	
}
