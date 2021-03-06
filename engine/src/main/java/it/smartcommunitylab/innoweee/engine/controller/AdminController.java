package it.smartcommunitylab.innoweee.engine.controller;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Scanner;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import it.smartcommunitylab.innoweee.engine.common.Const;
import it.smartcommunitylab.innoweee.engine.common.Utils;
import it.smartcommunitylab.innoweee.engine.exception.UnauthorizedException;
import it.smartcommunitylab.innoweee.engine.model.Catalog;
import it.smartcommunitylab.innoweee.engine.model.CategoryMap;
import it.smartcommunitylab.innoweee.engine.model.Component;
import it.smartcommunitylab.innoweee.engine.model.Game;
import it.smartcommunitylab.innoweee.engine.model.GarbageCollection;
import it.smartcommunitylab.innoweee.engine.model.GarbageMap;
import it.smartcommunitylab.innoweee.engine.model.Institute;
import it.smartcommunitylab.innoweee.engine.model.ItemValuableMap;
import it.smartcommunitylab.innoweee.engine.model.Player;
import it.smartcommunitylab.innoweee.engine.model.School;
import it.smartcommunitylab.innoweee.engine.model.TenantData;
import it.smartcommunitylab.innoweee.engine.model.WasteCollectorBin;
import it.smartcommunitylab.innoweee.engine.model.WasteCollectorCard;
import it.smartcommunitylab.innoweee.engine.repository.CatalogRepository;
import it.smartcommunitylab.innoweee.engine.repository.CategoryMapRepository;
import it.smartcommunitylab.innoweee.engine.repository.GameRepository;
import it.smartcommunitylab.innoweee.engine.repository.GarbageCollectionRepository;
import it.smartcommunitylab.innoweee.engine.repository.GarbageMapRepository;
import it.smartcommunitylab.innoweee.engine.repository.InstituteRepository;
import it.smartcommunitylab.innoweee.engine.repository.ItemValuableMapRepository;
import it.smartcommunitylab.innoweee.engine.repository.PlayerRepository;
import it.smartcommunitylab.innoweee.engine.repository.SchoolRepository;
import it.smartcommunitylab.innoweee.engine.repository.WasteCollectorBinRepository;
import it.smartcommunitylab.innoweee.engine.repository.WasteCollectorCardRepository;

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
	@Autowired
	private GarbageCollectionRepository garbageCollectionRepository;
	@Autowired
	private WasteCollectorCardRepository collectorCardRepository;
	@Autowired
	private WasteCollectorBinRepository collectorBinRepository;

	@PostMapping(value = "/admin/catalog")
	public Catalog saveCatalog(
			@RequestBody Catalog catalog,
			HttpServletRequest request, 
			HttpServletResponse response) throws Exception {
		if(!validateRole(Const.ROLE_ADMIN, request)) {
			throw new UnauthorizedException(Const.ERROR_CODE_ROLE + "role not valid");
		}
		catalogRepository.save(catalog);
		logger.info("saveCatalog:{}", catalog.getId());
		return catalog;
	}
	
	@PostMapping(value = "/admin/catalog/{tenantId}/{gameId}/csv")
	public Catalog saveCatalogFromCsv(
			@PathVariable String tenantId,
			@PathVariable String gameId,
			@RequestBody String csv,
			HttpServletRequest request, 
			HttpServletResponse response) throws Exception {
		if(!validateRole(Const.ROLE_ADMIN, request)) {
			throw new UnauthorizedException(Const.ERROR_CODE_ROLE + "role not valid");
		}
		Catalog catalog = catalogRepository.findByGameId(tenantId, gameId);
		if(catalog == null) {
			catalog = new Catalog();
			catalog.setTenantId(tenantId);
			catalog.setGameId(gameId);
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
			throw new UnauthorizedException(Const.ERROR_CODE_ROLE + "role not valid");
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
			throw new UnauthorizedException(Const.ERROR_CODE_ROLE + "role not valid");
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
			throw new UnauthorizedException(Const.ERROR_CODE_ROLE + "role not valid");
		}
		valuableMapRepository.save(map);
		logger.info("saveItemValuableMap:{}", map.getId());
		return map;
	}
	
	@PostMapping(value = "/admin/init/{tenantId}")
	public void initTenant(
			@PathVariable String tenantId,
			@RequestBody TenantData data,
			HttpServletRequest request) throws Exception {
		if(!validateRole(Const.ROLE_ADMIN, request)) {
			throw new UnauthorizedException(Const.ERROR_CODE_ROLE + "role not valid");
		}
		Date now = new Date();
		
		Institute institute = new Institute();
		if(Utils.isNotEmpty(data.getInstituteId())) {
			institute.setObjectId(data.getInstituteId());
		}
		institute.setTenantId(tenantId);
		institute.setName(data.getInstituteName());
		institute.setCreationDate(now);			
		institute.setLastUpdate(now);
		instituteRepository.save(institute);
		
		School school = new School();
		if(Utils.isNotEmpty(data.getSchoolId())) {
			school.setObjectId(data.getSchoolId());
		}		
		school.setTenantId(tenantId);
		school.setName(data.getSchoolName());
		school.setInstituteId(institute.getObjectId());
		school.setCreationDate(now);
		school.setLastUpdate(now);
		schoolRepository.save(school);
		
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(now);
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		Date from = sdf.parse(data.getGameFrom() + " 00:00:00");
		Date to = sdf.parse(data.getGameTo() + " 23:59:59");
		
		Game game = new Game();
		game.setTenantId(tenantId);
		game.setGameName("Gioco " + school.getName() + " " + calendar.get(Calendar.YEAR));
		game.setInstituteId(institute.getObjectId());
		game.setSchoolId(school.getObjectId());
		game.setCheckCode(data.getCheckCode());
		game.setFrom(from);
		game.setTo(to);
		game.setCreationDate(now);
		game.setLastUpdate(now);
		gameRepository.save(game);
		
		for(GarbageCollection collection : data.getCollections()) {
			collection.setTenantId(tenantId);
			collection.setGameId(game.getObjectId());
			collection.setCreationDate(now);
			collection.setLastUpdate(now);
			garbageCollectionRepository.save(collection);
		}
		
		for(String className : data.getClasses()) {
			Player player = new Player();
			player.setTenantId(tenantId);
			player.setName(className);
			player.setGameId(game.getObjectId());
			player.setTeam(false);
			Utils.setContributions(player, game.getTenantId(), game.getObjectId(), garbageCollectionRepository);
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
	
	@PostMapping(value = "/admin/collector/cards")
	public void saveCollectorCards(
			@RequestBody List<WasteCollectorCard> cards,
			HttpServletRequest request) throws Exception {
		if(!validateRole(Const.ROLE_ADMIN, request)) {
			throw new UnauthorizedException(Const.ERROR_CODE_ROLE + "role not valid");
		}
		for(WasteCollectorCard card : cards) {
			collectorCardRepository.save(card);
		}
		logger.info("saveCollectorCards:{}", cards.size());
	}
	
	@PostMapping(value = "/admin/collector/bins")
	public void saveCollectorBins(
			@RequestBody List<WasteCollectorBin> bins,
			HttpServletRequest request) throws Exception {
		if(!validateRole(Const.ROLE_ADMIN, request)) {
			throw new UnauthorizedException(Const.ERROR_CODE_ROLE + "role not valid");
		}
		for(WasteCollectorBin bin : bins) {
			collectorBinRepository.save(bin);
		}
		logger.info("saveCollectorBins:{}", bins.size());
	}

}
