package it.smartcommunitylab.innoweee.engine.ge;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.annotation.PostConstruct;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;

import it.smartcommunitylab.ApiClient;
import it.smartcommunitylab.basic.api.ExecutionControllerApi;
import it.smartcommunitylab.basic.api.PlayerControllerApi;
import it.smartcommunitylab.innoweee.engine.common.Const;
import it.smartcommunitylab.innoweee.engine.model.Category;
import it.smartcommunitylab.innoweee.engine.model.Component;
import it.smartcommunitylab.innoweee.engine.model.Game;
import it.smartcommunitylab.innoweee.engine.model.Garbage;
import it.smartcommunitylab.innoweee.engine.model.ItemEvent;
import it.smartcommunitylab.innoweee.engine.model.Player;
import it.smartcommunitylab.model.PlayerStateDTO;
import it.smartcommunitylab.model.ext.ExecutionDataDTO;

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
	private ExecutionControllerApi executionApi;
	
	@PostConstruct
	public void init() {
		apiClient = new ApiClient(gamificationURL);
		apiClient.setUsername(gamificationUser);
		apiClient.setPassword(gamificationPassword);
    playerApi = new PlayerControllerApi(apiClient);
    executionApi = new ExecutionControllerApi(apiClient);
	}
	
	public String deployGame(Game game) {
		//TODO
		return null;
	}
	
	public void itemDelivery(Game game, Player player, ItemEvent event,
			String collectionName, Garbage garbage, Category category) throws Exception {
		ExecutionDataDTO dataDTO = new ExecutionDataDTO();
		dataDTO.setActionId("itemDelivery");
		dataDTO.setGameId(game.getGeGameId());
		dataDTO.setPlayerId(player.getObjectId());
		dataDTO.setExecutionMoment(new Date(event.getTimestamp()));
		
		double weight = garbage.getWeight();
		double value = 0.0;
		Map<String, Object> data = new HashMap<String, Object>();
		data.put("raccoltaId", collectionName);
		data.put("weight", weight);
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

		executionApi.executeActionUsingPOST(game.getGeGameId(), "itemDelivery", dataDTO);
	}
	
	public void buildRobot(Game game, Player player, Component component) throws Exception {
		ExecutionDataDTO dataDTO = new ExecutionDataDTO();
		dataDTO.setActionId("buildRobot");
		dataDTO.setGameId(game.getGeGameId());
		dataDTO.setPlayerId(player.getObjectId());
		
		Map<String, Object> data = new HashMap<String, Object>();
		data.put(Const.COIN_RECYCLE, component.getCostMap().get(Const.COIN_RECYCLE));
		data.put(Const.COIN_REDUCE, component.getCostMap().get(Const.COIN_REDUCE));
		data.put(Const.COIN_REUSE, component.getCostMap().get(Const.COIN_REUSE));
		dataDTO.setData(data);

		executionApi.executeActionUsingPOST(game.getGeGameId(), "buildRobot", dataDTO);
	}
	
	public void getPlayerStatus(Game game, Player player) throws Exception {
		PlayerStateDTO playerStateDTO = playerApi.readStateUsingGET(game.getGeGameId(), 
				player.getObjectId());
		
	}
}
