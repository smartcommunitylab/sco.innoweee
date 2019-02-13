package it.smartcommunitylab.innoweee.engine.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import it.smartcommunitylab.innoweee.engine.model.School;

@Repository
public interface SchoolRepository extends MongoRepository<School, String> {
	@Query(value="{tenantId:?0, instituteId:?1}")
	List<School> findByInstituteId(String tenantId, String instituteId);
}
