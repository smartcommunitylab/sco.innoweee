package it.smartcommunitylab.innoweee.engine.controller;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import it.smartcommunitylab.innoweee.engine.common.Const;
import it.smartcommunitylab.innoweee.engine.common.Utils;
import it.smartcommunitylab.innoweee.engine.exception.EntityNotFoundException;
import it.smartcommunitylab.innoweee.engine.exception.UnauthorizedException;
import it.smartcommunitylab.innoweee.engine.ge.GeManager;
import it.smartcommunitylab.innoweee.engine.manager.ItemEventManager;
import it.smartcommunitylab.innoweee.engine.model.Game;
import it.smartcommunitylab.innoweee.engine.model.GameAction;
import it.smartcommunitylab.innoweee.engine.model.GarbageCollection;
import it.smartcommunitylab.innoweee.engine.model.GarbageMap;
import it.smartcommunitylab.innoweee.engine.model.Institute;
import it.smartcommunitylab.innoweee.engine.model.ItemAction;
import it.smartcommunitylab.innoweee.engine.model.ItemEvent;
import it.smartcommunitylab.innoweee.engine.model.Player;
import it.smartcommunitylab.innoweee.engine.model.ReduceReport;
import it.smartcommunitylab.innoweee.engine.model.School;
import it.smartcommunitylab.innoweee.engine.repository.GameActionRepository;
import it.smartcommunitylab.innoweee.engine.repository.GameRepository;
import it.smartcommunitylab.innoweee.engine.repository.GarbageCollectionRepository;
import it.smartcommunitylab.innoweee.engine.repository.GarbageMapRepository;
import it.smartcommunitylab.innoweee.engine.repository.InstituteRepository;
import it.smartcommunitylab.innoweee.engine.repository.PlayerRepository;
import it.smartcommunitylab.innoweee.engine.repository.ReduceReportRepository;
import it.smartcommunitylab.innoweee.engine.repository.SchoolRepository;
import it.smartcommunitylab.innoweee.engine.websocket.WebSocketManager;

@RestController
public class ItemController extends AuthController {
	private static final transient Logger logger = LoggerFactory.getLogger(ItemController.class);
	
	@Autowired
	private InstituteRepository instituteRepository;
	@Autowired
	private SchoolRepository schoolRepository;
	@Autowired
	private PlayerRepository playerRepository;
	@Autowired
	private GameRepository gameRepository; 
	@Autowired
	private GarbageCollectionRepository collectionRepository;
	@Autowired
	private GarbageMapRepository garbageMapRepository;
	@Autowired
	private ReduceReportRepository reduceReportRepository;
	@Autowired
	private GameActionRepository gameActionRepository;
	@Autowired
	private ItemEventManager itemEventManager;
	@Autowired
	private GeManager geManager;
	@Autowired
	private WebSocketManager webSocketManager;
	
	@PostConstruct
	public void init() throws Exception {
	}
 
	@PostMapping(value = "/api/item/recognized")
	public @ResponseBody void recognizedEvent(
			@RequestBody ItemEvent itemEvent,
			HttpServletRequest request, 
			HttpServletResponse response) throws Exception {
		Optional<Player> optionalPlayer = playerRepository.findById(itemEvent.getPlayerId());
		if(optionalPlayer.isEmpty()) {
			throw new EntityNotFoundException(Const.ERROR_CODE_ENTITY + "player entity not found");
		}
		Player player = optionalPlayer.get();
		Optional<Game> optionalGame = gameRepository.findById(player.getGameId());
		if(optionalGame.isEmpty()) {
			throw new EntityNotFoundException(Const.ERROR_CODE_ENTITY + "game entity not found");
		}
		Game game = optionalGame.get();
		if(!validateAuthorization(game.getTenantId(), game.getInstituteId(), game.getSchoolId(), 
				game.getObjectId(), Const.AUTH_RES_Game_Item, Const.AUTH_ACTION_ADD, request)) {
			throw new UnauthorizedException("Unauthorized Exception: token or role not valid");
		}
		if(StringUtils.isEmpty(itemEvent.getItemId())) {
			throw new EntityNotFoundException(Const.ERROR_CODE_ENTITY + "item id not found");
		}
		logger.info("recognizedEvent[{}]:{} / {}", game.getTenantId(), 
				itemEvent.getPlayerId(), itemEvent.getItemId());
		webSocketManager.notifyItemEventoToPlayer(player.getTenantId(), player.getObjectId(), itemEvent);
	}
	
