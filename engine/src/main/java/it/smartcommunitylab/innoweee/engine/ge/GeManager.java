package it.smartcommunitylab.innoweee.engine.ge;

import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

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
import it.smartcommunitylab.model.ext.GameConcept;
import it.smartcommunitylab.model.ext.PointConcept;
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
	
	@PostConstruct
	public void init() {
		apiClient = new ApiClient(gamificationURL);
		apiClient.setUsername(gamificationUser);
		apiClient.setPassword(gamificationPassword);
    playerApi = new PlayerControllerApi(apiClient);
    executionApi = new ExecutionControllerApi(apiClient);
    teamControllerApi = new TeamControllerApi(apiClient);
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
	
	public void contribution(String gameId, String playerId, Map<String, Map<String, Double>> playerCostMap) {
		//TODO
	}
	
	public PlayerState getPlayerState(String gameId, String playerId, 
			String collectionName) throws Exception {
		PlayerStateDTO playerStateDTO = playerApi.readStateUsingGET(gameId, playerId);
		PlayerState playerState = new PlayerState();
		playerState.setPlayerId(playerId);
		boolean periodState = !StringUtils.isEmpty(collectionName);
		if(periodState) {
			playerState.setNameGE(collectionName);
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
		return playerState;
	}
	
	public Map<String, Map<String, Double>> getPlayerCostMap(String gameId, String playerId,
			Map<String, Double> costMap) {
		//TODO
		return null;
	}
	
}
