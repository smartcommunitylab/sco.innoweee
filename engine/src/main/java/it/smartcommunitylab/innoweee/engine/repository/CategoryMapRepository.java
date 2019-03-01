package it.smartcommunitylab.innoweee.engine.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import it.smartcommunitylab.innoweee.engine.model.CategoryMap;

@Repository
public interface CategoryMapRepository extends MongoRepository<CategoryMap, String> {
	@Query(value="{tenantId:?0}")
	CategoryMap findByTenantId(String tenantId);
}
