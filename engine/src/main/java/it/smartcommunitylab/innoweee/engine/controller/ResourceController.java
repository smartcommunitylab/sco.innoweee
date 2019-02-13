package it.smartcommunitylab.innoweee.engine.controller;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import it.smartcommunitylab.innoweee.engine.model.Catalog;
import it.smartcommunitylab.innoweee.engine.model.GarbageMap;
import it.smartcommunitylab.innoweee.engine.repository.CatalogRepository;
import it.smartcommunitylab.innoweee.engine.repository.GarbageMapRepository;

@RestController
public class ResourceController extends AuthController {
	private static final transient Logger logger = LoggerFactory.getLogger(ResourceController.class);
	
	@Autowired
	private CatalogRepository catalogRepository;
	@Autowired
	private GarbageMapRepository garbageMapRepository;
	
	@GetMapping(value = "/api/catalog")
	public @ResponseBody Catalog getCatalog(
			HttpServletRequest request, 
			HttpServletResponse response) throws Exception {
		Catalog catalog = null;
		List<Catalog> list = catalogRepository.findAll();
		if(list.size() > 0) {
			catalog = list.get(0);
		}
		logger.info("getCatalog:{}", catalog);
		return catalog;
	}
	
	@GetMapping(value = "/api/garbageMap")
	public @ResponseBody GarbageMap getGarbageMap(
			HttpServletRequest request, 
			HttpServletResponse response) throws Exception {
		GarbageMap garbageMap = null;
		List<GarbageMap> list = garbageMapRepository.findAll();
		if(list.size() > 0) {
			garbageMap = list.get(0);
		}
		logger.info("getGarbageMap:{}", garbageMap);
		return garbageMap;
	}
	
}
