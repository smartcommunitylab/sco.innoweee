package it.smartcommunitylab.innoweee.engine.repository;

import java.util.List;

import it.smartcommunitylab.innoweee.engine.model.GarbageCollection;

public interface GarbageCollectionRepositoryCustom {
	GarbageCollection findActualCollection(String tenantId, String gameId);
	List<GarbageCollection> findActiveCollections(String tenantId, String gameId);
}	
