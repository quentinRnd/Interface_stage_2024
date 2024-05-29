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
	//table.classList.add("is-bordered")
	

	//permet d'avoir les points de départ des pdi de la solution choisie
	let depart=solution_proposer[id.Start_pdi_key]
	
	let pdi_coord_x=solution[id.Coordonee_pdi_x_key]
	let pdi_coord_y=solution[id.Coordonee_pdi_y_key] 

	circuit.sort((a,b)=>depart[a[0]]>depart[b[0]])

	let presence_pdi=solution_proposer[id.Presence_pdi_key]

	let content=[]

	let temps_visite=solution[id.Temps_visite_key]

	for(let i=0;i< circuit.length;++i)
	{
		let pdi=circuit[i][0]

		content.push({text:`POI ${pdi}`,categorie:0})
		if(presence_pdi[pdi])
		{
			content.push({text:`visiting during ${temps_visite[pdi]} minute`,categorie:1})
		}
		content.push({text:`walk for ${parseInt( Math.sqrt(Math.pow(pdi_coord_x[circuit[i][0]]-pdi_coord_x[circuit[i][1]],2)+Math.pow(pdi_coord_y[circuit[i][0]]-pdi_coord_y[circuit[i][1]],2)))} meter`})

	}
	content.push({text:`Your trail is finish`,categorie:2})
	
	let head=[{text:"Your journey",weight:content.length},{text:`visiting ${presence_pdi.reduce((partialsum,a)=>partialsum+0+a)} pdi`,weight:content.length}]
	
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

function draw_exemple(dataJson) {
	sessionStorage.setItem(id.stockage_solution_session,JSON.stringify(dataJson))
	let solution=dataJson[id.key_json_solution]
	draw_timeline(dataJson)
	if(solution == null)
	{
		//sortie de la fonction il n'y a pas de solution dans le json 
		add_information(errors.no_solution,information.error)
		return ;	
	}
	//solution que l'on choisie de montrer a l'utilisateur.ice
	let solution_proposer=solution[id.Solutions_key][solution[id.Solutions_key].length-1]	
	

	//donnée x et y des pdi
	let data_x=solution[id.Coordonee_pdi_x_key]
	let data_y=solution[id.Coordonee_pdi_y_key]

	let width=1400
	let height=1000
	
	let nodes_data=[]

	//permet d'avoir les points de départ des pdi de la solution choisie
	let depart=solution_proposer[id.Start_pdi_key]

	let presence_pdi=solution_proposer[id.Presence_pdi_key]

	//sert a aerer le graphe
	let scale=9

	for(let i=0;i<solution[id.Coordonee_pdi_x_key].length;++i)
	{
		nodes_data.push({id:`PDI ${i}`,x:data_x[i]*scale,y:data_y[i]*scale,visiter:presence_pdi[i],start:depart[i],group:1})
	}
	
	// circuit des pdi	
	let circuit =solution_proposer[id.Circuit_key]

	// les lien dans le graphe
	let links_data=[]

	


	//permet de colorier les noeud de départ et d'ariver de manière differente
	let node_start=circuit[0][0]
	let node_end=circuit[0][0]

	

	for (let i = 0; i < circuit.length; i++) {
		if(depart[node_start]>depart[circuit[i][0]])
		{
			node_start=circuit[i][0]
		}
		if(depart[node_end]<depart[circuit[i][0]])
		{
			node_end=circuit[i][0]
		}
		links_data.push({source:nodes_data[circuit[i][0]].id,distance:Math.sqrt(Math.pow(nodes_data[circuit[i][0]].x-nodes_data[circuit[i][1]].x,2)+Math.pow(nodes_data[circuit[i][0]].y-nodes_data[circuit[i][1]].y,2)),target:nodes_data[circuit[i][1]].id,value:2})
		
		if(presence_pdi[circuit[i][1]])
		{
			nodes_data[circuit[i][1]].group=5
		}else{
			nodes_data[circuit[i][1]].group=6
		}

	}

	console.log(node_start,nodes_data.length)
	nodes_data[node_end].group=2
	nodes_data[node_start].group=3

	console.log(nodes_data,"\n",links_data)
	
	
	let data={
		nodes:nodes_data
		,links:links_data
	}

	// Specify the color scale.
	const color = d3.scaleOrdinal(d3.schemeCategory10);

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
      .text(d => "llalaalalal");
	  console.log("llalal")


	const node = svg.append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
    .selectAll()
    .data(nodes)
    .join("circle")
      .attr("r", 10)
      .attr("fill", d => color(d.group));

  node.append("title")
      .text(d => d.id+`\n visite time ${d.start} \n visite ${(d.visiter==0?"false":"true")} `);

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
// This method is responsible for drawing the graph, returns the drawn network
function drawGraph(dataJson) {
	sessionStorage.setItem(id.stockage_solution_session,JSON.stringify(dataJson))
	
	
	let solution=dataJson[id.key_json_solution] 
	
	console.log(dataJson)
	if(solution == null)
	{
		add_information(errors.no_solution,information.error)
		return ;	
	}

	//offre la possibilitée de telecharger le json solution
	document.getElementById(id.button_download_solution).classList.remove("is-hidden")
	
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
	//drawGraph(dataJson)
	draw_exemple(dataJson)

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
	document.getElementById(id.html.timeline_circuit).classList.add("is-hidden")

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
		console.log("ici")
		if(!json[id.key_json_solution] ==null)
		{
			sendCsvAnimation()	
		}
		//drawGraph(json)
		draw_exemple(json)
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
		//drawGraph(json)
		draw_exemple(json)
		console.log()
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


}
onload()