package it.smartcommunitylab.innoweee.engine.manager;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import it.smartcommunitylab.innoweee.engine.common.Const;
import it.smartcommunitylab.innoweee.engine.model.WasteCollectorAction;
import it.smartcommunitylab.innoweee.engine.repository.WasteCollectorActionRepository;

@Component
public class WasteCollectorManager {
	@Autowired
	private WasteCollectorActionRepository repository;
	
	public void addDisposalAction(WasteCollectorAction action) {
		action.setObjectId(null);
		action.setActionType(Const.WASTE_DISPOSAL);
		action.setSaveTime(new Date());
		repository.save(action);
	}
	
	public void addCollectionAction(WasteCollectorAction action) {
		action.setObjectId(null);
		action.setActionType(Const.WASTE_COLLECTION);
		action.setSaveTime(new Date());
		repository.save(action);
	}
	
}
