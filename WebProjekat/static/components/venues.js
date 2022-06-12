Vue.component("venues", { 
	data: function () {
	    return {
	      venues: null
	    }
	},
	    template: ` 
    	<div>
    		<h3 style="text-align:center">Prikaz sportskih objekata</h3>
    		<table>
	    		<tr>
	    			<th>Naziv</th>
	    			<th>Tip</th>
	    			<th>Lokacija</th>
	    			<th>Prosečna ocena</th>
	    			<!--<th>Akcija</th>-->
	    		</tr>
	    		<tr v-for="(v, index) in venues">
	    			<td>{{v.name}}</td>
	    			<td>{{v.venueType}}</td>
	    			<td>{{v.location.address}}</td>
	    			<td style="text-align:center">{{v.averageGrade}}</td>
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
    }
});