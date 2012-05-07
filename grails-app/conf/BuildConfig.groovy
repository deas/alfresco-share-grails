grails.project.class.dir = "target/classes"
grails.project.test.class.dir = "target/test-classes"
grails.project.test.reports.dir = "target/test-reports"
grails.project.target.level = 1.6
// grails.project.source.level = 1.6
//grails.project.war.file = "target/${appName}-${appVersion}.war"


grails.project.dependency.resolution = {
    // inherit Grails' default dependencies
    inherits("global") {
    }
    log "warn" // log level of Ivy resolver, either 'error', 'warn', 'info', 'debug' or 'verbose'
    repositories {
        grailsCentral()
        // uncomment the below to enable remote dependency resolution
        // from public Maven repositories
        mavenLocal()
		mavenRepo "http://vcs.contentreich.de/m2/"
        mavenCentral()
		mavenRepo "http://maven.alfresco.com/nexus/content/groups/public/"
		mavenRepo "http://maven.alfresco.com/nexus/content/repositories/thirdparty/"
        //mavenRepo "http://snapshots.repository.codehaus.org"
        //mavenRepo "http://repository.codehaus.org"
        //mavenRepo "http://download.java.net/maven/2/"
        //mavenRepo "http://repository.jboss.com/maven2/"
    }
	/*
	 * Welcome to dependency hell !
	 */
    dependencies {
		// excludes "myfaces-api", "myfaces-impl", "servlet-api", "jsp-api", "chemistry-opencmis-test-util", "activation", "jaxb-api"
		//, "jcl-over-slf4j"
		// jul-to-slf4j ?
		// "jstl"
		// junit-3.8.jar ?
		// stax-api-1.0.1.jar <-> stax-api-1.0-2.jar
		// htmlparser-1.0.5.jar <-> htmlparser-1.6.jar 
		// vs geronimo-activation_1.0.2_spec-1.1.jar
		// def springSurfVersion = "1.0"
		// classifier
		/*
		htmlparser-1.0.5.jar
		htmlparser-1.6.jar
		facebook_070716.jar
		freemarker-2.3.18-patched.jar
		*/
        // specify dependencies here under either 'build', 'compile', 'runtime', 'test' or 'provided' scopes eg.
		// http://jira.grails.org/browse/GRAILS-6147
		// Spring surf jars broken !
		/*
		 * Broken spring-webscripts-api-1.0.0.jar
		 * Built-By: mindthegab
		 * Build-Jdk: 1.6.0_24
		 * 
		 * SCM-Revision: 903
		 * Built-By: David Draper
         * Build-Jdk: 1.6.0_20
         * SCM-Revision: 946
         * git svn find-rev r946
         * dc4e6e760d0570d4bec213a7aaba18e732c4c35d
         * 
         * 
         * 
         * spring-cmis-framework-1.0.0.jar
         * spring-surf-core-configservice-1.0.0.jar
         * Built-By: Kevin
         * Build-Jdk: 1.6.0_22
         * SCM-Revision: 904
         * 907 81cb08d0c486775fdfc477695bb899feefdc1c88
         * 
         * spring-surf-core-1.0.0.jar
         * Built-By: David Draper
         * Build-Jdk: 1.6.0_20
         * SCM-Revision: 958
         * 731e5e0a72b0911936ff48840ca87c072e503e55
         * 
         * spring-surf-1.0.0.jar
         * Built-By: Kevin
         * Build-Jdk: 1.6.0_22
         * SCM-Revision: 957
         * 0558d68fce62e23d67c0b2ff0db3bb5945f931ed
         * 
         * spring-webscripts-1.0.0.jar
         * Built-By: David Draper
         * Build-Jdk: 1.6.0_20
         * SCM-Revision:
         * 
         * spring-webscripts-api-1.0.0.jar
         * spring-surf-api-1.0.0.jar
         * 
         * Built-By: David Draper
         * Build-Jdk: 1.6.0_20
         * SCM-Revision: 946
         * dc4e6e760d0570d4bec213a7aaba18e732c4c35d
		 */
		compile (
/*			
			    'org.springframework.extensions.surf:spring-surf:1.0.0',
				'org.springframework.extensions.surf:spring-surf-api:1.0.0',
				'org.springframework.extensions.surf:spring-cmis-framework:1.0.0',
*/				
				'org.springframework.extensions.surf:spring-surf:1.0.0_4.0.d',
				'org.springframework.extensions.surf:spring-surf-api:1.0.0_4.0.d',
				'org.springframework.extensions.surf:spring-cmis-framework:1.0.0_4.0.d',
		// compile 'org.alfresco:alfresco-core:4.0.d-fixes'// :community
		// compile 'org.alfresco:alfresco-share:4.0.d-fixes'// :community
				'org.alfresco.cmis.client:alfresco-opencmis-extension:0.2',
		// compile 'alfresco-web-framework-commons:4.0.d-fixes'// :community
				'org.apache.chemistry.opencmis:chemistry-opencmis-client-api:0.6.0',
				'org.apache.chemistry.opencmis:chemistry-opencmis-client-impl:0.6.0', // 0.3.0 get picked up otherwise
				'org.apache.chemistry.opencmis:chemistry-opencmis-commons-impl:0.6.0', // 0.3.0 get picked up otherwise
				'org.apache.chemistry.opencmis:chemistry-opencmis-client-bindings:0.6.0', // 0.3.0 get picked up otherwise
				'org.codehaus.guessencoding:guessencoding:1.4',
				'org.tuckey:urlrewritefilter:3.2.0')
		{
			excludes "myfaces-api", "myfaces-impl", "servlet-api", "jsp-api", "chemistry-opencmis-test-util", "activation", "jaxb-api", "stax-api"
			// These just don't work "geronimo-activation_1.0.2_spec", "geronimo-stax-api_1.0_spec"
			/*
			excludes([ group: 'xml-apis', name: 'xml-apis'],
				[ group: 'org.apache.httpcomponents' ],
				[ name: 'commons-logging' ])*/
		}
		compile ('org.apache.abdera:abdera-extensions-html:0.4.0-incubating')
		{
			excludes([ group: 'nu.validator.htmlparser', name: 'htmlparser']) //, [(...)])
		}
		/*
		compile ('org.jvnet.staxex:stax-ex:1.2') {
			excludes([ group: 'javax.xml.stream', name: 'stax-api'])
		}
		*/ 
		/*
		compile ('org.apache.abdera:abdera-parser:0.4.0-incubating') {
			excludes([ group: 'org.apache.geronimo.specs', name: 'geronimo-stax-api_1.0_spec'])
		}
		*/
		/*
		abdera-client-0.4.0-incubating.jar
		abdera-core-0.4.0-incubating.jar
		abdera-extensions-json-0.4.0-incubating.jar
		abdera-i18n-0.4.0-incubating.jar
		abdera-parser-0.4.0-incubating.jar
		activation-1.1.jar
		alfresco-core-4.0.d.jar
		alfresco-jlan-embed-4.0.d.jar
		alfresco-opencmis-extension-0.2.jar
		alfresco-share-4.0.d.jar
		alfresco-web-framework-commons-4.0.d.jar
		axiom-api-1.2.5.jar
		axiom-impl-1.2.5.jar
		chemistry-opencmis-client-api-0.6.0.jar
		chemistry-opencmis-client-bindings-0.6.0.jar
		chemistry-opencmis-client-impl-0.6.0.jar
		chemistry-opencmis-commons-api-0.6.0.jar
		chemistry-opencmis-commons-impl-0.6.0.jar
		commons-beanutils-1.7.0.jar
		commons-codec-1.4.jar
		commons-collections-3.1.jar
		commons-digester-1.6.jar
		commons-el.jar
		commons-fileupload-1.2.1.jar
		commons-httpclient-3.1.jar
		commons-io-1.4.jar
		commons-logging-1.1.1.jar
		dom4j-1.6.1.jar
		facebook_070716.jar
		freemarker-2.3.18-patched.jar
		guessencoding-1.0.jar
		htmlparser-1.6.jar
		jaxb-impl-2.1.11.jar
		jaxen-1.1-beta-8.jar
		jaxws-api-2.1.jar
		jaxws-rt-2.1.7.jar
		json.jar
		json-simple-1.1.jar
		jta.jar
		log4j-1.2.15.jar
		mimepull-1.3.jar
		myfaces-api-1.1.8.jar
		myfaces-impl-1.1.8.jar
		org.springframework.aop-3.0.5.RELEASE.jar
		org.springframework.asm-3.0.5.RELEASE.jar
		org.springframework.beans-3.0.5.RELEASE.jar
		org.springframework.context-3.0.5.RELEASE.jar
		org.springframework.context.support-3.0.5.RELEASE.jar
		org.springframework.core-3.0.5.RELEASE.jar
		org.springframework.expression-3.0.5.RELEASE.jar
		org.springframework.jdbc-3.0.5.RELEASE.jar
		org.springframework.orm-3.0.5.RELEASE.jar
		org.springframework.transaction-3.0.5.RELEASE.jar
		org.springframework.web-3.0.5.RELEASE.jar
		org.springframework.web.servlet-3.0.5.RELEASE.jar
		resolver-20050927.jar
		rhino-js-1.6R7.jar
		spring-cmis-framework-1.0.0.jar
		spring-surf-1.0.0.jar
		spring-surf-api-1.0.0.jar
		spring-surf-core-1.0.0.jar
		spring-surf-core-configservice-1.0.0.jar
		spring-webscripts-1.0.0.jar
		spring-webscripts-api-1.0.0.jar
		stax-api-1.0.1.jar
		stax-ex-1.2.jar
		streambuffer-0.9.jar
		urlrewritefilter-3.1.0.jar
		*/
    }

    plugins {
        build(":tomcat:$grailsVersion",
              ":release:1.0.0") {
            export = false
        }
    }
}
