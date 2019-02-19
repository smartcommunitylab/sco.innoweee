package it.smartcommunitylab.innoweee.engine.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import it.smartcommunitylab.innoweee.engine.model.ReduceReport;

@Repository
public interface ReduceReportRepository extends MongoRepository<ReduceReport, String> {

}
