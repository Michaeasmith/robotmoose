function navigation_t(div, state_runner, robot)
{
	
	this.div = div;
	this.robot = robot;
	this.state_runner = state_runner;
	this.setup();
}
	
navigation_t.prototype.setup=function()
{
	var myself = this;
	if(this.div) this.div.innerHTML="";
	this.posX_set=this.robot.sensors.location.x;
	console.log("posX_set initial: " + this.posX_set);
	this.posY_set=this.robot.sensors.location.y;
	this.angle_set=this.robot.sensors.location.angle;
	
	this.map_json = this.robot.map_json;

	
	this.minimap_mode="location";
	this.minimap_action_onclick="location"; // action when minimap is clicked
	

	// Div format
	this.modal_loc_row=document.createElement("div");
	this.modal_loc_row.className="row";
	this.modal_img_col=document.createElement("div");
	this.modal_img_col.className="col-md-6";
	this.modal_ui_col=document.createElement("div");
	this.modal_ui_col.className="col-md-6";
	
	this.modal_loc_row.appendChild(myself.modal_img_col);
	this.modal_loc_row.appendChild(myself.modal_ui_col);
	this.div.appendChild(myself.modal_loc_row);
		
	
	// Mini roomba image
	this.minimap_img = document.createElement("img");
	
	if (this.map_json&&this.map_json.path)
		this.minimap_img.src=this.map_json.path;
	else
	{
		this.minimap_img.src="maps/nomap.jpg";
		this.map_json={};
		this.map_json.width=10;
		this.map_json.height=10;
	}
	

	this.minimap_img.style["max-width"]="100%";
	this.minimap_img.style["max-height"]="100%";
	this.modal_img_col.appendChild(myself.minimap_img);
	
	
	this.minimap_roomba=document.createElement("img");
	this.minimap_roomba.src="maps/minimap_roomba.png";

	this.modal_img_col.appendChild(myself.minimap_roomba);

	
	
	// Expanding pulse behind mini roomba 
	this.minimap_roomba_pulse=document.createElement("div");
	this.minimap_roomba_pulse_ring=document.createElement("div");
	
	this.minimap_roomba_pulse.className="pulse";
	this.minimap_roomba_pulse_ring.className="pulse_ring";
	
	this.modal_img_col.appendChild(this.minimap_roomba_pulse_ring);
	this.modal_img_col.appendChild(this.minimap_roomba_pulse);



	// UI
	this.posX = myself.minimap_img.offsetLeft;
	this.posY = myself.minimap_img.offsetTop;
	var coord_text = "X= " + myself.posX + ", Y= " + myself.posY;
	this.pos_text_el = document.createTextNode(coord_text);		
	
	this.pos_row=document.createElement("div");
	this.pos_row.className="row";
	this.pos_colX = document.createElement("div");
	this.pos_colX.className="col-md-2"
	this.pos_colY = document.createElement("div");
	this.pos_colY.className="col-md-2 col-md-offset-2"
	this.pos_angle=document.createElement("div");
	this.pos_angle.className="col-md-2 col-md-offset-2"
	
	var input_width = 75;
	
	this.posX_input = document.createElement("input");
	this.posX_input.type="number";
	this.posX_input.value=0;
	this.posX_input.id="posX_input";
	this.posX_input.style.width=input_width;
	this.posX_input.onchange=function(){ myself.pos_input_onchange()};
	this.posX_label=document.createElement("label");
	this.posX_label.for="posX_input";
	this.posX_label.innerHTML="X";
	
	this.posY_input=document.createElement("input");
	this.posY_input.type="number";
	this.posY_input.value=0;
	this.posY_input.id="posY_input"
	this.posY_input.style.width=input_width;
	this.posY_input.onchange=function(){ myself.pos_input_onchange()};
	this.posY_label=document.createElement("label");
	this.posY_label.for="posY_input";
	this.posY_label.innerHTML="Y";
	
	this.angle_input=document.createElement("input");
	this.angle_input.type="number";
	this.angle_input.value=0;
	this.angle_input.id="angle_input"
	this.angle_input.style.width=input_width;
	this.angle_input.onchange=function(){ myself.pos_input_onchange()};
	this.angle_label=document.createElement("label");
	this.angle_label.for="angle_input";
	this.angle_label.innerHTML="angle";
	
	
	this.set_loc_button=document.createElement("input");
	this.set_loc_button.className="btn btn-primary";
	this.set_loc_button.style.marginBottom="10px";
	this.set_loc_button.style.width = "30%";
	this.set_loc_button.disabled=true;
	this.set_loc_button.type="button";
	this.set_loc_button.value="Set Robot";
	this.set_loc_button.title="Click here to set robot location";
	this.set_loc_button.addEventListener("click",function(event)
	{
		myself.minimap_mode="location";
		myself.set_loc_button_pressed_m();
	});
	
	this.set_waypoint_button=document.createElement("input");
	this.set_waypoint_button.className="btn btn-primary";
	this.set_waypoint_button.style.marginBottom="10px";
	this.set_waypoint_button.style.width = "30%";
	this.set_waypoint_button.disabled=false;
	this.set_waypoint_button.type="button";
	this.set_waypoint_button.value="Set Waypoint";
	this.set_waypoint_button.title="Click here to set waypoints";
	this.set_waypoint_button.addEventListener("click",function(event)
	{
		myself.minimap_mode="waypoint";
		myself.set_loc_button_pressed_m();
	});
	
	this.set_obstacle_button=document.createElement("input");
	this.set_obstacle_button.className="btn btn-primary";
	this.set_obstacle_button.style.marginBottom="10px";
	this.set_obstacle_button.style.width = "30%";
	this.set_obstacle_button.disabled=false;
	this.set_obstacle_button.type="button";
	this.set_obstacle_button.value="Set Obstacle";
	this.set_obstacle_button.title="Click here to set obstacles";
	this.set_obstacle_button.addEventListener("click",function(event)
	{
		myself.minimap_mode="obstacle";
		myself.set_loc_button_pressed_m();
	});
	
	
	this.reset_loc_button=document.createElement("input");
	this.reset_loc_button.className="btn btn-primary";
	this.reset_loc_button.style.marginBottom="10px";
	this.reset_loc_button.style.width = "50%";
	this.reset_loc_button.disabled=false;
	this.reset_loc_button.type="button";
	this.reset_loc_button.value="Reset Location";
	this.reset_loc_button.title="Click here to reset robot location";
	this.reset_loc_button.addEventListener("click",function(event)
	{
		myself.reset_loc_button_pressed_m();
	});
	
	this.pos_colX.appendChild(this.posX_input);
	this.pos_colX.appendChild(this.posX_label);
	this.pos_colY.appendChild(this.posY_input);
	this.pos_colY.appendChild(this.posY_label);
	this.pos_angle.appendChild(this.angle_input);
	this.pos_angle.appendChild(this.angle_label);
	this.pos_row.appendChild(this.pos_colX);
	this.pos_row.appendChild(this.pos_colY);
	this.pos_row.appendChild(this.pos_angle);
	this.modal_ui_col.appendChild(this.pos_text_el);
	this.modal_ui_col.appendChild(document.createElement("br"));
	this.modal_ui_col.appendChild(document.createElement("br"));
	this.modal_ui_col.appendChild(this.pos_row);
	this.modal_ui_col.appendChild(this.set_loc_button);
	this.modal_ui_col.appendChild(this.set_waypoint_button);
	this.modal_ui_col.appendChild(this.set_obstacle_button);
	this.modal_ui_col.appendChild(this.reset_loc_button);
	
	
	this.code_box_div=document.createElement("div");
	this.code_box_div.hidden=true;
	this.code_box=document.createElement("textarea");
	this.code_box.className="form-control";
	this.code_box.id="code_box";
	this.code_box.readOnly=true;
	//this.code_box.innerHTML = "driveToPoint(3.5, 4) \ndriveToPoint(1.0, 0) \ndriveToPoint(-2.4, -2)";
	
	this.code_box_label=document.createElement("label");
	this.code_box_label["for"]="code_box";
	this.code_box_label.innerHTML="<br> Code generated from waypoints. <br> Copy + paste into the Code Editor.";
	
	this.code_box_div.appendChild(this.code_box_label);
	this.code_box_div.appendChild(this.code_box);
	this.modal_ui_col.appendChild(this.code_box_div);
	
	
	this.modal_img_col.addEventListener("click", function(event){myself.minimap_onclick(event)});
	this.modal_img_col.addEventListener("mousemove", function(event){myself.get_coords(event)});
	//window.addEventListener("resize", function(event){myself.set_minimap_roomba(myself.posX_input.value, myself.posY_input.value)});
	

	
	window.setTimeout(function(){myself.setup_images();}, 20); // setTimeout used so that width of divs will be set
}


