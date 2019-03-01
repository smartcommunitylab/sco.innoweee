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
import org.springframework.web.bind.annotation.RequestBody;
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
import it.smartcommunitylab.innoweee.engine.model.Player;
import it.smartcommunitylab.innoweee.engine.model.Robot;
import it.smartcommunitylab.innoweee.engine.repository.CatalogRepository;
import it.smartcommunitylab.innoweee.engine.repository.GameRepository;
import it.smartcommunitylab.innoweee.engine.repository.PlayerRepository;

@RestController
public class PlayerController extends AuthController {
	private static final transient Logger logger = LoggerFactory.getLogger(PlayerController.class);
	
	@Autowired
	private PlayerRepository playerRepository;
	@Autowired
	private GameRepository gameRepository; 
	@Autowired
	private CatalogRepository catalogResopitory;
	@Autowired
	private ImageManager imageManager;
	@Autowired
	private GeManager geManager;
	
	@GetMapping(value = "/api/player/{gameId}")
	public @ResponseBody List<Player> searchPlayer(
			@PathVariable String gameId,
			HttpServletRequest request, 
			HttpServletResponse response) throws Exception {
		Optional<Game> optional = gameRepository.findById(gameId);
		if(optional.isEmpty()) {
			throw new EntityNotFoundException("entity not found");
		}
		Game game = optional.get();
		if(!validateAuthorization(game.getTenantId(), game.getInstituteId(), game.getSchoolId(), 
				game.getObjectId(), Const.AUTH_RES_Game_Player, Const.AUTH_ACTION_READ, request)) {
			throw new UnauthorizedException("Unauthorized Exception: token or role not valid");
		}
		List<Player> result = playerRepository.findByGameId(game.getTenantId(), gameId);
		logger.info("searchPlayer[{}]:{} / {}", game.getTenantId(), gameId, result.size());
		return result;
	}
	
	@PostMapping(value = "/api/player")
	public @ResponseBody Player savePlayer(
			@RequestBody Player player,
			HttpServletRequest request, 
			HttpServletResponse response) throws Exception {
		Optional<Game> optional = gameRepository.findById(player.getGameId());
		if(optional.isEmpty()) {
			throw new EntityNotFoundException("entity not found");
		}
		Game game = optional.get();
		if(!validateAuthorization(game.getTenantId(), game.getInstituteId(), game.getSchoolId(), 
				game.getObjectId(), Const.AUTH_RES_Game_Player, Const.AUTH_ACTION_ADD, request)) {
			throw new UnauthorizedException("Unauthorized Exception: token or role not valid");
		}
		Date now = new Date();
		if(StringUtils.isEmpty(player.getObjectId())) {
			player.setCreationDate(now);
			player.setLastUpdate(now);
			if(!player.isTeam()) {
				addNewRobot(player);
			}
			playerRepository.save(player);
			if(!player.isTeam()) {
				imageManager.storeRobotImage(player);
			}
			//TODO add game action
			if(player.isTeam()) {
				List<String> members = new ArrayList<String>();
				List<Player> list = playerRepository.findByGameId(game.getTenantId(), game.getObjectId());
				for(Player pl : list) {
					if(!pl.isTeam()) {
						members.add(pl.getObjectId());
					}
				}
//				geManager.addTeam(game.getGeGameId(), player.getObjectId(), members);
			} else {
//				geManager.addPlayer(game.getGeGameId(), player.getObjectId());
			}
		} else {
			// update existing one
			player.setLastUpdate(now);
			playerRepository.save(player);
		}
		logger.info("savePlayer[{}]:{} / {}", game.getTenantId(), game.getObjectId(), player.getObjectId());
		return player;
	}
	
	@DeleteMapping(value = "/api/player/{id}")
	public @ResponseBody Player deletePlayer(
			@PathVariable String id,
			HttpServletRequest request, 
			HttpServletResponse response) throws Exception {
		Optional<Player> optionalPlayer = playerRepository.findById(id);
		if(optionalPlayer.isEmpty()) {
			throw new EntityNotFoundException("player entity not found");
		}
		Player player = optionalPlayer.get();
		Optional<Game> optionalGame = gameRepository.findById(player.getGameId());
		if(optionalGame.isEmpty()) {
			throw new EntityNotFoundException("game entity not found");
		}
		Game game = optionalGame.get();
		if(!validateAuthorization(game.getTenantId(), game.getInstituteId(), game.getSchoolId(), 
				game.getObjectId(), Const.AUTH_RES_Game_Player, Const.AUTH_ACTION_DELETE, request)) {
			throw new UnauthorizedException("Unauthorized Exception: token or role not valid");
		}
		//TODO add game action
//		geManager.deletePlayer(game.getGeGameId(), id);
		playerRepository.deleteById(id);
		logger.info("deletePlayer[{}]:{}", game.getTenantId(), id);
		return player;
	}
	
	@GetMapping(value = "/api/player/{playerId}/robot/reset")
	public @ResponseBody Robot resetRobot(
			@PathVariable String playerId,
			HttpServletRequest request, 
			HttpServletResponse response) throws Exception {
		Optional<Player> optionalPlayer = playerRepository.findById(playerId);
		if(optionalPlayer.isEmpty()) {
			throw new EntityNotFoundException("player not found");
		}
		Player player = optionalPlayer.get();
		Optional<Game> optionalGame = gameRepository.findById(player.getGameId());
		if(optionalGame.isEmpty()) {
			throw new EntityNotFoundException("game not found");
		}
		Game game = optionalGame.get();
		if(!validateAuthorization(game.getTenantId(), game.getInstituteId(), game.getSchoolId(), 
				game.getObjectId(), Const.AUTH_RES_Game_Robot, Const.AUTH_ACTION_UPDATE, request)) {
			throw new UnauthorizedException("Unauthorized Exception: token or role not valid");
		}
		addNewRobot(player);
		player.setLastUpdate(new Date());
		playerRepository.save(player);
		if(!player.isTeam()) {
			imageManager.storeRobotImage(player);
		}		
		logger.info("resetRobot[{}]:{}", player.getTenantId(), player.getObjectId());
		return player.getRobot();
	}
	
	private void addNewRobot(Player player) {
		Robot robot = new Robot();
		Catalog catalog = catalogResopitory.findByTenantId(player.getTenantId());
		if(catalog != null) {
			for(Component component : catalog.getComponents().values()) {
				if(StringUtils.isEmpty(component.getParentId())) {
					// default customization
					robot.getComponents().put(component.getComponentId(), component);
				}
			}
			player.setRobot(robot);			
		}
	}
	
}
