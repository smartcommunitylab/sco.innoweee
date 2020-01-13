package it.smartcommunitylab.innoweee.engine.manager;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import it.smartcommunitylab.innoweee.engine.common.Const;
import it.smartcommunitylab.innoweee.engine.common.Utils;
import it.smartcommunitylab.innoweee.engine.repository.UserRepository;
import it.smartcommunitylab.innoweee.engine.security.Authorization;
import it.smartcommunitylab.innoweee.engine.security.User;

@Component
public class RoleManager {
	
	@Autowired
	private UserRepository userRepository;
	
	public List<Authorization> addOwner(User user, String tenantId) {
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
		return auths;
	}
	
	public List<Authorization> addSchoolOwner(User user, String tenantId, 
			String instituteId, String instituteName, String schoolId, String schoolName) {
		List<Authorization> auths = new ArrayList<Authorization>();
		Authorization auth = new Authorization();
		auth.getActions().add(Const.AUTH_ACTION_READ);
		auth.getActions().add(Const.AUTH_ACTION_ADD);
		auth.getActions().add(Const.AUTH_ACTION_UPDATE);
		auth.getActions().add(Const.AUTH_ACTION_DELETE);
		auth.setRole(Const.ROLE_SCHOOL_OWNER);
		auth.setTenantId(tenantId);
		auth.setInstituteId(instituteId);
		auth.setInstituteName(instituteName);
		auth.setSchoolId(schoolId);
		auth.setSchoolName(schoolName);
		auth.setGameId("*");
		auth.getResources().add("*");
		auths.add(auth);
		String authKey = Utils.getAuthKey(tenantId, Const.ROLE_SCHOOL_OWNER, instituteId, schoolId);
		user.getRoles().put(authKey, auths);
		userRepository.save(user);
		return auths;
	}
	
	public List<Authorization> addSchoolTeacher(User user, String tenantId, 
			String instituteId, String instituteName, String schoolId, String schoolName) {
		List<Authorization> auths = new ArrayList<Authorization>();
		
		Authorization auth = new Authorization();
		auth.getActions().add(Const.AUTH_ACTION_READ);
		auth.setRole(Const.ROLE_SCHOOL_TEACHER);
		auth.setTenantId(tenantId);
		auth.setInstituteId(instituteId);
		auth.setInstituteName(instituteName);
		auth.setSchoolId(schoolId);
		auth.setSchoolName(schoolName);
		auth.setGameId("*");
		auth.getResources().add("*");
		auths.add(auth);
		
		auth = new Authorization();
		auth.getActions().add(Const.AUTH_ACTION_ADD);
		auth.getActions().add(Const.AUTH_ACTION_UPDATE);
		auth.setRole(Const.ROLE_SCHOOL_TEACHER);
		auth.setTenantId(tenantId);
		auth.setInstituteId(instituteId);
		auth.setSchoolId(schoolId);
		auth.setGameId("*");
		auth.getResources().add(Const.AUTH_RES_Game_Item);
		auth.getResources().add(Const.AUTH_RES_Game_Point);
		auth.getResources().add(Const.AUTH_RES_Game_Robot);
		auths.add(auth);
		
		String authKey = Utils.getAuthKey(tenantId, Const.ROLE_SCHOOL_TEACHER, instituteId, schoolId);
		user.getRoles().put(authKey, auths);
		userRepository.save(user);
		return auths;
	}
	
	public List<Authorization> addParent(User user, String tenantId, 
			String instituteId, String instituteName, String schoolId, String schoolName, 
			String gameId, String gameName) {
		List<Authorization> auths = new ArrayList<Authorization>();
		
		Authorization auth = new Authorization();
		auth.getActions().add(Const.AUTH_ACTION_READ);
		auth.setRole(Const.ROLE_SCHOOL_PARENT);
		auth.setTenantId(tenantId);
		auth.setInstituteId(instituteId);
		auth.setInstituteName(instituteName);
		auth.setSchoolId(schoolId);
		auth.setSchoolName(schoolName);
		auth.setGameId(gameId);
		auth.setGameName(gameName);
		auth.getResources().add("*");
		auths.add(auth);
		
		auths = new ArrayList<Authorization>();
		auth = new Authorization();
		auth.getActions().add(Const.AUTH_ACTION_ADD);
		auth.setRole(Const.ROLE_SCHOOL_PARENT);
		auth.setTenantId(tenantId);
		auth.setInstituteId(instituteId);
		auth.setSchoolId(schoolId);
		auth.setGameId(gameId);
		auth.getResources().add(Const.AUTH_RES_Game_Item);
		auths.add(auth);
		
		String authKey = Utils.getAuthKey(tenantId, Const.ROLE_SCHOOL_PARENT, instituteId, schoolId, gameId);
		user.getRoles().put(authKey, auths);
		userRepository.save(user);
		return auths;
	}

}
