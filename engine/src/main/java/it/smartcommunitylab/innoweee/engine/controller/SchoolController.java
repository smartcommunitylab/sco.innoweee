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
import it.smartcommunitylab.innoweee.engine.model.School;
import it.smartcommunitylab.innoweee.engine.repository.SchoolRepository;


@RestController
public class SchoolController extends AuthController {
	private static final transient Logger logger = LoggerFactory.getLogger(SchoolController.class);
	
	@Autowired
	private SchoolRepository schoolRepository;
	
	@GetMapping(value = "/api/school/{tenantId}/{instituteId}")
	public @ResponseBody List<School> searchSchool(
			@PathVariable String tenantId, 
			@PathVariable String instituteId,
			HttpServletRequest request, 
			HttpServletResponse response) throws Exception {
		List<School> result = new ArrayList<>();
		List<School> list = schoolRepository.findByInstituteId(tenantId, instituteId);
		for(School school : list) {
			//TODO TEST
			result.add(school);			
//			if(validateAuthorization(tenantId, instituteId, school.getObjectId(), null, 
//				Const.AUTH_RES_School, Const.AUTH_ACTION_READ, request)) {
//				result.add(school);
//			}
		}
		logger.info("searchSchool[{}]:{}", tenantId, result.size());
		return result;
	}
	
	@PostMapping(value = "/api/school")
	public @ResponseBody School addSchool(
			@RequestBody School school, 
			HttpServletRequest request, 
			HttpServletResponse response) throws Exception {
		if(!validateAuthorization(school.getTenantId(), school.getInstituteId(), 
				Const.AUTH_RES_School, Const.AUTH_ACTION_ADD, request)) {
			throw new UnauthorizedException("Unauthorized Exception: token or role not valid");
		}
		Date now = new Date();
		school.setCreationDate(now);
		school.setLastUpdate(now);
		schoolRepository.save(school);
		logger.info("addSchool[{}]:{}", school.getTenantId(), school.getObjectId());
		return school;
	}

	@PutMapping(value = "/api/school")
	public @ResponseBody School updateSchool(
			@RequestBody School school,  
			HttpServletRequest request, 
			HttpServletResponse response) throws Exception {
		Optional<School> optional = schoolRepository.findById(school.getObjectId());
		if(optional.isEmpty()) {
			throw new EntityNotFoundException("entity not found");
		}
		if(!validateAuthorization(school.getTenantId(), school.getInstituteId(), school.getObjectId(), 
				Const.AUTH_RES_School, Const.AUTH_ACTION_UPDATE, request)) {
			throw new UnauthorizedException("Unauthorized Exception: token or role not valid");
		}
		Date now = new Date();
		school.setLastUpdate(now);
		schoolRepository.save(school);
		logger.info("updateSchool[%s]:%s", school.getTenantId(), school.getObjectId());
		return school;
	}
	
	@DeleteMapping(value = "/api/school/{objectId}")
	public @ResponseBody School deleteSchool(
			@PathVariable String objectId, 
			HttpServletRequest request, 
			HttpServletResponse response) throws Exception {
		Optional<School> optional = schoolRepository.findById(objectId);
		if(optional.isEmpty()) {
			throw new EntityNotFoundException("entity not found");
		}
		School school = optional.get();
		if(!validateAuthorization(school.getTenantId(), school.getInstituteId(), school.getObjectId(), 
				Const.AUTH_RES_School, Const.AUTH_ACTION_DELETE, request)) {
			throw new UnauthorizedException("Unauthorized Exception: token or role not valid");
		}
		schoolRepository.deleteById(objectId);
		logger.info("deleteSchool[{}]:{}", school.getTenantId(), objectId);
		return school;
	}
	
}