navigation_t.prototype.setup_images=function()
{

	this.set_minimap_roomba(this.posX_set, this.posY_set, this.angle_set);
	console.log("setup - posX_set: " + this.posX_set)
	this.generate_grid();
	this.update_pos_loop();
}

// Set location of mini roomba image
navigation_t.prototype.set_minimap_roomba=function(posX, posY, angle, resize)
{
	var myself = this;
	
	if(!posX) posX = this.posX_set;
	if(!posY) posY = this.posY_set;
	if(!angle) angle = this.angle_set;
	
	// set minimap roomba scale
	if(!myself.minimap_roomba_scale || resize)
	{
		//myself.minimap_roomba.style["-webkit-transform"]="rotate(90deg)";
		if (!resize)
			myself.minimap_roomba.style["transform"]="rotate(90deg)";
	
		var roomba_width = 0.3;
		var px_real_img_ratio = this.minimap_img.width/this.map_json.width;
		this.minimap_roomba_scale=roomba_width*(px_real_img_ratio);
	
		if (this.minimap_roomba_scale < 30) this.minimap_roomba_scale = 30; 
	
		this.minimap_pulse_scale = this.minimap_roomba_scale*1.5;
		this.minimap_ring_scale = this.minimap_roomba_scale*4;
		this.minimap_waypoint_scale = this.minimap_roomba_scale/2;
	
		var scale = this.minimap_roomba_scale;
		var pulse_scale = this.minimap_pulse_scale;
		var ring_scale = this.minimap_ring_scale;
	
		Object.assign(myself.minimap_roomba.style, {position: "absolute", width : scale, height : scale, "z-index" : 100});
		Object.assign(myself.minimap_roomba_pulse.style, {position: "absolute", width : pulse_scale, height : pulse_scale});
		Object.assign(myself.minimap_roomba_pulse_ring.style, {width : ring_scale, height : ring_scale, "border_radius" : ring_scale*2});
	
	}
	

	// set location of minimap roomba
	
	var offset_posX = 0;
	var offset_posY = 0;
	
	// get offset of mouse click
	
	if(posX&&posY) // don't waste time if both == 0
	{
		offset_posX = posX*(myself.minimap_img.width/myself.map_json.width);
		offset_posY = -posY*(myself.minimap_img.height/myself.map_json.height);
	}
	
	var margin_left = this.minimap_img.offsetLeft; // margin on div to the left of minimap (determined experimentally)
	
	// mini roomba offset
	var offset_left = myself.minimap_img.width/2- myself.minimap_roomba_scale/2 + margin_left + offset_posX;
	var offset_top = myself.minimap_img.height/2 - myself.minimap_roomba_scale/2 + offset_posY;
	
	// pulse offset
	var offset_left_pulse = myself.minimap_img.width/2- myself.minimap_pulse_scale/2 + margin_left + offset_posX;
	var offset_top_pulse = myself.minimap_img.height/2- myself.minimap_pulse_scale/2 + offset_posY;
	
	// pulse ring offset
	var offset_left_ring = myself.minimap_img.width/2- myself.minimap_ring_scale/2 + margin_left + offset_posX;
	var offset_top_ring = myself.minimap_img.height/2 - myself.minimap_ring_scale/2 + offset_posY;
	
	console.log("set_minimap_roomba - image width: " + myself.minimap_img.width);
	Object.assign(myself.minimap_roomba_pulse.style, {left : offset_left_pulse, top : offset_top_pulse});
	Object.assign(myself.minimap_roomba_pulse_ring.style, {left : offset_left_ring, top : offset_top_ring});
	Object.assign(myself.minimap_roomba.style, {left : offset_left, top : offset_top});
	//myself.minimap_roomba.style.left=offset_left;
	//myself.minimap_roomba.style.top=offset_top;
	
	
		
	myself.angle = angle;
	var angle_adj = -angle + 90;
	
	myself.minimap_roomba.style["transform"]="rotate(" + angle_adj + "deg)"; 


	this.posX_curr = posX;
	this.posY_curr = posY;
	this.angle_curr = angle;
}

