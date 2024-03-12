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
    ,Arc_key:"Arc"

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
		
}