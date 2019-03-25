package it.smartcommunitylab.innoweee.engine.controller;

import java.util.HashMap;
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
import it.smartcommunitylab.innoweee.engine.exception.UnauthorizedException;
import it.smartcommunitylab.innoweee.engine.model.Catalog;
import it.smartcommunitylab.innoweee.engine.model.CategoryMap;
import it.smartcommunitylab.innoweee.engine.model.Component;
import it.smartcommunitylab.innoweee.engine.model.GarbageMap;
import it.smartcommunitylab.innoweee.engine.model.ItemValuableMap;
import it.smartcommunitylab.innoweee.engine.repository.CatalogRepository;
import it.smartcommunitylab.innoweee.engine.repository.CategoryMapRepository;
import it.smartcommunitylab.innoweee.engine.repository.GarbageMapRepository;
import it.smartcommunitylab.innoweee.engine.repository.ItemValuableMapRepository;

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
	public Catalog saveCatalogByCsv(
			@PathVariable String tenantId,
			@RequestBody String csv,
			HttpServletRequest request, 
			HttpServletResponse response) throws Exception {
//		if(!validateRole(Const.ROLE_ADMIN, request)) {
//			throw new UnauthorizedException("Unauthorized Exception: role not valid");
//		}
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
		logger.info("saveCatalogByCsv:{}", catalog.getId());
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
	
}