// Set temp waypoint on minimap
navigation_t.prototype.set_temp_waypoint=function(posX, posY, option)
{
	var myself = this;
	if (!myself.minimap_temp_waypoint)
	{
		this.minimap_temp_waypoint=document.createElement("div");
		this.minimap_temp_waypoint.className="waypoint";
		this.modal_img_col.appendChild(this.minimap_temp_waypoint);
		Object.assign(myself.minimap_temp_waypoint.style, {position: "absolute", width : myself.minimap_roomba_scale, height : myself.minimap_roomba_scale});
	}	

	
	if (option && option=="location")
		this.minimap_temp_waypoint.style["background"]="#4cf78e";
	else 
		this.minimap_temp_waypoint.style["background"]="#1ee";
		
	
	this.minimap_temp_waypoint.posX=posX;
	this.minimap_temp_waypoint.posY=posY;
			

	var offset_posX = 0;
	var offset_posY = 0;

	// get offset of mouse click
	if(posX&&posY)
	{
		offset_posX = posX*(myself.minimap_img.width/myself.map_json.width);
		offset_posY = -posY*(myself.minimap_img.height/myself.map_json.height);
	}

	var margin_left = this.minimap_img.offsetLeft; // margin on div to the left of minimap (determined experimentally)

	// offset
	var offset_left = myself.minimap_img.width/2- myself.minimap_roomba_scale/2 + margin_left + offset_posX;
	var offset_top = myself.minimap_img.height/2 - myself.minimap_roomba_scale/2 + offset_posY;

	Object.assign(myself.minimap_temp_waypoint.style, {left : offset_left, top : offset_top});
		
	
		
}

