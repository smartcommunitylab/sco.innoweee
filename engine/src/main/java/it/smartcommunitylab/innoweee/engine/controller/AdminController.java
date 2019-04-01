package it.smartcommunitylab.innoweee.engine.controller;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import it.smartcommunitylab.innoweee.engine.common.Const;
import it.smartcommunitylab.innoweee.engine.exception.UnauthorizedException;
import it.smartcommunitylab.innoweee.engine.model.Catalog;
import it.smartcommunitylab.innoweee.engine.model.CategoryMap;
import it.smartcommunitylab.innoweee.engine.model.Component;
import it.smartcommunitylab.innoweee.engine.model.Game;
import it.smartcommunitylab.innoweee.engine.model.GarbageMap;
import it.smartcommunitylab.innoweee.engine.model.Institute;
import it.smartcommunitylab.innoweee.engine.model.ItemValuableMap;
import it.smartcommunitylab.innoweee.engine.model.Player;
import it.smartcommunitylab.innoweee.engine.model.School;
import it.smartcommunitylab.innoweee.engine.model.TenantData;
import it.smartcommunitylab.innoweee.engine.repository.CatalogRepository;
import it.smartcommunitylab.innoweee.engine.repository.CategoryMapRepository;
import it.smartcommunitylab.innoweee.engine.repository.GameRepository;
import it.smartcommunitylab.innoweee.engine.repository.GarbageMapRepository;
import it.smartcommunitylab.innoweee.engine.repository.InstituteRepository;
import it.smartcommunitylab.innoweee.engine.repository.ItemValuableMapRepository;
import it.smartcommunitylab.innoweee.engine.repository.PlayerRepository;
import it.smartcommunitylab.innoweee.engine.repository.SchoolRepository;

@RestController
public class AdminController extends AuthController {
	private static final transient Logger logger = LoggerFactory.getLogger(AdminController.class);
	
	@Autowired
	private CatalogRepository catalogRepository;
	@Autowired
	private GarbageMapRepository garbageMapRepository;
	@Autowired
	private CategoryMapRepository categoryMapRepository;
	@Autowired
	private ItemValuableMapRepository valuableMapRepository;
	@Autowired
	private InstituteRepository instituteRepository;
	@Autowired
	private SchoolRepository schoolRepository;
	@Autowired
	private GameRepository gameRepository;
	@Autowired
	private PlayerRepository playerRepository;

	@PostMapping(value = "/admin/catalog")
	public Catalog saveCatalog(
			@RequestBody Catalog catalog,
			HttpServletRequest request, 
			HttpServletResponse response) throws Exception {
		if(!validateRole(Const.ROLE_ADMIN, request)) {
			throw new UnauthorizedException("Unauthorized Exception: role not valid");
		}
		catalogRepository.save(catalog);
		logger.info("saveCatalog:{}", catalog.getId());
		return catalog;
	}
	
	@PostMapping(value = "/admin/catalog/{tenantId}/csv")
	public Catalog saveCatalogFromCsv(
			@PathVariable String tenantId,
			@RequestBody String csv,
			HttpServletRequest request, 
			HttpServletResponse response) throws Exception {
		if(!validateRole(Const.ROLE_ADMIN, request)) {
			throw new UnauthorizedException("Unauthorized Exception: role not valid");
		}
		Catalog catalog = catalogRepository.findByTenantId(tenantId);
		if(catalog == null) {
			catalog = new Catalog();
			catalog.setTenantId(tenantId);
		}
		Scanner scanner = new Scanner(csv);
		while (scanner.hasNextLine()) {
			String line = scanner.nextLine();
			String[] strings = line.split(",");
		  Component component = new Component();
		  String type = strings[0];
		  String componentId = strings[1];
		  String parentId = strings[2];
		  String imageUri = componentId + ".png";
		  Map<String, Double> costMap = new HashMap<String, Double>();
		  costMap.put(Const.COIN_REDUCE, Double.valueOf(strings[3]));
		  costMap.put(Const.COIN_REUSE, Double.valueOf(strings[4]));
		  costMap.put(Const.COIN_RECYCLE, Double.valueOf(strings[5]));
		  component.setType(type);
		  component.setComponentId(componentId);
		  if(!StringUtils.isEmpty(parentId)) {
		  	component.setParentId(parentId);
		  }
		  component.setImageUri(imageUri);
		  component.setCostMap(costMap);
		  catalog.getComponents().put(componentId, component);
		}
		scanner.close();
		catalogRepository.save(catalog);
		logger.info("saveCatalogFromCsv:{}", catalog.getId());
		return catalog;
	}
	
