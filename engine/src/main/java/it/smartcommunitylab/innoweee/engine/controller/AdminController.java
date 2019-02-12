package it.smartcommunitylab.innoweee.engine.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import it.smartcommunitylab.innoweee.engine.model.Catalog;
import it.smartcommunitylab.innoweee.engine.model.GarbageMap;
import it.smartcommunitylab.innoweee.engine.repository.CatalogRepository;
import it.smartcommunitylab.innoweee.engine.repository.GarbageMapRepository;

@RestController
public class AdminController extends AuthController {
	private static final transient Logger logger = LoggerFactory.getLogger(AdminController.class);
	
	@Autowired
	private CatalogRepository catalogRepository;
	@Autowired
	private GarbageMapRepository garbageTypeRepository;
	
	@PostMapping(value = "/admin/catalog")
	public Catalog saveCatalog(
			@RequestBody Catalog catalog,
			HttpServletRequest request, 
			HttpServletResponse response) throws Exception {
		catalogRepository.save(catalog);
		logger.info("saveCatalog:{}", catalog.getId());
		return catalog;
	}
	
	@PostMapping(value = "/admin/garbage")
	public GarbageMap saveGarbageMap(
			@RequestBody GarbageMap map,
			HttpServletRequest request, 
			HttpServletResponse response) throws Exception {
		garbageTypeRepository.save(map);
		logger.info("saveGarbageMap:{}", map.getId());
		return map;
	}
}
