package it.smartcommunitylab.innoweee.engine.controller;

import java.util.List;
import java.util.Optional;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import it.smartcommunitylab.innoweee.engine.common.Const;
import it.smartcommunitylab.innoweee.engine.exception.EntityNotFoundException;
import it.smartcommunitylab.innoweee.engine.model.Game;
import it.smartcommunitylab.innoweee.engine.model.Institute;
import it.smartcommunitylab.innoweee.engine.model.School;
import it.smartcommunitylab.innoweee.engine.repository.GameRepository;
import it.smartcommunitylab.innoweee.engine.repository.InstituteRepository;
import it.smartcommunitylab.innoweee.engine.repository.SchoolRepository;
import it.smartcommunitylab.innoweee.engine.repository.UserRepository;
import it.smartcommunitylab.innoweee.engine.security.Authorization;
import it.smartcommunitylab.innoweee.engine.security.RoleManager;
import it.smartcommunitylab.innoweee.engine.security.User;

@RestController
public class ProfileController extends AuthController {
	private static final transient Logger logger = LoggerFactory.getLogger(ProfileController.class);
	
	@Autowired
	private UserRepository userRepository;
	@Autowired
	GameRepository gameRepository;
	@Autowired
	private RoleManager roleManager;
	@Autowired
	private InstituteRepository instituteRepository;
	@Autowired
	private SchoolRepository schoolRepository;
	
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
	
	@PostMapping(value="/api/profile/parent/{gameCode}")
	public User addParentRole(
			@PathVariable String gameCode,
			@RequestBody User user,
			HttpServletRequest request) throws Exception {
		Game game = gameRepository.findByCheckCode(gameCode);
		if(game == null) {
			throw new EntityNotFoundException(Const.ERROR_CODE_ENTITY + "game code not found");
		}
		if(StringUtils.isEmpty(user.getEmail())) {
			throw new EntityNotFoundException(Const.ERROR_CODE_APP + "email must be present");
		}
		Optional<Institute> optInstitute = instituteRepository.findById(game.getInstituteId());
		if(optInstitute.isEmpty()) {
			throw new EntityNotFoundException(Const.ERROR_CODE_ENTITY + "institute not found");
		}
		Institute institute = optInstitute.get();
		Optional<School> optSchool = schoolRepository.findById(game.getSchoolId());
		if(optSchool.isEmpty()) {
			throw new EntityNotFoundException(Const.ERROR_CODE_ENTITY + "school not found");
		}
		School school = optSchool.get();
		User userDb = userRepository.findByEmail(user.getEmail());
		if(userDb == null) {
			User newUser = new User();
			newUser.setName(user.getName());
			newUser.setSurname(user.getSurname());
			newUser.setEmail(user.getEmail());
			newUser.setCf(user.getCf());
    	userRepository.save(newUser);
    	user = newUser;
    	logger.info("addParentRole save new user:{}", user.getEmail());
		} else {
			user = userDb;
		}
		roleManager.addParent(user, game.getTenantId(), institute.getObjectId(), institute.getName(), 
				school.getObjectId(), school.getName(), game.getObjectId(), "Gioco " + school.getName());
		return user;
	}
	
}
