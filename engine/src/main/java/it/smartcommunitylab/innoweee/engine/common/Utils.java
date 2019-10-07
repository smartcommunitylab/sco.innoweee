package it.smartcommunitylab.innoweee.engine.common;

import java.io.IOException;
import java.io.InputStream;
import java.io.Reader;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.apache.commons.lang3.StringUtils;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;

import it.smartcommunitylab.innoweee.engine.model.Catalog;
import it.smartcommunitylab.innoweee.engine.model.Component;
import it.smartcommunitylab.innoweee.engine.model.Contribution;
import it.smartcommunitylab.innoweee.engine.model.ContributionPoint;
import it.smartcommunitylab.innoweee.engine.model.GarbageCollection;
import it.smartcommunitylab.innoweee.engine.model.Player;
import it.smartcommunitylab.innoweee.engine.model.Robot;
import it.smartcommunitylab.innoweee.engine.repository.CatalogRepository;
import it.smartcommunitylab.innoweee.engine.repository.GarbageCollectionRepository;
import it.smartcommunitylab.innoweee.engine.security.Authorization;
import it.smartcommunitylab.innoweee.engine.security.User;

public class Utils {
	private static ObjectMapper fullMapper = new ObjectMapper();
	static {
		Utils.fullMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		Utils.fullMapper.configure(DeserializationFeature.READ_ENUMS_USING_TO_STRING, true);
		Utils.fullMapper.configure(SerializationFeature.WRITE_ENUMS_USING_TO_STRING, true);
		Utils.fullMapper.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
		Utils.fullMapper.configure(SerializationFeature.INDENT_OUTPUT, false);
	}

	public static boolean isNotEmpty(String value) {
		boolean result = false;
		if ((value != null) && (!value.isEmpty())) {
			result = true;
		}
		return result;
	}
	
	public static boolean isEmpty(String value) {
		boolean result = true;
		if ((value != null) && (!value.isEmpty())) {
			result = false;
		}
		return result;
	}

	public static String getString(Map<String, String> data, String lang, String defaultLang) {
		String result = null;
		if(data.containsKey(lang)) {
			result = data.get(lang);
		} else {
			result = data.get(defaultLang);
		}
		return result;
	}
	
	public static String getUUID() {
		return UUID.randomUUID().toString();
	}
	
	public static JsonNode readJsonFromString(String json) throws JsonParseException, JsonMappingException, IOException {
		return Utils.fullMapper.readValue(json, JsonNode.class);
	}
	
	public static JsonNode readJsonFromReader(Reader reader) throws JsonProcessingException, IOException {
		return Utils.fullMapper.readTree(reader);
	}
	
	public static <T> List<T> readJSONListFromInputStream(InputStream in, Class<T> cls)
			throws IOException {
		List<Object> list = Utils.fullMapper.readValue(in, new TypeReference<List<?>>() {
		});
		List<T> result = new ArrayList<T>();
		for (Object o : list) {
			result.add(Utils.fullMapper.convertValue(o, cls));
		}
		return result;
	}
	
	public static <T> T toObject(Object in, Class<T> cls) {
		return Utils.fullMapper.convertValue(in, cls);
	}

	public static <T> T toObject(JsonNode in, Class<T> cls) throws JsonProcessingException {
		return Utils.fullMapper.treeToValue(in, cls);
	}

	public static Map<String,String> handleError(Exception exception) {
		Map<String,String> errorMap = new HashMap<String,String>();
		errorMap.put(Const.ERRORTYPE, exception.getClass().toString());
		errorMap.put(Const.ERRORMSG, exception.getMessage());
		return errorMap;
	}
	
	public static String getAuthKey(String tenantId, String role) {
		return tenantId + "__" + role;
	}

	public static String getAuthKey(String tenantId, String role, String... attributes) {
		String result = tenantId + "__" + role;
		for(String attribute : attributes) {
			result = result + "__" + attribute; 
		}
		return result;
	}
	
	public static boolean checkTenantId(String tenantId, User user) {
		for(String authKey : user.getRoles().keySet()) {
			List<Authorization> authList = user.getRoles().get(authKey);
			for(Authorization auth : authList) {
				if(auth.getTenantId().equals(tenantId)) {
					return true;
				}
			}
		}
		return false;
	}
	
	public static boolean checkTenantId(String tenantId, User user, String authKey) {
		List<Authorization> authList = user.getRoles().get(authKey);
		if((authList != null) && (authList.size() > 0)) {
			Authorization auth = authList.get(0);
			if(auth.getTenantId().equals(tenantId)) {
				return true;
			}
		}
		return false;
	}
	
