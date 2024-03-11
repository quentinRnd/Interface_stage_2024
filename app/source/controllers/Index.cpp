#include "Index.hh"
#include <iostream>

#include <fstream>

#include <jsoncpp/json/json.h>
#include <jsoncpp/json/value.h>

/*
fonction qui sert a retourner la commande utiliser pour executer le stricpt python qui résout les csp
*/
std::string commande_python_csp(std::string const& nom_fichier_instance)
{
	return "python3 "+config::python_config::path_to_csp+"/Modele1.py -f "+nom_fichier_instance;
}

void Index::asyncHandleHttpRequest(const drogon::HttpRequestPtr & req, std::function<void(const drogon::HttpResponsePtr &)> && callback)
{
	LOG_INFO << "session @" << req->session()->sessionId() << ": " << req->getMethodString() << " " << req->getPath();
	
	drogon::MultiPartParser req_multi_part;
    req_multi_part.parse(req);
    const std::map<std::string,std::string> & req_parameter(req_multi_part.getParameters());
	//on regarde si la requête que l'on reçois est une requête json 
	if(req_parameter.find(config::html::ajax_request)!=req_parameter.end())
	{
		drogon::HttpResponsePtr resp(nullptr);
		Json::Value json_response;
		if(req_parameter.find(config::html::ajax_file_csv)!=req_parameter.end())
		{
			// on est dans le cas ou on a reçu un fichier csv
			std::vector<drogon::HttpFile> files( req_multi_part.getFiles());
			if(files.size()!=1)
			{
				json_response[config::json_response::key_error_array].append(config::error::error_no_file);
				//erreur il ne peut y avoir que un fichier
				
			}else{
				std::string nom_instance(req->session()->sessionId());
				files.front().saveAs("./"+config::python_config::path_to_csp+"/"+config::python_config::path_instance+"/"+nom_instance+".csv");
				int retour(std::system(commande_python_csp(nom_instance).c_str()));
				if (retour==0)
				{
					// Using fstream to get the file pointer in file
  					std::ifstream file(config::python_config::path_to_csp+"/"+config::python_config::path_solution+"/"+nom_instance+".json");
  					Json::Value actualJson;
  					Json::Reader reader;

					// Using the reader, we are parsing the json file
  					reader.parse(file, actualJson);
					Json::FastWriter fastWriter;
					json_response[config::json_response::key_json_solution]=actualJson;

					//json_response[config::json_response::key_json_solution].append(config::error::error_no_file);
				}
				else{
					/*
					il y'a eu une erreur lors de l'éxecution du fichier
					*/
					json_response[config::json_response::key_error_array].append(config::error::error_no_file);
				}
			}
		}
		callback(drogon::HttpResponse::newHttpJsonResponse(json_response));

	}else{
		callback(drogon::HttpResponse::newHttpViewResponse("index_view"));
	}
}