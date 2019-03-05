package it.smartcommunitylab.innoweee.engine.security;

import java.util.Arrays;
import java.util.concurrent.TimeUnit;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.google.common.cache.CacheBuilder;
import com.google.common.cache.CacheLoader;
import com.google.common.cache.LoadingCache;

@Component
public class AuthManager {
	@Autowired
	@Value("${profile.serverUrl}")
	private String profileServerUrl;
	
	LoadingCache<String, String> cache;
	RestTemplate restTemplate;
	ObjectMapper mapper;
	
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
	
	public LoadingCache<String, String> getCache() {
		return cache;
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

}
