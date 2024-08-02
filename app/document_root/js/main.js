import {id}from "./id.js"
import {errors}from "./error.js"

import * as d3 from "https://cdn.skypack.dev/d3@7.6.1";
//import * as d3 from "./d3.min.js";


const  information={error:"is-danger",info:"is-info"}

const table_color=["is-primary","is-link","is-info","is-success","is-warning","is-danger","is-black","is-dark","is-light","is-white"]

function draw_timeline(dataJson) {
	while(document.getElementById(id.html.timeline_circuit).firstChild)
	{
		document.getElementById(id.html.timeline_circuit).removeChild(document.getElementById(id.html.timeline_circuit).firstChild)
	}
	document.getElementById(id.html.timeline_circuit).classList.remove("is-hidden")
	let solution=dataJson[id.key_json_solution]

	//solution que l'on choisie de montrer a l'utilisateur.ice
	let solution_proposer=solution[id.Solutions_key][solution[id.Solutions_key].length-1]	
	
	// circuit des pdi	
	let circuit =solution_proposer[id.Circuit_key]

	let table=document.createElement("table")
	table.classList.add("table")
	table.classList.add("is-fullwidth")
	//table.classList.add("is-bordered")
	

	//permet d'avoir les points de départ des pdi de la solution choisie
	let depart=solution_proposer[id.Start_pdi_key]
	
	let pdi_coord_x=solution[id.Coordonee_pdi_x_key]
	let pdi_coord_y=solution[id.Coordonee_pdi_y_key] 

	circuit.sort((a,b)=>depart[a[0]]>depart[b[0]])

	let presence_pdi=solution_proposer[id.Presence_pdi_key]

	let content=[]

	let temps_visite=solution[id.Temps_visite_key]

	let distance_circuit=0
	let visite_circuit=0

	content.push({text:`Your trail begins`,categorie:2})

	for(let i=0;i< circuit.length;++i)
	{
		let pdi=circuit[i][0]

		content.push({text:`POI ${pdi}`,categorie:0})
		if(presence_pdi[pdi])
		{
			content.push({text:`visiting during ${temps_visite[pdi]} unit of time`,categorie:1})
		}

		let distance=parseInt( Math.sqrt(Math.pow(pdi_coord_x[circuit[i][0]]-pdi_coord_x[circuit[i][1]],2)+Math.pow(pdi_coord_y[circuit[i][0]]-pdi_coord_y[circuit[i][1]],2)))

		content.push({text:`walk for ${distance} unit of length`})

		distance_circuit+=distance
		visite_circuit+=temps_visite[pdi]
	}
	content.push({text:`Your trail is finish`,categorie:2})
	
	let head=
	[	{text:"Your journey",weight:content.length}
		,{text:`visiting ${presence_pdi.reduce((partialsum,a)=>partialsum+0+a)} pdi`,weight:content.length}
		,{text:`walking during ${distance_circuit} unit of length`,weight:content.length}
		,{text:`visiting during ${visite_circuit} unit of time`,weight:content.length}
	]
	
	let thead=document.createElement("thead")

	for(let i=0;i<  head.length;++i)
	{
		let tr=document.createElement("tr")
		let th=document.createElement("th")
		th.setAttribute("colspan",`${head[i].weight}`)
		th.classList.add("has-text-centered")
		th.textContent=head[i].text
		tr.appendChild(th)
		thead.appendChild(tr)
	}

	table.appendChild(thead)

	let tr_body=document.createElement("tr")
	let tbody=document.createElement("tbody")
	
	for(let i =0;i<content.length;++i)
	{
		let td =document.createElement("td")
		td.textContent=content[i].text
		td.classList.add(table_color[content[i].categorie] )
		td.classList.add("has-text-centered")
		tr_body.appendChild(td)
	}
	tbody.appendChild(tr_body)
	table.appendChild(tbody)

	document.getElementById(id.html.timeline_circuit).appendChild(table)
	//document.getElementById(id.html.timeline_circuit).classList.remove("is-hidden")
}

