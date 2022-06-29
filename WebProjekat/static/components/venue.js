Vue.component("venue", {
	props: ['value'],
	data: function () {
		    return {
		      id : 0,
			  visible : false,
		      venue: {id: '', name:null, venueType:0, content:null, isWorking:true, location:null, logoPath:null, averageGrade:null, workingHours:null}
		    }
	},
	template: ` 
<div>
	<form v-if=visible>
	<h2>Prikaz sportskog objekta</h2>
		<table>
			<tr>
				<td><img v-bind:src=venue.logoPath width="75%"></img></td>
				<td></td>
			</tr>
			<tr>
				<td>Ime</td>
				<td><input type = "text" v-model = "venue.name" readonly></td>
			</tr>
			<tr>
				<td>Tip</td>
				<td><input type = "text" v-model = "venue.venueType" readonly></td>
			</tr>
			<tr>
				<td>Status</td>
				<td><input type = "text" v-model = "venue.isWorking ? 'Radi' : 'Ne radi'" readonly></td>
			</tr>
			<tr>
				<td>Lokacija</td>
				<td><input type = "text" v-model = "venue.location.address.street + ' '
													+ venue.location.address.number + ', '
													+ venue.location.address.city + ', ' 
													+ venue.location.address.postalCode" readonly></td>
			</tr
			</tr>
			<tr>
				<td>Prosečna ocena</td>
				<td><input type = "text" v-model = "venue.averageGrade" readonly></td>
			</tr>
		</table>
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
		this.id = this.value;
		if (this.id > 0){
			this.visible = true;
	        axios
	          .get('rest/venues/' + this.id)
	          .then(response => (this.venue = response.data))
		}else{
			this.visible = false;
		}
    }
});