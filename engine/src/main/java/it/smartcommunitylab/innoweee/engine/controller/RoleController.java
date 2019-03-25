package it.smartcommunitylab.innoweee.engine.controller;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import it.smartcommunitylab.innoweee.engine.common.Const;
import it.smartcommunitylab.innoweee.engine.common.Utils;
import it.smartcommunitylab.innoweee.engine.exception.EntityNotFoundException;
import it.smartcommunitylab.innoweee.engine.exception.UnauthorizedException;
import it.smartcommunitylab.innoweee.engine.repository.UserRepository;
import it.smartcommunitylab.innoweee.engine.security.Authorization;
import it.smartcommunitylab.innoweee.engine.security.User;

@RestController
public class RoleController extends AuthController {
	private static final transient Logger logger = LoggerFactory.getLogger(RoleController.class);
	
	@Autowired
	private UserRepository userRepository;
	
	@GetMapping(value = "/api/role/{tenantId}/owner")
	public @ResponseBody List<Authorization> addOwner(
			@PathVariable String tenantId,
			@RequestParam String email,
			HttpServletRequest request) throws Exception {
		if(!validateRole(Const.ROLE_ADMIN, request)) {
			throw new UnauthorizedException("Unauthorized Exception: role not valid");
		}
		User user = userRepository.findByEmail(email);
		if(user == null) {
			throw new EntityNotFoundException("user not found");
		}
		List<Authorization> auths = new ArrayList<Authorization>();
		Authorization auth = new Authorization();
		auth.getActions().add(Const.AUTH_ACTION_READ);
		auth.getActions().add(Const.AUTH_ACTION_ADD);
		auth.getActions().add(Const.AUTH_ACTION_UPDATE);
		auth.getActions().add(Const.AUTH_ACTION_DELETE);
		auth.setRole(Const.ROLE_OWNER);
		auth.setTenantId(tenantId);
		auth.setInstituteId("*");
		auth.setSchoolId("*");
		auth.setGameId("*");
		auth.getResources().add("*");
		auths.add(auth);
		String authKey = Utils.getAuthKey(tenantId, Const.ROLE_OWNER);
		user.getRoles().put(authKey, auths);
		userRepository.save(user);
		logger.info(String.format("addOwner[{}]:{}", tenantId, email));
		return auths;
	}
	
	@GetMapping(value = "/api/role/{tenantId}/schoolowner")
	public @ResponseBody List<Authorization> addSchoolOwner(
			@PathVariable String tenantId,
			@RequestParam String email,
			@RequestParam String instituteId,
			@RequestParam String schoolId,
			HttpServletRequest request) throws Exception {
		if(!validateRole(Const.ROLE_OWNER, tenantId, request)) {
			throw new UnauthorizedException("Unauthorized Exception: role not valid");
		}
		User user = userRepository.findByEmail(email);
		if(user == null) {
			throw new EntityNotFoundException("user not found");
		}
		List<Authorization> auths = new ArrayList<Authorization>();
		Authorization auth = new Authorization();
		auth.getActions().add(Const.AUTH_ACTION_READ);
		auth.getActions().add(Const.AUTH_ACTION_ADD);
		auth.getActions().add(Const.AUTH_ACTION_UPDATE);
		auth.getActions().add(Const.AUTH_ACTION_DELETE);
		auth.setRole(Const.ROLE_SCHOOL_OWNER);
		auth.setTenantId(tenantId);
		auth.setInstituteId(instituteId);
		auth.setSchoolId(schoolId);
		auth.setGameId("*");
		auth.getResources().add("*");
		auths.add(auth);
		String authKey = Utils.getAuthKey(tenantId, Const.ROLE_SCHOOL_OWNER);
		user.getRoles().put(authKey, auths);
		userRepository.save(user);
		logger.info(String.format("addSchoolOwner[{}]:{}", tenantId, email));
		return auths;
	}
	
	@PostMapping(value = "/api/role/{tenantId}/user")
	public @ResponseBody User saveUser(
			@PathVariable String tenantId,
			@RequestBody User user,
			HttpServletRequest request) throws Exception {
		if(!validateRole(Const.ROLE_OWNER, tenantId, request)) {
			throw new UnauthorizedException("Unauthorized Exception: role not valid");
		}
		User userDb = null;
		if(!StringUtils.isEmpty(user.getEmail())) {
			userDb = userRepository.findByEmail(user.getEmail());
		} else {
			throw new EntityNotFoundException("email must be present");
		}
		if(userDb == null) {
			User newUser = new User();
			newUser.setName(user.getName());
			newUser.setSurname(user.getSurname());
			newUser.setEmail(user.getEmail());
			newUser.setCf(user.getCf());
    	
  		List<Authorization> auths = new ArrayList<Authorization>();
  		Authorization auth = new Authorization();
  		auth.setRole(Const.ROLE_USER);
  		auth.setTenantId(tenantId);
  		auths.add(auth);
  		String authKey = Utils.getAuthKey(tenantId, Const.ROLE_USER);
  		newUser.getRoles().put(authKey, auths);
  		
    	userRepository.save(newUser);
    	logger.info("saveUser new [{}]:{}", tenantId, user.getEmail());
    	return newUser;
    } else {
    	user.setId(userDb.getId());
    	if(!Utils.checkTenantIdAndRole(tenantId, Const.ROLE_USER, userDb)) {
    		List<Authorization> auths = new ArrayList<Authorization>();
    		Authorization auth = new Authorization();
    		auth.setRole(Const.ROLE_USER);
    		auth.setTenantId(tenantId);
    		auths.add(auth);
    		String authKey = Utils.getAuthKey(tenantId, Const.ROLE_USER);
    		user.getRoles().put(authKey, auths);
    	}
    	userRepository.save(user);
    	logger.info("saveUser update [{}]:{}", tenantId, user.getEmail());
    	return user;
    }
	}
	
	@DeleteMapping(value = "/api/role/{tenantId}/user")
	public @ResponseBody void removeUser(
			@PathVariable String tenantId,
			@RequestParam String email,
			HttpServletRequest request) throws Exception {
		if(!validateRole(Const.ROLE_OWNER, tenantId, request)) {
			throw new UnauthorizedException("Unauthorized Exception: role not valid");
		}
		User user = getUserByEmail(request);
		if(user == null) {
			throw new EntityNotFoundException(String.format("user %s not found", email));
		}
		List<String> userRoles = Utils.getUserRoles(user);
		List<String> userTenantIds = Utils.getUserTenantIds(user);
  	if(!userTenantIds.contains(tenantId)) {
  		throw new UnauthorizedException("Unauthorized Exception: dataset not allowed");
  	}
  	if(userRoles.contains(Const.ROLE_ADMIN)) {
  		throw new UnauthorizedException("Unauthorized Exception: unable to delete admin user");
  	}
  	userRepository.delete(user);
  	logger.info("removeUser[{}]:{}", tenantId, email);
	}
}