function draw_instance(dataJson)
{
	
	clean_session_storage(id.data_sessionstorage.stockage_instance)

	if(dataJson==null)
	{
		//sortie de la fonction il n'y a pas de solution dans le json 
		add_information(errors.instance_wrong,information.error)
		return;
	}
	

	let data_x=dataJson[id.instance_json.X_PDI]
	let data_y=dataJson[id.instance_json.Y_PDI]

	let nodes_data=[]

	let score_pdi=dataJson[id.instance_json.Score_pdi]

	//sert a aerer le graphe
	let scale=sessionStorage.getItem(id.data_sessionstorage.stockage_scale)

	for(let i=0;i<data_x.length;++i)
	{
		let d={
			id:`PDI ${i}`
			,x:data_x[i]*scale
			,y:data_y[i]*scale
			,score:score_pdi[i]
			,group:1
			,heure_ouverture:dataJson[id.instance_json.Heure_ouverture][i]
			,heure_fermeture:dataJson[id.instance_json.Heure_fermeture][i]
			,Cout_entrer:dataJson[id.instance_json.Cout_entrer][i]
			,Temps_visite:dataJson[id.instance_json.Temps_visite][i]
			
			}
		
			d.title=d.id+` \n score ${d.score} \nheure ouverture ${d.heure_ouverture}\nheure fermeture ${d.heure_fermeture}\nCout entrer ${d.Cout_entrer}\nTemps visite ${d.Temps_visite}` 
			nodes_data.push(d)
	}
	// les lien dans le graphe
	let links_data=[]

	let valuation_chemin=dataJson[id.instance_json.Categorie_chemin_pdi]

	for(let i=0 ;i<data_x.length;++i)
	{
		for(let j=0 ;j<data_x.length;++j)
		{
			
			let start=i
			let end=j
			if(valuation_chemin[start][end]!=null)
			{
				
				
				let distance=Math.sqrt(Math.pow(nodes_data[start].x-nodes_data[end].x,2)+Math.pow(nodes_data[start].y-nodes_data[end].y,2))
				distance=Math.round(distance)
				links_data.push({
					source:nodes_data[start].id
					,target:nodes_data[end].id
					,value:2
					,title:`distance ${distance}\n nature ${valuation_chemin[start][end][0]}\n ville ${valuation_chemin[start][end][1]} \n elevation ${valuation_chemin[start][end][2]}\n forest ${valuation_chemin[start][end][3]}\n lake ${valuation_chemin[start][end][3]}\n river ${valuation_chemin[start][end][4]}`
					}) 
			}
		}
	}
	let data={
		nodes:nodes_data
		,links:links_data
	}
	sessionStorage.setItem(id.data_sessionstorage.stockage_instance,JSON.stringify(dataJson))
	document.getElementById(id.html.solution_management).classList.remove("is-hidden")
	display_graph_data(data)
}

/*
sert a retirer tout les element parasite de la session storage
exemple les instances et les solution en json dans ce cas-ci
*/
function clean_session_storage(id_safe)
{
	//tableau contenant les chose de la session a retirer
	let session_clean=[id.data_sessionstorage.stockage_instance,id.stockage_solution_session]
	
	session_clean.forEach((element)=>{
		if(element!==id_safe)
		{
			sessionStorage.removeItem(element)
		}
	})
}


