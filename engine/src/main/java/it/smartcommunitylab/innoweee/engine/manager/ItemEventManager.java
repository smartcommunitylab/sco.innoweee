package it.smartcommunitylab.innoweee.engine.manager;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Component;

import it.smartcommunitylab.innoweee.engine.common.Const;
import it.smartcommunitylab.innoweee.engine.model.ItemAction;
import it.smartcommunitylab.innoweee.engine.model.ItemEvent;
import it.smartcommunitylab.innoweee.engine.repository.ItemEventRepository;

@Component
public class ItemEventManager {
	@Autowired
	private ItemEventRepository itemEventRepository;
	
	public ItemEvent findByItemId(String itemId) {
		return itemEventRepository.findByItemId(itemId);
	}
	
	public List<ItemEvent> findByPlayerIds(List<String> playerIds, Sort sort) {
		return itemEventRepository.findByPlayerIds(playerIds, sort);
	}
	
	List<ItemEvent> findByDisposal(List<String> playerIds, boolean reusable, boolean valuable, 
			int state, Date disposalDate, Sort sort) {
		return itemEventRepository.findByDisposal(playerIds, reusable, valuable, state, disposalDate, sort);
	}
	
	public ItemEvent itemClassified(ItemEvent itemEvent) {
		ItemAction action = new ItemAction();
		action.setActionType("CLASSIFIED");
		action.setTimestamp(new Date());
		itemEvent.getActions().add(action);
		itemEvent.setState(Const.ITEM_STATE_CLASSIFIED);
		itemEventRepository.save(itemEvent);
		return itemEvent;
	}
	
	public ItemEvent itemConfirmed(ItemEvent itemEvent) {
		ItemAction action = new ItemAction();
		action.setActionType("CONFIRMED");
		action.setTimestamp(new Date());
		itemEvent.getActions().add(action);
		itemEvent.setState(Const.ITEM_STATE_CONFIRMED);
		itemEventRepository.save(itemEvent);
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

}
