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
	
	@Query(value="{$or:[{playerId:{$in:?0}}, {tenantId:?1}]}")
	List<ItemEvent> findByPlayerIdsOrTenant(List<String> playerIds, String tenantId, Sort sort);	
	
	ItemEvent findByItemId(String itemId);
	
	@Query(value="{playerId:{$in:?0}, reusable:?1, valuable:?2, state:?3, saveTime:{$lte:?4}}")
	List<ItemEvent> findByParams(List<String> playerIds, boolean reusable, boolean valuable, 
			int state, Date disposalDate, Sort sort);
	
	@Query(value="{playerId:{$in:?0}, state:{$in:?1}, reusable:?2, valuable:?3}", count=true)
	int countByParams(List<String> playerIds, List<Integer> states, boolean reusable, boolean valuable);
}
