package it.smartcommunitylab.innoweee.engine.ge;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

import javax.annotation.PostConstruct;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;

import it.smartcommunitylab.ApiClient;
import it.smartcommunitylab.basic.api.ExecutionControllerApi;
import it.smartcommunitylab.basic.api.PlayerControllerApi;
import it.smartcommunitylab.basic.api.TeamControllerApi;
import it.smartcommunitylab.innoweee.engine.common.Const;
import it.smartcommunitylab.innoweee.engine.model.Category;
import it.smartcommunitylab.innoweee.engine.model.Component;
import it.smartcommunitylab.innoweee.engine.model.Game;
import it.smartcommunitylab.innoweee.engine.model.Garbage;
import it.smartcommunitylab.innoweee.engine.model.ItemEvent;
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
	
	private Random random;
	
	@PostConstruct
	public void init() {
		apiClient = new ApiClient(gamificationURL);
		apiClient.setUsername(gamificationUser);
		apiClient.setPassword(gamificationPassword);
    playerApi = new PlayerControllerApi(apiClient);
    executionApi = new ExecutionControllerApi(apiClient);
    teamControllerApi = new TeamControllerApi(apiClient);
    random = new Random(System.currentTimeMillis());
	}
	
	public String deployGame(Game game) {
		//TODO
		return null;
	}
	
	public void addPlayer(String gameId, String playerId) throws Exception {
		PlayerStateDTO player = new PlayerStateDTO();
		player.setGameId(gameId);
		player.setPlayerId(playerId);
		//TODO
//		playerApi.createPlayerUsingPOST1(gameId, player);
	}
	
	public void addTeam(String gameId, String playerId, 
			List<String> members) throws Exception {
		TeamDTO team = new TeamDTO();
		team.setGameId(gameId);
		team.setPlayerId(playerId);
		team.setMembers(members);
		//TODO
//		teamControllerApi.createTeamUsingPOST1(gameId, team );
	}
	
	public void deletePlayer(String gameId, String playerId) throws Exception {
		//TODO
//		playerApi.deletePlayerUsingDELETE1(gameId, playerId);
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
		//TODO
//		executionApi.executeActionUsingPOST(gameId, "itemDelivery", dataDTO);
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
		//TODO
//		executionApi.executeActionUsingPOST(gameId, "buildRobot", dataDTO);
	}
	
	public void reduceReport(String gameId, String playerId, ReduceReport reduceReport,
			String collectionName) throws Exception {
		ExecutionDataDTO dataDTO = new ExecutionDataDTO();
		dataDTO.setActionId("reduceReport");
		dataDTO.setGameId(gameId);
		dataDTO.setPlayerId(playerId);
		
		Map<String, Object> data = new HashMap<String, Object>();
		data.put("raccoltaId", collectionName);
		data.put("reduceCoin", reduceReport.getReduceCoin());
		dataDTO.setData(data);
		//TODO
//		executionApi.executeActionUsingPOST(gameId, "reduceReport", dataDTO);		
	}
	
	public PlayerState getPlayerState(String gameId, String playerId, String collectionName) throws Exception {
		//TODO get player state
//		PlayerStateDTO playerStateDTO = playerApi.readStateUsingGET(gameId, playerId);
		PlayerState playerState = new PlayerState();
		playerState.setPlayerId(playerId);
		if(!StringUtils.isEmpty(collectionName)) {
			playerState.setNameGE(collectionName);
		}
		playerState.setRecycleCoin(50);
		playerState.setTotalRecycleCoin(100);
		playerState.setReduceCoin(50);
		playerState.setTotalReduceCoin(100);
		playerState.setReuseCoin(50);
		playerState.setTotalReuseCoin(100);
		playerState.setAluminium(getRandomDouble(100, 5000));
		playerState.setCopper(getRandomDouble(100, 5000));
		playerState.setGlass(getRandomDouble(100, 1000));
		playerState.setIron(getRandomDouble(500, 7500));
		playerState.setPlastic(getRandomDouble(1000, 15000));
		playerState.setTin(getRandomDouble(100, 5000));
		playerState.setNickel(getRandomDouble(0.01, 0.1));
		playerState.setSilver(getRandomDouble(0.01, 0.1));
		playerState.setGold(getRandomDouble(0.01, 0.1));
		playerState.setPlatinum(getRandomDouble(0.01, 0.1));
		playerState.setItems(300);
		playerState.setWeight(getRandomDouble(15000, 25000));
		playerState.setCo2(getRandomDouble(100, 5000));
		return playerState;
	}
	
	private double getRandomDouble(double min, double max) {
		return min + (random.nextDouble() * (max - min));
  }
}
