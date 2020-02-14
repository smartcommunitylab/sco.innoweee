package it.smartcommunitylab.innoweee.engine.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import it.smartcommunitylab.innoweee.engine.model.WasteCollectorCard;

@Repository
public interface WasteCollectorCardRepository extends MongoRepository<WasteCollectorCard, String> {
	WasteCollectorCard findByCardId(String cardId);
}
