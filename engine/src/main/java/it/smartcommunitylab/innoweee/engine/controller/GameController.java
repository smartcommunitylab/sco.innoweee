package it.smartcommunitylab.innoweee.engine.controller;

import java.util.ArrayList;
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
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import it.smartcommunitylab.innoweee.engine.common.Const;
import it.smartcommunitylab.innoweee.engine.exception.EntityNotFoundException;
import it.smartcommunitylab.innoweee.engine.exception.UnauthorizedException;
import it.smartcommunitylab.innoweee.engine.ge.GeManager;
import it.smartcommunitylab.innoweee.engine.img.ImageManager;
import it.smartcommunitylab.innoweee.engine.model.Catalog;
import it.smartcommunitylab.innoweee.engine.model.Component;
import it.smartcommunitylab.innoweee.engine.model.Game;
import it.smartcommunitylab.innoweee.engine.model.GarbageCollection;
import it.smartcommunitylab.innoweee.engine.model.Link;
import it.smartcommunitylab.innoweee.engine.model.Player;
import it.smartcommunitylab.innoweee.engine.model.PlayerState;
import it.smartcommunitylab.innoweee.engine.model.Robot;
import it.smartcommunitylab.innoweee.engine.repository.CatalogRepository;
import it.smartcommunitylab.innoweee.engine.repository.GameRepository;
import it.smartcommunitylab.innoweee.engine.repository.GarbageCollectionRepository;
import it.smartcommunitylab.innoweee.engine.repository.PlayerRepository;

@RestController
public class GameController extends AuthController {
	private static final transient Logger logger = LoggerFactory.getLogger(GameController.class);
	
	@Autowired
	private GameRepository gameRepository;
	@Autowired
	private GarbageCollectionRepository collectionRepository;
	@Autowired
	private PlayerRepository playerRepository;
	@Autowired
	private CatalogRepository catalogRepository;
	@Autowired
	private GeManager geManager;
	@Autowired
	private ImageManager imageManager;
	
	@GetMapping(value = "/api/game/{tenantId}/{instituteId}/{schoolId}")
	public @ResponseBody List<Game> searchGame(
			@PathVariable String tenantId, 
			@PathVariable String instituteId,
			@PathVariable String schoolId,
			HttpServletRequest request, 
			HttpServletResponse response) throws Exception {
		List<Game> result = new ArrayList<>();
		List<Game> list = gameRepository.findBySchoolId(tenantId, instituteId, schoolId);
		for(Game game : list) {
			if(validateAuthorization(tenantId, instituteId, schoolId, game.getObjectId(), 
					Const.AUTH_RES_Game, Const.AUTH_ACTION_READ, request)) {
					result.add(game);
				}
		}
		logger.info("searchGame[{}]:{} / {} / {}", tenantId, instituteId, schoolId, result.size());
		return result;
	}
	
	@PostMapping(value = "/api/game")
	public @ResponseBody Game addGame(
			@RequestBody Game game,
			HttpServletRequest request, 
			HttpServletResponse response) throws Exception {
		if(!validateAuthorization(game.getTenantId(), game.getInstituteId(), game.getSchoolId(), 
				Const.AUTH_RES_Game, Const.AUTH_ACTION_ADD, request)) {
			throw new UnauthorizedException("Unauthorized Exception: token or role not valid");
		}
		Date now = new Date();
		game.setCreationDate(now);
		game.setLastUpdate(now);
		gameRepository.save(game);
		logger.info("addGame[{}]:{} / {}", game.getTenantId(), game.getInstituteId(), game.getSchoolId());
		return game;
	}
	
	@PutMapping(value = "/api/game")
	public @ResponseBody Game updateGame(
			@RequestBody Game game,
			HttpServletRequest request, 
			HttpServletResponse response) throws Exception {
		Optional<Game> optional = gameRepository.findById(game.getObjectId());
		if(optional.isEmpty()) {
			throw new EntityNotFoundException("entity not found");
		}
		if(!validateAuthorization(game.getTenantId(), game.getInstituteId(), game.getSchoolId(), 
				game.getObjectId(), Const.AUTH_RES_Game, Const.AUTH_ACTION_UPDATE, request)) {
			throw new UnauthorizedException("Unauthorized Exception: token or role not valid");
		}
		Date now = new Date();
		game.setLastUpdate(now);
		gameRepository.save(game);
		logger.info("updateGame[{}]:{}", game.getTenantId(), game.getObjectId());
		return game;
	}
	
	@DeleteMapping(value = "/api/game/{gameId}")
	public @ResponseBody Game deleteGame(
			@PathVariable String gameId, 
			HttpServletRequest request, 
			HttpServletResponse response) throws Exception {
		Optional<Game> optional = gameRepository.findById(gameId);
		if(optional.isEmpty()) {
			throw new EntityNotFoundException("entity not found");
		}
		Game game = optional.get();
		if(!validateAuthorization(game.getTenantId(), game.getInstituteId(), game.getSchoolId(), 
				game.getObjectId(), Const.AUTH_RES_Game, Const.AUTH_ACTION_UPDATE, request)) {
			throw new UnauthorizedException("Unauthorized Exception: token or role not valid");
		}
		gameRepository.deleteById(gameId);
		List<Player> playerList = playerRepository.findByGameId(game.getTenantId(), game.getObjectId());
		playerRepository.deleteAll(playerList);
		List<GarbageCollection> collectionList = collectionRepository.findByGameId(game.getTenantId(), game.getObjectId());
		collectionRepository.deleteAll(collectionList);
		logger.info("deleteGame[{}]:{}", game.getTenantId(), game.getObjectId());
		return game;
	}
	
