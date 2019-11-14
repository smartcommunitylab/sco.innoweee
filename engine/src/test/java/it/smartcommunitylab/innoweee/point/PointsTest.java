package it.smartcommunitylab.innoweee.point;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Stream;

import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.MethodSource;
import org.junit.runner.RunWith;
import org.junit.runners.Suite;
import org.junit.runners.Suite.SuiteClasses;

import it.smartcommunitylab.innoweee.engine.common.Utils;
import it.smartcommunitylab.innoweee.engine.ge.CoinMap;
import it.smartcommunitylab.innoweee.engine.ge.PointDistribution;
import it.smartcommunitylab.innoweee.engine.ge.PointStatus;

@RunWith(Suite.class)
@SuiteClasses({})
public class PointsTest {
	
	@ParameterizedTest(name="player:{0}")
	@MethodSource("argumentProvider")
	public void testOrder(String playerId, List<PointStatus> pointStatusList) {
		PointDistribution pointDistribution = new PointDistribution(pointStatusList);
		assertFalse(pointDistribution.checkLastPositions(playerId));
	}
	
	@ParameterizedTest(name="player:{0}")
	@CsvSource({
		"'due,2.0,2.0,2.0', 'uno,5.0,5.0,5.0;due,13.0,13.0,13.0;tre,15.0,15.0,15.0;quattro,9.0,9.0,9.0;cinque,8.0,8.0,8.0'",
		"'tre,3.0,3.0,3.0', 'uno,5.0,5.0,5.0;due,13.0,13.0,13.0;tre,15.0,15.0,15.0;quattro,9.0,9.0,9.0;cinque,8.0,8.0,8.0'",
		"'tre,1.0,1,0,1.0', 'uno,5.0,5.0,5.0;due,5.0,5.0,5.0;tre,5.0,5.0,5.0'",
		"'tre,5.0,3.0,1.0', 'uno,15.0,10.0,5.0;due,25.0,15.0,5.0;tre,25.0,5.0,5.0'",
		"'due,5.0,3.0,1.0', 'uno,15.0,10.0,5.0;due,25.0,15.0,5.0",
		"'uno,5.0,3.0,1.0', 'uno,15.0,10.0,5.0",
		"'2A,19.0,1.0,0.0', '2A,19.0,1.0,0.0;1C,0.0,0.0,0.0;2B,0.0,0.0,0.0;1D,0.0,0.0,0.0'"
	})
	public void testPoints(String contributor, String players) {
		List<PointStatus> pointStatusList = new ArrayList<PointStatus>();
		String[] contributorDef = contributor.split(",");
		String contributorId = contributorDef[0];
		double reduceCoin = Double.valueOf(contributorDef[1]);
		double reuseCoin = Double.valueOf(contributorDef[2]);
		double recycleCoin = Double.valueOf(contributorDef[3]);
		CoinMap contributorCoinMap = new CoinMap(reduceCoin, reuseCoin, recycleCoin);
		
		String[] playerDefs = players.split(";");
		for(String playerDef : playerDefs) {
			String[] def = playerDef.split(",");
			String playerId = def[0];
			reduceCoin = Double.valueOf(def[1]);
			reuseCoin = Double.valueOf(def[2]);
			recycleCoin = Double.valueOf(def[3]);
			CoinMap coinMap = new CoinMap(reduceCoin, reuseCoin, recycleCoin);
			PointStatus ps = new PointStatus(playerId, Utils.getRank(coinMap));
			ps.setCoinMap(coinMap);
			pointStatusList.add(ps);
		}
		PointDistribution pointDistribution = new PointDistribution(pointStatusList);
		Map<String, CoinMap> map = pointDistribution.distribute(contributorId, contributorCoinMap);
		double reduceCoinSum = 0;
		double reuseCoinSum = 0;
		double recycleCoinSum = 0;
		for(CoinMap coinMap : map.values()) {
			reduceCoinSum += coinMap.getReduceCoin();
			reuseCoinSum += coinMap.getReuseCoin();
			recycleCoinSum += coinMap.getRecycleCoin();
		}
		System.out.println(map);
		assertTrue("reduceCoinSum", reduceCoinSum == contributorCoinMap.getReduceCoin());
		assertTrue("reuseCoinSum", reuseCoinSum == contributorCoinMap.getReuseCoin());
		assertTrue("recycleCoinSum", recycleCoinSum == contributorCoinMap.getRecycleCoin());
	}
	
	static Stream<Arguments> argumentProvider() {
		List<PointStatus> pointStatusList = new ArrayList<PointStatus>();
		
		CoinMap coinMap1 = new CoinMap(5.0, 5.0, 5.0);
		PointStatus p1 = new PointStatus("uno", Utils.getRank(coinMap1));
		p1.setCoinMap(coinMap1);
		
		CoinMap coinMap2 = new CoinMap(13.0, 13.0, 13.0);
		PointStatus p2 = new PointStatus("due", Utils.getRank(coinMap2));
		p2.setCoinMap(coinMap2);
		
		CoinMap coinMap3 = new CoinMap(15.0, 15.0, 15.0);
		PointStatus p3 = new PointStatus("tre", Utils.getRank(coinMap3));
		p3.setCoinMap(coinMap3);
		
		CoinMap coinMap4 = new CoinMap(9.0, 9.0, 9.0);
		PointStatus p4 = new PointStatus("quattro", Utils.getRank(coinMap4));
		p4.setCoinMap(coinMap4);
		
		CoinMap coinMap5 = new CoinMap(8.0, 8.0, 8.0);
		PointStatus p5 = new PointStatus("cinque", Utils.getRank(coinMap4));
		p4.setCoinMap(coinMap5);
		
		pointStatusList.add(p1);
		pointStatusList.add(p2);
		pointStatusList.add(p3);
		pointStatusList.add(p4);
		pointStatusList.add(p5);
		return Stream.of(
				Arguments.of("due", pointStatusList),
				Arguments.of("tre", pointStatusList)
    );
	}
}
