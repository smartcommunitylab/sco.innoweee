package it.smartcommunitylab.innoweee.engine.controller;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class StatusController extends AuthController {
	private static final transient Logger logger = LoggerFactory.getLogger(StatusController.class);
	
	@GetMapping(value = "/api/status/player/{playerId}")
	public @ResponseBody Map<String, Object> getPlayerStatus(
			@PathVariable String playerId,
			HttpServletRequest request, 
			HttpServletResponse response) throws Exception {
		//TODO
		return null;
	}
	
	@GetMapping(value = "/api/status/player/{playerId}/collection")
	public @ResponseBody Map<String, Object> getCollectionStatus(
			@PathVariable String playerId,
			HttpServletRequest request, 
			HttpServletResponse response) throws Exception {
		//TODO
		return null;
	}

}
