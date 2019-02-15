package it.smartcommunitylab.innoweee.engine.controller;

import java.util.Iterator;
import java.util.Optional;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonNode;
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
import it.smartcommunitylab.innoweee.engine.model.Player;
import it.smartcommunitylab.innoweee.engine.repository.CategoryMapRepository;
import it.smartcommunitylab.innoweee.engine.repository.GameRepository;
import it.smartcommunitylab.innoweee.engine.repository.GarbageCollectionRepository;
import it.smartcommunitylab.innoweee.engine.repository.GarbageMapRepository;
import it.smartcommunitylab.innoweee.engine.repository.ItemEventRepository;
import it.smartcommunitylab.innoweee.engine.repository.PlayerRepository;

@Controller
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
	private GeManager geManager;
	
	private ObjectMapper mapper = null;
	
	@PostConstruct
	public void init() throws Exception {
		mapper = new ObjectMapper();
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		mapper.configure(DeserializationFeature.READ_ENUMS_USING_TO_STRING, true);
		mapper.configure(SerializationFeature.WRITE_ENUMS_USING_TO_STRING, true);
		mapper.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
	}
 
	//@MessageMapping("/item")
  //@SendTo("/topic/item")
	public ItemEvent itemIdentification(ItemEvent event) {
		return event;
	}
	
	@PostMapping(value = "/api/event")
	public @ResponseBody ResponseEntity<ItemEvent> itemDelivery(String content,
			@RequestParam(required = false) Long timestamp,
			HttpServletRequest request, 
			HttpServletResponse response) throws Exception {
		try {
			JsonNode jsonNode = mapper.readTree(content);
			String playerId = jsonNode.get("playerId").asText();
			String itemId = jsonNode.get("itemId").asText();
			String itemType = jsonNode.get("itemType").asText();
			
			Optional<Player> optionalPlayer = playerRepository.findById(playerId);
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

			ItemEvent itemEvent = itemRepository.findByItemId(itemId);
			if(itemEvent != null) {
				logger.warn("itemDelivery:item already used / {}", itemId);
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
			}
			ItemEvent event = new ItemEvent();
			event.setPlayerId(playerId);
			event.setItemId(itemId);
			setAttributes(event, jsonNode);
			if(timestamp != null) {
				event.setTimestamp(timestamp);
			} else {
				event.setTimestamp(System.currentTimeMillis());
			}
			GarbageCollection actualCollection = collectionRepository.findActualCollection(
					game.getTenantId(), game.getObjectId());
			GarbageMap garbageMap = garbageMapRepository.findAll().get(0);
			Garbage garbage = garbageMap.getItems().get(itemType);
			if(garbage == null) {
				logger.warn("itemDelivery:garbage not found / {}", itemType);
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
			}
			CategoryMap categoryMap = categoryMapRepository.findAll().get(0);
			Category category = categoryMap.getCategories().get(garbage.getCategory());
			if(category == null) {
				logger.warn("itemDelivery:category not found / {}", itemType);
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
			}			
			//TODO set weee flag
			boolean weee = false;
			geManager.itemDelivery(game, player, itemEvent, actualCollection.getNameGE(), 
					weee, garbage, category);
			itemRepository.save(event);
			logger.debug("itemDelivery - event created:{}", jsonNode);
			return ResponseEntity.ok(event);
		} catch (EntityNotFoundException e) {
			throw e;
		} catch (UnauthorizedException e) {
			throw e;
		} catch (Exception e) {
			logger.warn("itemDelivery error:{}", e.getMessage());
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}
	}
	
	private void setAttributes(ItemEvent event, JsonNode jsonNode) {
		Iterator<String> fieldNames = jsonNode.fieldNames();
		while (fieldNames.hasNext()) {
			String filedName = fieldNames.next();
			if(filedName.equals("playerId") || filedName.equals("eventType") ||
					filedName.equals("id")) {
				continue;
			}
			JsonNode fieldNode = jsonNode.get(filedName);
			if(fieldNode.isTextual()) {
				event.getAttributes().put(filedName, fieldNode.get(filedName).asText());
			} else if(fieldNode.isBoolean()) {
				event.getAttributes().put(filedName, fieldNode.get(filedName).asBoolean());
			} else if(fieldNode.isDouble() || jsonNode.isFloat()) {
				event.getAttributes().put(filedName, fieldNode.get(filedName).asDouble());
			} else if(fieldNode.canConvertToInt()) {
				event.getAttributes().put(filedName, fieldNode.get(filedName).asInt());
			} else if(fieldNode.canConvertToLong()) {
				event.getAttributes().put(filedName, fieldNode.get(filedName).asLong());
			}
		}
	}

}
