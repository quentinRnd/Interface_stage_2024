import {id}from "./id.js"
import {errors}from "./error.js"

import * as d3 from "https://cdn.skypack.dev/d3@7.6.1";
//import * as d3 from "../third-party/D3/d3.v7.min.js";

const  information={error:"is-danger",info:"is-info"}

function select_tab(id_tab,id_tab_content)
{
	for (const tab in id.tab_id) {
		let tab_html=document.getElementById(tab)
		tab_html.classList.remove("is-active")
	} 
	for (const tab in id.tab_content)
		{
			let tab_html=document.getElementById(tab)
		tab_html.classList.add("is-hidden")
		}
	
	let tab=document.getElementById(id_tab)
	tab.classList.add("is-active")
	let tab_content=document.getElementById(id_tab_content)
	tab_content.classList.remove("is-hidden")
}

function remove_information(id_erreur,type_information)
{
	let erreur_page=document.getElementById(id.erreur_page)
	erreur_page.classList.add("is-hidden")
	while(erreur_page.firstChild)
	{
		erreur_page.removeChild(erreur_page.firstChild)
	}
	erreur_page.classList.remove(type_information)
	if(id_erreur!=null)
	{
		for(let i =0;i<id_erreur.length;++i)
			{
				let id=id_erreur[i]
				document.getElementById(id).classList.remove(type_information)
			}
	}
}

function add_information(erreur,information_type,id_erreur=null)
{
	let erreur_page=document.getElementById(id.erreur_page)
	erreur_page.classList.remove("is-hidden")
	erreur_page.classList.add(information_type)
	let p =document.createElement("p")
	p.textContent=erreur

	if(id_erreur!=null)
	{
		
		for(let i =0;i<id_erreur.length;++i)
		{
			let id=id_erreur[i]
			document.getElementById(id).classList.add(information_type)
			
		}
		
	}
	erreur_page.appendChild(p)

	setTimeout(()=>remove_information(id_erreur,information_type), 10000)

}
// This method is responsible for drawing the graph, returns the drawn network
function drawGraph(dataJson) {
	sessionStorage.setItem(id.stockage_solution_session,JSON.stringify(dataJson))
	
	//offre la possibilitée de telecharger le json solution
	document.getElementById(id.button_download_solution).classList.remove("is-hidden")
	
	let solution=dataJson[id.key_json_solution]
	console.log(dataJson)
	let solution_proposer=solution[id.Solutions_key][solution[id.Solutions_key].length-1]
	let data_x=solution[id.Coordonee_pdi_x_key]
	let data_y=solution[id.Coordonee_pdi_y_key]
	let depart=solution_proposer[id.Start_pdi_key]
	let taille_rayon=20
	let circuit =solution_proposer[id.Circuit_key]
	let presence_pdi=solution_proposer[id.Presence_pdi_key]
	let width=0
	let height=0

	console.log(solution)

	// ces offset serve pour les graphe avec des valeurs négative
	let offsetx=0
	let offsety=0
	//les deucx variable servent a savoir quelle sont les départ et l'arriver du graphe pour les colorier d'une autre manièreS
	let depart_circuit=circuit[0][0]
	let arriver_circuit=circuit[0][0]

	for(let i=0;i<circuit.length;++i)
	{
		if(depart[depart_circuit]>depart[circuit[i][0]])
		{
			depart_circuit=circuit[i][0]
		}
		if(depart[arriver_circuit]<depart[circuit[i][0]])
		{
			arriver_circuit=circuit[i][0]
		}
	}

	for (let i=0;i<data_x.length;++i)
	{
		if(data_x[i]<offsetx)
		{
			offsetx=data_x[i]
		}
		if(data_y[i]<offsety)
		{
			offsety=data_y[i]
		}
	}

	offsetx= -offsetx 
	offsety= -offsety
	let offsetdefault=20
	offsetx+= offsetdefault
	offsety+= offsetdefault
	//sert a scale la figure pour mieux voire les donnée
	let scale=20

	for(let i=0;i<data_x.length;++i)
	{
		data_x[i]+=offsetx
		data_y[i]+=offsety

		data_x[i]*=scale
		data_y[i]*=scale

	}

	for(let i=0;i<data_x.length;++i)
	{
		if(data_x[i]>width)
		{
			width=data_x[i]
		}
		if(data_y[i]>height)
		{
			height=data_y[i]
		}

	}
	/*var svg = d3.select("#"+id.div_solution_display).append("svg")
            .attr("width", width+100)
            .attr("height", height+100)
            .style('background-color', 'lightgrey')*/
	var svg = d3.select("#"+id.div_solution_display).append("svg")
		.attr('viewBox',`0 0 ${width+50} ${height+50}` )
        .attr('preserveAspectRatio','xMinYMin')
		.style('background-color', 'lightgrey');
	
	
	for(let i=0;i<circuit.length;++i)
	{
		let k=circuit[i][0]
		let j=circuit[i][1]
		
		// Add the path using this helper function
		
		svg.append('line')
		.attr('x1', data_x[k])
		.attr('y1', data_y[k])
		.attr('x2', data_x[j])
		.attr('y2', data_y[j])
		.attr('stroke', 'black')
	}
	for(let i=0;i<data_x.length;++i)
	{		
		let x=data_x[i]
		let y=data_y[i]

		svg.append("circle")
		.attr("cx",x )
		.attr("cy", y)
		.attr("opacity", 0.5)
		.attr("fill", (i==depart_circuit?"green":(i==arriver_circuit?"red":(presence_pdi[i]?"blue":"white"))))
		.attr("r", taille_rayon);
		
		svg.append("text")
		.attr("x", x-5)
		.attr("y", y+5)
		.attr('stroke', 'black')
  		.style("font-size", 19)
  		.text(depart[i]);

		  svg.append("text")
		  .attr("x", x-(taille_rayon))
		  .attr("y", y-taille_rayon)
		  .attr('stroke', 'black')
			.style("font-size", 19)
			.text("PDI : "+i);
	}
}