function draw_exemple(dataJson) {
	clean_session_storage(id.stockage_solution_session)
	sessionStorage.setItem(id.stockage_solution_session,JSON.stringify(dataJson))
	let solution=dataJson[id.key_json_solution]
	if(solution == null)
	{
		//sortie de la fonction il n'y a pas de solution dans le json 
		add_information(errors.no_solution,information.error)
		sessionStorage.removeItem(id.stockage_solution_session)
		return ;	
	}
	sessionStorage.removeItem(id.data_sessionstorage)
	console.log(sessionStorage.getItem(id.data_sessionstorage))
	
	draw_timeline(dataJson)
	document.getElementById(id.html.solution_management).classList.remove("is-hidden")
	//solution que l'on choisie de montrer a l'utilisateur.ice
	let solution_proposer=solution[id.Solutions_key][solution[id.Solutions_key].length-1]	
	

	//donnée x et y des pdi
	let data_x=solution[id.Coordonee_pdi_x_key]
	let data_y=solution[id.Coordonee_pdi_y_key]

	let instance=solution[id.solution_json.instance_data_key	]
	
	let nodes_data=[]

	//permet d'avoir les points de départ des pdi de la solution choisie
	let depart=solution_proposer[id.Start_pdi_key]

	let presence_pdi=solution_proposer[id.Presence_pdi_key]

	let score_pdi=solution[id.instance_json.instance_data_key][id.instance_json.Score_pdi_key]
	
	//sert a aerer le graphe
	let scale=sessionStorage.getItem(id.data_sessionstorage.stockage_scale)

	for(let i=0;i<solution[id.Coordonee_pdi_x_key].length;++i)
	{
		let d={
			id:`PDI ${i}`
			,x:data_x[i]*scale
			,y:data_y[i]*scale
			,score:score_pdi[i]
			,visiter:presence_pdi[i]
			,start:depart[i]
			,group:1
			,heure_ouverture:instance[id.instance_json.Heure_ouverture][i]
			,heure_fermeture:instance[id.instance_json.Heure_fermeture][i]
			,Cout_entrer:instance[id.instance_json.Cout_entrer][i]
			,Temps_visite:instance[id.instance_json.Temps_visite][i]
			}
		
			d.title=d.id+`\n visite time ${d.start} \n visite ${(d.visiter==0?"false":"true")} \n score ${d.score}\nheure ouverture ${d.heure_ouverture}\nheure fermeture ${d.heure_fermeture}\nCout entrer ${d.Cout_entrer}\nTemps visite ${d.Temps_visite}`
			nodes_data.push(d)
	}
	
	// circuit des pdi	
	let circuit =solution_proposer[id.Circuit_key]

	// les lien dans le graphe
	let links_data=[]

	


	//permet de colorier les noeud de départ et d'ariver de manière differente
	let node_start=circuit[0][0]
	let node_end=circuit[0][0]

	let valuation_chemin=solution[id.instance_json.instance_data_key][id.instance_json.Categorie_chemin_pdi_key]

	for (let i = 0; i < circuit.length; i++) {
		if(depart[node_start]>depart[circuit[i][0]])
		{
			node_start=circuit[i][0]
		}
		if(depart[node_end]<depart[circuit[i][0]])
		{
			node_end=circuit[i][0]
		}
		let start=circuit[i][0]
		let end =circuit[i][1]
		let distance=Math.sqrt(Math.pow(nodes_data[circuit[i][0]].x-nodes_data[circuit[i][1]].x,2)+Math.pow(nodes_data[circuit[i][0]].y-nodes_data[circuit[i][1]].y,2))
		distance=Math.round(distance)
		links_data.push({source:nodes_data[circuit[i][0]].id
			,title:`distance ${distance}\n nature ${valuation_chemin[start][end][0]}\n ville ${valuation_chemin[start][end][1]} \n elevation ${valuation_chemin[start][end][2]}\n forest ${valuation_chemin[start][end][3]}\n lake ${valuation_chemin[start][end][3]}\n river ${valuation_chemin[start][end][4]}`
			,target:nodes_data[circuit[i][1]].id,value:2})
		
		if(presence_pdi[circuit[i][1]])
		{
			nodes_data[circuit[i][1]].group=5
		}else{
			nodes_data[circuit[i][1]].group=6
		}

	}

	nodes_data[node_end].group=2
	nodes_data[node_start].group=3
	
	
	let data={
		nodes:nodes_data
		,links:links_data
	}

	display_graph_data(data)
}

function display_graph_data(data)
{
	let width=1400
	let height=1000
	// Specify the color scale.
	//const color = d3.scaleOrdinal(d3.schemeCategory10);
	const color=["red","orange","blue","black","cyan","yellow","limegreen"]
	// The force simulation mutates links and nodes, so create a copy
  	// so that re-evaluating this cell produces the same result.
  	const links = data.links.map(d => ({...d}));
  	const nodes = data.nodes.map(d => ({...d}));

	 // Create a simulation with several forces.
	 const simulation = d3.forceSimulation(nodes)
	 .force("link", d3.forceLink(links).id(d => d.id).strength(0))
	 //.force("charge", d3.forceManyBody().strength(-50))
	 .force("center", d3.forceCenter(width / 2, height / 2))
	 .on("tick", ticked);


	let offset=0
	 // Create the SVG container.
	const svg = d3.select("#"+id.div_solution_display).append("svg")
	.attr("width", width)
	.attr("height", height)
	.attr("viewBox", [-offset,-offset,width+offset,height+offset])
	.attr("style", "max-width: 100%; height: auto;")
	.attr('preserveAspectRatio','xMinYMin')
	.style('background-color', 'lightgrey');

	 // Add a line for each link, and a circle for each node.
	const link = svg.append("g")
	.attr("stroke", "#999")
	.attr("stroke-opacity", 0.6)
   	.selectAll()
   	.data(links)
   	.join("line")
	.attr("stroke-width", d => 5);

	  link.append("title")
      .text(d => d.title);


	const node = svg.append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
    .selectAll()
    .data(nodes)
    .join("circle")
      .attr("r", 13)
      .attr("fill", d => color[d.group]);

  node.append("title")
      .text(d => d.title);

  // Add a drag behavior.
  node.call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

  // Set the position attributes of links and nodes each time the simulation ticks.
  function ticked() {
    link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

    node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);
  }

  // Reheat the simulation when drag starts, and fix the subject position.
  function dragstarted(event) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
  }

  // Update the subject (dragged node) position during drag.
  function dragged(event) {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
  }

  // Restore the target alpha so the simulation cools after dragging ends.
  // Unfix the subject position now that it’s no longer being dragged.
  function dragended(event) {
    //if (!event.active) simulation.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
  }

  // When this cell is re-run, stop the previous simulation. (This doesn’t
  // really matter since the target alpha is zero and the simulation will
  // stop naturally, but it’s a good practice.)
  //invalidation.then(() => simulation.stop());
}

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
	let session_data=[id_tab,id_tab_content]
	sessionStorage.setItem(id.selected_tab,JSON.stringify(session_data))
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

