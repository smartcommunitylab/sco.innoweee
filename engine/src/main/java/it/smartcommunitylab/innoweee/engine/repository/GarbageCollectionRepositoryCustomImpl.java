package it.smartcommunitylab.innoweee.engine.repository;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import it.smartcommunitylab.innoweee.engine.model.GarbageCollection;

public class GarbageCollectionRepositoryCustomImpl implements GarbageCollectionRepositoryCustom {
	@Autowired
	private MongoTemplate mongoTemplate;

	@Override
	public GarbageCollection findActualCollection(String tenantId, String gameId, 
			long timestamp) {
		Criteria criteria = Criteria.where("tenantId").is(tenantId).and("gameId").is(gameId);
		Query query = new Query(criteria);
		query.with(new Sort(Direction.DESC, "from"));
		List<GarbageCollection> list = mongoTemplate.find(query, GarbageCollection.class);
		Date now = new Date(timestamp);
		for(GarbageCollection collection : list) {
			if(now.after(collection.getFrom()) && now.before(collection.getTo())) {
				return collection;
			}
		}
		return null;
	}

	@Override
	public List<GarbageCollection> findActiveCollections(String tenantId, String gameId, 
			long timestamp) {
		List<GarbageCollection> result = new ArrayList<GarbageCollection>();
		Criteria criteria = Criteria.where("tenantId").is(tenantId).and("gameId").is(gameId);
		Query query = new Query(criteria);
		query.with(new Sort(Direction.DESC, "from"));
		List<GarbageCollection> list = mongoTemplate.find(query, GarbageCollection.class);
		Date now = new Date(timestamp);
		for(GarbageCollection collection : list) {
			if(now.after(collection.getFrom())) {
				result.add(collection);
			}
		}
		return result;
	}

}
