package it.smartcommunitylab.innoweee.engine.controller;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.google.common.cache.CacheBuilder;
import com.google.common.cache.CacheLoader;
import com.google.common.cache.LoadingCache;

import it.smartcommunitylab.innoweee.engine.common.Utils;
import it.smartcommunitylab.innoweee.engine.exception.EntityNotFoundException;
import it.smartcommunitylab.innoweee.engine.exception.StorageException;
import it.smartcommunitylab.innoweee.engine.exception.UnauthorizedException;
import it.smartcommunitylab.innoweee.engine.repository.UserRepository;
import it.smartcommunitylab.innoweee.engine.security.Authorization;
import it.smartcommunitylab.innoweee.engine.security.User;

@Controller
public class AuthController {
	private static final transient Logger logger = LoggerFactory.getLogger(AuthController.class);
	
	@Autowired
	@Value("${profile.serverUrl}")
	private String profileServerUrl;

	@Autowired
	private UserRepository userRepository;

	RestTemplate restTemplate;
	ObjectMapper mapper;
	LoadingCache<String, String> cache;
	
	@PostConstruct
	public void init() throws Exception {
		CacheLoader<String, String> loader = new CacheLoader<String, String>() {
        @Override
        public String load(String key) throws Exception {
            return getEmailByToken(key);
        }
    };
		cache = CacheBuilder.newBuilder()
				.expireAfterWrite(3600,TimeUnit.SECONDS)
	      .build(loader);
		
		mapper = new ObjectMapper();
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		mapper.configure(DeserializationFeature.READ_ENUMS_USING_TO_STRING, true);
		mapper.configure(SerializationFeature.WRITE_ENUMS_USING_TO_STRING, true);
		mapper.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
		
		int timeout = 15000;
    HttpComponentsClientHttpRequestFactory clientHttpRequestFactory
      = new HttpComponentsClientHttpRequestFactory();
    clientHttpRequestFactory.setConnectTimeout(timeout);
		restTemplate = new RestTemplate(clientHttpRequestFactory);
	}
	
	private String getEmailByToken(String token) throws Exception {
		String email = null;
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);
		headers.setAccept(Arrays.asList(MediaType.APPLICATION_JSON));
		headers.add("Authorization", token);
		HttpEntity<String> entity = new HttpEntity<String>("parameters", headers);
		
