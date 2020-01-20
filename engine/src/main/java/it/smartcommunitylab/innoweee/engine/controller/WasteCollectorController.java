package it.smartcommunitylab.innoweee.engine.controller;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import it.smartcommunitylab.innoweee.engine.exception.UnauthorizedException;
import it.smartcommunitylab.innoweee.engine.manager.WasteCollectorManager;
import it.smartcommunitylab.innoweee.engine.model.WasteCollectorAction;

@RestController
public class WasteCollectorController extends AuthController {
	private static final transient Logger logger = LoggerFactory.getLogger(WasteCollectorController.class);
	
	@Autowired
	private WasteCollectorManager wasteCollectorManager;
	
	@PostMapping(value = "/api/collector/disposal")
	public @ResponseBody void addDisposalAction(
			@RequestBody WasteCollectorAction action,
			HttpServletRequest request) throws Exception {
		if(!validateClient(request)) {
			throw new UnauthorizedException("Unauthorized Exception: token not valid");
		}
		wasteCollectorManager.addDisposalAction(action);
		logger.info("addDisposalAction:{} / {} / {}", action.getOrigin(), action.getBinId(), action.getCardId());
	}
	
	@PostMapping(value = "/api/collector/collection")
	public @ResponseBody void addCollectionAction(
			@RequestBody WasteCollectorAction action,
			HttpServletRequest request) throws Exception {
		if(!validateClient(request)) {
			throw new UnauthorizedException("Unauthorized Exception: token not valid");
		}
		wasteCollectorManager.addCollectionAction(action);
		logger.info("addCollectionAction:{} / {} / {}", action.getOrigin(), action.getBinId(), action.getCardId());
	}
	
}
