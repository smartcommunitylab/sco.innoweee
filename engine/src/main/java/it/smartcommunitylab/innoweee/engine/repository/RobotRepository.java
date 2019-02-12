package it.smartcommunitylab.innoweee.engine.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import it.smartcommunitylab.innoweee.engine.model.Robot;

@Repository
public interface RobotRepository extends MongoRepository<Robot, String> {
	@Query(value="{tenantId:?0, playerId:?1}")
	List<Robot> findByPlayerId(String tenantId, String playerId);
}
