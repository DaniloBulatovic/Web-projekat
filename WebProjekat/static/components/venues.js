Vue.component("venues", { 
	data: function () {
	    return {
		  search: "",
		  multiSearch: false,
		  searchName: "",
		  searchType: "",
		  searchLocation: "",
		  searchGrade: "",
		  selectedId: 0,
		  reloadVenue: false,
		  reloadNewVenue: 1,
		  filterWorking: false,
	      venues: null,
		  user: { username: "", password: "", role: ""},
	    }
	},
	    template: ` 
    	<div>
			<div class="leftpane">
				<div id="left-pane" style="margin:auto">
					<venue :value = this.selectedId :user = this.user :key="this.reloadVenue"></venue>
					<new-venue :value = this.selectedId :key="this.reloadNewVenue"></new-venue>
		    	</div>
	    	</div>
			<div class="middlepane" style="float:right">
	    		<h2>Prikaz sportskih objekata</h2>
	    		<p id="searchParagraph">
	    			<label>Tip</label>
	    			<select id="typeDropdown" v-on:change="filterTableByType()">
	    			 	<option>Sve</option>
					    <option v-for="(v, index) in filteredVenues">{{v.venueType}}</option>
					</select>
					<input type="checkbox" v-model="filterWorking">Prikaži samo otvorene</input>
	    			<input type="text" v-model="search" v-if="!multiSearch" placeholder="Pretraga objekata.."></input>
	    		</p>
				<p id="searchParagraph">
					<input type="checkbox" v-model="multiSearch">Višestruka pretraga</input>
				</p>
				<p id="searchParagraph" v-if=multiSearch>
	    			<input type="text" v-model="searchName" placeholder="Naziv..">
					<input type="text" v-model="searchType" placeholder="Tip..">
					<input type="text" v-model="searchLocation" placeholder="Lokacija..">
					<input type="text" v-model="searchGrade" placeholder="Prosečna ocena..">
	    		</p>
				<button class="confirm" v-on:click = "showAddVenue" v-if="this.user.role === 'Administrator'">Dodaj novi objekat</button>
	    		<table id="venues_table" class="default-table">
		    		<tr>
		    			<th>Logo</th>
		    			<th v-on:click="sortTable(1, false)" style="cursor:pointer">Naziv</th>
		    			<th>Tip</th>
		    			<th v-on:click="sortTable(3, false)" style="cursor:pointer">Lokacija</th>
		    			<th v-on:click="sortTable(4, true)" style="cursor:pointer">Prosečna ocena</th>
		    			<th>Radno vreme</th>
		    		</tr>
		    		<tr v-for="(v, index) in filteredVenues" v-on:click="selectedVenue(v.id)">
		    			<td style="text-align:center"><img v-bind:src=v.logoPath width="75%"></img></td>
		    			<td>{{v.name}}</td>
		    			<td>{{v.venueType}}</td>
		    			<td>{{v.location.address.street}} {{v.location.address.number}}, {{v.location.address.city}}, {{v.location.address.postalCode}} ({{v.location.latitude}}, {{v.location.longitude}})</td>
		    			<td style="text-align:center">{{v.averageGrade}}</td>
		    			<td style="text-align:center">{{v.workingHours}}</td>
		    		</tr>
		    	</table>
			</div>
    	</div>		  
    	`,
    mounted () {
        axios
          .get('rest/venues/')
          .then(response => (this.venues = response.data));
		axios.post('rest/users/getlogged', this.user, {withCredentials: true}).
					then(response => { 
						this.user = { username: "", password: "", role: ""};
						if (response.data != "ERROR" && response.data != null){
							this.user = response.data;
						}
			});
    },
    methods: {
    	showAddVenue : function() {
    		this.selectedId = -1;
			this.reloadVenue = !this.reloadVenue;
			this.reloadNewVenue += this.reloadNewVenue;
    	},
    	sortTable(n, isNumber) {
			  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
			  table = document.getElementById("venues_table");
			  switching = true;
			  dir = "asc";
			  while (switching) {
			    switching = false;
			    rows = table.rows;
			    for (i = 1; i < (rows.length - 1); i++) {
			      shouldSwitch = false;
			      x = rows[i].getElementsByTagName("TD")[n];
			      y = rows[i + 1].getElementsByTagName("TD")[n];
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
				  }else{
				      if (dir == "asc") {
				        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
				          shouldSwitch = true;
				          break;
				        }
				      } else if (dir == "desc") {
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
		filterTableByType() {
		  let dropdown, table, rows, cells, type, filter;
		  dropdown = document.getElementById("typeDropdown");
		  table = document.getElementById("venues_table");
		  rows = table.getElementsByTagName("tr");
		  filter = dropdown.value;
		
		  for (let row of rows) {
		    cells = row.getElementsByTagName("td");
		    type = cells[2] || null;
		    if (filter === "Sve" || !type || (filter === type.textContent)) {
		      row.style.display = "";
		    }
		    else {
		      row.style.display = "none";
		    }
		  }
		},
		selectedVenue : function(id){
			this.selectedId = id;
			this.reloadVenue = !this.reloadVenue;
			this.reloadNewVenue += this.reloadNewVenue;
		}
    },
    computed: {
		filteredVenues() {
			if (this.venues == null){ 
				axios.get('rest/venues/').then(response => (this.venues = response.data));
				return this.venues;
			}
			else if(!this.multiSearch){
				if (this.filterWorking == true){
					return this.venues.filter(venue => {
	    	     			return (venue.isWorking == true) && (venue.name.toLowerCase().indexOf(this.search.toLowerCase()) > -1)
	    	     			 || (venue.venueType.toLowerCase().indexOf(this.search.toLowerCase()) > -1)
	    	     			 || (venue.location.address.street.toLowerCase().indexOf(this.search.toLowerCase()) > -1)
	    	     			 || (venue.location.address.number.toLowerCase().indexOf(this.search.toLowerCase()) > -1)
	    	     			 || (venue.location.address.city.toLowerCase().indexOf(this.search.toLowerCase()) > -1)
	    	     			 || (venue.location.address.postalCode.toLowerCase().indexOf(this.search.toLowerCase()) > -1)
	    	     			 || (venue.location.address.country.toLowerCase().indexOf(this.search.toLowerCase()) > -1)
	    	     			 || (venue.averageGrade.toString().indexOf(this.search) > -1)})
				}
				else{
					return this.venues.filter(venue => {
	    	     			return (venue.name.toLowerCase().indexOf(this.search.toLowerCase()) > -1)
	    	     			 || (venue.venueType.toLowerCase().indexOf(this.search.toLowerCase()) > -1)
	    	     			 || (venue.location.address.street.toLowerCase().indexOf(this.search.toLowerCase()) > -1)
	    	     			 || (venue.location.address.number.toLowerCase().indexOf(this.search.toLowerCase()) > -1)
	    	     			 || (venue.location.address.city.toLowerCase().indexOf(this.search.toLowerCase()) > -1)
	    	     			 || (venue.location.address.postalCode.toLowerCase().indexOf(this.search.toLowerCase()) > -1)
	    	     			 || (venue.location.address.country.toLowerCase().indexOf(this.search.toLowerCase()) > -1)
	    	     			 || (venue.averageGrade.toString().indexOf(this.search) > -1)})
				}
			}else{
				if(this.filterWorking == true){
					return this.venues.filter(venue => {
						return (venue.isWorking == true) && (venue.name.toLowerCase().indexOf(this.searchName.toLowerCase()) > -1)
						 && (venue.venueType.toLowerCase().indexOf(this.searchType.toLowerCase()) > -1)
						 && ((venue.location.address.street.toLowerCase().indexOf(this.searchLocation.toLowerCase()) > -1)
						 || (venue.location.address.number.toLowerCase().indexOf(this.searchLocation.toLowerCase()) > -1)
						 || (venue.location.address.city.toLowerCase().indexOf(this.searchLocation.toLowerCase()) > -1)
						 || (venue.location.address.postalCode.toLowerCase().indexOf(this.searchLocation.toLowerCase()) > -1)
						 || (venue.location.address.country.toLowerCase().indexOf(this.searchLocation.toLowerCase()) > -1))
						 && (venue.averageGrade.toString().indexOf(this.searchGrade) > -1)
					});
				}else{
					return this.venues.filter(venue => {
						return (venue.name.toLowerCase().indexOf(this.searchName.toLowerCase()) > -1)
						 && (venue.venueType.toLowerCase().indexOf(this.searchType.toLowerCase()) > -1)
						 && ((venue.location.address.street.toLowerCase().indexOf(this.searchLocation.toLowerCase()) > -1)
						 || (venue.location.address.number.toLowerCase().indexOf(this.searchLocation.toLowerCase()) > -1)
						 || (venue.location.address.city.toLowerCase().indexOf(this.searchLocation.toLowerCase()) > -1)
						 || (venue.location.address.postalCode.toLowerCase().indexOf(this.searchLocation.toLowerCase()) > -1)
						 || (venue.location.address.country.toLowerCase().indexOf(this.searchLocation.toLowerCase()) > -1))
						 && (venue.averageGrade.toString().indexOf(this.searchGrade) > -1)
					});
				}
			}
		}
	}
});