package it.smartcommunitylab.innoweee.engine.controller;

import java.util.List;
import java.util.Optional;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;

import it.smartcommunitylab.innoweee.engine.common.Const;
import it.smartcommunitylab.innoweee.engine.exception.EntityNotFoundException;
import it.smartcommunitylab.innoweee.engine.exception.UnauthorizedException;
import it.smartcommunitylab.innoweee.engine.ge.GeManager;
import it.smartcommunitylab.innoweee.engine.model.Category;
import it.smartcommunitylab.innoweee.engine.model.CategoryMap;
import it.smartcommunitylab.innoweee.engine.model.Game;
import it.smartcommunitylab.innoweee.engine.model.Garbage;
import it.smartcommunitylab.innoweee.engine.model.GarbageCollection;
import it.smartcommunitylab.innoweee.engine.model.GarbageMap;
import it.smartcommunitylab.innoweee.engine.model.ItemEvent;
import it.smartcommunitylab.innoweee.engine.model.ItemValuable;
import it.smartcommunitylab.innoweee.engine.model.ItemValuableMap;
import it.smartcommunitylab.innoweee.engine.model.Player;
import it.smartcommunitylab.innoweee.engine.model.ReduceReport;
import it.smartcommunitylab.innoweee.engine.repository.CategoryMapRepository;
import it.smartcommunitylab.innoweee.engine.repository.GameRepository;
import it.smartcommunitylab.innoweee.engine.repository.GarbageCollectionRepository;
import it.smartcommunitylab.innoweee.engine.repository.GarbageMapRepository;
import it.smartcommunitylab.innoweee.engine.repository.ItemEventRepository;
import it.smartcommunitylab.innoweee.engine.repository.ItemValuableMapRepository;
import it.smartcommunitylab.innoweee.engine.repository.PlayerRepository;
import it.smartcommunitylab.innoweee.engine.repository.ReduceReportRepository;
import it.smartcommunitylab.innoweee.engine.websocket.WebSocketManager;

@RestController
public class ItemController extends AuthController {
	private static final transient Logger logger = LoggerFactory.getLogger(ItemController.class);
	
	@Autowired
	private ItemEventRepository itemRepository;
	@Autowired
	private PlayerRepository playerRepository;
	@Autowired
	private GameRepository gameRepository; 
	@Autowired
	private GarbageCollectionRepository collectionRepository;
	@Autowired
	private GarbageMapRepository garbageMapRepository;
	@Autowired
	private CategoryMapRepository categoryMapRepository;
	@Autowired
	private ReduceReportRepository reduceReportRepository;
	@Autowired
	private ItemValuableMapRepository valuableMapRepository;
	@Autowired
	private GeManager geManager;
	@Autowired
	private WebSocketManager webSocketManager;
	
	private ObjectMapper mapper = null;
	
	@PostConstruct
	public void init() throws Exception {
		mapper = new ObjectMapper();
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		mapper.configure(DeserializationFeature.READ_ENUMS_USING_TO_STRING, true);
		mapper.configure(SerializationFeature.WRITE_ENUMS_USING_TO_STRING, true);
		mapper.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
	}
 
