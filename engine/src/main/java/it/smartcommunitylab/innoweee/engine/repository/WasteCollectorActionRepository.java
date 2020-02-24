package it.smartcommunitylab.innoweee.engine.repository;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import it.smartcommunitylab.innoweee.engine.model.WasteCollectorAction;

@Repository
public interface WasteCollectorActionRepository extends MongoRepository<WasteCollectorAction, String> {
	List<WasteCollectorAction> findByActionTypeAndBinType(String actionType, String binType, Sort sort);
}
