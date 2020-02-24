/**
 *    Copyright 2015 Fondazione Bruno Kessler - Trento RISE
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */

package it.smartcommunitylab.innoweee.engine.controller;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import it.smartcommunitylab.innoweee.engine.common.Const;
import it.smartcommunitylab.innoweee.engine.exception.EntityNotFoundException;
import it.smartcommunitylab.innoweee.engine.exception.UnauthorizedException;
import it.smartcommunitylab.innoweee.engine.model.Institute;
import it.smartcommunitylab.innoweee.engine.repository.InstituteRepository;


@RestController
public class InstituteController extends AuthController {
	private static final transient Logger logger = LoggerFactory.getLogger(InstituteController.class);
			
	@Autowired
	private InstituteRepository instituteRepository;

	@GetMapping(value = "/api/institute/{tenantId}")
	public @ResponseBody List<Institute> searchInstitute(
			@PathVariable String tenantId, 
			HttpServletRequest request, 
			HttpServletResponse response) throws Exception {
		List<Institute> result = new ArrayList<>();
		List<Institute> list = instituteRepository.findByTenantId(tenantId);
		for(Institute institute : list) {
			if(validateAuthorization(tenantId, institute.getObjectId(), null, null, 
				Const.AUTH_RES_Institute, Const.AUTH_ACTION_READ, request)) {
				result.add(institute);
			}
		}
		logger.info("searchInstitute[{}]:{}", tenantId, result.size());
		return result;
	}
	
	@PostMapping(value = "/api/institute")
	public @ResponseBody Institute addInstitute(
			@RequestBody Institute institute, 
			HttpServletRequest request, 
			HttpServletResponse response) throws Exception {
		if(!validateAuthorization(institute.getTenantId(), 
				Const.AUTH_RES_Institute, Const.AUTH_ACTION_ADD, request)) {
			throw new UnauthorizedException(Const.ERROR_CODE_ROLE + "role not valid");
		}
		Date now = new Date();
		if(StringUtils.isEmpty(institute.getObjectId())) {
			institute.setCreationDate(now);
		}
		institute.setLastUpdate(now);
		instituteRepository.save(institute);
		logger.info("addInstitute[{}]:{}", institute.getTenantId(), institute.getObjectId());
		return institute;
	}

	@PutMapping(value = "/api/institute")
	public @ResponseBody Institute updateInstitute(
			@RequestBody Institute institute, 
			HttpServletRequest request, 
			HttpServletResponse response) throws Exception {
		Optional<Institute> optional = instituteRepository.findById(institute.getObjectId());
		if(optional.isEmpty()) {
			throw new EntityNotFoundException("entity not found");
		}
		if(!validateAuthorization(institute.getTenantId(), institute.getObjectId(),
				Const.AUTH_RES_Institute, Const.AUTH_ACTION_UPDATE, request)) {
			throw new UnauthorizedException(Const.ERROR_CODE_ROLE + "role not valid");
		}
		Date now = new Date();
		institute.setLastUpdate(now);
		instituteRepository.save(institute);
		logger.info("updateSchool[{}]:{}", institute.getTenantId(), institute.getObjectId());
		return institute;
	}
	
	@DeleteMapping(value = "/api/institute/{objectId}")
	public @ResponseBody Institute deleteInstitute(
			@PathVariable String objectId, 
			HttpServletRequest request, 
			HttpServletResponse response) throws Exception {
		Optional<Institute> optional = instituteRepository.findById(objectId);
		if(optional.isEmpty()) {
			throw new EntityNotFoundException("entity not found");
		}
		Institute institute = optional.get();
		if(!validateAuthorization(institute.getTenantId(), objectId,  
				Const.AUTH_RES_Institute, Const.AUTH_ACTION_DELETE, request)) {
			throw new UnauthorizedException(Const.ERROR_CODE_ROLE + "role not valid");
		}
		instituteRepository.deleteById(objectId);
		logger.info(String.format("deleteInstitute[{}]:{}", institute.getTenantId(), objectId));
		return institute;
	}
		
}