// Add waypoint to minimap
navigation_t.prototype.add_waypoint=function(posX, posY)
{

	var myself = this;
	
	if(!this.minimap_temp_waypoint||this.minimap_temp_waypoint.hidden) // check for temp waypoint
		return;
		
	
	if (!this.waypoints)
	{
		this.waypoints=[];
		this.waypoint_count=0;
	}	
	
	if(this.waypoint_count==26)
	{
		console.log("ERROR - waypoint limit reached");
		return;
	}
	
	this.waypoint_count += 1;

	var new_waypoint = document.createElement("div");
	new_waypoint.className = "waypoint";
	new_waypoint.posX=posX;
	new_waypoint.posY=posY;
	new_waypoint.style["background"]="#f5f";
	var waypoint_letter = String.fromCharCode('A'.charCodeAt() + myself.waypoint_count - 1);
	new_waypoint.innerHTML = waypoint_letter;
	
	var scale = 36;
	//Object.assign(new_waypoint.style, {position: "absolute", width : scale, height : scale});
	Object.assign(new_waypoint.style, {position: "absolute"});
	var offset_posX = 0;
	var offset_posY = 0;

	// get offset of mouse click
	if(posX&&posY)
	{
		offset_posX = posX*(myself.minimap_img.width/myself.map_json.width);
		offset_posY = -posY*(myself.minimap_img.height/myself.map_json.height);
	}

	var margin_left = this.minimap_img.offsetLeft; // margin on div to the left of minimap (determined experimentally)

	// offset
	var offset_left = myself.minimap_img.width/2 - scale/2 + margin_left + offset_posX;
	var offset_top = myself.minimap_img.height/2 - scale/2 + offset_posY;

	Object.assign(new_waypoint.style, {left : offset_left, top : offset_top});
		
	
	var index = this.waypoint_count-1;
	this.waypoints[index] = new_waypoint;
	this.modal_img_col.appendChild(myself.waypoints[index]);
	
	if (this.waypoint_count==1)
		this.code_box.innerHTML+="driveToPoint(" + posX + ", " + posY + ")";
	else 
		this.code_box.innerHTML+="\ndriveToPoint(" + posX + ", " + posY + ")";
		
	this.code_box.rows=this.waypoint_count;
	this.code_box_div.hidden=false;
	
}

