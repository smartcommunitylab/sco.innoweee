package it.smartcommunitylab.innoweee.engine.repository;

import java.util.Date;
import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import it.smartcommunitylab.innoweee.engine.model.ItemEvent;

@Repository
public interface ItemEventRepository extends MongoRepository<ItemEvent, String> {
	
	List<ItemEvent> findByPlayerId(String playerId);
	
	@Query(value="{playerId:{$in:?0}}")
	List<ItemEvent> findByPlayerIds(List<String> playerIds, Sort sort);
	
	ItemEvent findByItemId(String itemId);
	
	@Query(value="{playerId:{$in:?0}, reusable:?1, valuable:?2, state:?3, saveTime:{$lte:?4}}")
	List<ItemEvent> findByDisposal(List<String> playerIds, boolean reusable, boolean valuable, 
			int state, Date disposalDate, Sort sort);
	
}