function display_solution(dataJson)
{
	console.log("display solution")
	console.log(dataJson)
	
	var solution_display=document.getElementById(id.div_solution_display)
	while(solution_display.hasChildNodes())
	{
		solution_display.removeChild(solution_display.firstChild)
	}
	drawGraph(dataJson)

}

function check_parametres()
{
	let error=false
	let distance_wrong=false
	let nbvisite_wrong=false
	for(let id_parameter in id.search_parameter)
	{
		
		let field=document.getElementById(id_parameter)
		let value_field= Number.parseInt(field.value) 


		if(!Number.isInteger(value_field))
		{
			add_information(errors.wrong_value_int,information.error,[id_parameter])
			error=true
		}
		switch(id_parameter)
		{
			case id.search_parameter.preference_elevation:
			case id.search_parameter.preference_foret:
			case id.search_parameter.preference_lac:
			case id.search_parameter.preference_nature:
			case id.search_parameter.preference_riviere:
			case id.search_parameter.preference_ville:
			{
				if(value_field>10 || value_field<0)
				{
					add_information(errors.wrong_value_preference,information.error,[id_parameter])
					error=true
				}
			}break;

			case id.search_parameter.distance_Max:
			case id.search_parameter.distance_Min:
			case id.search_parameter.nombre_visite_max:
			case id.search_parameter.nombre_visite_min:
			{
				if(!distance_wrong && Number.parseInt(document.getElementById(id.search_parameter.distance_Max).value)<Number.parseInt(document.getElementById(id.search_parameter.distance_Min).value))
				{
					error=true
					distance_wrong=true
					add_information(errors.wrong_value_min_max,information.error,[id.search_parameter.distance_Max,id.search_parameter.distance_Min])
				}
				if(!nbvisite_wrong&&Number.parseInt(document.getElementById(id.search_parameter.nombre_visite_max).value)<Number.parseInt(document.getElementById(id.search_parameter.nombre_visite_min).value))
				{
					error=true
					nbvisite_wrong=true
					add_information(errors.wrong_value_min_max,information.error,[id.search_parameter.nombre_visite_max,id.search_parameter.nombre_visite_min])
				}
			}break;
			
			


		}

		

	}

	if(!error)
	{
		add_information(errors.all_good,information.info,[])
	}else{
		select_tab(id.tab_id.config_search_tab,id.tab_content.search_config)
	}

	return !error
}