		ResponseEntity<String> response = restTemplate.exchange(profileServerUrl + "/accountprofile/me", 
				HttpMethod.GET, entity, String.class);
		JsonNode rootNode = mapper.readTree(response.getBody());
		if(rootNode.hasNonNull("accounts")) {
			JsonNode accountsNode = rootNode.get("accounts");
			if(accountsNode.hasNonNull("internal")) {
				email = accountsNode.get("internal").get("email").asText();
			} else if(accountsNode.hasNonNull("google")) {
				email = accountsNode.get("google").get("email").asText();
			}
		}
		return email;
	}
	
	public User getUserByEmail(HttpServletRequest request) throws Exception {
		//TODO test only
//		String token = request.getHeader("Authorization");
		String token = "Bearer xxxxxx";
		if(StringUtils.isEmpty(token)) {
			throw new UnauthorizedException("Unauthorized Exception: token not valid");
		}
		//TODO test only
//		String email = cache.get(token);
		String email = "admin@test.com";
		if(StringUtils.isEmpty(email)) {
			throw new UnauthorizedException("Unauthorized Exception: email not valid");
		}
		User user = userRepository.findByEmail(email);
		if(user == null) {
			throw new UnauthorizedException("Unauthorized Exception: user not found");
		}
		return user;
	}
	
	public boolean validateAuthorization(String tenantId, String resource, String action,	
			HttpServletRequest request) throws Exception {
		User user = getUserByEmail(request);
		if(StringUtils.isEmpty(tenantId)) {
			tenantId = "null";
		}
		return validateAuthorization(tenantId, null, null, null,
				resource, action, user);
	}

	public boolean validateAuthorization(String tenantId, String instituteId, 
			String resource, String action, HttpServletRequest request) throws Exception {
		User user = getUserByEmail(request);
		if(StringUtils.isEmpty(tenantId)) {
			tenantId = "null";
		}
		if(StringUtils.isEmpty(instituteId)) {
			instituteId = "null";
		}
		return validateAuthorization(tenantId, instituteId, null, null,
				resource, action, user);
	}
	
	public boolean validateAuthorization(String tenantId, String instituteId, String schoolId, 
			String resource, String action, HttpServletRequest request) throws Exception {
		User user = getUserByEmail(request);
		if(StringUtils.isEmpty(tenantId)) {
			tenantId = "null";
		}
		if(StringUtils.isEmpty(instituteId)) {
			instituteId = "null";
		}
		if(StringUtils.isEmpty(schoolId)) {
			schoolId = "null";
		}
		return validateAuthorization(tenantId, instituteId, null, null,
				resource, action, user);
	}
	
	public boolean validateAuthorization(String tenantId, String instituteId, 
			String schoolId, String gameId, String resource, String action, 
			HttpServletRequest request) throws Exception {
		User user = getUserByEmail(request);
		if(StringUtils.isEmpty(tenantId)) {
			tenantId = "null";
		}
		if(StringUtils.isEmpty(instituteId)) {
			instituteId = "null";
		}
		if(StringUtils.isEmpty(schoolId)) {
			schoolId = "null";
		}
		if(StringUtils.isEmpty(gameId)) {
			gameId = "null";
		}
		return validateAuthorization(tenantId, instituteId, null, null,
				resource, action, user);
	}
	
	private boolean validateAuthorization(String tenantId, String instituteId, String schoolId, 
			String gameId, String resource, String action, User user) {
		if(user != null) {
			for(String authKey : user.getRoles().keySet()) {
				List<Authorization> authList = user.getRoles().get(authKey);
				for(Authorization auth : authList) {
					if(auth.getTenantId().equals(tenantId)) {
						if(auth.getResources().contains("*") || auth.getResources().contains(resource)) {
							if(auth.getActions().contains(action)) {
								if(!StringUtils.isEmpty(instituteId)) {
									if(!auth.getInstituteId().equals(instituteId) && !auth.getInstituteId().equals("*")) {
										continue;
									}
								}
								if(!StringUtils.isEmpty(schoolId)) {
									if(!auth.getSchoolId().equals(schoolId) && !auth.getSchoolId().equals("*")) {
										continue;
									}
								}
								if(!StringUtils.isEmpty(gameId)) {
									if(!auth.getGameId().equals(gameId) && !auth.getGameId().equals("*")) {
										continue;
									}
								}
								return true;
							}
						}						
					}
				}
			}
		}
		return false;
	}
	
	public boolean validateRole(String role, String tenantId, HttpServletRequest request) throws Exception {
		User user = getUserByEmail(request);
		if(user != null) {
			for(String authKey : user.getRoles().keySet()) {
				List<Authorization> authList = user.getRoles().get(authKey);
				for(Authorization auth : authList) {
					if(auth.getRole().equals(role) && auth.getTenantId().equals(tenantId)) {
						return true;
					}
				}
			}
		}
		return false;
	}
	
	public boolean validateRole(String role, HttpServletRequest request) throws Exception {
		User user = getUserByEmail(request);
		if(user != null) {
			for(String authKey : user.getRoles().keySet()) {
				List<Authorization> authList = user.getRoles().get(authKey);
				for(Authorization auth : authList) {
					if(auth.getRole().equals(role)) {
						return true;
					}
				}
			}
		}
		return false;
	}

	@ExceptionHandler({EntityNotFoundException.class, StorageException.class})
	@ResponseStatus(value=HttpStatus.BAD_REQUEST)
	@ResponseBody
	public Map<String,String> handleEntityNotFoundError(HttpServletRequest request, Exception exception) {
		logger.error("controller error:{} / {}", request.getRequestURL(), exception.getMessage());
		return Utils.handleError(exception);
	}
	
	@ExceptionHandler(UnauthorizedException.class)
	@ResponseStatus(value=HttpStatus.FORBIDDEN)
	@ResponseBody
	public Map<String,String> handleUnauthorizedError(HttpServletRequest request, Exception exception) {
		logger.error("controller error:{} / {}", request.getRequestURL(), exception.getMessage());
		return Utils.handleError(exception);
	}
	
	@ExceptionHandler(Exception.class)
	@ResponseStatus(value=HttpStatus.INTERNAL_SERVER_ERROR)
	@ResponseBody
	public Map<String,String> handleGenericError(HttpServletRequest request, Exception exception) {
		logger.error("controller error:{} / {}", request.getRequestURL(), exception.getMessage());
		return Utils.handleError(exception);
	}		
	
}
