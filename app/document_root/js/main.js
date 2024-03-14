import {id}from "./id.js"

import * as d3 from "https://cdn.skypack.dev/d3@7.6.1";
//import * as d3 from "../third-party/D3/d3.v7.min.js";
function add_erreur(erreur)
{
	let status=document.getElementById(id.status_display)
	let p=document.createElement("p")
	p.textContent=erreur
	status.appendChild(p)
}
// This method is responsible for drawing the graph, returns the drawn network
function drawGraph(dataJson) {
	sessionStorage.setItem(id.stockage_solution_session,JSON.stringify(dataJson))
	
	//offre la possibilitée de telecharger le json solution
	document.getElementById(id.button_download_solution).classList.remove("is-hidden")
	
	let solution=dataJson[id.key_json_solution]
	let solution_proposer=solution[id.Solutions_key][solution[id.Solutions_key].length-1]
	let data_x=solution[id.Coordonee_pdi_x_key]
	let data_y=solution[id.Coordonee_pdi_y_key]
	let depart=solution_proposer[id.Start_pdi_key]
	let taille_rayon=20
	let arc =solution_proposer[id.Arc_key]
	let presence_pdi=solution_proposer[id.Presence_pdi_key]
	let width=0
	let height=0

	console.log(solution)

	// ces offset serve pour les graphe avec des valeurs négative
	let offsetx=0
	let offsety=0
	//les deucx variable servent a savoir quelle sont les départ et l'arriver du graphe pour les colorier d'une autre manièreS
	let depart_circuit=0
	let arriver_circuit=0

	for(let i=0;i<data_x.length;++i)
	{
		if(depart[depart_circuit]>depart[i] && presence_pdi[i])
		{
			depart_circuit=i
		}
		if(depart[arriver_circuit]<depart[i] && presence_pdi[i])
		{
			arriver_circuit=i
		}

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
	let offsetdefault=10
	offsetx+= offsetdefault
	offsety+= offsetdefault
	//sert a scale la figure pour mieux voire les donnée
	let scale=10

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
	
	
	for(let i=0;i<data_x.length;++i)
	{
		for(let j=0;j<data_x.length;++j)
		{
			if(arc[i][j])
			{
				// Add the path using this helper function
				svg.append('line')
				.attr('x1', data_x[i])
				.attr('y1', data_y[i])
				.attr('x2', data_x[j])
				.attr('y2', data_y[j])
				.attr('stroke', 'black')
			}
		}
	}
	for(let i=0;i<data_x.length;++i)
	{		
		let x=data_x[i]
		let y=data_y[i]

		svg.append("circle")
		.attr("cx",x )
		.attr("cy", y)
		.attr("opacity", 0.5)
		.attr("fill", (i==depart_circuit?"blue":(i==arriver_circuit?"red":(presence_pdi[i]?"green":"white"))))
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
		drawGraph(json)
		console.log()
	}
}
onload()