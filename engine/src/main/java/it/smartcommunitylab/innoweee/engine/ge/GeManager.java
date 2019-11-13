package it.smartcommunitylab.innoweee.engine.ge;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

import javax.annotation.PostConstruct;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;

import it.smartcommunitylab.ApiClient;
import it.smartcommunitylab.ApiException;
import it.smartcommunitylab.basic.api.ExecutionControllerApi;
import it.smartcommunitylab.basic.api.PlayerControllerApi;
import it.smartcommunitylab.basic.api.TeamControllerApi;
import it.smartcommunitylab.innoweee.engine.common.Const;
import it.smartcommunitylab.innoweee.engine.common.Utils;
import it.smartcommunitylab.innoweee.engine.exception.StorageException;
import it.smartcommunitylab.innoweee.engine.model.Category;
import it.smartcommunitylab.innoweee.engine.model.Component;
import it.smartcommunitylab.innoweee.engine.model.Game;
import it.smartcommunitylab.innoweee.engine.model.Garbage;
import it.smartcommunitylab.innoweee.engine.model.ItemEvent;
import it.smartcommunitylab.innoweee.engine.model.Player;
import it.smartcommunitylab.innoweee.engine.model.PlayerState;
import it.smartcommunitylab.innoweee.engine.model.ReduceReport;
import it.smartcommunitylab.model.PlayerStateDTO;
import it.smartcommunitylab.model.ext.ExecutionDataDTO;
import it.smartcommunitylab.model.ext.TeamDTO;

@org.springframework.stereotype.Component
public class GeManager {
	private static final transient Logger logger = LoggerFactory.getLogger(GeManager.class);
	
	@Autowired
	@Value("${gamification.url}")
	private String gamificationURL;
	
	@Autowired
	@Value("${gamification.user}")
	private String gamificationUser;

	@Autowired
	@Value("${gamification.password}")
	private String gamificationPassword;
	
	private ApiClient apiClient;
	private PlayerControllerApi playerApi;
	private TeamControllerApi teamControllerApi;
	private ExecutionControllerApi executionApi;
	
	Random random;
	
	@PostConstruct
	public void init() {
		apiClient = new ApiClient(gamificationURL);
		apiClient.setUsername(gamificationUser);
		apiClient.setPassword(gamificationPassword);
    playerApi = new PlayerControllerApi(apiClient);
    executionApi = new ExecutionControllerApi(apiClient);
    teamControllerApi = new TeamControllerApi(apiClient);
    random = new Random();
    logger.info("init GeManager");
	}
	
	public String deployGame(Game game) {
		//TODO
		return null;
	}
	
	public void addPlayer(String gameId, String playerId) throws Exception {
		PlayerStateDTO player = new PlayerStateDTO();
		player.setGameId(gameId);
		player.setPlayerId(playerId);
		playerApi.createPlayerUsingPOST1(gameId, player);
	}
	
	public void addTeam(String gameId, String playerId, String name, 
			List<String> members) throws Exception {
		TeamDTO team = new TeamDTO();
		team.setGameId(gameId);
		team.setPlayerId(playerId);
		team.setName(name);
		team.setMembers(members);
		teamControllerApi.createTeamUsingPOST1(gameId, team);
	}
	
	public void deletePlayer(String gameId, String playerId) throws Exception {
		playerApi.deletePlayerUsingDELETE1(gameId, playerId);
	}
	
