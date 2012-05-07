/*
 * deas - http://www.contentreich.de
 *
 * Created on May 3, 2012
 * 
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package de.contentreich.extensions.webscripts.servlet.mvc;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.extensions.webscripts.servlet.mvc.ResourceController;
import org.springframework.web.context.support.ServletContextResource;

public class GrailsResourceController extends ResourceController {
	private static Log logger = LogFactory
			.getLog(GrailsResourceController.class);
	private String pluginPrefix;// plugin/alfresco-share-0.1

	public void setPluginPrefix(String pluginPrefix) {
		this.pluginPrefix = pluginPrefix;
	}

	@Override
	public boolean dispatchResource(final String path,
			HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		boolean resolved = false;
		// final boolean debug = logger.isDebugEnabled();
		// serve back the resource from the web application (if it exists)
		if (pluginPrefix != null) {
			String pathWithPrefix = pluginPrefix + "/" + path;
			ServletContextResource resource = new ServletContextResource(
					getServletContext(), "/" + pathWithPrefix);
			if (resource.exists()) {
				// dispatch to resource
				if (logger.isDebugEnabled())
					logger.debug("...dispatching resource from web application ServletContext.");
				commitResponse(pathWithPrefix, resource, request, response);
				resolved = true;
			}
		}
		if (resolved) {
			return resolved;
		}
		return super.dispatchResource(path, request, response);
	}

}
