Vue.component("edit-venue", {
	data: function () {
		    return {
		      title: "Dodaj sportski objekat",
		      value: "Dodaj",
		      id : -1,
		      venue: {id: '', name:null, venueType:0, content:null, isWorking:true, location:null, logo:null, averageGrade:null, workingHours:null}
		    }
	},
	template: ` 
<div>
	{{title}}
	<form>
		<label>Ime</label>
		<input type = "text" v-model = "venue.name" name = "name">
		<input type = "submit" v-on:click = "editVenue" v-bind:value = "this.value">
	</form>
</div>		  
`
	, 
	methods : {
		editVenue : function () {
			event.preventDefault();
			if (this.id != -1){
				axios.put('rest/venues/edit/' + this.venue.id, this.venue).
				then(response => (router.push(`/`)));
			}
			else{
				axios.post('rest/venues/add', this.venue).
				then(response => (router.push(`/`)));
			}
		}
	},
	mounted () {
		this.id = this.$route.params.id;
		if (this.id != -1){
			this.title = "Izmeni sportski objekat";
			this.value = "Izmeni";
	        axios
	          .get('rest/venues/' + this.id)
	          .then(response => (this.venue = response.data))
		}
    }
});