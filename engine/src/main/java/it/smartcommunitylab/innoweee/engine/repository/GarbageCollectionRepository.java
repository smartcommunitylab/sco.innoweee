package it.smartcommunitylab.innoweee.engine.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import it.smartcommunitylab.innoweee.engine.model.GarbageCollection;

@Repository
public interface GarbageCollectionRepository extends MongoRepository<GarbageCollection, String>, 
	GarbageCollectionRepositoryCustom {
}
