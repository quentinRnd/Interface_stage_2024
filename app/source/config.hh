#pragma once

#include <string>

// Set constants used in code
namespace config
{
	// Drogon parameters used in main
	namespace main
	{
		const std::string ip("0.0.0.0");
		const std::string document_root("document_root");
		const int session_timeout(3600);
		const size_t threads(5);
	}

	// Path of URLs
	namespace url
	{
		const std::string root_url("/");
	}

	namespace python_config
	{
		const std::string path_to_csp("thirdparty/csp_resolve/Stage_Fac_2024");
		const std::string path_instance("Instancias");
		const std::string path_solution("solution");
	}
	namespace error
	{
		const std::string error_no_file("error no file provided by the request");
	}
	namespace json_response
	{
		// clé pour les erreur rencontré lors de l'éxecuition du main controleur dans le json renvoyer
		const std::string key_error_array("errors");
		//clé pour les solution trouver par le pycsp3
		const std::string key_json_solution("json_solution");
	}

	// Strings used in HTML
	namespace html
	{
		// Ajax request
		const std::string ajax_request("ajax_request");

		//input file fore the csv download
		const std::string input_csv_data("input_csv_data");
		//button to trigger the csv input file
		const std::string button_csv_data("button_csv_data");

		//id for the  csv in the querry ajax
		const std::string ajax_file_csv("ajax_file_csv");
		
		// id div where solution are display
		const std::string div_solution_display("div_solution_display");
		
	}
};