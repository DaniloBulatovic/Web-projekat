Vue.component("venues", { 
	data: function () {
	    return {
		  search: "",
	      venues: null
	    }
	},
	    template: ` 
    	<div>
    		<h2>Prikaz sportskih objekata</h2>
    		<p id="searchParagraph"><input type="text" v-model="search" placeholder="Pretraga objekata.."></p>
    		<table class="venues_table">
	    		<tr>
	    			<th>Logo</th>
	    			<th>Naziv</th>
	    			<th>Tip</th>
	    			<th>Lokacija</th>
	    			<th>Prosečna ocena</th>
	    			<th>Radno vreme</th>
	    			<!--<th>Akcija</th>-->
	    		</tr>
	    		<tr v-for="(v, index) in filteredVenues">
	    			<td style="text-align:center"><img v-bind:src=v.logoPath width="75%"></img></td>
	    			<td>{{v.name}}</td>
	    			<td>{{v.venueType}}</td>
	    			<td>{{v.location.address}}</td>
	    			<td style="text-align:center">{{v.averageGrade}}</td>
	    			<td style="text-align:center">{{v.workingHours}}</td>
	    			<!--<td>
	    				<button v-on:click="editVenue(v.id)">Izmeni</button>
	    				<button v-on:click="deleteVenue(v.id, index)">Obriši</button>
	    			</td>-->
	    		</tr>
	    	</table>
    		<!--<button v-on:click = "addVenue">Dodaj novi objekat</button>-->
    	</div>		  
    	`,
    mounted () {
        axios
          .get('rest/venues/')
          .then(response => (this.venues = response.data))
    },
    methods: {
    	addVenue : function() {
    		router.push(`/venues/-1`);
    	},
    	editVenue : function(id) {
    		router.push(`/venues/${id}`);
    	},
    	deleteVenue : function(id, index) {
    		r = confirm("Are you sure?")
    		if (r){
	    		axios
	            .delete('rest/venues/delete/' + id)
	            .then(response => (this.venues.splice(index, 1)))
    		}
    	}
    },
    computed: {
		filteredVenues() {
			if (this.venues == null){ 
				axios.get('rest/venues/').then(response => (this.venues = response.data));
				return this.venues;
			}
			else{
				return this.venues.filter(venue => {
    	     			return (venue.name.toLowerCase().indexOf(this.search.toLowerCase()) > -1)
    	     			 || (venue.venueType.toLowerCase().indexOf(this.search.toLowerCase()) > -1)
    	     			 || (venue.location.address.toLowerCase().indexOf(this.search.toLowerCase()) > -1)
    	     			 || (venue.averageGrade.toString().indexOf(this.search) > -1)})
			}
		}
	}
});