	@PostMapping(value = "/api/item/reduce")
	public @ResponseBody ReduceReport reduceReport(
			@RequestBody ReduceReport report,
			@RequestParam(required = false) Long timestamp,
			HttpServletRequest request, 
			HttpServletResponse response) throws Exception {
		Optional<Player> optionalPlayer = playerRepository.findById(report.getPlayerId());
		if(optionalPlayer.isEmpty()) {
			throw new EntityNotFoundException("player not found");
		}
		Player player = optionalPlayer.get();
		Optional<Game> optionalGame = gameRepository.findById(player.getGameId());
		if(optionalGame.isEmpty()) {
			throw new EntityNotFoundException(Const.ERROR_CODE_ENTITY + "game not found");
		}
		Game game = optionalGame.get();
		if(!validateAuthorization(game.getTenantId(), game.getInstituteId(), game.getSchoolId(), 
				game.getObjectId(), Const.AUTH_RES_Game_Point, Const.AUTH_ACTION_ADD, request)) {
			throw new UnauthorizedException("Unauthorized Exception: token or role not valid");
		}
		if(timestamp != null) {
			report.setTimestamp(timestamp);
		} else {
			report.setTimestamp(System.currentTimeMillis());
		}
		GarbageCollection actualCollection = collectionRepository.findActualCollection(
				game.getTenantId(), game.getObjectId(), report.getTimestamp());
		if(actualCollection == null) {
			throw new EntityNotFoundException(Const.ERROR_CODE_ENTITY + "collection not found");
		}
		Date now = new Date(); 
		report.setTenantId(game.getTenantId());
		report.setCreationDate(now);
		report.setLastUpdate(now);
		report.setGarbageCollectionId(actualCollection.getObjectId());
		geManager.reduceReport(game.getGeGameId(), player.getObjectId(), report, 
				actualCollection.getNameGE());
		reduceReportRepository.save(report);
		GameAction gameAction = Utils.getReduceReportGameAction(game, actualCollection.getNameGE(), player, report);
		gameActionRepository.save(gameAction);
		logger.info("reduceReport[{}]:{} / {}", game.getTenantId(), 
				report.getPlayerId(), report.getObjectId());		
		return report;
	}
	
	@GetMapping(value = "/api/item/used")
	public @ResponseBody ItemEvent isItemUsed(
			@RequestParam String itemId, 
			@RequestParam String playerId,
			HttpServletRequest request, 
			HttpServletResponse response) throws Exception {
		Optional<Player> optionalPlayer = playerRepository.findById(playerId);
		if(optionalPlayer.isEmpty()) {
			throw new EntityNotFoundException(Const.ERROR_CODE_ENTITY + "player not found");
		}
		Player player = optionalPlayer.get();
		Optional<Game> optionalGame = gameRepository.findById(player.getGameId());
		if(optionalGame.isEmpty()) {
			throw new EntityNotFoundException(Const.ERROR_CODE_ENTITY + "game not found");
		}
		Game game = optionalGame.get();
		if(!validateAuthorization(game.getTenantId(), game.getInstituteId(), game.getSchoolId(), 
				game.getObjectId(), Const.AUTH_RES_Game_Item, Const.AUTH_ACTION_READ, request)) {
			throw new UnauthorizedException("Unauthorized Exception: token or role not valid");
		}
		ItemEvent itemEvent = itemEventManager.findByItemId(itemId);
		if((itemEvent != null) && !playerId.equals(itemEvent.getPlayerId())) {
			throw new EntityNotFoundException(Const.ERROR_CODE_PLAYER + "playerId not corresponding");
		}
		logger.info("isItemUsed[{}]:{} / {}", game.getTenantId(), itemId, itemEvent);		
		return itemEvent;
	}
		
	@PostMapping(value = "/api/item/delivery")
	public @ResponseBody ItemEvent itemDelivery(
			@RequestBody ItemEvent itemEvent,
			HttpServletRequest request, 
			HttpServletResponse response) throws Exception {
		Optional<Player> optionalPlayer = playerRepository.findById(itemEvent.getPlayerId());
		if(optionalPlayer.isEmpty()) {
			throw new EntityNotFoundException(Const.ERROR_CODE_ENTITY + "player not found");
		}
		Player player = optionalPlayer.get();
		Optional<Game> optionalGame = gameRepository.findById(player.getGameId());
		if(optionalGame.isEmpty()) {
			throw new EntityNotFoundException(Const.ERROR_CODE_ENTITY + "game not found");
		}
		Game game = optionalGame.get();
		if(!validateAuthorization(game.getTenantId(), game.getInstituteId(), game.getSchoolId(), 
				game.getObjectId(), Const.AUTH_RES_Game_Item, Const.AUTH_ACTION_ADD, request)) {
			throw new UnauthorizedException("Unauthorized Exception: token or role not valid");
		}
		itemEventManager.itemClassified(itemEvent, game);
		logger.info("itemDelivery:{} / {}", itemEvent.getItemType(), itemEvent.getItemId());
		if(validateRole(Const.ROLE_SCHOOL_TEACHER, game.getTenantId(), request)) {
			itemEventManager.itemConfirmed(itemEvent, game, player);
			logger.info("itemDelivery: item confirmed {} / {}", itemEvent.getItemType(), itemEvent.getItemId());
		}
		return itemEvent;
	}
	