	public void itemDelivery(String gameId, String playerId, ItemEvent event,
			String collectionName, Garbage garbage, Category category) throws Exception {
		ExecutionDataDTO dataDTO = new ExecutionDataDTO();
		dataDTO.setActionId("itemDelivery");
		dataDTO.setGameId(gameId);
		dataDTO.setPlayerId(playerId);
		dataDTO.setExecutionMoment(new Date(event.getTimestamp()));
		
		double weight = garbage.getWeight();
		double value = 0.0;
		Map<String, Object> data = new HashMap<String, Object>();
		data.put("raccoltaId", collectionName);
		data.put("weight", weight);
		data.put("weee", !event.isReusable());
		value = weight * category.getMaterialsConversion().get(Const.MATERIAL_PLASTIC);
		data.put(Const.MATERIAL_PLASTIC, value);
		value = weight * category.getMaterialsConversion().get(Const.MATERIAL_GLASS);
		data.put(Const.MATERIAL_GLASS, value);
		value = weight * category.getMaterialsConversion().get(Const.MATERIAL_IRON);
		data.put(Const.MATERIAL_IRON, value);
		value = weight * category.getMaterialsConversion().get(Const.MATERIAL_ALUMINIUM);
		data.put(Const.MATERIAL_ALUMINIUM, value);
		value = weight * category.getMaterialsConversion().get(Const.MATERIAL_COPPER);
		data.put(Const.MATERIAL_COPPER, value);
		value = weight * category.getMaterialsConversion().get(Const.MATERIAL_TIN);
		data.put(Const.MATERIAL_TIN, value);
		value = weight * category.getMaterialsConversion().get(Const.MATERIAL_NICKEL);
		data.put(Const.MATERIAL_NICKEL, value);
		value = weight * category.getMaterialsConversion().get(Const.MATERIAL_SILVER);
		data.put(Const.MATERIAL_SILVER, value);
		value = weight * category.getMaterialsConversion().get(Const.MATERIAL_GOLD);
		data.put(Const.MATERIAL_GOLD, value);
		value = weight * category.getMaterialsConversion().get(Const.MATERIAL_PLATINUM);
		data.put(Const.MATERIAL_PLATINUM, value);
		dataDTO.setData(data);
		executionApi.executeActionUsingPOST(gameId, "itemDelivery", dataDTO);
	}
	
	public void buildRobot(String gameId, String playerId, Component component) throws Exception {
		ExecutionDataDTO dataDTO = new ExecutionDataDTO();
		dataDTO.setActionId("buildRobot");
		dataDTO.setGameId(gameId);
		dataDTO.setPlayerId(playerId);
		
		Map<String, Object> data = new HashMap<String, Object>();
		data.put(Const.COIN_RECYCLE, component.getCostMap().get(Const.COIN_RECYCLE));
		data.put(Const.COIN_REDUCE, component.getCostMap().get(Const.COIN_REDUCE));
		data.put(Const.COIN_REUSE, component.getCostMap().get(Const.COIN_REUSE));
		dataDTO.setData(data);
		executionApi.executeActionUsingPOST(gameId, "buildRobot", dataDTO);
	}
	
	public void reduceReport(String gameId, String playerId, ReduceReport reduceReport,
			String collectionName) throws Exception {
		ExecutionDataDTO dataDTO = new ExecutionDataDTO();
		dataDTO.setActionId("reduceReport");
		dataDTO.setGameId(gameId);
		dataDTO.setPlayerId(playerId);
		dataDTO.setExecutionMoment(new Date(reduceReport.getTimestamp()));
		
		Map<String, Object> data = new HashMap<String, Object>();
		data.put("raccoltaId", collectionName);
		data.put("reduceCoin", reduceReport.getReduceCoin());
		dataDTO.setData(data);
		executionApi.executeActionUsingPOST(gameId, "reduceReport", dataDTO);		
	}
	
	public void sendContribution(String gameId, String playerId, CoinMap coinMap, 
			Date executionDate) throws Exception {
		ExecutionDataDTO dataDTO = new ExecutionDataDTO();
		dataDTO.setActionId("donation");
		dataDTO.setGameId(gameId);
		dataDTO.setPlayerId(playerId);
		dataDTO.setExecutionMoment(executionDate);
		
		Map<String, Object> data = new HashMap<String, Object>();
		data.put(Const.COIN_RECYCLE, 0.0 - coinMap.getRecycleCoin());
		data.put(Const.COIN_REDUCE, 0.0 - coinMap.getReduceCoin());
		data.put(Const.COIN_REUSE, 0.0 - coinMap.getReuseCoin());
		dataDTO.setData(data);
		executionApi.executeActionUsingPOST(gameId, "donation", dataDTO);		
	}
	
