package it.smartcommunitylab.innoweee.engine.manager;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Component;

import it.smartcommunitylab.innoweee.engine.common.Const;
import it.smartcommunitylab.innoweee.engine.model.ItemEvent;
import it.smartcommunitylab.innoweee.engine.model.Player;
import it.smartcommunitylab.innoweee.engine.model.WasteCollectorAction;
import it.smartcommunitylab.innoweee.engine.model.WasteCollectorBin;
import it.smartcommunitylab.innoweee.engine.model.WasteCollectorCard;
import it.smartcommunitylab.innoweee.engine.repository.ItemEventRepository;
import it.smartcommunitylab.innoweee.engine.repository.PlayerRepository;
import it.smartcommunitylab.innoweee.engine.repository.WasteCollectorActionRepository;
import it.smartcommunitylab.innoweee.engine.repository.WasteCollectorBinRepository;
import it.smartcommunitylab.innoweee.engine.repository.WasteCollectorCardRepository;

@Component
public class WasteCollectorManager {
	private static final transient Logger logger = LoggerFactory.getLogger(WasteCollectorManager.class);
	
	@Autowired
	private WasteCollectorActionRepository actionRepository;
	@Autowired
	private WasteCollectorBinRepository binRepository;
	@Autowired
	private WasteCollectorCardRepository cardRepository;
	@Autowired
	private PlayerRepository playerRepository;
	@Autowired
	private ItemEventRepository itemEventRepository;
	
	public void addDisposalAction(WasteCollectorAction action) {
		action.setObjectId(null);
		action.setActionType(Const.WASTE_DISPOSAL);
		action.setSaveTime(new Date());
		WasteCollectorBin bin = binRepository.findByBinId(action.getBinId());
		if(bin != null) {
			action.setBinType(bin.getBinType());
		}		
		actionRepository.save(action);
		WasteCollectorCard card = cardRepository.findByCardId(action.getCardId());
		if((bin != null) && (card != null)) {
			Optional<Player> opPlayer = playerRepository.findById(card.getPlayerId());
			if(opPlayer.isPresent()) {
				Player player = opPlayer.get();
				List<Player> players = playerRepository.findByGameId(player.getTenantId(), player.getGameId());
				List<String> playerIds = getPlayerIds(players);
				if(Const.BIN_RECYCLE.equals(bin.getBinType())) {
					changeItemsStateToDisposed(playerIds, false, false, action.getTimestamp(), bin, card);
				}
				if(Const.BIN_REUSE.equals(bin.getBinType())) {
					changeItemsStateToDisposed(playerIds, true, false, action.getTimestamp(), bin, card);
				}
				if(Const.BIN_VALUE.equals(bin.getBinType())) {
					changeItemsStateToDisposed(playerIds, false, true, action.getTimestamp(), bin, card);
					changeItemsStateToDisposed(playerIds, true, true, action.getTimestamp(), bin, card);
				}
			}
		}		
	}
	
	private List<String> getPlayerIds(List<Player> players) {
		List<String> playerIds = new ArrayList<String>();
		for(Player p : players) {
			playerIds.add(p.getObjectId());
		}
		return playerIds;
	}

	private void changeItemsStateToDisposed(List<String> playerIds, boolean reusable, boolean valuable, 
			Date disposalDate, WasteCollectorBin bin, WasteCollectorCard card) {
		List<ItemEvent> events = itemEventRepository.findByDisposal(playerIds, reusable, valuable, 
				Const.ITEM_STATE_CONFIRMED, disposalDate, new Sort(Sort.Direction.DESC, "timestamp"));
		for(ItemEvent event : events) {
			event.setState(Const.ITEM_STATE_DISPOSED);
			itemEventRepository.save(event);
		}
		logger.info("addDisposalAction:set {} items to disposed state / {} / {} / {}", events.size(), 
				bin.getBinType(), bin.getBinId(), card.getCardId());
	}
	
	public void addCollectionAction(WasteCollectorAction action) {
		action.setObjectId(null);
		action.setActionType(Const.WASTE_COLLECTION);
		action.setSaveTime(new Date());
		WasteCollectorBin bin = binRepository.findByBinId(action.getBinId());
		if(bin != null) {
			action.setBinType(bin.getBinType());
		}		
		actionRepository.save(action);
	}
	
}
