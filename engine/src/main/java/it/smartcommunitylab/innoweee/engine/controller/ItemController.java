package it.smartcommunitylab.innoweee.engine.controller;

import java.util.Iterator;

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
import org.springframework.web.bind.annotation.ResponseBody;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;

import it.smartcommunitylab.innoweee.engine.ge.GeManager;
import it.smartcommunitylab.innoweee.engine.model.ItemEvent;
import it.smartcommunitylab.innoweee.engine.repository.ItemEventRepository;

@Controller
public class ItemController {
	private static final transient Logger logger = LoggerFactory.getLogger(ItemController.class);
	
	@Autowired
	private ItemEventRepository itemRepository;
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
			HttpServletRequest request, 
			HttpServletResponse response) throws Exception {
		try {
			JsonNode jsonNode = mapper.readTree(content);
			String playerId = jsonNode.get("playerId").asText();
			String itemId = jsonNode.get("itemId").asText();
			ItemEvent itemEvent = itemRepository.findByItemId(itemId);
			if(itemEvent != null) {
				logger.warn("itemDelivery:item already used / {}", itemId);
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
			}
			ItemEvent event = new ItemEvent();
			event.setPlayerId(playerId);
			event.setItemId(itemId);
			event.setUpdateTime(System.currentTimeMillis());
			setAttributes(event, jsonNode);
			geManager.itemDelivery(itemEvent);
			itemRepository.save(event);
			logger.debug("itemDelivery - event created:{}", jsonNode);
			return ResponseEntity.ok(event);
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
