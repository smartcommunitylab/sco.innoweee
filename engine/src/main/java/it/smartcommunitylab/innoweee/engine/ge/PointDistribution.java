package it.smartcommunitylab.innoweee.engine.ge;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import it.smartcommunitylab.innoweee.engine.common.Utils;

public class PointDistribution {
	private List<PointStatus> pointStatusList = null;
	private int count;
	private CoinMap contributorCoinMap;
	
	public PointDistribution(CoinMap contributorCoinMap, List<PointStatus> pointStatusList) {
		this.contributorCoinMap = contributorCoinMap;
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
	
	public CoinMap getContributorCoinMap()  {
		return contributorCoinMap;
	}
	
	public List<PointStatus> getPointStatusList() {
		return Collections.unmodifiableList(pointStatusList);
	}

	public Map<String, CoinMap> distribute() {
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
		Map<String, Double> XMap = new HashMap<String, Double>();
		//double[] XList = new double[count];
		for(int i=0; i < count; i++) {
			XMap.put(pointStatusList.get(i).getPlayerId(), WList[i] / W);
		}
		List<String> sortByValuesList = sortByValuesList(XMap);
		
		if(count == 1) {
			result.put(pointStatusList.get(0).getPlayerId(), contributorCoinMap);
		} else {
			double lastReduceCoin = contributorCoinMap.getReduceCoin();
			double lastReuseCoin = contributorCoinMap.getReuseCoin();
			double lastRecycleCoin = contributorCoinMap.getRecycleCoin();
			for(int i=0; i < (count - 1); i++) {
				String playerId = sortByValuesList.get(i);
				Double X = XMap.get(playerId);
				double reduceCoin = Math.min(lastReduceCoin, Math.ceil(contributorCoinMap.getReduceCoin() * X));
				double reuseCoin = Math.min(lastReuseCoin, Math.ceil(contributorCoinMap.getReuseCoin() * X));
				double recycleCoin = Math.min(lastRecycleCoin, Math.ceil(contributorCoinMap.getRecycleCoin() * X));
				CoinMap coinMap = new CoinMap(reduceCoin, reuseCoin, recycleCoin);
				if(!Utils.isEmpty(coinMap)) {
					result.put(playerId, coinMap);
				}
				lastReduceCoin -= reduceCoin;
				lastReuseCoin -= reuseCoin;
				lastRecycleCoin -= recycleCoin;
			}
			CoinMap coinMap = new CoinMap(lastReduceCoin, lastReuseCoin, lastRecycleCoin);
			if(!Utils.isEmpty(coinMap)) {
				result.put(sortByValuesList.get(count - 1), coinMap);
			}
		}
		return result;
	}
	
	@SuppressWarnings("rawtypes")
	private <K, V extends Comparable> List<K> sortByValuesList(Map<K, V> map) {
    List<Map.Entry<K, V>> entries = new LinkedList<Map.Entry<K, V>>(
            map.entrySet());

    Collections.sort(entries, new Comparator<Map.Entry<K, V>>() {

        @SuppressWarnings("unchecked")
				public int compare(Map.Entry<K, V> o1, Map.Entry<K, V> o2) {
            return o1.getValue().compareTo(o2.getValue());
        }
    });

    // LinkedHashMap will keep the keys in the order they are inserted
    // which is currently sorted on natural ordering
    List<K> sortedList = new ArrayList<K>();

    for (Map.Entry<K, V> entry : entries) {
        sortedList.add(entry.getKey());
    }

    return sortedList;
	}
	
}
