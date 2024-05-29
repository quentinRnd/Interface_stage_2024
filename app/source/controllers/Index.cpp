#include "Index.hh"
#include <iostream>

#include <fstream>


#include<json/value.h>
#include<json/json.h>

/*
fonction qui sert a retourner la commande utiliser pour executer le stricpt python qui résout les csp
*/
std::string commande_python_csp(std::string const& nom_fichier_instance,std::string const& nom_fichier_settings)
{
	return "python3 "+config::python_config::path_to_csp+"/Modele4.py --f "+nom_fichier_instance +" --s "+nom_fichier_settings;
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
				files.front().saveAs("./"+config::python_config::path_to_csp+"/"+config::python_config::path_instance+"/"+nom_instance+".json");
				
				/*
				modifier les paramètre de recherche en fonction des utilisateurs.ices
				*/
				//int timeout_solver(std::stoi(req_parameter.find(config::json_response::formdataparameter)));
				Json::Value parameter_json;
				Json::Reader reader;

				reader.parse(req_parameter.find(config::json_response::formdataparameter)->second,parameter_json);
				
				std::ifstream settings_default_file(config::python_config::path_to_csp+"/"+config::python_config::path_settings+"/"+config::python_config::settings_choose+".json");
  				std::ifstream profile_default_file(config::python_config::path_to_csp+"/"+config::python_config::path_profil_marcheur+"/"+config::python_config::profil_choose+".json");
  				

				Json::Value settings_json,profile_json;

				reader.parse(settings_default_file, settings_json);
				reader.parse(profile_default_file, profile_json);
				
				std::string nom_fichier_perso(nom_instance+".json");

				profile_json[config::profile_marcheureuse::preference_marche_key][config::profile_marcheureuse::foret_key]=parameter_json[config::html::preference_util::preference_foret];
				profile_json[config::profile_marcheureuse::preference_marche_key][config::profile_marcheureuse::nature_key]=parameter_json[config::html::preference_util::preference_nature];
				profile_json[config::profile_marcheureuse::preference_marche_key][config::profile_marcheureuse::lac_key]=parameter_json[config::html::preference_util::preference_lac];
				profile_json[config::profile_marcheureuse::preference_marche_key][config::profile_marcheureuse::elevation_key]=parameter_json[config::html::preference_util::preference_elevation];
				profile_json[config::profile_marcheureuse::preference_marche_key][config::profile_marcheureuse::riviere_key]=parameter_json[config::html::preference_util::preference_riviere];
				profile_json[config::profile_marcheureuse::preference_marche_key][config::profile_marcheureuse::ville_key]=parameter_json[config::html::preference_util::preference_ville];

				profile_json[config::profile_marcheureuse::budget_max_key]=parameter_json[config::html::preference_util::budget_Max];
				profile_json[config::profile_marcheureuse::distance_parcourue_max_key]=parameter_json[config::html::preference_util::distance_Max];
				profile_json[config::profile_marcheureuse::distance_parcourue_min_key]=parameter_json[config::html::preference_util::distance_Min];
				profile_json[config::profile_marcheureuse::Temps_max_visite_key]=parameter_json[config::html::preference_util::max_temps_visite];
				profile_json[config::profile_marcheureuse::Max_visite_pdi_key]=parameter_json[config::html::preference_util::nombre_visite_max];
				profile_json[config::profile_marcheureuse::Min_visite_pdi_key]=parameter_json[config::html::preference_util::nombre_visite_min];
				profile_json[config::profile_marcheureuse::poiInterresement]=parameter_json[config::profile_marcheureuse::poiInterresement];
				profile_json[config::profile_marcheureuse::interet_chemin_key]=parameter_json[config::html::preference_util::trailInterresement];
				


				settings_json[config::settingsjson::inter_solution_key]=true;
				settings_json[config::settingsjson::solution_algo_custom_key]=true;
				settings_json[config::settingsjson::type_objectif_inter_solution]=config::settingsjson::Maximise_score_chemin;
				settings_json[config::settingsjson::type_objectif_key]=config::settingsjson::Maximise_chemin_pdi;
				settings_json[config::settingsjson::profile_marcheureuse_choisie_key]=nom_instance+".json";
				settings_json[config::settingsjson::timout_solution_inter_key]=parameter_json[config::html::preference_recherche::timeout_solver];
				settings_json[config::settingsjson::Timeout_solver_key]=parameter_json[config::html::preference_recherche::timeout_solver];
				settings_json[config::settingsjson::repertoire_solution_key]=config::python_config::path_solution;

				

				std::ofstream settings_perso_file(config::python_config::path_to_csp+"/"+config::python_config::path_settings+"/"+nom_fichier_perso,std::ios::trunc);
  				std::ofstream profile_perso_file(config::python_config::path_to_csp+"/"+config::python_config::path_profil_marcheur+"/"+nom_fichier_perso,std::ios::trunc);
  				
				settings_perso_file << settings_json;
				profile_perso_file << profile_json;
				
				
				profile_perso_file.close();
				settings_perso_file.close();

				/*
				changer le lacement de pycsp3 pour qu'il prenne le settings personalisé
				*/
				


				int retour(std::system(commande_python_csp(nom_instance,nom_fichier_perso).c_str()));
				if (retour==0)
				{
					std::string nom_fichier_solution(config::python_config::path_to_csp+"/"+config::python_config::path_solution+"/"+nom_instance+".json");
					// Using fstream to get the file pointer in file
  					std::ifstream file(nom_fichier_solution);
  					Json::Value actualJson;

					// Using the reader, we are parsing the json file
  					reader.parse(file, actualJson);
					Json::FastWriter fastWriter;
					json_response[config::json_response::key_json_solution]=actualJson;
					file.close();
					std::remove(nom_fichier_solution.c_str());
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