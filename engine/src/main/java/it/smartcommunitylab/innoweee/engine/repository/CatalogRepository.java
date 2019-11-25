package it.smartcommunitylab.innoweee.engine.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import it.smartcommunitylab.innoweee.engine.model.Catalog;

@Repository
public interface CatalogRepository extends MongoRepository<Catalog, String> {
	@Query(value="{tenantId:?0, gameId:?1}")
	Catalog findByGameId(String tenantId, String gameId);
}
