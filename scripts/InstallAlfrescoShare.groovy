includeTargets << grailsScript("_GrailsInit")
includeTargets << grailsScript("_GrailsEvents")

// http://stackoverflow.com/questions/2876348/copying-a-folder-from-pluginbasedir-to-the-target-project
target(main: "Merge alfresco share web resources into application") {
	Ant.sequential {
		event("StatusUpdate", ["Copying alfresco share resources from to $basedir/web-app"])
		ant.copy(todir: "$basedir/web-app", file : "$alfrescoSharePluginDir/src/web-app/site-index.jsp" )
		ant.copy(todir: "$basedir/web-app/WEB-INF", file: "$alfrescoSharePluginDir/src/web-app/WEB-INF/alfresco-share-servlet.xml" )
		ant.copy(todir: "$basedir/web-app/WEB-INF", file: "$alfrescoSharePluginDir/src/web-app/WEB-INF/urlrewrite.xml" )
		ant.copy(todir: "$basedir/web-app/WEB-INF", file: "$alfrescoSharePluginDir/src/web-app/WEB-INF/surf.xml" )
	}
	event("StatusFinal", ["Static alfresco share resources copied successfully"])
}

setDefaultTarget(main)