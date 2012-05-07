import static grails.util.Environment.DEVELOPMENT
import static grails.util.Environment.getCurrentEnvironment

class AlfrescoShareGrailsPlugin {
	// the plugin version
	def version = "0.1"
	// the version or versions of Grails the plugin is designed for
	def grailsVersion = "2.0 > *"
	// the other plugins this plugin depends on
	def dependsOn = [:]
	// resources that are excluded from plugin packaging
	def pluginExcludes = [
		"grails-app/views/error.gsp"
	]

	// TODO Fill in these fields
	def title = "Alfresco Share Plugin" // Headline display name of the plugin
	def author = "Andreas Steffan"
	def authorEmail = "a.steffan@contentreich.de"
	def description = '''\
POC Plugin showing how grails can swallow alfresco share.
'''

	// URL to the plugin's documentation
	def documentation = "http://grails.org/plugin/alfresco-share"

	// Extra (optional) plugin metadata

	// License: one of 'APACHE', 'GPL2', 'GPL3'
	//    def license = "APACHE"

	// Details of company behind the plugin (if there is one)
	//    def organization = [ name: "My Company", url: "http://www.my-company.com/" ]

	// Any additional developers beyond the author specified above.
	//    def developers = [ [ name: "Joe Bloggs", email: "joe@bloggs.net" ]]

	// Location of the plugin's issue tracker.
	//    def issueManagement = [ system: "JIRA", url: "http://jira.grails.org/browse/GPMYPLUGIN" ]

	// Online location of the plugin's browseable source code.
	//    def scm = [ url: "http://svn.grails-plugins.codehaus.org/browse/grails-plugins/" ]

	def doWithWebDescriptor = { webXml ->
		/*
		 def mappingElement = webXml.'servlet-mapping'
		 def lastMapping = mappingElement[mappingElement.size() - 1]
		 lastMapping + {
		 'servlet-mapping' {
		 'servlet-name'("grails")
		 'url-pattern'("*.dispatch")
		 }
		 }
		 */
		def contextParam = webXml.'context-param'
		// def urlRewriteConfig = currentEnvironment == DEVELOPMENT ? "/WEB-INF/urlrewrite.xml" : "/WEB-INF/urlrewrite-production.xml"
		def urlRewriteConfig = "/WEB-INF/urlrewrite.xml"

		contextParam[contextParam.size() - 1] + {
			/*
			 'filter' {
			 'description'('Set HTTP cache Expires header 30 days forward for a mapping.')
			 'filter-name'('CacheExpiresFilter')
			 'filter-class'('org.alfresco.web.scripts.servlet.StaticAssetCacheFilter')
			 'init-param' {
			 'description'('Add an Expires Header 30 days forward')
			 'param-name'('expires')
			 'param-value'('30')
			 }
			 }
			 */
			'filter' {
				'description'('MT authentication support - NOTE: does not support portlets')
				'filter-name'('MTAuthentationFilter')
				'filter-class'('org.alfresco.web.site.servlet.MTAuthenticationFilter')
			}
			'filter' {
				'description'('Redirects view and service URLs to the dispatcher servlet')
				'filter-name'('UrlRewriteFilter')
				'filter-class'('org.tuckey.web.filters.urlrewrite.UrlRewriteFilter')
				'init-param' {
					'param-name'('confPath')
					'param-value'(urlRewriteConfig)
				}
			}
			/*
			 'filter' {
			 'description'('Share SSO authentication support filter')
			 'filter-name'('Authentication Filter')
			 'filter-class'(org.alfresco.web.site.servlet.SSOAuthenticationFilter.name)
			 'init-param' {
			 'param-name'('endpoint')
			 'param-value'('alfresco')
			 }
			 }
			 */
		}
		def filter = webXml.'filter'
		filter[filter.size() - 1] + {
			/*
			 'filter-mapping'{
			 'filter-name'('CacheExpiresFilter')
			 'url-pattern'('*.jpg')
			 }
			 'filter-mapping'{
			 'filter-name'('CacheExpiresFilter')
			 'url-pattern'('*.png')
			 }
			 'filter-mapping'{
			 'filter-name'('CacheExpiresFilter')
			 'url-pattern'('*.gif')
			 }
			 'filter-mapping'{
			 'filter-name'('CacheExpiresFilter')
			 'url-pattern'('*.css')
			 }
			 'filter-mapping'{
			 'filter-name'('CacheExpiresFilter')
			 'url-pattern'('*.js')
			 }*/		
			/*
			'filter-mapping'{
				'filter-name'('Authentication Filter')
				'url-pattern'('/page/*')
			}
			'filter-mapping'{
				'filter-name'('Authentication Filter')
				'url-pattern'('/p/*')
			}
			'filter-mapping'{
				'filter-name'('Authentication Filter')
				'url-pattern'('/proxy/*')
			}
			*/
			'filter-mapping'{
				'filter-name'('UrlRewriteFilter')
				'url-pattern'('/proxy/*')
			}
			'filter-mapping'{
				'filter-name'('UrlRewriteFilter')
				'url-pattern'('/service/*')
			}
			'filter-mapping'{
				'filter-name'('UrlRewriteFilter')
				'url-pattern'('/feedservice/*')
			}
			'filter-mapping'{
				'filter-name'('UrlRewriteFilter')
				'url-pattern'('/res/*')
			}
			'filter-mapping'{
				'filter-name'('UrlRewriteFilter')
				'url-pattern'('/system/*')
			}
			'filter-mapping'{
				'filter-name'('MTAuthentationFilter')
				'url-pattern'('/page/*')
			}
			'filter-mapping'{
				'filter-name'('UrlRewriteFilter')
				'url-pattern'('/p/*')
			}
		}

		def listener = webXml.'listener'
		listener[listener.size() - 1] + {
			'servlet' {
				'servlet-name'('alfresco-share')
				'servlet-class'(org.springframework.web.servlet.DispatcherServlet.name)
				// 
				// 'init-param' {
				// 'param-name'('contextAttribute')
				// 'param-value'('org.springframework.web.context.WebApplicationContext.ROOT')
				// }
				'load-on-startup'('1')
			}
		}

		def servlet = webXml.'servlet'
		servlet[servlet.size() - 1] + {
			'servlet-mapping' {
				'servlet-name'('alfresco-share')
				'url-pattern'('/page/*')
			}
			'servlet-mapping' {
				'servlet-name'('alfresco-share')
				'url-pattern'('/p/*')
			}
		}
	}

