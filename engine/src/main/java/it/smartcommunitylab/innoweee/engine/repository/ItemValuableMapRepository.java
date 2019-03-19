package it.smartcommunitylab.innoweee.engine.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import it.smartcommunitylab.innoweee.engine.model.ItemValuableMap;

@Repository
public interface ItemValuableMapRepository extends MongoRepository<ItemValuableMap, String> {
	@Query(value="{tenantId:?0, collectionNames:?1}")
	ItemValuableMap findByCollectionName(String tenantId, String collectionName);
}
