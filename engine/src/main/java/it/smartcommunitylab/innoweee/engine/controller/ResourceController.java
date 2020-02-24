package it.smartcommunitylab.innoweee.engine.controller;

import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.util.ArrayList;
import java.util.List;

import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import it.smartcommunitylab.innoweee.engine.common.Const;
import it.smartcommunitylab.innoweee.engine.exception.EntityNotFoundException;
import it.smartcommunitylab.innoweee.engine.exception.UnauthorizedException;
import it.smartcommunitylab.innoweee.engine.model.Catalog;
import it.smartcommunitylab.innoweee.engine.model.CategoryMap;
import it.smartcommunitylab.innoweee.engine.model.Component;
import it.smartcommunitylab.innoweee.engine.model.GarbageMap;
import it.smartcommunitylab.innoweee.engine.repository.CatalogRepository;
import it.smartcommunitylab.innoweee.engine.repository.CategoryMapRepository;
import it.smartcommunitylab.innoweee.engine.repository.GarbageMapRepository;

@RestController
public class ResourceController extends AuthController {
	private static final transient Logger logger = LoggerFactory.getLogger(ResourceController.class);
	
	@Autowired
	@Value("${image.path}")
	private String imagePath;
	
	@Autowired
	private CatalogRepository catalogRepository;
	@Autowired
	private GarbageMapRepository garbageMapRepository;
	@Autowired
	private CategoryMapRepository categoryMapRepository;
	
	@GetMapping(value = "/api/catalog/{tenantId}/{gameId}")
	public @ResponseBody Catalog getCatalog(
			@PathVariable String tenantId,
			@PathVariable String gameId,
			HttpServletRequest request) throws Exception {
		if(!validateAuthorization(tenantId, Const.AUTH_RES_Catalog, 
				Const.AUTH_ACTION_READ, request)) {
			throw new UnauthorizedException(Const.ERROR_CODE_ROLE + "role not valid");
		}		
		Catalog catalog = catalogRepository.findByGameId(tenantId, gameId);
		logger.info("getCatalog[{}]:{}", tenantId, catalog);
		return catalog;
	}
	
	@GetMapping(value = "/api/catalog/{tenantId}/{gameId}/component/{id}")
	public @ResponseBody List<Component> getUpgradeComponents(
			@PathVariable String tenantId,
			@PathVariable String gameId,
			@PathVariable String id,
			HttpServletRequest request) throws Exception {
		if(!validateAuthorization(tenantId, Const.AUTH_RES_Catalog, 
				Const.AUTH_ACTION_READ, request)) {
			throw new UnauthorizedException(Const.ERROR_CODE_ROLE + "role not valid");
		}		
		Catalog catalog = catalogRepository.findByGameId(tenantId, gameId);
		if(catalog == null) {
			throw new EntityNotFoundException("catalog not found");
		}
		Component actualComponent = catalog.getComponents().get(id);
		if(actualComponent == null) {
			throw new EntityNotFoundException("component not found");
		}
		List<Component> result = new ArrayList<Component>();
		for(Component component : catalog.getComponents().values()) {
			if(id.equals(component.getParentId())) {
				result.add(component);
			}
		}
		logger.info("getUpgradeComponents[{}]:{}", tenantId, id);
		return result;
	}
	
	@GetMapping(value = "/api/garbageMap/{tenantId}")
	public @ResponseBody GarbageMap getGarbageMap(
			@PathVariable String tenantId,
			HttpServletRequest request) throws Exception {
		if(!validateAuthorization(tenantId, Const.AUTH_RES_GarbageMap, 
				Const.AUTH_ACTION_READ, request)) {
			throw new UnauthorizedException(Const.ERROR_CODE_ROLE + "role not valid");
		}
		GarbageMap garbageMap = garbageMapRepository.findByTenantId(tenantId);
		logger.info("getGarbageMap[{}]:{}", tenantId, garbageMap);
		return garbageMap;
	}

	@GetMapping(value = "/api/categoryMap/{tenantId}")
	public @ResponseBody CategoryMap getCategoryMap(
			@PathVariable String tenantId,
			HttpServletRequest request) throws Exception {
		if(!validateAuthorization(tenantId, Const.AUTH_RES_CategoryMap, 
				Const.AUTH_ACTION_READ, request)) {
			throw new UnauthorizedException(Const.ERROR_CODE_ROLE + "role not valid");
		}
		CategoryMap categoryMap = categoryMapRepository.findByTenantId(tenantId);
		logger.info("getCategoryMap[{}]:{}", tenantId, categoryMap);
		return categoryMap;
	}
	
	@GetMapping(value = "/api/image/robot/{id}")
	public @ResponseBody ResponseEntity<byte[]> downloadRobotImage(
			@PathVariable String id, 
			HttpServletResponse response) throws Exception {
		BufferedImage image = ImageIO.read(new File(imagePath + "/" + id + ".png"));
		ByteArrayOutputStream outputStream = new ByteArrayOutputStream(); 
		ImageIO.write(image, "png", outputStream);
		byte[] data = outputStream.toByteArray();
//		response.setHeader("Cache-Control", "public, max-age=86400");
		logger.info("downloadRobotImage:{}", id);
		return ResponseEntity.ok()
				.contentType(MediaType.IMAGE_PNG)
				.contentLength(data.length)
				.body(data);
	}
	
	@GetMapping(value = "/api/image/robot/{id}/thumb")
	public @ResponseBody ResponseEntity<byte[]> downloadRobotThumb(
			@PathVariable String id, 
			HttpServletResponse response) throws Exception {
		BufferedImage image = ImageIO.read(new File(imagePath + "/" + id + "-thumb.png"));
		ByteArrayOutputStream outputStream = new ByteArrayOutputStream(); 
		ImageIO.write(image, "png", outputStream);
		byte[] data = outputStream.toByteArray();
//		response.setHeader("Cache-Control", "public, max-age=86400");
		logger.info("downloadRobotThumb:{}", id);
		return ResponseEntity.ok()
				.contentType(MediaType.IMAGE_PNG)
				.contentLength(data.length)
				.body(data);
	}

}
