package it.smartcommunitylab.innoweee.engine.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import it.smartcommunitylab.innoweee.engine.model.ItemEvent;

@Repository
public interface ItemEventRepository extends MongoRepository<ItemEvent, String> {
	
	List<ItemEvent> findByPlayerId(String playerId);
	
	@Query(value="{playerId:{$in:?0}}")
	List<ItemEvent> findByPlayerIds(List<String> playerIds);
	
	ItemEvent findByItemId(String itemId);
}