	@GetMapping(value = "/api/game/{gameId}/collection")
	public @ResponseBody GarbageCollection getActualCollection(
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
		GarbageCollection collection = collectionRepository.findActualCollection(game.getTenantId(), 
				gameId, System.currentTimeMillis());
		logger.info("getActualCollection[{}]:{}", game.getTenantId(), gameId);
		return collection;
	}
	
	@GetMapping(value = "/api/game/{gameId}/link")
	public @ResponseBody List<Link> getGameMaterial(
			@PathVariable String gameId, 
			HttpServletRequest request, 
			HttpServletResponse response) throws Exception {
		Optional<Game> optional = gameRepository.findById(gameId);
		if(optional.isEmpty()) {
			throw new EntityNotFoundException("entity not found");
		}
		Game game = optional.get();
		if(!validateAuthorization(game.getTenantId(), game.getInstituteId(), game.getSchoolId(), 
				game.getObjectId(), Const.AUTH_RES_Game_Link, Const.AUTH_ACTION_READ, request)) {
			throw new UnauthorizedException("Unauthorized Exception: token or role not valid");
		}
		List<Link> result = new ArrayList<Link>();
		List<GarbageCollection> activeCollections = collectionRepository.findActiveCollections(
				game.getTenantId(), game.getObjectId(), System.currentTimeMillis());
		for(GarbageCollection collection : activeCollections) {
			result.addAll(collection.getLinks());
		}
		logger.info("getGameMaterial[{}]:{} / {}", game.getTenantId(), game.getObjectId(), result.size());
		return result;
	}
	
	@GetMapping(value = "/api/game/{gameId}/robot/{playerId}/buy/{componentId}")
	public @ResponseBody Robot buildRobot(
			@PathVariable String gameId,
			@PathVariable String playerId,
			@PathVariable String componentId,
			HttpServletRequest request, 
			HttpServletResponse response) throws Exception {
		Optional<Game> optionalGame = gameRepository.findById(gameId);
		if(optionalGame.isEmpty()) {
			throw new EntityNotFoundException("game not found");
		}
		Game game = optionalGame.get();
		if(!validateAuthorization(game.getTenantId(), game.getInstituteId(), game.getSchoolId(), 
				game.getObjectId(), Const.AUTH_RES_Game_Robot, Const.AUTH_ACTION_UPDATE, request)) {
			throw new UnauthorizedException("Unauthorized Exception: token or role not valid");
		}
		Optional<Player> optionalPlayer = playerRepository.findById(playerId);
		if(optionalPlayer.isEmpty()) {
			throw new EntityNotFoundException("player not found");
		}
		Player player = optionalPlayer.get();
		Catalog catalog = catalogRepository.findAll().get(0);
		Component newComponent = catalog.getComponents().get(componentId);
		if(newComponent == null) {
			throw new EntityNotFoundException("component not found");
		}
		//TODO add game action
//		geManager.buildRobot(game.getGeGameId(), player.getObjectId(), newComponent);
		String oldComponentId = null;
		for(Component component : player.getRobot().getComponents().values()) {
			if(component.getType().equals(newComponent.getType())) {
				oldComponentId = component.getComponentId();
			}
		}
		if(!StringUtils.isEmpty(oldComponentId)) {
			player.getRobot().getComponents().remove(oldComponentId);
		}
		player.getRobot().getComponents().put(newComponent.getComponentId(), newComponent);
		playerRepository.save(player);
		//TODO create robot image
//		imageManager.storeRobotImage(player);
		logger.info("buildRobot[{}]:{} / {}", player.getTenantId(), playerId, componentId);
		return player.getRobot();
	}
		
	@GetMapping(value = "/api/game/{gameId}/state/{playerId}")
	public @ResponseBody PlayerState getPlayerState(
			@PathVariable String gameId,
			@PathVariable String playerId,
			@RequestParam(required = false) String nameGE,
			HttpServletRequest request, 
			HttpServletResponse response) throws Exception {
		Optional<Game> optionalGame = gameRepository.findById(gameId);
		if(optionalGame.isEmpty()) {
			throw new EntityNotFoundException("game not found");
		}
		Game game = optionalGame.get();
		if(!validateAuthorization(game.getTenantId(), game.getInstituteId(), game.getSchoolId(), 
				game.getObjectId(), Const.AUTH_RES_Game_Player, Const.AUTH_ACTION_READ, request)) {
			throw new UnauthorizedException("Unauthorized Exception: token or role not valid");
		}
		PlayerState playerState = geManager.getPlayerState(gameId, playerId, nameGE);
		logger.info("getPlayerState[{}]:{} / {} / {}", game.getTenantId(), gameId, playerId, nameGE);
		return playerState;
	}
	
}