	public void receiveContribution(String gameId, String playerId, CoinMap coinMap, 
			Date executionDate) throws Exception {
		ExecutionDataDTO dataDTO = new ExecutionDataDTO();
		dataDTO.setActionId("donation");
		dataDTO.setGameId(gameId);
		dataDTO.setPlayerId(playerId);
		dataDTO.setExecutionMoment(executionDate);
		
		Map<String, Object> data = new HashMap<String, Object>();
		data.put(Const.COIN_RECYCLE, coinMap.getRecycleCoin());
		data.put(Const.COIN_REDUCE, coinMap.getReduceCoin());
		data.put(Const.COIN_REUSE, coinMap.getReuseCoin());
		dataDTO.setData(data);
		executionApi.executeActionUsingPOST(gameId, "donation", dataDTO);		
	}
	
	public PlayerState getPlayerState(String gameId, String playerId, 
			String collectionName) throws Exception {
		PlayersStatus playersStatus = new PlayersStatus();
		PlayerStateDTO playerStateDTO = playerApi.readStateUsingGET(gameId, playerId);
		playersStatus.addPlayerStatus(playerId, collectionName, playerStateDTO);
		return playersStatus.getPlayerState(playerId, collectionName);
	}
	
	/**
	 * 
	 * @param gameId
	 * @param playerId
	 * @param players
	 * @param collections
	 * @return a Map where the key is the playerId and the value is a CostMap
	 */
	public Map<String, CoinMap> getPlayerCoinMap(String gameId, String playerId,
			List<Player> players, String collectionName) throws Exception {
		PlayersStatus playersStatus = new PlayersStatus();
		for(Player player : players) {
			try {
				PlayerStateDTO playerStateDTO = playerApi.readStateUsingGET(gameId, player.getObjectId());
				playersStatus.addPlayerStatus(player.getObjectId(), null, playerStateDTO);
				playersStatus.addPlayerStatus(player.getObjectId(), collectionName, playerStateDTO);
			} catch (ApiException | IOException e) {
				logger.warn("getPlayerCostMap - read player status error:{}", e.getMessage());
			}
		}
		return assignPoints(playerId, players, playersStatus, collectionName);
	}

	private Map<String, CoinMap> assignPoints(String contributorId, List<Player> players,
			PlayersStatus playersStatus, String collectionName) throws Exception {
		Map<String, CoinMap> result = new HashMap<>();
		CoinMap contributorCoinMap = playersStatus.getPlayerCoinMap(contributorId, null);
		result.put(contributorId, contributorCoinMap);
		
		List<PointStatus> pointStatusList = new ArrayList<>();
		for(Player player : players) {
			if(Utils.checkDonation(player, collectionName)) {
				continue;
			}
			CoinMap coinMap = playersStatus.getPlayerTotalCoinMap(player.getObjectId(), collectionName);
			double rank = Utils.getRank(coinMap);
			PointStatus pointStatus = new PointStatus(player.getObjectId(), rank);
			pointStatusList.add(pointStatus);
		}
		PointDistribution pointDistribution = new PointDistribution(pointStatusList);
		if(pointDistribution.checkLastPositions(contributorId)) {
			throw new StorageException("score too low");
		}
		result.putAll(pointDistribution.distribute(contributorId, contributorCoinMap));
//		CoinMap fakeCoinMap = new CoinMap(1.0, 1.0, 1.0);
//		int index = random.nextInt(playersStatus.getPlayerIds().size());
//		int i = 0;
//		for(String playerId : playersStatus.getPlayerIds()) {
//			if(playerId.equals(contributorId)) {
//				continue;
//			}
//			if(i == index) {
//				result.put(playerId, fakeCoinMap);
//				break;
//			}
//			i++;
//		}
		return result;
	}
	
}