	@PostMapping(value = "/api/item/recognized")
	public @ResponseBody void startCollection(
			@RequestBody ItemEvent itemEvent,
			HttpServletRequest request, 
			HttpServletResponse response) throws Exception {
		Optional<Player> optionalPlayer = playerRepository.findById(itemEvent.getPlayerId());
		if(optionalPlayer.isEmpty()) {
			throw new EntityNotFoundException("player entity not found");
		}
		Player player = optionalPlayer.get();
		Optional<Game> optionalGame = gameRepository.findById(player.getGameId());
		if(optionalGame.isEmpty()) {
			throw new EntityNotFoundException("game entity not found");
		}
		Game game = optionalGame.get();
		if(!validateAuthorization(game.getTenantId(), game.getInstituteId(), game.getSchoolId(), 
				game.getObjectId(), Const.AUTH_RES_Game_Item, Const.AUTH_ACTION_ADD, request)) {
			throw new UnauthorizedException("Unauthorized Exception: token or role not valid");
		}
		if(StringUtils.isEmpty(itemEvent.getItemId())) {
			throw new EntityNotFoundException("item id not found");
		}
		webSocketManager.notifyItemEventoToPlayer(player.getTenantId(), player.getGameId(), itemEvent);
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
			throw new EntityNotFoundException("game not found");
		}
		Game game = optionalGame.get();
		if(!validateAuthorization(game.getTenantId(), game.getInstituteId(), game.getSchoolId(), 
				game.getObjectId(), Const.AUTH_RES_Game_Item, Const.AUTH_ACTION_ADD, request)) {
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
			throw new EntityNotFoundException("collection not found");
		}
		report.setGarbageCollectionId(actualCollection.getObjectId());
		//TODO add game action
//		geManager.reduceReport(game.getGeGameId(), player.getObjectId(), report, 
//				actualCollection.getNameGE());
		reduceReportRepository.save(report);
		return report;
	}
		
	@PostMapping(value = "/api/item/delivery")
	public @ResponseBody ItemEvent itemDelivery(
			@RequestBody ItemEvent itemEvent,
			@RequestParam(required = false) Long timestamp,
			HttpServletRequest request, 
			HttpServletResponse response) throws Exception {
		Optional<Player> optionalPlayer = playerRepository.findById(itemEvent.getPlayerId());
		if(optionalPlayer.isEmpty()) {
			throw new EntityNotFoundException("player not found");
		}
		Player player = optionalPlayer.get();
		Optional<Game> optionalGame = gameRepository.findById(player.getGameId());
		if(optionalGame.isEmpty()) {
			throw new EntityNotFoundException("game not found");
		}
		Game game = optionalGame.get();
		if(!validateAuthorization(game.getTenantId(), game.getInstituteId(), game.getSchoolId(), 
				game.getObjectId(), Const.AUTH_RES_Game_Item, Const.AUTH_ACTION_ADD, request)) {
			throw new UnauthorizedException("Unauthorized Exception: token or role not valid");
		}
		if(itemRepository.findByItemId(itemEvent.getItemId()) != null) {
			throw new EntityNotFoundException("item already used");
		}
		if(timestamp != null) {
			itemEvent.setTimestamp(timestamp);
		} else {
			itemEvent.setTimestamp(System.currentTimeMillis());
		}
		GarbageCollection actualCollection = collectionRepository.findActualCollection(
				game.getTenantId(), game.getObjectId(), itemEvent.getTimestamp());
		if(actualCollection == null) {
			throw new EntityNotFoundException("collection not found");
		}
		GarbageMap garbageMap = garbageMapRepository.findAll().get(0);
		Garbage garbage = garbageMap.getItems().get(itemEvent.getItemType());
		if(garbage == null) {
			throw new EntityNotFoundException("garbage not found");
		}
		CategoryMap categoryMap = categoryMapRepository.findAll().get(0);
		Category category = categoryMap.getCategories().get(garbage.getCategory());
		if(category == null) {
			throw new EntityNotFoundException("category not found");
		}			
		itemEvent.setReusable(getReusable(itemEvent, garbage));
		itemEvent.setValuable(getValuable(itemEvent, garbage, actualCollection));
		//TODO add game action
//		geManager.itemDelivery(game.getGeGameId(), player.getObjectId(), itemEvent, 
//				actualCollection.getNameGE(), garbage, category);
		itemRepository.save(itemEvent);
		logger.debug("itemDelivery:{} / {}", itemEvent.getItemType(), itemEvent.getItemId());
		return itemEvent;
	}
	
	private boolean getValuable(ItemEvent event, Garbage garbage, 
			GarbageCollection collection) {
		ItemValuableMap valuableMap = valuableMapRepository.findByCollectionName(collection.getNameGE());
		if(valuableMap == null) {
			return false;
		}
		List<ItemValuable> list = valuableMap.getItems().get(garbage.getId());
		if(list == null) {
			return false;
		}
		for(ItemValuable itemValuable : list) {
			if((itemValuable.isBroken() == event.isBroken()) &&
					itemValuable.isSwitchingOn() == event.isSwitchingOn() &&
					itemValuable.getAge() >= event.getAge()) {
				return true;
			}
		}
		return false;
	}

	private boolean getReusable(ItemEvent event, Garbage garbage) {
		if(event.isBroken() && !event.isSwitchingOn()) {
			return false;
		}
		return true;
	}

}
