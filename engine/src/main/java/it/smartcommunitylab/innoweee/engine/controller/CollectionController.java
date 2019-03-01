package it.smartcommunitylab.innoweee.engine.controller;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import it.smartcommunitylab.innoweee.engine.common.Const;
import it.smartcommunitylab.innoweee.engine.exception.EntityNotFoundException;
import it.smartcommunitylab.innoweee.engine.exception.UnauthorizedException;
import it.smartcommunitylab.innoweee.engine.model.Game;
import it.smartcommunitylab.innoweee.engine.model.GarbageCollection;
import it.smartcommunitylab.innoweee.engine.repository.GameRepository;
import it.smartcommunitylab.innoweee.engine.repository.GarbageCollectionRepository;

@RestController
public class CollectionController extends AuthController {
	private static final transient Logger logger = LoggerFactory.getLogger(CollectionController.class);
	
	@Autowired
	private GarbageCollectionRepository collectionRepository;
	@Autowired
	private GameRepository gameRepository; 
	
	@GetMapping(value = "/api/collection/{gameId}")
	public @ResponseBody List<GarbageCollection> searchCollection(
			@PathVariable String gameId,
			HttpServletRequest request, 
			HttpServletResponse response) throws Exception {
		Optional<Game> optional = gameRepository.findById(gameId);
		if(optional.isEmpty()) {
			throw new EntityNotFoundException("entity not found");
		}
		Game game = optional.get();
		if(!validateAuthorization(game.getTenantId(), game.getInstituteId(), game.getSchoolId(), 
				game.getObjectId(), Const.AUTH_RES_Game_GarbageCollection, Const.AUTH_ACTION_READ, request)) {
			throw new UnauthorizedException("Unauthorized Exception: token or role not valid");
		}
		List<GarbageCollection> result = collectionRepository.findByGameId(game.getTenantId(), gameId);
		logger.info("searchCollection[{}]:{} / {}", game.getTenantId(), gameId, result.size());
		return result;
	}
		
	@PostMapping(value = "/api/collection")
	public @ResponseBody GarbageCollection saveCollection(
			@RequestBody GarbageCollection collection,
			HttpServletRequest request, 
			HttpServletResponse response) throws Exception {
		Optional<Game> optional = gameRepository.findById(collection.getGameId());
		if(optional.isEmpty()) {
			throw new EntityNotFoundException("entity not found");
		}
		Game game = optional.get();
		if(!validateAuthorization(game.getTenantId(), game.getInstituteId(), game.getSchoolId(), 
				game.getObjectId(), Const.AUTH_RES_Game_GarbageCollection, Const.AUTH_ACTION_ADD, request)) {
			throw new UnauthorizedException("Unauthorized Exception: token or role not valid");
		}
		Date now = new Date();
		if(StringUtils.isEmpty(collection.getObjectId())) {
			collection.setCreationDate(now);
		}
		collection.setLastUpdate(now);
		collectionRepository.save(collection);
		logger.info("saveCollection[{}]:{} / {}", game.getTenantId(), game.getGeGameId(), collection.getObjectId());
		return collection;
	}
	
	@PostMapping(value = "/api/collection/multi")
	public @ResponseBody void saveMultiCollection(
			@RequestBody List<GarbageCollection> collections,
			HttpServletRequest request, 
			HttpServletResponse response) throws Exception {
		for(GarbageCollection collection : collections) {
			Optional<Game> optional = gameRepository.findById(collection.getGameId());
			if(optional.isEmpty()) {
				throw new EntityNotFoundException("entity not found");
			}
			Game game = optional.get();
			if(!validateAuthorization(game.getTenantId(), game.getInstituteId(), game.getSchoolId(), 
					game.getObjectId(), Const.AUTH_RES_Game_GarbageCollection, Const.AUTH_ACTION_ADD, request)) {
				throw new UnauthorizedException("Unauthorized Exception: token or role not valid");
			}
			Date now = new Date();
			if(StringUtils.isEmpty(collection.getObjectId())) {
				collection.setCreationDate(now);
			}
			collection.setLastUpdate(now);
			collectionRepository.save(collection);
			logger.info("saveMultiCollection[{}]:{} / {}", game.getTenantId(), game.getObjectId(), collection.getObjectId());
		}
	}
	
	@DeleteMapping(value = "/api/collection/{id}")
	public @ResponseBody GarbageCollection deleteCollection(
			@PathVariable String id,
			HttpServletRequest request, 
			HttpServletResponse response) throws Exception {
		Optional<GarbageCollection> optionalColl = collectionRepository.findById(id);
		if(optionalColl.isEmpty()) {
			throw new EntityNotFoundException("collection entity not found");
		}
		GarbageCollection collection = optionalColl.get();
		Optional<Game> optionalGame = gameRepository.findById(collection.getGameId());
		if(optionalGame.isEmpty()) {
			throw new EntityNotFoundException("game entity not found");
		}
		Game game = optionalGame.get();
		if(!validateAuthorization(game.getTenantId(), game.getInstituteId(), game.getSchoolId(), 
				game.getObjectId(), Const.AUTH_RES_Game_GarbageCollection, Const.AUTH_ACTION_DELETE, request)) {
			throw new UnauthorizedException("Unauthorized Exception: token or role not valid");
		}
		collectionRepository.deleteById(id);
		logger.info("deleteCollection[{}]:{}", game.getTenantId(), id);
		return collection;
	}
}
