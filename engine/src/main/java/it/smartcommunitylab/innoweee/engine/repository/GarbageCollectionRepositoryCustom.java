package it.smartcommunitylab.innoweee.engine.repository;

import java.util.List;

import it.smartcommunitylab.innoweee.engine.model.GarbageCollection;

public interface GarbageCollectionRepositoryCustom {
	List<GarbageCollection> findByGameId(String tenantId, String gameId);
	GarbageCollection findActualCollection(String tenantId, String gameId, long timestamp);
	List<GarbageCollection> findActiveCollections(String tenantId, String gameId, long timestamp);
}	