	@GetMapping(value = "/api/item/confirm")
	public @ResponseBody ItemEvent itemConfirmed(
			@RequestParam String itemId, 
			@RequestParam String playerId,			
			HttpServletRequest request) throws Exception {
		ItemEvent itemEvent = itemEventManager.findByItemId(itemId);
		if(itemEvent == null) {
			throw new EntityNotFoundException(Const.ERROR_CODE_ENTITY + "item not found");
		}
		if(!playerId.equals(itemEvent.getPlayerId())) {
			throw new EntityNotFoundException(Const.ERROR_CODE_APP + "playerId not corresponding");
		}
		Optional<Player> optionalPlayer = playerRepository.findById(playerId);
		if(optionalPlayer.isEmpty()) {
			throw new EntityNotFoundException(Const.ERROR_CODE_ENTITY + "player not found");
		}
		Player player = optionalPlayer.get();
		Optional<Game> optionalGame = gameRepository.findById(player.getGameId());
		if(optionalGame.isEmpty()) {
			throw new EntityNotFoundException(Const.ERROR_CODE_ENTITY + "game not found");
		}
		Game game = optionalGame.get();
		if(!validateAuthorization(game.getTenantId(), game.getInstituteId(), game.getSchoolId(), 
				game.getObjectId(), Const.AUTH_RES_Game_Point, Const.AUTH_ACTION_ADD, request)) {
			throw new UnauthorizedException("Unauthorized Exception: token or role not valid");
		}
		if(itemEvent.getState() >= Const.ITEM_STATE_CONFIRMED) {
			throw new EntityNotFoundException(Const.ERROR_CODE_PLAYER + "item already confirmed");
		}
		itemEventManager.itemConfirmed(itemEvent, game, player);
		logger.info("itemConfirmed:{} / {}", itemEvent.getItemType(), itemEvent.getItemId());
		return itemEvent;
	}	
	