	def doWithSpring = {
		// Hack ! AbstractStoreObjectPersister.java
		// org.springframework.beans.factory.BeanDefinitionStoreException: Invalid bean definition with name 'webframework.webinf.persister.root' defined in URL [jar:file:/home/deas/.grails/ivy-cache/org.springframework.extensions.surf/spring-surf/jars/spring-surf-1.0.0.jar!/org/springframework/extensions/surf/spring-surf-model-context.xml]: Could not resolve placeholder 'objectTypeIds'
		// Error creating bean with name 'handlerMappings' defined in ServletContext resource [/WEB-INF/classes/surf-config.xml]: Cannot resolve reference to bean 'pathMatcher' while setting		bean property 'pathMatcher'; nested exception is org.springframework.beans.factory.NoSuchBeanDefinitionException: No bean named 'pathMatcher' is defined
		// http://static.springsource.org/spring/docs/3.1.x/spring-framework-reference/html/mvc.html#mvc-ann-requestmapping-31-vs-30
		// http://forum.springsource.org/showthread.php?124742-Spring-migration-from-3-0-5-to-3-1-1
		/*
		 System.setProperty('objectTypeIds','${objectTypeIds}')
		 System.setProperty('objectTypeId','${objectTypeId}')
		 System.setProperty('objectId','${objectId}')
		 */
		// importBeans('classpath:/web-application-config.xml')
	}

	def doWithDynamicMethods = { ctx ->
		// TODO Implement registering dynamic methods to classes (optional)
	}

	def doWithApplicationContext = { applicationContext ->
		// TODO Implement post initialization spring config (optional)
	}

	def onChange = { event ->
		// TODO Implement code that is executed when any artefact that this plugin is
		// watching is modified and reloaded. The event contains: event.source,
		// event.application, event.manager, event.ctx, and event.plugin.
	}

	def onConfigChange = { event ->
		// TODO Implement code that is executed when the project configuration changes.
		// The event is the same as for 'onChange'.
	}

	def onShutdown = { event ->
		// TODO Implement code that is executed when the application shuts down (optional)
	}
}
