package it.smartcommunitylab.innoweee.engine.controller;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import it.smartcommunitylab.innoweee.engine.common.Const;
import it.smartcommunitylab.innoweee.engine.exception.UnauthorizedException;
import it.smartcommunitylab.innoweee.engine.model.GameAction;
import it.smartcommunitylab.innoweee.engine.repository.GameActionRepository;

@RestController
public class GameActionController extends AuthController {
	private static final transient Logger logger = LoggerFactory.getLogger(GameActionController.class);
	
	@Autowired
	private GameActionRepository gameActionRepository;
	
	@GetMapping(value = "/api/gameaction/{tenantId}")
	public @ResponseBody List<GameAction> getGameActions(
			@PathVariable String tenantId,
			HttpServletRequest request) throws Exception {
		if(!validateRole(Const.ROLE_OWNER, tenantId, request)) {
			throw new UnauthorizedException(Const.ERROR_CODE_ROLE + "role not valid");
		}
		List<GameAction> result = gameActionRepository.findByTenantId(tenantId, 
				new Sort(Sort.Direction.DESC, "lastUpdate"));
		logger.info("getGameActions:{} / {}", tenantId, result.size());
		return result;
	}
	
	
}
