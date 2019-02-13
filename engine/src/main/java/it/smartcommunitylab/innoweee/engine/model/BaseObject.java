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

package it.smartcommunitylab.innoweee.engine.model;

import java.util.Date;

import org.apache.commons.lang3.StringUtils;
import org.springframework.data.annotation.Id;


public class BaseObject {
	@Id
	private String objectId;
	private String tenantId;
	private Date creationDate;
	private Date lastUpdate;

	public Date getCreationDate() {
		return creationDate;
	}

	public void setCreationDate(Date creationDate) {
		this.creationDate = creationDate;
	}

	public Date getLastUpdate() {
		return lastUpdate;
	}

	public void setLastUpdate(Date lastUpdate) {
		this.lastUpdate = lastUpdate;
	}

	public String getObjectId() {
		return objectId;
	}

	public void setObjectId(String objectId) {
		this.objectId = objectId;
	}

	public String getTenantId() {
		return tenantId;
	}

	public void setTenantId(String tenantId) {
		this.tenantId = tenantId;
	}
	
	@Override
	public boolean equals(Object obj) {
		boolean retVal = false;
		if (obj instanceof BaseObject) {
			BaseObject baseObject = (BaseObject) obj;
			if(!StringUtils.isEmpty(baseObject.getObjectId()) && 
					!StringUtils.isEmpty(objectId)) {
				retVal = this.objectId.equals(baseObject.getObjectId());
			}
		}
		return retVal;
	}

	@Override
	public int hashCode() {
		if(!StringUtils.isEmpty(objectId)) {
			return objectId.hashCode();
		}
		return super.hashCode();
	}
}