	public static boolean checkRole(String role, User user) {
		for(String authKey : user.getRoles().keySet()) {
			List<Authorization> authList = user.getRoles().get(authKey);
			for(Authorization auth : authList) {
				if(auth.getRole().equals(role)) {
					return true;
				}
			}
		}
		return false;
	}
	
	public static boolean checkTenantIdAndRole(String tenantId, String role, User user) {
		for(String authKey : user.getRoles().keySet()) {
			List<Authorization> authList = user.getRoles().get(authKey);
			for(Authorization auth : authList) {
				if(auth.getTenantId().equals(tenantId)) {
					if(auth.getRole().equals(role)) {
						return true;
					}
				}
			}
		}
		return false;
	}
	
	public static List<String> getUserRoles(User user) {
		List<String> result = new ArrayList<>();
		for(String authKey : user.getRoles().keySet()) {
			List<Authorization> authList = user.getRoles().get(authKey);
			for(Authorization auth : authList) {
				if(!result.contains(auth.getRole())) {
					result.add(auth.getRole());
				}
			}
		}
		return result;
	}
	
	public static List<String> getUserTenantIds(User user) {
		List<String> result = new ArrayList<>();
		for(String authKey : user.getRoles().keySet()) {
			List<Authorization> authList = user.getRoles().get(authKey);
			for(Authorization auth : authList) {
				if(!result.contains(auth.getTenantId())) {
					result.add(auth.getTenantId());
				}
			}
		}
		return result;
	}
	
	public static Date getStartOfTheDay(Date date) {
		Calendar cal = new GregorianCalendar();
		cal.setTime(date);
    cal.set(Calendar.HOUR_OF_DAY, 0);
    cal.set(Calendar.MINUTE, 0);
    cal.set(Calendar.SECOND, 0);
    cal.set(Calendar.MILLISECOND, 0);
    return cal.getTime();
	}
	
	public static Date getEndOfTheDay(Date date) {
		Calendar cal = new GregorianCalendar();
		cal.setTime(date);
    cal.set(Calendar.HOUR_OF_DAY, 23);
    cal.set(Calendar.MINUTE, 59);
    cal.set(Calendar.SECOND, 59);
    cal.set(Calendar.MILLISECOND, 999);
    return cal.getTime();
	}
	
	public static String getTopic(String tenantId, String playerId) {
		return "/topic/item." + tenantId + "." + playerId;
	}
	
	public static void addNewRobot(Player player, CatalogRepository catalogResopitory) {
		Robot robot = new Robot();
		Catalog catalog = catalogResopitory.findByTenantId(player.getTenantId());
		if(catalog != null) {
			for(Component component : catalog.getComponents().values()) {
				if(StringUtils.isEmpty(component.getParentId())) {
					// default customization
					robot.getComponents().put(component.getComponentId(), component);
				}
			}
			player.setRobot(robot);			
		}
	}
	
	public static void setContributions(Player player, String tenantId, String gameId,
			GarbageCollectionRepository garbageCollectionRepository) {
		List<GarbageCollection> list = garbageCollectionRepository.findByGameId(tenantId, gameId);
		for(GarbageCollection garbageCollection : list) {
			Contribution contribution = new Contribution();
			contribution.setGarbageCollectionName(garbageCollection.getNameGE());
			contribution.setGarbageCollectionId(garbageCollection.getObjectId());
			player.getContributions().add(contribution);
		}
	}
	
	public static boolean checkDonation(Player player, String nameGE) {
		for(Contribution contribution : player.getContributions()) {
			if(contribution.getGarbageCollectionName().equals(nameGE)) {
				if(contribution.getDonatedPoints().size() > 0) {
					return true;
				}
			}
		}
		return false;
	}
	
	public static void sendContribution(Player player, String nameGE, 
			Map<String, Double> costMap) {
		for(Contribution contribution : player.getContributions()) {
			if(contribution.getGarbageCollectionName().equals(nameGE)) {
				ContributionPoint contributionPoint = new ContributionPoint();
				contributionPoint.setPlayerId(player.getObjectId());
				contributionPoint.setPlayerName(player.getName());
				contributionPoint.setCostMap(costMap);
				contributionPoint.setTimestamp(new Date());
				contribution.getDonatedPoints().add(contributionPoint);
			}
		}
	}
	
	public static void receiveContribution(Player player, String nameGE, 
			Map<String, Double> costMap) {
		for(Contribution contribution : player.getContributions()) {
			if(contribution.getGarbageCollectionName().equals(nameGE)) {
				ContributionPoint contributionPoint = new ContributionPoint();
				contributionPoint.setPlayerId(player.getObjectId());
				contributionPoint.setPlayerName(player.getName());
				contributionPoint.setCostMap(costMap);
				contributionPoint.setTimestamp(new Date());
				contribution.getReceivedPoints().add(contributionPoint);
			}
		}
	}

}
