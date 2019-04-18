package it.smartcommunitylab.innoweee.engine.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import it.smartcommunitylab.innoweee.engine.model.Game;

@Repository
public interface GameRepository extends MongoRepository<Game, String> {
	
	@Query(value="{tenantId:?0, instituteId:?1, schoolId:?2}")
	List<Game> findBySchoolId(String tenantId, String instituteId, String schoolId);
	
	@Query(value="{schoolId:{$in:?0}}")
	List<Game> findBySchoolIds(List<String> ids);
}