function display_solution(dataJson)
{
	
	var solution_display=document.getElementById(id.div_solution_display)
	while(solution_display.hasChildNodes())
	{
		solution_display.removeChild(solution_display.firstChild)
	}
	//drawGraph(dataJson)
	sendCsvAnimation()
	draw_exemple(dataJson)
	receiveCsvAnimation()

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
			case id.search_parameter.poiInterresement:
			case id.search_parameter.trailInterresement:
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

function sendData(Formdata,type_send) {
	console.log(Formdata,"\n",type_send)
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
													switch(type_send)
													{
														case id.ajax_file_csv:
														case id.request_id.execute_exemple:
														{
															display_solution(data)
															receiveCsvAnimation()		
														}break;
														case id.request_id.exemple_request:
														{
															update_exemple(data)	
														}break;
													}
													
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

function update_exemple(datajson)
{
	let select =document.getElementById(id.select_exemple);
	while(select.firstChild)
	{
		select.removeChild(select.firstChild)
	}
	let exemple=datajson[id.response_id.exemple_response]
	exemple.sort((a,b)=>a>b)
	for(let i=0;i<exemple.length;++i)
	{
		let option=document.createElement("option")
		let nom_instance=exemple[i].replace(/\.[^/.]+$/, "")
		option.textContent=nom_instance
		option.setAttribute("name",nom_instance)
		select.appendChild(option)
		
	}
}

//thing to do when you send a csv to solve
function sendCsvAnimation()
{

	document.getElementById(id.html.solution_management).classList.add("is-hidden")

	var solution_display=document.getElementById(id.div_solution_display)
	while(solution_display.hasChildNodes())
	{
		solution_display.removeChild(solution_display.firstChild)
	}
	document.getElementById(id.status_solve).classList.add("is-hidden")
	document.getElementById(id.html.timeline_circuit).classList.add("is-hidden")
	document.getElementById(id.button_csv_data).setAttribute("disabled","true")
	document.getElementById(id.button_solution_json).setAttribute("disabled","true")
	document.getElementById(id.button_loading_exemple).setAttribute("disabled","true")
	document.getElementById(id.button.input_display_instance).setAttribute("disabled","true")
	document.getElementById(id.button.button_loading).classList.remove("is-hidden")


}
function receiveCsvAnimation()
{
	document.getElementById(id.button_csv_data).removeAttribute("disabled")
	document.getElementById(id.button_solution_json).removeAttribute("disabled")
	document.getElementById(id.button.button_loading).classList.add("is-hidden")
	document.getElementById(id.button_loading_exemple).removeAttribute("disabled","true")
	document.getElementById(id.button.input_display_instance).removeAttribute("disabled")

}

function add_search_parameter(formData)
{
	let parameter={}
	for(let param in id.search_parameter)
	{
		let value_param=Number.parseInt(document.getElementById(param).value)
		switch(param)
		{
			case id.search_parameter.preference_elevation:
			case id.search_parameter.preference_foret:
			case id.search_parameter.preference_lac:
			case id.search_parameter.preference_nature:
			case id.search_parameter.preference_ville:
			case id.search_parameter.preference_riviere:
			{
				value_param/=10
			}break;
		}
		parameter[param]= value_param
	}
	
	formData.append(id.formdataparameter,JSON.stringify(parameter) )
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

	add_search_parameter(formData)
	sendCsvAnimation()
	sendData(formData,id.ajax_file_csv) 
	

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
	}
	json=sessionStorage.getItem(id.data_sessionstorage.stockage_instance)
	if(json!=null)
	{
		download(json,"instance.json","application/json")
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
		draw_exemple(json)
		receiveCsvAnimation()
	}

	//drawGraph(JSON.parse(file)) 
})