function sendData(Formdata) {
	
	fetch
	(
		id.root_url, 
		{
			method: "POST",
			headers: 
			{ 	
			}
			,"Content-Type": "multipart/form-data"
			,body: Formdata,
		}
	)
		// Successful response
		
		.then(response =>response.json().then(
												data=> {
													display_solution(data)
													//console.log(data)
						  								}
											).catch(err=>console.log("error parsing the response json",err))
			 )
		.catch(err => console.error(err))
	;
}

function FormDataDefault()
{
	let formdata=new FormData()
	formdata.append(id.ajax_request,true)
	return formdata
}
//thing to do when you send a csv to solve
function sendCsvAnimation()
{

	document.getElementById(id.button_download_solution).classList.add("is-hidden")

	var solution_display=document.getElementById(id.div_solution_display)
	while(solution_display.hasChildNodes())
	{
		solution_display.removeChild(solution_display.firstChild)
	}
	document.getElementById(id.status_solve).classList.add("is-hidden")

}

//event to trigger the load of an csv data by the user
document.getElementById(id.input_csv_data).addEventListener("change",(e)=>{
	let file=e.target.files[0]
	let formData=FormDataDefault()
	formData.append(id.ajax_file_csv,true)
	formData.append("file",file)
	
	if(!check_parametres())
	{
		return 
	}

	let parameter={}
	for(let param in id.search_parameter)
	{
		parameter[param]=Number.parseInt(document.getElementById(param).value) 
	}
	console.log(parameter)
	formData.append(id.formdataparameter,JSON.stringify(parameter) )
	sendCsvAnimation()
	sendData(formData) 

})

//event to trigger the input file hidden
document.getElementById(id.button_csv_data).addEventListener("click",(e)=>{
	document.getElementById(id.input_csv_data).click()
})

function download(content, fileName, contentType) {
    var a = document.createElement("a");
    var file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}

//event to dowload the solution.json
document.getElementById(id.button_download_solution).addEventListener("click",(e)=>{
	let json=sessionStorage.getItem(id.stockage_solution_session)
	if(json!=null)
	{
		download(json,"solution.json","application/json")
	}else{
		//creer une erreur
	}
})




document.getElementById(id.input_solution_json).addEventListener("change",(e)=>{
	let file=e.target.files[0]
    let read = new FileReader();

	read.readAsBinaryString(file);

	read.onloadend = function(){
		let json ={}

		json[id.key_json_solution]=JSON.parse(read.result)

		sendCsvAnimation()

		drawGraph(json)
	}

	//drawGraph(JSON.parse(file)) 
})

//event to import solution json to display the solution
document.getElementById(id.button_solution_json).addEventListener("click",(e)=>{
	document.getElementById(id.input_solution_json).click()
})

function onload()
{
	var solution=sessionStorage.getItem(id.stockage_solution_session)
	if(solution!=null)
	{
		sendCsvAnimation()
		let json =JSON.parse(solution)
		console.log(json)
		drawGraph(json)
		console.log()
	}

	
	document.getElementById(id.tab_id.config_search_tab).addEventListener("click",()=>{select_tab(id.tab_id.config_search_tab,id.tab_content.search_config)})
	document.getElementById(id.tab_id.solution_tab).addEventListener("click",()=>{select_tab(id.tab_id.solution_tab,id.tab_content.vizualize_solution)})
	select_tab(id.tab_id.config_search_tab,id.tab_content.search_config)
	
	document.getElementById(id.button_check_parameters).addEventListener("click",()=>{check_parametres()})
}
onload()