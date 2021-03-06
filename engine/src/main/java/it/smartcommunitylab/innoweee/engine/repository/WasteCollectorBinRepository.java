package it.smartcommunitylab.innoweee.engine.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import it.smartcommunitylab.innoweee.engine.model.WasteCollectorBin;

@Repository
public interface WasteCollectorBinRepository extends MongoRepository<WasteCollectorBin, String> {
	WasteCollectorBin findByBinId(String binId);
}
