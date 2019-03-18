package it.smartcommunitylab.innoweee.engine.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import it.smartcommunitylab.innoweee.engine.common.Const;
import it.smartcommunitylab.innoweee.engine.exception.UnauthorizedException;
import it.smartcommunitylab.innoweee.engine.model.Catalog;
import it.smartcommunitylab.innoweee.engine.model.CategoryMap;
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
