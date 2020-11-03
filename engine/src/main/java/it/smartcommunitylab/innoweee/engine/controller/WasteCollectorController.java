package it.smartcommunitylab.innoweee.engine.controller;

import java.util.Optional;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
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
import it.smartcommunitylab.innoweee.engine.manager.ItemEventManager;
import it.smartcommunitylab.innoweee.engine.manager.WasteCollectorManager;
import it.smartcommunitylab.innoweee.engine.model.CollectorReport;
import it.smartcommunitylab.innoweee.engine.model.Game;
import it.smartcommunitylab.innoweee.engine.model.ItemEvent;
import it.smartcommunitylab.innoweee.engine.model.ItemReport;
import it.smartcommunitylab.innoweee.engine.model.Player;
import it.smartcommunitylab.innoweee.engine.model.School;
import it.smartcommunitylab.innoweee.engine.model.WasteCollectorAction;
import it.smartcommunitylab.innoweee.engine.repository.GameRepository;
import it.smartcommunitylab.innoweee.engine.repository.PlayerRepository;
import it.smartcommunitylab.innoweee.engine.repository.SchoolRepository;

@RestController
public class WasteCollectorController extends AuthController {
	private static final transient Logger logger = LoggerFactory.getLogger(WasteCollectorController.class);
	
	@Autowired
	private WasteCollectorManager wasteCollectorManager;
	@Autowired
	private ItemEventManager itemEventManager;
	@Autowired
	private PlayerRepository playerRepository;
	@Autowired
	private GameRepository gameRepository; 
	@Autowired
	private SchoolRepository schoolRepository;

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
	
	@GetMapping(value = "/api/collector/item/{tenantId}/find")
	public @ResponseBody ItemReport findItem(
			@PathVariable String tenantId,
			@RequestParam String itemId,
			HttpServletRequest request) throws Exception {
		if(!validateRole(Const.ROLE_COLLECTOR_OPERATOR, tenantId, request)) {
			throw new UnauthorizedException("Unauthorized Exception: token or role not valid");
		}
		ItemReport report = null;
		ItemEvent itemEvent = itemEventManager.findByItemId(itemId);
		if(itemEvent != null) {
			report = new ItemReport(itemEvent);
			if(Utils.isNotEmpty(itemEvent.getPlayerId())) {
				Optional<Player> optionalPlayer = playerRepository.findById(itemEvent.getPlayerId());
				if(optionalPlayer.isPresent()) {
					Player player = optionalPlayer.get();
					report.setPlayerName(player.getName());
					Optional<Game> optionalGame = gameRepository.findById(player.getGameId());
					if(optionalGame.isPresent()) {
						Game game = optionalGame.get();
						Optional<School> optionalSchool = schoolRepository.findById(game.getSchoolId());
						if(optionalSchool.isPresent()) {
							School school = optionalSchool.get();
							report.setSchoolName(school.getName());
						}
					}
				}				
			}
		}
		logger.info("findItem[{}]:{} / {}", tenantId, itemId, report);
		return report;
	}
	
	@PostMapping(value = "/api/collector/item/{tenantId}/check")
	public @ResponseBody ItemEvent itemChecked(
			@PathVariable String tenantId,
			@RequestParam String itemId,
			@RequestParam boolean broken,
			@RequestParam(required=false) String itemType,
			@RequestParam(required=false) String note,
			@RequestParam String collector,
			HttpServletRequest request) throws Exception {
		if(!validateRole(Const.ROLE_COLLECTOR_OPERATOR, tenantId, request)) {
			throw new UnauthorizedException("Unauthorized Exception: token or role not valid");
		}
		ItemEvent itemEvent = itemEventManager.findByItemId(itemId);
		if(itemEvent == null) {
			throw new EntityNotFoundException(Const.ERROR_CODE_ENTITY + "item not found");
		}
		if(!itemEvent.isReusable() && !itemEvent.isValuable() &&
				(itemEvent.getState() == Const.ITEM_STATE_DISPOSED)) {
			itemEvent.setCollector(collector);
			//if(itemEvent.getState() == Const.ITEM_STATE_CONFIRMED) {
			//	itemEvent.addStateNote("not in DISPOSED state");
			//}
			if(itemEvent.isBroken() ^ broken) {
				itemEvent.addStateNote("BROKEN flag changed");
			}
			if(Utils.isNotEmpty(itemType)) {
				if(!itemEvent.getItemType().equalsIgnoreCase(itemType)) {
					itemEvent.addStateNote("TYPE changed:" + itemType);
				}
			}
			if(Utils.isNotEmpty(note)) {
				itemEvent.setNote(note);
			}
			itemEventManager.itemChecked(itemEvent);
		} else {
			throw new EntityNotFoundException(Const.ERROR_CODE_APP + "item state not compatible");
		}
		logger.info("itemChecked[{}]:{}", tenantId, itemId);
		return itemEvent; 
	}
	
	@PostMapping(value = "/api/collector/item/{tenantId}/unexpected")
	public @ResponseBody ItemEvent itemUnexpected(
			@PathVariable String tenantId,
			@RequestParam String itemId,
			@RequestParam String itemType,
			@RequestParam boolean broken,
			@RequestParam(required=false) String note,
			@RequestParam String collector,
			HttpServletRequest request) throws Exception {
		if(!validateRole(Const.ROLE_COLLECTOR_OPERATOR, tenantId, request)) {
			throw new UnauthorizedException("Unauthorized Exception: token or role not valid");
		}
		ItemEvent itemEvent = itemEventManager.findByItemId(itemId);
		if(itemEvent == null) {
			itemEvent = new ItemEvent();
			itemEvent.setItemId(itemId);
			itemEvent.setItemType(itemType);
			itemEvent.setBroken(broken);
			itemEvent.setTenantId(tenantId);
			itemEvent.setTimestamp(System.currentTimeMillis());
		}
		if(itemEvent.isBroken() ^ broken) {
			itemEvent.addStateNote("BROKEN flag changed");
		}
		if(!itemEvent.getItemType().equals(itemType)) {
			itemEvent.addStateNote("TYPE changed " + itemType);
		}
		if(Utils.isNotEmpty(note)) {
			itemEvent.setNote(note);
		}
		itemEvent.setCollector(collector);
		itemEventManager.itemUnexpected(itemEvent);
		logger.info("itemUnexpected[{}]:{}", tenantId, itemId);
		return itemEvent; 
	}
	
	@GetMapping(value = "/api/collector/item/{tenantId}/report")
	public @ResponseBody CollectorReport operatorReport(
			@PathVariable String tenantId,
			@RequestParam String collector,
			HttpServletRequest request) throws Exception {
		if(!validateRole(Const.ROLE_COLLECTOR_OPERATOR, tenantId, request)) {
			throw new UnauthorizedException("Unauthorized Exception: token or role not valid");
		}
		CollectorReport report = wasteCollectorManager.getOperatorReport(tenantId, collector);
		logger.info("operatorReport[{}]:{}", tenantId, report);
		return report;
	}
	
	
}