navigation_t.prototype.move_waypoints=function()
{
	var myself = this;
	if (!this.waypoint_count)
		return;
		
	var scale = 36;
	for (i = 0; i < this.waypoint_count; i++)
	{	
		var offset_posX = this.waypoints[i].posX*(myself.minimap_img.width/myself.map_json.width);
		var offset_posY = -this.waypoints[i].posY*(myself.minimap_img.height/myself.map_json.height);


		var margin_left = this.minimap_img.offsetLeft; // margin on div to the left of minimap (determined experimentally)

		// offset
		var offset_left = myself.minimap_img.width/2 - scale/2 + margin_left + offset_posX;
		var offset_top = myself.minimap_img.height/2 - scale/2 + offset_posY;

		Object.assign(myself.waypoints[i].style, {left : offset_left, top : offset_top});
	}
	
}

navigation_t.prototype.pos_input_onchange=function()
{

	var myself = this;
	var opt = myself.map_json;
	
	// check range
	var posX_temp = this.posX_input.value;
	var posY_temp = this.posY_input.value;
	var angle_temp = this.angle_input.value;
	
	if (opt.width/2 < posX_temp)
	{
		this.posX_input.value=opt.width/2;
	}
	else if (-opt.width/2 > posX_temp)
	{
		this.posX_input.value = -opt.width/2;
	}
	
	if (opt.height/2 < posY_temp)
	{
		this.posY_input.value=opt.height/2;
	}
	else if (-opt.height/2 > posY_temp)
	{
		this.posY_input.value=-opt.height/2;
	}
	
	if (angle_temp > 180)
		this.angle_input.value = 180;
	else if (angle_temp < -180)
		this.angle_input.value = -180;
	
	// set roomba position
	this.posX_set=this.posX_input.value;
	this.posY_set=this.posY_input.value;
	this.angle_set=this.angle_input.value;
	
	// set minimap roomba image
	if (myself.minimap_action_onclick == "location")
		myself.set_temp_waypoint(myself.posX_set, myself.posY_set, "location");
	else
		this.set_temp_waypoint(myself.posX_set, myself.posY_set);
}

navigation_t.prototype.reset_location=function(x_cor, y_cor, angle)
{
	var myself = this;
	if (!x_cor) x_cor = 0;
	if (!y_cor) y_cor = 0;
	if (!angle) angle = 0;
	
	if (this.robot&&this.robot.sim) this.robot.change_location(x_cor, y_cor, 0, angle);
	else
	{
		if (!this.pilot.power.power.reset) 
		{
			this.pilot.power.reset={};
			this.pilot.power.reset.location={}
			this.pilot.power.reset.counter=0;
		}
		this.pilot.power.reset.counter++;
		this.pilot.power.reset.location.x = x_cor;
		this.pilot.power.reset.location.y = y_cor;
		this.pilot.power.reset.location.angle = angle;
		robot_network.update_pilot(myself.pilot);
	}
}

navigation_t.prototype.reset_loc_button_pressed_m=function()
{
	var myself = this;
	
	var new_x = this.posX_input.value;
	var new_y = this.posY_input.value;
	var new_angle =this.angle_input.value;
	if (myself.minimap_mode=="location")
	{
		console.log("Resetting location - x: " + new_x + ", y: " + new_y);
		myself.set_minimap_roomba(new_x, new_y, new_angle);
		myself.reset_location(new_x, new_y, new_angle);
		if(myself.onreset) myself.onreset();
	}
	else if (myself.minimap_mode=="waypoint")
	{
		myself.add_waypoint(new_x, new_y);
	}

}