	@PostMapping(value = "/admin/garbagemap")
	public GarbageMap saveGarbageMap(
			@RequestBody GarbageMap map,
			HttpServletRequest request, 
			HttpServletResponse response) throws Exception {
		if(!validateRole(Const.ROLE_ADMIN, request)) {
			throw new UnauthorizedException("Unauthorized Exception: role not valid");
		}
		garbageMapRepository.save(map);
		logger.info("saveGarbageMap:{}", map.getId());
		return map;
	}
	
	@PostMapping(value = "/admin/categorymap")
	public CategoryMap saveCategoryMap(
			@RequestBody CategoryMap map,
			HttpServletRequest request, 
			HttpServletResponse response) throws Exception {
		if(!validateRole(Const.ROLE_ADMIN, request)) {
			throw new UnauthorizedException("Unauthorized Exception: role not valid");
		}
		categoryMapRepository.save(map);
		logger.info("saveCategoryMap:{}", map.getId());
		return map;
	}

	@PostMapping(value = "/admin/itemvaluablemap")
	public ItemValuableMap saveItemValuableMap(
			@RequestBody ItemValuableMap map,
			HttpServletRequest request, 
			HttpServletResponse response) throws Exception {
		if(!validateRole(Const.ROLE_ADMIN, request)) {
			throw new UnauthorizedException("Unauthorized Exception: role not valid");
		}
		valuableMapRepository.save(map);
		logger.info("saveItemValuableMap:{}", map.getId());
		return map;
	}
	
	@GetMapping(value = "/admin/init/{tenantId}")
	public void initTenant(
			@PathVariable String tenantId,
			@RequestBody TenantData data,
			HttpServletRequest request) throws Exception {
		if(!validateRole(Const.ROLE_ADMIN, request)) {
			throw new UnauthorizedException("Unauthorized Exception: role not valid");
		}
		Date now = new Date();
		
		Institute institute = new Institute();
		institute.setTenantId(tenantId);
		institute.setName(data.getInstituteName());
		institute.setCreationDate(now);
		institute.setLastUpdate(now);
		instituteRepository.save(institute);
		
		School school = new School();
		school.setTenantId(tenantId);
		school.setName(data.getSchoolName());
		school.setInstituteId(institute.getObjectId());
		school.setCreationDate(now);
		school.setLastUpdate(now);
		schoolRepository.save(school);
		
		Game game = new Game();
		game.setTenantId(tenantId);
		game.setGameName("Gioco Innoweee");
		game.setInstituteId(institute.getObjectId());
		game.setSchoolId(school.getObjectId());
		game.setCreationDate(now);
		game.setLastUpdate(now);
		gameRepository.save(game);
		
		for (String className : data.getClasses()) {
			Player player = new Player();
			player.setTenantId(tenantId);
			player.setName(className);
			player.setGameId(game.getObjectId());
			player.setTeam(false);
			playerRepository.save(player);
		}
		Player player = new Player();
		player.setTenantId(tenantId);
		player.setName("Scuola");
		player.setGameId(game.getObjectId());
		player.setTeam(true);
		playerRepository.save(player);	
		logger.info("initTenant:{}", tenantId);
	}
	
}
