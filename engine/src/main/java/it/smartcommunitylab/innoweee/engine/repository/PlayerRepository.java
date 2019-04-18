package it.smartcommunitylab.innoweee.engine.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import it.smartcommunitylab.innoweee.engine.model.Player;

@Repository
public interface PlayerRepository extends MongoRepository<Player, String> {
	
	@Query(value="{tenantId:?0, gameId:?1}")
	List<Player> findByGameId(String tenantId, String gameId);
	
	@Query(value="{gameId:{$in:?0}}")
	List<Player> findByGameIds(List<String> ids);

}
