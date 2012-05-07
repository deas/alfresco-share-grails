//
// This script is executed by Grails after plugin was installed to project.
// This script is a Gant script so you can use all special variables provided
// by Gant (such as 'baseDir' which points on project base dir). You can
// use 'ant' to access a global instance of AntBuilder
//
// For example you can create directory under project tree:
//
//    ant.mkdir(dir:"${basedir}/grails-app/jobs")
Ant.sequential {
	event("StatusUpdate", [
		"Copying alfresco share resources from to $basedir/web-app"
	])
	ant.copy(todir: "$basedir/web-app", file : "$alfrescoSharePluginDir/src/web-app/site-index.jsp" )
	ant.copy(todir: "$basedir/web-app/WEB-INF", file: "$alfrescoSharePluginDir/src/web-app/WEB-INF/alfresco-share-servlet.xml" )
	ant.copy(todir: "$basedir/web-app/WEB-INF", file: "$alfrescoSharePluginDir/src/web-app/WEB-INF/urlrewrite.xml" )
	ant.copy(todir: "$basedir/web-app/WEB-INF", file: "$alfrescoSharePluginDir/src/web-app/WEB-INF/surf.xml" )
}
event("StatusFinal", [
	"Static alfresco share resources copied successfully"
])