	@GetMapping(value = "/api/item/{tenantId}/csv")
	public @ResponseBody String getItemCsv(
			@PathVariable String tenantId,
			HttpServletRequest request) throws Exception {
		if(!validateRole(Const.ROLE_OWNER, tenantId, request)) {
			throw new UnauthorizedException("Unauthorized Exception: token or role not valid");
		}
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ssZ");
		StringBuffer sb = new StringBuffer("instituteName,instituteId,schoolName,schoolId,");
		sb.append("gameName,gameId,playerName,playerId,collection,itemId,itemType,state,isBroken,");
		sb.append("isSwitchingOn,ageRange,isReusable,isValuable,weight,timestamp,saveTime,collector,");
		sb.append("tsClassified,tsConfirmed,tsDisposed,tsChecked,tsUnexpected,stateNote\n");
		List<Institute> instituteList = instituteRepository.findByTenantId(tenantId);
		Map<String, Institute> instituteMap = new HashMap<>();
		List<String> institues = new ArrayList<>();
		for(Institute institute : instituteList) {
			instituteMap.put(institute.getObjectId(), institute);
			institues.add(institute.getObjectId());
		}
		List<School> schoolList = schoolRepository.findByInstituteIds(institues);
		Map<String, School> schoolMap = new HashMap<>();
		List<String> schools = new ArrayList<>();
		for(School school : schoolList) {
			schoolMap.put(school.getObjectId(), school);
			schools.add(school.getObjectId());
		}
		List<Game> gameList = gameRepository.findBySchoolIds(schools);
		Map<String, Game> gameMap = new HashMap<>();
		List<String> games = new ArrayList<>();
		for(Game game : gameList) {
			gameMap.put(game.getObjectId(), game);
			games.add(game.getObjectId());
		}
		List<Player> playerList = playerRepository.findByGameIds(games);
		Map<String, Player> playerMap = new HashMap<>();
		List<ItemEvent> globalEventList = new ArrayList<ItemEvent>();
		for(Player player : playerList) {
			playerMap.put(player.getObjectId(), player);
			List<ItemEvent> eventList = itemEventManager.findByPlayerId(player.getObjectId());
			globalEventList.addAll(eventList);
		}
		globalEventList.addAll(itemEventManager.findByTenantId(tenantId));
		globalEventList.sort(Comparator.comparing(ItemEvent::getTimestamp).reversed());
		GarbageMap garbageMap = garbageMapRepository.findByTenantId(tenantId);
		for(ItemEvent event : globalEventList) {
			try {
				String instituteName = null;
				String instituteId = null;
				String schoolName = null;
				String schoolId = null;
				String gameName = null;
				String gameId = null;
				String playerName = null;
				String playerId = null;
				String collection = null;
				String itemId = null;
				String itemType = null;
				String state = null;
				String isBroken = null;
				String isSwitchingOn = null;
				String ageRange = null;
				String isReusable = null;
				String isValuable = null;
				String weight = null;
				String timestamp = null;
				String saveTime = null;
				String collector = null;
				String tsClassified = null;
				String tsConfirmed = null;
				String tsDisposed = null;
				String tsChecked = null;
				String tsUnexpected = null;
				String stateNote = null;
				itemId = event.getItemId();
				itemType = event.getItemType();
				isBroken = String.valueOf(event.isBroken());
				state = Utils.getItemState(event.getState());
				collector = event.getCollector();
				stateNote = event.getStateNote();
				timestamp = sdf.format(new Date(event.getTimestamp()));
				if(event.getSaveTime() != null) {
					saveTime = sdf.format(event.getSaveTime());
				}
				if(Utils.isNotEmpty(event.getPlayerId())) {
					Player player = playerMap.get(event.getPlayerId());
					Game game = gameMap.get(player.getGameId());
					School school = schoolMap.get(game.getSchoolId());
					Institute institute = instituteMap.get(game.getInstituteId());
					GarbageCollection actualCollection = collectionRepository.findActualCollection(tenantId, 
							game.getObjectId(), event.getTimestamp());
					instituteName = institute.getName();
					instituteId = institute.getObjectId();
					schoolName = school.getName();
					schoolId = school.getObjectId();
					gameName = game.getGameName();
					gameId = game.getObjectId();
					playerName = player.getName();
					playerId = player.getObjectId();
					collection = actualCollection.getNameGE();
					isSwitchingOn = String.valueOf(event.isSwitchingOn());
					ageRange = String.valueOf(event.getAge());
					isReusable = String.valueOf(event.isReusable());
					isValuable = String.valueOf(event.isValuable());
					weight = String.valueOf(garbageMap.getItems().get(itemType).getWeight());
				}
				for(ItemAction action : event.getActions()) {
					if("CLASSIFIED".equals(action.getActionType())) {
						tsClassified = sdf.format(action.getTimestamp());
					}
					if("CONFIRMED".equals(action.getActionType())) {
						tsConfirmed = sdf.format(action.getTimestamp());
					}
					if("DISPOSED".equals(action.getActionType())) {
						tsDisposed = sdf.format(action.getTimestamp());
					}
					if("CHECKED".equals(action.getActionType())) {
						tsChecked = sdf.format(action.getTimestamp());
					}
					if("UNEXPECTED".equals(action.getActionType())) {
						tsUnexpected = sdf.format(action.getTimestamp());
					}
				}
				
				sb.append("\"" + instituteName + "\",");
				sb.append("\"" + instituteId + "\",");
				sb.append("\"" + schoolName + "\",");
				sb.append("\"" + schoolId + "\",");
				sb.append("\"" + gameName + "\",");
				sb.append("\"" + gameId + "\",");
				sb.append("\"" + playerName + "\",");
				sb.append("\"" + playerId + "\",");
				sb.append("\"" + collection + "\",");
				sb.append("\"" + itemId + "\",");
				sb.append("\"" + itemType + "\",");
				sb.append("\"" + state + "\",");
				sb.append("\"" + isBroken + "\",");
				sb.append("\"" + isSwitchingOn + "\",");
				sb.append("\"" + ageRange + "\",");
				sb.append("\"" + isReusable + "\",");
				sb.append("\"" + isValuable + "\",");
				sb.append("\"" + weight + "\",");
				sb.append("\"" + timestamp + "\",");
				sb.append("\"" + saveTime + "\",");
				sb.append("\"" + collector + "\",");
				sb.append("\"" + tsClassified + "\",");
				sb.append("\"" + tsConfirmed + "\",");
				sb.append("\"" + tsDisposed + "\",");
				sb.append("\"" + tsChecked + "\",");
				sb.append("\"" + tsUnexpected + "\",");
				sb.append("\"" + stateNote + "\"\n");
			} catch (Exception e) {
				logger.info("getItemCsv error:{} / {}", event.getId(), e.getMessage());
			}
		}
		logger.info("getItemCsv:{} / {}", tenantId, globalEventList.size());
		return sb.toString();
	}
	

}