navigation_t.prototype.set_loc_button_pressed_m=function()
{
	var myself = this;
	if (myself.minimap_mode == "location") // set location pressed
	{
		if (myself.minimap_temp_waypoint)
		{
			this.minimap_temp_waypoint.style["background"]="#4cf78e";
		}
			
		myself.set_loc_button.disabled=true;
		myself.set_waypoint_button.disabled=false;
		myself.set_obstacle_button.disabled=false;
		this.reset_loc_button.value="Reset Location";
		this.reset_loc_button.disabled=false;
		this.reset_loc_button.style.visibility="";
		if (this.minimap_temp_waypoint)
			this.minimap_temp_waypoint.hidden=false;
	}
	else if (myself.minimap_mode == "waypoint") // set location pressed
	{
		if (myself.minimap_temp_waypoint)
		{
			this.minimap_temp_waypoint.style["background"]="#1ee";
		}
	
		myself.set_loc_button.disabled=false;
		myself.set_waypoint_button.disabled=true;
		myself.set_obstacle_button.disabled=false;
		this.reset_loc_button.value="Add Waypoint";
		this.reset_loc_button.disabled=false;
		this.reset_loc_button.style.visibility="";
		if (this.minimap_temp_waypoint)
			this.minimap_temp_waypoint.hidden=false;		
	}
	else // set obstacle pressed
	{
		myself.set_loc_button.disabled=false;
		myself.set_waypoint_button.disabled=false;
		myself.set_obstacle_button.disabled=true;
		this.reset_loc_button.disabled=true;
		this.reset_loc_button.style.visibility="hidden";
		if (this.minimap_temp_waypoint)
			this.minimap_temp_waypoint.hidden=true;
	}
		

}

navigation_t.prototype.get_coords=function(event)
{
	var myself = this;
	var opt = myself.map_json;
	var ratio_width = opt.width/myself.minimap_img.width;
	var ratio_height = opt.height/myself.minimap_img.height;
	
	var viewport = myself.minimap_img.getBoundingClientRect();
	var posX = ratio_width*(event.pageX - viewport.left - myself.minimap_img.width/2);
	var posY = -ratio_height*(event.pageY - viewport.top - myself.minimap_img.height/2);
	
	if (opt.width/2 < Math.abs(posX))
	{
		return "";
	}
	else
	{
		myself.posX = posX.toFixed(2);
		myself.posY = posY.toFixed(2);
		//myself.pos_text_el.nodeValue="X= " + (myself.posX).toFixed(2) + ", Y= " + (myself.posY).toFixed(2);
		myself.pos_text_el.nodeValue="X= " + myself.posX + ", Y= " + myself.posY;
		return true;
	}
}

navigation_t.prototype.generate_grid=function()
{
	var myself = this;
	this.cell_size = 0.5; // square meters
	this.grid_width = Math.floor(this.map_json.width/this.cell_size); // number of cells horizontally in grid
	this.grid_height = Math.floor(this.map_json.height/this.cell_size); // number of cells vertically in grid
	this.cell_size_pixels = this.minimap_img.width/this.grid_width;
	
	// Grid overlay
	this.minimap_grid_box=document.createElement("div");
	this.minimap_grid_box.style.width=this.cell_size_pixels;
	this.minimap_grid_box.style.height=this.cell_size_pixels;
	this.minimap_grid_box.style.background="#EE6B6B";
	this.minimap_grid_box.style.opacity=0.6;
	this.minimap_grid_box.style.position="absolute";
	this.minimap_grid_box.style.left=0 + this.minimap_img.offsetLeft;
	this.minimap_grid_box.style.top=0;
	this.minimap_grid_box.style["z-index"]=101;
	this.minimap_grid_box.style
	//this.modal_img_col.appendChild(this.minimap_grid_box);
	
	this.cell_array=[];
	
	var w=this.grid_height;
	for (j = 0; j < this.grid_height; j++)
	{
		for (i = 0; i < this.grid_width; i++)
		{
			var k = j*w + i;
			this.cell_array[k]=this.minimap_grid_box.cloneNode(true);
			this.cell_array[k].style.left=this.minimap_img.offsetLeft + i*this.cell_size_pixels;
			this.cell_array[k].style.top=j*this.cell_size_pixels;
			this.modal_img_col.appendChild(this.cell_array[k]);
			
			this.cell_array[k].hidden=true;
			
			//Test: checkered board
			//var x = k;
			//if (j%2 == 0) x++;
			//if (x%2 == 0) this.cell_array[k].hidden=true;
		}
	}
	
	
	this.grid_data = {}; // data to pass to state_runner
	this.grid_data.cell_size = this.cell_size;
	this.grid_data.width = this.grid_width;
	this.grid_data.height = this.grid_height;
	this.grid_data.num_cells = this.grid_width*this.grid_height;
	this.grid_data.array = new Array(this.grid_data.num_cells).fill(0);
	this.state_runner.grid_data = this.grid_data;
	
}

