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
import it.smartcommunitylab.innoweee.engine.common.Utils;
import it.smartcommunitylab.innoweee.engine.model.CollectorReport;
import it.smartcommunitylab.innoweee.engine.model.Game;
import it.smartcommunitylab.innoweee.engine.model.ItemEvent;
import it.smartcommunitylab.innoweee.engine.model.Player;
import it.smartcommunitylab.innoweee.engine.model.WasteCollectorAction;
import it.smartcommunitylab.innoweee.engine.model.WasteCollectorBin;
import it.smartcommunitylab.innoweee.engine.model.WasteCollectorCard;
import it.smartcommunitylab.innoweee.engine.repository.GameRepository;
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
	private ItemEventManager itemEventManager;
	@Autowired
	private GameRepository gameRepository;
	
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
		List<ItemEvent> events = itemEventManager.findByParams(playerIds, reusable, valuable, 
				Const.ITEM_STATE_CONFIRMED, disposalDate, new Sort(Sort.Direction.DESC, "timestamp"));
		for(ItemEvent event : events) {
			itemEventManager.itemDisposed(event);
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
	
	public CollectorReport getOperatorReport(String tenantId) {
		List<Game> games = gameRepository.findByTenantId(tenantId);
		List<String> gameIds = new ArrayList<String>();
		for(Game game : games) {
			if(Utils.isGamePeriodValid(game)) {
				gameIds.add(game.getObjectId());
			}
		}
		List<Player> players = playerRepository.findByGameIds(gameIds);
		List<String> playerIds = getPlayerIds(players);
		List<Integer> states = new ArrayList<Integer>();
		states.add(Const.ITEM_STATE_DISPOSED);
		int totaleAttesi = itemEventManager.countByParams(playerIds, states, false, false);
		states.clear();
		states.add(Const.ITEM_STATE_DISPOSED);
		states.add(Const.ITEM_STATE_CHECKED);
		int totaleConferiti = itemEventManager.countByParams(playerIds, states, false, false);
		states.clear();
		states.add(Const.ITEM_STATE_CHECKED);
		int totaleCorrispondenti = itemEventManager.countByParams(playerIds, states, false, false);
		states.clear();
		states.add(Const.ITEM_STATE_UNEXPECTED);
		int totaleInattesi = itemEventManager.countByParams(playerIds, states, false, false);
		CollectorReport report = new CollectorReport();
		report.setTotaleAttesi(totaleAttesi);
		report.setTotaleConferiti(totaleConferiti);
		report.setTotaleCorrispondenti(totaleCorrispondenti);
		report.setTotaleInattesi(totaleInattesi);
		return report;
	}
	
}
