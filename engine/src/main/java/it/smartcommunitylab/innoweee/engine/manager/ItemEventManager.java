package it.smartcommunitylab.innoweee.engine.manager;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Component;

import it.smartcommunitylab.innoweee.engine.common.Const;
import it.smartcommunitylab.innoweee.engine.common.Utils;
import it.smartcommunitylab.innoweee.engine.exception.EntityNotFoundException;
import it.smartcommunitylab.innoweee.engine.ge.GeManager;
import it.smartcommunitylab.innoweee.engine.model.Category;
import it.smartcommunitylab.innoweee.engine.model.CategoryMap;
import it.smartcommunitylab.innoweee.engine.model.Game;
import it.smartcommunitylab.innoweee.engine.model.GameAction;
import it.smartcommunitylab.innoweee.engine.model.Garbage;
import it.smartcommunitylab.innoweee.engine.model.GarbageCollection;
import it.smartcommunitylab.innoweee.engine.model.GarbageMap;
import it.smartcommunitylab.innoweee.engine.model.ItemAction;
import it.smartcommunitylab.innoweee.engine.model.ItemEvent;
import it.smartcommunitylab.innoweee.engine.model.ItemValuable;
import it.smartcommunitylab.innoweee.engine.model.ItemValuableMap;
import it.smartcommunitylab.innoweee.engine.model.Player;
import it.smartcommunitylab.innoweee.engine.repository.CategoryMapRepository;
import it.smartcommunitylab.innoweee.engine.repository.GameActionRepository;
import it.smartcommunitylab.innoweee.engine.repository.GarbageCollectionRepository;
import it.smartcommunitylab.innoweee.engine.repository.GarbageMapRepository;
import it.smartcommunitylab.innoweee.engine.repository.ItemEventRepository;
import it.smartcommunitylab.innoweee.engine.repository.ItemValuableMapRepository;

@Component
public class ItemEventManager {
	@Autowired
	private ItemEventRepository itemEventRepository;
	@Autowired
	private GarbageCollectionRepository collectionRepository;
	@Autowired
	private GarbageMapRepository garbageMapRepository;
	@Autowired
	private ItemValuableMapRepository valuableMapRepository;
	@Autowired
	private GeManager geManager;
	@Autowired
	private GameActionRepository gameActionRepository;
	@Autowired
	private CategoryMapRepository categoryMapRepository;

	public ItemEvent findByItemId(String itemId) {
		return itemEventRepository.findByItemId(itemId);
	}
	
	public List<ItemEvent> findByPlayerId(String playerId) {
		return itemEventRepository.findByPlayerId(playerId);
	}
	
	public List<ItemEvent> findByTenantId(String tenantId) {
		return itemEventRepository.findByTenantId(tenantId);
	}
	
	public List<ItemEvent> findByPlayerIds(List<String> playerIds, Sort sort) {
		return itemEventRepository.findByPlayerIds(playerIds, sort);
	}
	
	public List<ItemEvent> findByPlayerIdsOrTenant(List<String> playerIds, String tenantId, Sort sort) {
		return itemEventRepository.findByPlayerIdsOrTenant(playerIds, tenantId, sort);
	}
	
	public List<ItemEvent> findByParams(List<String> playerIds, boolean reusable, boolean valuable, 
			int state, Date disposalDate, Sort sort) {
		return itemEventRepository.findByParams(playerIds, reusable, valuable, state, disposalDate, sort);
	}
	
	public int countByParams(List<String> playerIds, List<Integer> states, 
			boolean reusable, boolean valuable) {
		return itemEventRepository.countByParams(playerIds, states, reusable, valuable);
	}
	
	public int countByStates(List<String> playerIds, String tenantId,
			List<Integer> states) {
		return itemEventRepository.countByStates(playerIds, tenantId, states);
	}
	
	public ItemEvent itemClassified(ItemEvent itemEvent, Game game) throws Exception {
		if(findByItemId(itemEvent.getItemId()) != null) {
			throw new EntityNotFoundException(Const.ERROR_CODE_APP + "item already used");
		}
		long now = System.currentTimeMillis();
		if(itemEvent.getTimestamp() == 0) {
			itemEvent.setTimestamp(now);
		}
		itemEvent.setSaveTime(new Date(now));
		GarbageCollection actualCollection = collectionRepository.findActualCollection(
				game.getTenantId(), game.getObjectId(), itemEvent.getTimestamp());
		if(actualCollection == null) {
			throw new EntityNotFoundException(Const.ERROR_CODE_ENTITY + "collection not found");
		}
		GarbageMap garbageMap = garbageMapRepository.findByTenantId(game.getTenantId());
		Garbage garbage = garbageMap.getItems().get(itemEvent.getItemType());
		if(garbage == null) {
			throw new EntityNotFoundException(Const.ERROR_CODE_ENTITY + "garbage not found");
		}
		setReusableValuable(itemEvent, garbage, actualCollection);
		
		ItemAction action = new ItemAction();
		action.setActionType("CLASSIFIED");
		action.setTimestamp(new Date());
		itemEvent.getActions().add(action);
		itemEvent.setState(Const.ITEM_STATE_CLASSIFIED);
		
		itemEventRepository.save(itemEvent);
		return itemEvent;
	}
	
