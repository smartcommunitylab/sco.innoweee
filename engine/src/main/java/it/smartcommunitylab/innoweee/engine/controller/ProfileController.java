package it.smartcommunitylab.innoweee.engine.controller;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import it.smartcommunitylab.innoweee.engine.common.Const;
import it.smartcommunitylab.innoweee.engine.security.Authorization;
import it.smartcommunitylab.innoweee.engine.security.User;

@RestController
public class ProfileController extends AuthController {
	private static final transient Logger logger = LoggerFactory.getLogger(ProfileController.class);
	
	@GetMapping(value = "/api/profile")
	public User getProfile(
			HttpServletRequest request, 
			HttpServletResponse response) throws Exception {
		User user = getUserByEmail(request);
		for(String key : user.getRoles().keySet()) {
			List<Authorization> authorizationList = user.getRoles().get(key);
			for(Authorization authorization : authorizationList) {
				String tenantId = authorization.getTenantId();
				if(!tenantId.equals(Const.SYSTEM_DOMAIN) && 
						!user.getTenants().contains(tenantId)) {
					user.getTenants().add(tenantId);
				}
			}
		}
		logger.info("getProfile:{}", user.getEmail());
		return user;
	}
	
}