document.getElementById(id.file.file_display_instance).addEventListener("change",(e)=>{
	let file=e.target.files[0]
    let read = new FileReader();

	read.readAsBinaryString(file);

	read.onloadend = function(){
		let json ={}

		json=JSON.parse(read.result)
		sendCsvAnimation()	
		draw_instance(json)
		receiveCsvAnimation()
	}

	//drawGraph(JSON.parse(file)) 
})


//event to import solution json to display the solution
document.getElementById(id.button_solution_json).addEventListener("click",(e)=>{
	document.getElementById(id.input_solution_json).click()
})

//event to import solution json to display the solution
document.getElementById(id.button.input_display_instance).addEventListener("click",(e)=>{
	document.getElementById(id.file.file_display_instance).click()
})

document.getElementById(id.button_loading_exemple).addEventListener("click",(e)=>{
	let formData=FormDataDefault()
	let select=document.getElementById(id.select_exemple)
	let nom_exemple=select.value
	formData.append(id.request_id.execute_exemple,nom_exemple)
	if(!check_parametres())
	{
		return
	}
	add_search_parameter(formData)
	sendCsvAnimation()
	sendData(formData,id.request_id.execute_exemple)
})

function refresh_exemple()
{
	let formData=FormDataDefault()
	formData.append(id.request_id.exemple_request,true)
	sendData(formData,id.request_id.exemple_request)	
}

function onload()
{
	sessionStorage.setItem(id.data_sessionstorage.stockage_scale,5)
	refresh_exemple()
	var solution=sessionStorage.getItem(id.stockage_solution_session)
	if(solution!=null)
	{
		sendCsvAnimation()
		let json =JSON.parse(solution)
		sendCsvAnimation()
		draw_exemple(json)
		receiveCsvAnimation()
	}
	var instance=sessionStorage.getItem(id.data_sessionstorage.stockage_instance)
	if(instance!=null)
	{
		sendCsvAnimation()
		let json =JSON.parse(instance)
		sendCsvAnimation()
		draw_instance(json)
		receiveCsvAnimation()
	}

	
	document.getElementById(id.tab_id.config_search_tab).addEventListener("click",()=>{select_tab(id.tab_id.config_search_tab,id.tab_content.search_config)})
	document.getElementById(id.tab_id.solution_tab).addEventListener("click",()=>{select_tab(id.tab_id.solution_tab,id.tab_content.vizualize_solution)})
	
	let tab=sessionStorage.getItem(id.selected_tab)
	if(tab!=null)
	{
		tab=JSON.parse(tab)
		select_tab(tab[0],tab[1])
	}else{
		select_tab(id.tab_id.config_search_tab,id.tab_content.search_config)
	}
	
	
	document.getElementById(id.button_check_parameters).addEventListener("click",()=>{check_parametres()})

	document.getElementById(id.input.input_zoom).addEventListener("change",()=>{
		let input_zoom=document.getElementById(id.input.input_zoom)
		let zoom=Number.parseInt(input_zoom.value) 
		
		if(Number.isInteger(zoom))
		{
			if(zoom>0)
			{
				sessionStorage.setItem(id.data_sessionstorage.stockage_scale,zoom)
				if(sessionStorage.getItem(id.data_sessionstorage.stockage_instance)!=null)
				{
					sendCsvAnimation()
					draw_instance(JSON.parse(sessionStorage.getItem(id.data_sessionstorage.stockage_instance)))
					receiveCsvAnimation()
				}
				if(sessionStorage.getItem(id.stockage_solution_session)!=null)
				{
					sendCsvAnimation()
					draw_exemple(JSON.parse(sessionStorage.getItem(id.stockage_solution_session)))
					receiveCsvAnimation()
				}
			}
			
		}
	})
}
onload()