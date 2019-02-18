package it.smartcommunitylab.innoweee.engine.websocket;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import it.smartcommunitylab.innoweee.engine.common.Utils;
import it.smartcommunitylab.innoweee.engine.model.ItemEvent;

@Component
public class WebSocketManager {
	private static final transient Logger logger = LoggerFactory.getLogger(WebSocketManager.class);
	
  @Autowired
  private SimpMessagingTemplate simpMessagingTemplate;

  public void notifyItemEventoToPlayer(String tenantId, String playerId, 
  		ItemEvent itemEvent) throws Exception {
  	String destination = Utils.getTopic(tenantId, playerId);
  	simpMessagingTemplate.convertAndSend(destination, itemEvent);
  	logger.info("notifyItemEventoToPlayer:{}", destination);
  }
}
