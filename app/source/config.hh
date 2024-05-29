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
		const std::string path_instance("Instance_json");
		const std::string path_solution("solution");
		const std::string path_settings("settings_recherche");
		const std::string path_profil_marcheur("profile_marcheur");
		const std::string settings_choose("settings_default");
		const std::string profil_choose("profile_1");	
		 
		
	}
	namespace profile_marcheureuse
	{
		//sert a recuperer un objet qui contient différente préférence utilisateur.ice
		const std::string preference_marche_key("préférence marche");
		//sert a savoir les préférence en terme de nature de la personne 
		const std::string nature_key("nature");
		//sert a savoir les préférence en terme de ville de la personne 
		const std::string ville_key("ville");
		//sert a savoir les préférence en terme d'élévation des chemin emprintée de la personne 
		const std::string elevation_key("élevation");
		//sert a savoir les préférence en terme de forêt de la personne 
		const std::string foret_key("foret");
		//sert a savoir les préférence en terme de lac de la personne
		const std::string lac_key("lac");
		//sert a savoir les préférence en terme de rivière de la personne
		const std::string riviere_key("rivière");

		//représente la distance minimum a parcourir par les personnes
		const std::string distance_parcourue_min_key("distance parcourue min");
		//représente la distance maximum a parcourir par les personnes
		const std::string distance_parcourue_max_key("distance parcourue max");
		//représente le budget maximum a dépenser dans les point d'intérêt visiter
		const std::string budget_max_key("budget max");
		//représente le temps max de visite de tout les point d'intérêt dans le chemin
		const std::string Temps_max_visite_key("Temps max visite");

		//sert a savoir le nombre de vsite maximal par jour
		const std::string Max_visite_pdi_key("Max_visite_pdi");

		//sert a savoir le nombre de visite maximal par jour 
		const std::string Min_visite_pdi_key("Min_visite_pdi");

		//sert a mettre un score d'interressement sur les poi
		const std::string poiInterresement("poiInterresement");

		//sert a savoir l'interêt de l'utilisateur.ice envers les chemin 
		const std::string interet_chemin_key("interet_chemin");

	}

	namespace settingsjson{
		//sert a savoir si on utilise l'algo custom pour résoudre les temps des chemins
		const std::string solution_algo_custom_key("solution_algo_custom");

		//clé permettant de savoir si on génère des solution intermediaire ou pas 
		const std::string inter_solution_key("inter_solution");

		//fonction objectif
		const std::string Maximise_score_chemin("Maximise_score_chemin");

		const std::string Maximise_chemin_pdi("Maximise_chemin_pdi");

		//cle servant a savoir quelle profile on a selectionner dans le repertoire
		const std::string profile_marcheureuse_choisie_key("profile_marcheureuse_choisie");

		// c'est le paramètre qui gére quelle fonction objectif est choisie 
		const std::string type_objectif_key("type_objectif");

		const std::string type_objectif_inter_solution("type_objectif_inter_solution");


		//sert a savoir quelle était le temps de timout au moment de la résolution
		const std::string Timeout_solver_key("timeout_solver");

		//clé pour le timeout des solution intermediaire 
		const std::string timout_solution_inter_key("timout_solution_inter");

		//repertoire dans lequel sont stocker les solutions 
		const std::string repertoire_solution_key("repertoire_solution");
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

		// id to put in the formdata the different parameters of the modele
     	const std::string formdataparameter("parameters");

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

		//input file et button pour que l'utilisateur puisse visualiser une solution qu'il a déjà calculer précedement
		const std::string input_solution_json("input_solution_json");
		const std::string button_solution_json("button_solution_json");

		//boutton qui permet de télecharge les solutions de l'instance visualisée
		const std::string button_download_solution("button_download_solution");

		//identifiant dans la session html ou on stocke le fichier json des solution a télécharger
		const std::string stockage_solution_session("stockage_solution_session");
		
		

		//sert a mettre du texte ou une liste d'erreur
		const std::string status_display("status_display");
		//statut du solver qui permet de retirer ou de mettre cette element en hidden 
		const std::string status_solve("status_solve");
		
		//bouton qui sert a verifier les information des paramètre 
		const std::string button_check_parameters("button_check_parameters");
		
		//sert a afficher des erreurs 
		const std::string erreur_page("erreur_page");
		
		const std::string timeline_circuit("timeline_circuit");

		namespace content_tab {
			//configuration de la recherche, permet de retirer ou de mettre cette element en hidden 
			const std::string search_config("search_config");

			const std::string vizualize_solution("vizualize_solution");	

		}

		namespace tab{
			//identifiant pour le tab de configuration de la recherche 
			const std::string config_search_tab("config_search_tab");
			
			//identifiant pour le tab de visualisation des solutions 
			const std::string solution_tab("solution_tab");

		}
		namespace preference_recherche{
			//identifiant pour le timeout du solver
			const std::string timeout_solver("timeout_solver");


			
		}
		namespace preference_util{
			//id html pour savoir quelle sont les préférence en terme de nature
			const std::string preference_nature("preference_nature");
			
			//id html pour savoir quelle sont les préférence en terme de ville
			const std::string preference_ville("preference_ville");
			
			//id html pour savoir quelle sont les préférence en terme de elevation
			const std::string preference_elevation("preference_elevation");
			
			//id html pour savoir quelle sont les préférence en terme de foret
			const std::string preference_foret("preference_foret");
			
			//id html pour savoir quelle sont les préférence en terme de lac
			const std::string preference_lac("preference_lac");

			//id html pour savoir quelle sont les préférence en terme de rivière
			const std::string preference_riviere("preference_riviere");
			
			//identifiant pour distance Minimal
			const std::string distance_Min("distance_Min");

			//identifiant pour distance Maximal
			const std::string distance_Max("distance_Max");

			//identifiant pour distance Minimal
			const std::string budget_Max("budget_Max");

			//identifiant pour nombre de visite Min
			const std::string nombre_visite_min("nombre_visite_min");

			//identifiant pour nombre de visite Max
			const std::string nombre_visite_max("nombre_visite_max");
			
			//identifiant pour nombre de visite Max
			const std::string max_temps_visite("max_temps_visite");

			//id html pour savoir quelle sont les préférence en terme de nature
			const std::string poiInterresement("poiInterresement");

			//id html pour savoir quelle sont les préférence en terme de nature
			const std::string trailInterresement("trailInterresement");
			
		}

		 
	}
};