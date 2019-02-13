package it.smartcommunitylab.innoweee.engine.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import it.smartcommunitylab.innoweee.engine.model.ItemEvent;

@Repository
public interface ItemEventRepository extends MongoRepository<ItemEvent, String> {
	List<ItemEvent> findByPlayerId(String playerId);
	ItemEvent findByItemId(String itemId);
}
