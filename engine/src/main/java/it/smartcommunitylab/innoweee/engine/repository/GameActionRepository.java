package it.smartcommunitylab.innoweee.engine.repository;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import it.smartcommunitylab.innoweee.engine.model.GameAction;

@Repository
public interface GameActionRepository extends MongoRepository<GameAction, String> {
	List<GameAction> findByTenantId(String tenantId, Sort sort);
}