navigation_t.prototype.move_grid=function()
{
	if (!this.grid_width)
		return;
	
	this.cell_size_pixels = this.minimap_img.width/this.grid_width;
	
	this.minimap_grid_box.style.width=this.cell_size_pixels;
	this.minimap_grid_box.style.height=this.cell_size_pixels;
	
	var w=this.grid_height;
	for (j = 0; j < this.grid_height; j++)
	{
		for (i = 0; i < this.grid_width; i++)
		{
			var k = j*w + i;
			this.cell_array[k].style.width=this.cell_size_pixels;
			this.cell_array[k].style.height=this.cell_size_pixels;
			this.cell_array[k].style.left=this.minimap_img.offsetLeft + i*this.cell_size_pixels;
			this.cell_array[k].style.top=j*this.cell_size_pixels;
		}
	}
}


navigation_t.prototype.minimap_onclick=function(event)
{

	var myself = this;
		
	if (myself.get_coords(event))
	{
		myself.posX_input.value=myself.posX; //(myself.posX).toFixed(2);
		myself.posY_input.value=myself.posY; //(myself.posY).toFixed(2);
		myself.posX_set=myself.posX;
		myself.posY_set=myself.posY;
	
		if (myself.minimap_mode == "location")
			myself.set_temp_waypoint(myself.posX, myself.posY, "location");
		else if (myself.minimap_mode == "waypoint")
			myself.set_temp_waypoint(myself.posX, myself.posY);
		else
		{
			myself.change_grid_cell(myself.posX, myself.posY);
		}
	}	
}

navigation_t.prototype.change_grid_cell=function(posX, posY)
{
	var myself = this;
	
	var left = parseFloat(this.map_json.width/2) + parseFloat(posX);
	var top = parseFloat(this.map_json.height/2) - parseFloat(posY);
	
	var w=this.grid_height;
	var i = Math.floor(left/myself.cell_size);
	var j = Math.floor(top/myself.cell_size);
	var k = j*w + i;
	myself.cell_array[k].hidden = !myself.cell_array[k].hidden;
	myself.grid_data.array[k] = 1 - myself.grid_data.array[k]; // change between 0 and 1
}

navigation_t.prototype.hide_grid=function()
{
	var n = this.cell_array.length;
	for (i = 0; i < n; i++)
	{
		this.cell_array[i].hidden=true;
	}
}

navigation_t.prototype.on_resize=function()
{
	var myself = this;
	
	var location = this.robot.sensors.location;
	this.posX_set = location.x;
	this.posY_set = location.y;
	this.angle_set = location.angle;
	
	
	this.set_minimap_roomba(this.posX_set, this.posY_set, this.angle_set, true);
	if (this.minimap_temp_waypoint)
		this.set_temp_waypoint(this.minimap_temp_waypoint.posX, this.minimap_temp_waypoint.posY, this.minimap_mode);
	if (this.waypoint_count)
		this.move_waypoints();
	if (this.cell_array)
		this.move_grid();

}

navigation_t.prototype.update_pos_loop=function()
{
	var myself = this;
	if (!this.robot.sensors.location)
		return;
	
	//console.log("looping - posX_curr: " + this.posX_curr)
	var location = this.robot.sensors.location;
	if (this.posX_curr != location.x ||this.posY_curr != location.y || this.angle_curr != location.angle)
	{

		this.posX_set = location.x;
		this.posY_set = location.y;
		this.angle_set = location.angle;
		this.set_minimap_roomba(this.posX_set, this.posY_set, this.angle_set);
	}

	if(!this.status) // status set to "done" by map.js when map is changed
	{
		setTimeout(function(){myself.update_pos_loop()}, 60);
	}
}





