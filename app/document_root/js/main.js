import {id}from "./id.js"
// This method is responsible for drawing the graph, returns the drawn network
function drawGraph(dataJson) {
	console.log(dataJson)
	let solution=dataJson[id.key_json_solution]
	let solution_proposer=solution[id.Solutions_key][solution[id.Solutions_key].length-1]
	let data_x=solution[id.Coordonee_pdi_x_key]
	let data_y=solution[id.Coordonee_pdi_y_key]
	let depart=solution_proposer[id.Start_pdi_key]
	let taille_rayon=20
	let arc =solution_proposer[id.Arc_key]
	let width=0
	let height=0

	// ces offset serve pour les graphe avec des valeurs négative
	let offsetx=0
	let offsety=0
	//les deucx variable servent a savoir quelle sont les départ et l'arriver du graphe pour les colorier d'une autre manièreS
	let depart_circuit=0
	let arriver_circuit=0

	for(let i=0;i<data_x.length;++i)
	{
		if(data_x[i]<offsetx)
		{
			offsetx=data_x[i]
		}
		if(depart[i])
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
	for(let i=0;i<data_x.length;++i)
	{
		data_x[i]+=offsetx
		data_y[i]+=offsety

		data_x[i]*=10
		data_y[i]*=10

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
	var svg = d3.select("#"+id.div_solution_display).append("svg")
            .attr("width", width+100)
            .attr("height", height+100)
            .style('background-color', 'lightgrey')
	
	
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
		console.log(x,y)
		svg.append("circle")
		.attr("cx",x )
		.attr("cy", y)
		.attr("opacity", 0.5)
		.attr("fill", "green")
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
											).catch(err=>console.log("error parsing the response json"))
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

//event to trigger the load of an csv data by the user
document.getElementById(id.input_csv_data).addEventListener("change",(e)=>{
	let file=e.target.files[0]
	let formData=FormDataDefault()
	formData.append(id.ajax_file_csv,true)
	formData.append("file",file)
	
	sendData(formData) 

})

//event to trigger the input file hidden
document.getElementById(id.button_csv_data).addEventListener("click",(e)=>{
	document.getElementById(id.input_csv_data).click()
})