	private void setReusableValuable(ItemEvent event, Garbage garbage, 
			GarbageCollection collection) {
		if(event.isBroken() || !event.isSwitchingOn()) {
			event.setReusable(false);
		} else {
			event.setReusable(true);
		}
		event.setValuable(false);
		ItemValuableMap valuableMap = valuableMapRepository.findByCollectionName(
				collection.getTenantId(), collection.getNameGE());
		if(valuableMap != null) {
			List<ItemValuable> list = valuableMap.getItems().get(garbage.getItemId());
			if(list != null) {
				event.setReusable(false);
				for(ItemValuable itemValuable : list) {
					if((itemValuable.isBroken() == event.isBroken()) &&
							itemValuable.isSwitchingOn() == event.isSwitchingOn() &&
							itemValuable.getAge() >= event.getAge()) {
						event.setValuable(true);
					}
				}
			}
		}
	}

//	private boolean getValuable(ItemEvent event, Garbage garbage, 
//			GarbageCollection collection) {
//		ItemValuableMap valuableMap = valuableMapRepository.findByCollectionName(
//				collection.getTenantId(), collection.getNameGE());
//		if(valuableMap == null) {
//			return false;
//		}
//		List<ItemValuable> list = valuableMap.getItems().get(garbage.getItemId());
//		if(list == null) {
//			return false;
//		}
//		for(ItemValuable itemValuable : list) {
//			if((itemValuable.isBroken() == event.isBroken()) &&
//					itemValuable.isSwitchingOn() == event.isSwitchingOn() &&
//					itemValuable.getAge() >= event.getAge()) {
//				return true;
//			}
//		}
//		return false;
//	}

//	private boolean getReusable(ItemEvent event, Garbage garbage) {
//		if(event.isBroken() || !event.isSwitchingOn()) {
//			return false;
//		}
//		return true;
//	}
	
	public ItemEvent itemConfirmed(ItemEvent itemEvent, Game game, Player player) throws Exception {
		GarbageCollection actualCollection = collectionRepository.findActualCollection(
				game.getTenantId(), game.getObjectId(), itemEvent.getTimestamp());
		if(actualCollection == null) {
			throw new EntityNotFoundException(Const.ERROR_CODE_ENTITY + "collection not found");
		}
		GarbageMap garbageMap = garbageMapRepository.findByTenantId(game.getTenantId());
		Garbage garbage = garbageMap.getItems().get(itemEvent.getItemType());
		if(garbage == null) {
			throw new EntityNotFoundException(Const.ERROR_CODE_ENTITY + "garbage not found");
		}
		CategoryMap categoryMap = categoryMapRepository.findByTenantId(game.getTenantId());
		Category category = categoryMap.getCategories().get(garbage.getCategory());
		if(category == null) {
			throw new EntityNotFoundException(Const.ERROR_CODE_ENTITY + "category not found");
		}							
		geManager.itemDelivery(game.getGeGameId(), player.getObjectId(), itemEvent, 
				actualCollection.getNameGE(), garbage, category);
		
		ItemAction action = new ItemAction();
		action.setActionType("CONFIRMED");
		action.setTimestamp(new Date());
		itemEvent.getActions().add(action);
		itemEvent.setState(Const.ITEM_STATE_CONFIRMED);
		itemEventRepository.save(itemEvent);

		GameAction gameAction = Utils.getItemDeliveryGameAction(game, actualCollection.getNameGE(), player, itemEvent);
		gameActionRepository.save(gameAction);		

		return itemEvent;
	}
	
	public ItemEvent itemDisposed(ItemEvent itemEvent) {
		ItemAction action = new ItemAction();
		action.setActionType("DISPOSED");
		action.setTimestamp(new Date());
		itemEvent.getActions().add(action);
		itemEvent.setState(Const.ITEM_STATE_DISPOSED);
		itemEventRepository.save(itemEvent);
		return itemEvent;
	}
	
	public ItemEvent itemChecked(ItemEvent itemEvent) {
		ItemAction action = new ItemAction();
		action.setActionType("CHECKED");
		action.setTimestamp(new Date());
		itemEvent.getActions().add(action);
		itemEvent.setState(Const.ITEM_STATE_CHECKED);
		itemEventRepository.save(itemEvent);
		return itemEvent;		
	}

	public ItemEvent itemUnexpected(ItemEvent itemEvent) {
		ItemAction action = new ItemAction();
		action.setActionType("UNEXPECTED");
		action.setTimestamp(new Date());
		itemEvent.getActions().add(action);
		itemEvent.setState(Const.ITEM_STATE_UNEXPECTED);
		itemEventRepository.save(itemEvent);
		return itemEvent;		
	}

}
