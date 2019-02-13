package it.smartcommunitylab.innoweee.engine.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import it.smartcommunitylab.innoweee.engine.model.Institute;

@Repository
public interface InstituteRepository extends MongoRepository<Institute, String> {
	@Query(value="{tenantId:?0}")
	List<Institute> findByTenantId(String tenantId);
}
