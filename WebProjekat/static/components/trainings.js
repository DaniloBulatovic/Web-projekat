Vue.component("trainings", { 
	data: function () {
	    return {
		  search: "",
		  searchPriceMin: "",
		  searchPriceMax: "",
		  searchDateMin: "",
		  searchDateMax: "",
	      trainings: null,
	      user: { username: "", password: "", role: ""}
	    }
	},
	    template: ` 
    	<div class="middlepane" style="float:right">
    		<h2>Prikaz treninga</h2>
    		<p id="searchParagraph">
    			<label>Tip treninga</label>
    			<select id="trainingTypeDropdown" v-on:change="filterTableByTrainingType()">
    			 	<option>Sve</option>
				    <option>Personalni</option>
				    <option>Grupni</option>
					<option>Teretana</option>
				</select>
				<label v-if="user.role !== 'Menadžer'">Tip objekta</label>
    			<select v-if="user.role !== 'Menadžer'" id="venueTypeDropdown" v-on:change="filterTableByVenueType()">
    			 	<option>Sve</option>
				    <option>Teretana</option>
				    <option>Bazen</option>
				    <option>Sportski centar</option>
					<option>Plesni studio</option>
				</select>
    			<input v-if="user.role !== 'Menadžer'" type="text" v-model="search" placeholder="Pretraga treninga..">
    		</p>
			<p id="searchParagraph">
				<label>Cena</label>
				<input type="number" v-model="searchPriceMin" placeholder="Od..">
				<input type="number" v-model="searchPriceMax" placeholder="Do..">
			</p>
			<p id="searchParagraph">
				<label>Datum</label>
				<label>Od:</label>
				<input type="date" v-model="searchDateMin">
				<label> Do:</label>
				<input type="date" v-model="searchDateMax">
			</p>
    		<table id="trainings_table" class="trainings_table" style="width:100%">
	    		<tr>
	    			<th>Trening</th>
					<th>Tip treninga</th>
	    			<th v-if="user.role !== 'Menadžer'" v-on:click="sortTable(2, false, false)" style="cursor:pointer">Sportski objekat</th>
					<th v-if="user.role !== 'Menadžer'">Tip objekta</th>
	    			<th v-on:click="sortTable(4, false, true)" style="cursor:pointer">Datum treniranja</th>
					<th v-on:click="sortTable(5, true, false)" style="cursor:pointer">Cena</th>
					<th v-if="user.role === 'Administrator'">Trener</th>
					<th v-if="user.role === 'Administrator'">Kupac</th>
					<th v-if="user.role === 'Administrator' || user.role === 'Trener'">Akcija</th>
	    		</tr>
	    		<tr v-for="(t, index) in filteredTrainings">
	    			<td>{{t.training.name}}</td>
					<td>{{t.training.trainingType}}</td>
	    			<td v-if="user.role !== 'Menadžer'">{{t.training.sportsVenue.name}}</td>
					<td v-if="user.role !== 'Menadžer'">{{t.training.sportsVenue.venueType}}</td>
	    			<td>{{formatDateTime(t.dateTimeOfTraining)}}</td>
					<td style="text-align:right">{{t.training.price}}</td>
					<td v-if="user.role === 'Administrator'">{{t.trainer.name}} {{t.trainer.surname}}</td>
					<td v-if="user.role === 'Administrator'">{{t.customer.name}} {{t.customer.surname}}</td> 
					<td v-if="user.role === 'Administrator'" style="text-align:center"><button class="cancel" @click="deleteTraining(t.id, index)">Obriši</button></td>
					<td v-if="user.role === 'Trener'" style="text-align:center"><button class="cancel" @click="cancelTraining(t, index)">Otkaži</button></td>
				</tr>
	    	</table>
    	</div>		  
    	`,
    mounted () {
		axios.post('rest/users/getlogged', this.user, {withCredentials: true}).
					then(response => { 
						this.user = { username: "", password: "", role: ""};
						if (response.data != "ERROR" && response.data != null){
							this.user = response.data;
							if(this.user.role === 'Trener')
								axios.get('rest/trainingsHistory/trainer/' + this.user.id).then(response => (this.trainings = response.data));
							else if (this.user.role === 'Kupac')
								axios.get('rest/trainingsHistory/customer/' + this.user.id).then(response => (this.trainings = response.data));
							else if (this.user.role === 'Menadžer')
								axios.get('rest/trainingsHistory/venue/' + this.user.sportsVenue.id).then(response => (this.trainings = response.data));
							else if (this.user.role === 'Administrator')
								axios.get('rest/trainingsHistory/').then(response => (this.trainings = response.data));
						}else{
							router.push("/");
						}
			});
    },
    methods: {
		cancelTraining : function(training, index) {
			let todaysDate = new Date();
			if (new Date(training.dateTimeOfTraining) > todaysDate.setDate(todaysDate.getDate() + 2)){
	    		r = confirm("Da li ste sigurni?")
	    		if (r){
					if(training.training.price === 0){
						if(training.customer.membership){
							training.customer.membership.numberOfAppointments += 1;
							axios.put('rest/users/edit/' + training.customer.id, training.customer);
						}
					}
		    		axios
		            .delete('rest/trainingsHistory/delete/' + training.id).then(response => (this.trainings.splice(index, 1)));
	    		}
			}else{
				alert("Možete otkazati trening najkasnije 2 dana unapred!");
			}
    	},
		deleteTraining : function(id, index) {
    		r = confirm("Da li ste sigurni?")
    		if (r){
	    		axios
	            .delete('rest/trainingsHistory/delete/' + id).then(response => (this.trainings.splice(index, 1)));
    		}
    	},
		formatDate(date) {
    		return new Intl.DateTimeFormat('en-US', { dateStyle: 'short'}).format(new Date(date))
  		},
		formatDateTime(date) {
    		return new Intl.DateTimeFormat('rs-SR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(date))
  		},
		filteredRoles: function (val, idx, arr) {
          for(var i = 0; i < idx; i++) {
            if(arr[i].role === val.role) {
              return false;
            }
          }
          return true;
        },
    	sortTable(n, isNumber, isDate) {
	    	var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0, managerOffset = 0;
			table = document.getElementById("trainings_table");
			switching = true;
			dir = "asc";
			if(this.user.role === 'Menadžer'){
				managerOffset = 2;
			}
			while (switching) {
				switching = false;
			    rows = table.rows;
			    for (i = 1; i < (rows.length - 1); i++) {
			    	shouldSwitch = false;
			      	x = rows[i].getElementsByTagName("TD")[n - managerOffset];
			      	y = rows[i + 1].getElementsByTagName("TD")[n - managerOffset];
				  	if(isNumber){
						let a = x.innerHTML;
						let b = y.innerHTML;
						if (dir == "asc") {
				        	if (Number(a) > Number(b)) {
				          		shouldSwitch = true;
				          		break;
				        	}
				      	} else if (dir == "desc") {
				        	if (Number(a) < Number(b)) {
					          	shouldSwitch = true;
					          	break;
				        	}
				      	}
				  	}else if(isDate){
						let a = x.innerHTML;
						let b = y.innerHTML;
						let day1 = a.split("\.")[0], month1 = a.split("\.")[1], year1 = a.split("\.")[2], hour1 = a.split(" ")[3].split(":")[0], minutes1 = a.split(":")[1]
						let day2 = b.split("\.")[0], month2 = b.split("\.")[1], year2 = b.split("\.")[2], hour2 = b.split(" ")[3].split(":")[0], minutes2 = b.split(":")[1]
						if (dir == "asc") {
					        if (new Date(year1, month1, day1, hour1, minutes1, 0) > new Date(year2, month2, day2, hour2, minutes2, 0)) {
								shouldSwitch = true;
					          	break;
					        }
				      	}else if (dir == "desc") {
					        if (new Date(year1, month1, day1, hour1, minutes1, 0) < new Date(year2, month2, day2, hour2, minutes2, 0)) {
					          	shouldSwitch = true;
					          	break;
					        }
				    	}
				  	}else{
				    	if (dir == "asc") {
				        	if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
					          	shouldSwitch = true;
					          	break;
				        	}
				      	}else if (dir == "desc") {
				        	if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
				          		shouldSwitch = true;
				          		break;
				        	}
				      	}
				  	}
			    }
			    if (shouldSwitch) {
			      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
			      switching = true;
			      switchcount ++;
			    } else {
			      if (switchcount == 0 && dir == "asc") {
			        dir = "desc";
			        switching = true;
			      }
			    }
			}
		},
		filterTableByTrainingType() {
		  let dropdown, table, rows, cells, type, filter;
		  dropdown = document.getElementById("trainingTypeDropdown");
		  table = document.getElementById("trainings_table");
		  rows = table.getElementsByTagName("tr");
		  filter = dropdown.value;
		
		  for (let row of rows) {
		    cells = row.getElementsByTagName("td");
		    type = cells[1] || null;
		    if (filter === "Sve" || !type || (filter === type.textContent)) {
		      row.style.display = "";
		    }
		    else {
		      row.style.display = "none";
		    }
		  }
		},
		filterTableByVenueType() {
		  let dropdown, table, rows, cells, type, filter;
		  dropdown = document.getElementById("venueTypeDropdown");
		  table = document.getElementById("trainings_table");
		  rows = table.getElementsByTagName("tr");
		  filter = dropdown.value;
		
		  for (let row of rows) {
		    cells = row.getElementsByTagName("td");
		    type = cells[3] || null;
		    if (filter === "Sve" || !type || (filter === type.textContent)) {
		      row.style.display = "";
		    }
		    else {
		      row.style.display = "none";
		    }
		  }
		}
    },
    computed: {
		filteredTrainings() {
			if (this.trainings == null){ 
				if(this.user.role === 'Trener')
					axios.get('rest/trainingsHistory/trainer/' + this.user.id).then(response => (this.trainings = response.data));
				else if (this.user.role === 'Kupac')
					axios.get('rest/trainingsHistory/customer/' + this.user.id).then(response => (this.trainings = response.data));
				else if (this.user.role === 'Menadžer')
					axios.get('rest/trainingsHistory/venue/' + this.user.sportsVenue.id).then(response => (this.trainings = response.data));
				else if (this.user.role === 'Administrator')
					axios.get('rest/trainingsHistory/').then(response => (this.trainings = response.data));
				return this.trainings;
			}
			else{
				return this.trainings.filter(training => {
							return (training.training.sportsVenue.name.toLowerCase().indexOf(this.search.toLowerCase()) > -1)
								&& ((this.searchPriceMin !== '') ? training.training.price >= Number(this.searchPriceMin) : true)
								&& ((this.searchPriceMax !== '') ? training.training.price <= Number(this.searchPriceMax) : true)
								&& ((this.searchDateMin !== '') ? this.formatDate(training.dateTimeOfTraining) >= this.formatDate(this.searchDateMin) : true)
								&& ((this.searchDateMax !== '') ? this.formatDate(training.dateTimeOfTraining) <= this.formatDate(this.searchDateMax) : true)
					});
			}
		}
	}
});