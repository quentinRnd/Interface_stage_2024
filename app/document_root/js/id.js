export const id={
    //id du bouton permettant d'envoyer le csv
    button_csv_data:"button_csv_data"
    //input du csv data qui est cacher qui permet d'afficher selectionner csv
    ,input_csv_data:"input_csv_data"
    //identifiant dans le send data pour le dire que c'est l'ajax
    ,ajax_request:"ajax_request"
    //route du controleur principal pour l'envoyer des donnée
    ,root_url:"/"
    //identifiant pour le fichier csv
    ,ajax_file_csv:"ajax_file_csv"
    //identifiant qui permet d'afficher le 
    ,div_solution_display:"div_solution_display"

    // id to put in the formdata the different parameters of the modele
    ,formdataparameter:"parameters"
    

    //clé pour les solution trouver par le pycsp3
    ,key_error_array:"errors"
    // clé pour les erreur rencontré lors de l'éxecuition du main controleur dans le json renvoyer
    ,key_json_solution:"json_solution"
    //#cle pour récupérer les solution du modèle
    ,Solutions_key:"Solutions"
    //#cle pour les coordonée x des pdi
    ,Coordonee_pdi_x_key:"coordonee_pdi_x"
    //#cle pour les coordonée y des pdi
    ,Coordonee_pdi_y_key:"coordonee_pdi_y"
    //#cle pour les temps de visite de chaque pdi
    ,Temps_visite_key:"Temps_visite"
    //#cle pour les score des pdi
    ,Score_pdi_key:"Score_pdi"
    //#cle pour savoir la presence des pdi dans la solutions 
    ,Presence_pdi_key:"Presence_pdi"
    //#cle pour savoir l'heure de départ des pdi
    ,Start_pdi_key:"Start_pdi"
    //cle pour recupéré les arc des differente solution
    ,Circuit_key:"Circuit"

    //input file et button pour que l'utilisateur puisse visualiser une solution qu'il a déjà calculer précedement
	,input_solution_json:"input_solution_json"
	,button_solution_json:"button_solution_json"
	
    //boutton qui permet de télecharge les solutions de l'instance visualisée
	,button_download_solution:"button_download_solution"
	
    //identifiant dans la session html ou on stocke le fichier json des solution a télécharger
	,stockage_solution_session:"stockage_solution_session"

    //statut du solver 
	,status_solve:"status_solve"

    //sert a mettre du texte ou une liste d'erreur
	,status_display:"status_display"

    //clé pour la sauvegarde de la tab selectionner
    ,selected_tab:"selected_tab"

    
    ,html:{
        timeline_circuit:"timeline_circuit"
        ,solution_management:"solution_management"
    }
    ,input:{
        input_zoom:"input_zoom"
    }
    
    ,data_sessionstorage:{
        stockage_instance:"stockage_instance"
        ,stockage_scale:"stockage_scale"
    }

    ,instance_json:{
        instance_data_key:"instance_data"
        //sert a savoir dans quelle catégorie sont les chemins entre les pdi
        ,Categorie_chemin_pdi_key:"Categorie_chemin_pdi"
        //cle pour les score des pdi 
        ,Score_pdi_key:"Score_pdi"
        
        ,X_PDI:"X_PDI"
        ,Y_PDI:"Y_PDI"
        ,Score_pdi:"Score_pdi"
        ,Temps_visite:"Temps_visite"
        ,Cout_entrer:"Cout_entrer"
        ,Heure_ouverture:"Heure_ouverture"
        ,Heure_fermeture:"Heure_fermeture"
        ,Categorie:"Categorie"
        ,Capacite:"Capacite"
        ,Categorie_chemin_pdi:"Categorie_chemin_pdi"
    }
    ,tab_id:
    {
        config_search_tab:"config_search_tab"
        ,solution_tab:"solution_tab"
    }
    ,tab_content:
    {
        search_config:"search_config"
        ,vizualize_solution:"vizualize_solution"
    }
    ,button:
    {
        button_loading:"button_loading"
        ,input_display_instance:"input_display_instance"
    }
    ,file:{
        file_display_instance:"file_display_instance"
    }

    ,request_id:{
        exemple_request:"exemple_request"
        ,execute_exemple:"execute_exemple"
    }
    ,response_id:{
        exemple_response:"exemple_response"
    }
    ,select_exemple:"select_exemple"

    ,button_check_parameters:"button_check_parameters"
    ,button_loading_exemple:"button_loading_exemple"
    ,search_parameter:{
        preference_nature:"preference_nature"
        ,preference_ville:"preference_ville"
        ,timeout_solver:"timeout_solver"
        ,preference_elevation:"preference_elevation"
        ,preference_foret:"preference_foret"
        ,preference_lac:"preference_lac"
        ,preference_riviere:"preference_riviere"
        ,distance_Min:"distance_Min"
        ,distance_Max:"distance_Max"
        ,budget_Max:"budget_Max"
        ,nombre_visite_min:"nombre_visite_min"
        ,nombre_visite_max:"nombre_visite_max"
        ,max_temps_visite:"max_temps_visite"
        ,trailInterresement:"trailInterresement"
        ,poiInterresement:"poiInterresement"
    }
    ,erreur_page:"erreur_page"
    
}