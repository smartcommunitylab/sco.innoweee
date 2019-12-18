package it.smartcommunitylab.innoweee.engine.ge;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;

import org.apache.commons.lang3.StringUtils;

import it.smartcommunitylab.innoweee.engine.common.Utils;
import it.smartcommunitylab.innoweee.engine.model.PlayerState;
import it.smartcommunitylab.model.PlayerStateDTO;
import it.smartcommunitylab.model.ext.GameConcept;
import it.smartcommunitylab.model.ext.PointConcept;

public class PlayersStatus {
	Map<String, Map<String, PlayerState>> statusMap = new HashMap<>();
	final String globalState = "globalState";
	
	public void addPlayerStatus(String playerId, String collectionName, PlayerStateDTO playerStateDTO) {
		PlayerState playerState = new PlayerState();
		playerState.setPlayerId(playerId);
		boolean periodState = !StringUtils.isEmpty(collectionName);
		if(periodState) {
			playerState.setNameGE(collectionName);
		} else {
			playerState.setNameGE(globalState);
		}
		Set<GameConcept> scores = playerStateDTO.getState().get("PointConcept");
		if(scores != null) {
			Iterator<GameConcept> iterator = scores.iterator();
			while (iterator.hasNext()) {
				PointConcept pointConcept = (PointConcept) iterator.next();
				switch (pointConcept.getName()) {
				case "reduceCoin":
					if(periodState) {
						playerState.setReduceCoin(pointConcept.getPeriodScore(collectionName, 0));
					} else {
						playerState.setReduceCoin(pointConcept.getScore());
					}
					break;
				case "totalReuse":
					if(periodState) {
						playerState.setTotalReuseCoin(pointConcept.getPeriodScore(collectionName, 0));
					} else {
						playerState.setTotalReuseCoin(pointConcept.getScore());
					}
					break;
				case "recycleCoin":
					if(periodState) {
						playerState.setRecycleCoin(pointConcept.getPeriodScore(collectionName, 0));
					} else {
						playerState.setRecycleCoin(pointConcept.getScore());
					}
					break;	
				case "totalRecycle":
					if(periodState) {
						playerState.setTotalRecycleCoin(pointConcept.getPeriodScore(collectionName, 0));
					} else {
						playerState.setTotalRecycleCoin(pointConcept.getScore());
					}
					break;
				case "reuseCoin":
					if(periodState) {
						playerState.setReuseCoin(pointConcept.getPeriodScore(collectionName, 0));
					} else {
						playerState.setReuseCoin(pointConcept.getScore());
					}
					break;
				case "totalReduce":
					if(periodState) {
						playerState.setTotalReduceCoin(pointConcept.getPeriodScore(collectionName, 0));
					} else {
						playerState.setTotalReduceCoin(pointConcept.getScore());
					}
					break;
				case "totalItems":
					if(periodState) {
						playerState.setItems(pointConcept.getPeriodScore(collectionName, 0));
					} else {
						playerState.setItems(pointConcept.getScore());
					}
					break;
				case "weight":
					if(periodState) {
						playerState.setWeight(pointConcept.getPeriodScore(collectionName, 0));
					} else {
						playerState.setWeight(pointConcept.getScore());
					}
					break;
				case "CO2":
					if(periodState) {
						playerState.setCo2(pointConcept.getPeriodScore(collectionName, 0));
					} else {
						playerState.setCo2(pointConcept.getScore());
					}
					break;
				case "plastic":
					if(periodState) {
						playerState.setPlastic(pointConcept.getPeriodScore(collectionName, 0));
					} else {
						playerState.setPlastic(pointConcept.getScore());
					}
					break;
				case "glass":
					if(periodState) {
						playerState.setGlass(pointConcept.getPeriodScore(collectionName, 0));
					} else {
						playerState.setGlass(pointConcept.getScore());
					}
					break;
				case "iron":
					if(periodState) {
						playerState.setIron(pointConcept.getPeriodScore(collectionName, 0));
					} else {
						playerState.setIron(pointConcept.getScore());
					}
					break;
				case "aluminium":
					if(periodState) {
						playerState.setAluminium(pointConcept.getPeriodScore(collectionName, 0));
					} else {
						playerState.setAluminium(pointConcept.getScore());
					}
					break;
				case "copper":
					if(periodState) {
						playerState.setCopper(pointConcept.getPeriodScore(collectionName, 0));
					} else {
						playerState.setCopper(pointConcept.getScore());
					}
					break;
				case "tin":
					if(periodState) {
						playerState.setTin(pointConcept.getPeriodScore(collectionName, 0));
					} else {
						playerState.setTin(pointConcept.getScore());
					}
					break;
				case "nickel":
					if(periodState) {
						playerState.setNickel(pointConcept.getPeriodScore(collectionName, 0));
					} else {
						playerState.setNickel(pointConcept.getScore());
					}
					break;
				case "silver":
					if(periodState) {
						playerState.setSilver(pointConcept.getPeriodScore(collectionName, 0));
					} else {
						playerState.setSilver(pointConcept.getScore());
					}
					break;
				case "gold":
					if(periodState) {
						playerState.setGold(pointConcept.getPeriodScore(collectionName, 0));
					} else {
						playerState.setGold(pointConcept.getScore());
					}
					break;
				case "platinum":
					if(periodState) {
						playerState.setPlatinum(pointConcept.getPeriodScore(collectionName, 0));
					} else {
						playerState.setPlatinum(pointConcept.getScore());
					}
					break;
				default:
					break;
				}
			}
		}
		Map<String, PlayerState> collectionStateMap = statusMap.get(playerId);
		if(collectionStateMap == null) {
			collectionStateMap = new HashMap<>();
			statusMap.put(playerId, collectionStateMap);
		}
		if(!periodState) {
			collectionName = globalState;
		}
		collectionStateMap.put(collectionName, playerState);	
	}
	
	private CoinMap extractCoinMap(PlayerState playerState) {
		CoinMap coinMap = new CoinMap(playerState.getReduceCoin(), 
				playerState.getReuseCoin(), playerState.getRecycleCoin());
		return coinMap;
	}

	private CoinMap extractTotalCoinMap(PlayerState playerState) {
		CoinMap coinMap = new CoinMap(playerState.getTotalReduceCoin(), 
				playerState.getTotalReuseCoin(), playerState.getTotalRecycleCoin());
		return coinMap;
	}
	
	public CoinMap getPlayerCoinMap(String playerId, String collectionName) {
		if(Utils.isEmpty(collectionName)) {
			collectionName = globalState;
		}
		return extractCoinMap(statusMap.get(playerId).get(collectionName));
	}

	public CoinMap getPlayerTotalCoinMap(String playerId, String collectionName) {
		if(Utils.isEmpty(collectionName)) {
			collectionName = globalState;
		}
		return extractTotalCoinMap(statusMap.get(playerId).get(collectionName));
	}
	
	public Set<String> getPlayerIds() {
		return statusMap.keySet();
	}

	public PlayerState getPlayerState(String playerId, String collectionName) {
		if(Utils.isEmpty(collectionName)) {
			collectionName = globalState;
		}
		return statusMap.get(playerId).get(collectionName);
	}
	
}
