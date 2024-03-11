#include <drogon/HttpAppFramework.h>
#include <cstdlib>

#include"config.hh"

// Run drogon app
int main()
{
	// Drogon port given by environment
	uint16_t port;
	if (const char * port_str = std::getenv("INTERNAL_PORT"))
		port = std::atoi(port_str);

	// Fail to run
	else
	{
		LOG_FATAL << "INTERNAL_PORT environment variable must be set";
		return EXIT_FAILURE;
	}

	// Configure the app
	drogon::app()
		.addListener(config::main::ip, port)
		.setDocumentRoot(config::main::document_root)
		.enableSession(config::main::session_timeout)
		.setThreadNum(config::main::threads)
		.setFileTypes({"js", "css", "html", "ico", "mzn", "woff2", "mjs", "wasm", "data"})
		.registerCustomExtensionMime("mjs", "application/javascript")
	;

	// Run the app
	LOG_INFO << "Server running on http://" << config::main::ip << ":" << port;
	drogon::app().run();

	return EXIT_SUCCESS;
}