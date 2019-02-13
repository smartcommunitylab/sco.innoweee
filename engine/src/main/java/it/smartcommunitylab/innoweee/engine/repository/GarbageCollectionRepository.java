package it.smartcommunitylab.innoweee.engine.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import it.smartcommunitylab.innoweee.engine.model.GarbageCollection;

@Repository
public interface GarbageCollectionRepository extends MongoRepository<GarbageCollection, String>, 
	GarbageCollectionRepositoryCustom {
	
	@Query(value="{tenantId:?0, gameId:?1}")
	List<GarbageCollection> findByGameId(String tenantId, String gameId);
}
