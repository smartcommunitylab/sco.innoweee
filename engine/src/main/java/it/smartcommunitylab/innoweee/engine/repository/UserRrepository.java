package it.smartcommunitylab.innoweee.engine.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import it.smartcommunitylab.innoweee.engine.security.User;

@Repository
public interface UserRrepository extends MongoRepository<User, String> {

}
