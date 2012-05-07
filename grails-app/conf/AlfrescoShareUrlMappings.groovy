class AlfrescoShareUrlMappings {
	// Alfresco !
	static excludes = [
		"/page/**",
		"/p/**",
		"/proxy/*",
		"/service/*",
		"/feedservice/*",
		"/res/*",
		"/system/*"
	]

	static mappings = {
		/*
		"/$controller/$action?/$id?"{
			constraints {
				// apply constraints here
			}
		}

		"/"(view:"/index")
		"500"(view:'/error')
		*/
	}
}
