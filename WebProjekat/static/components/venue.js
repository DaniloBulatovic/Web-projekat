Vue.component("venue", {
	props: ['value', 'user'],
	data: function () {
		    return {
		      id : 0,
			  visible : false,
		      venue: {id: '', name:null, venueType:0, content:[], isWorking:true, location:{ latitude:null, longitude:null, address:{ street:null, number:null, city:null, country:null, postalCode:null}}, logoPath:'./images/icons/no-image.png', averageGrade:null, workingHours:null},
			  trainings: [],
			  comments: []
		    }
	},
	template: ` 
<div>
	<form v-if=visible>
	<h3>Prikaz sportskog objekta</h3>
		<table style="width:100%; background:aliceblue">
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
			</tr>
			<tr>
				<td><input type = "text" v-model = "'Lat: ' + venue.location.latitude"></td>
				<td><input type = "text" v-model = "'Lon: ' + venue.location.longitude"></td>
			</tr>
			<tr>
				<th colspan=2><div ref="map-root" id="map" class="map" style="height:300px"></div></th>
			</tr>
			<tr>
				<td>Prosečna ocena</td>
				<td><input type = "text" v-model = "venue.averageGrade" readonly></td>
			</tr>
			<tr>
				<td>Radno vreme</td>
				<td><input type = "text" v-model = "venue.workingHours" readonly></td>
			</tr>
			<tr v-if=venue.content>
				<td>Sadržaj</td>
				<td></td>
			</tr>
			<tr v-if=venue.content>
				<td colspan=2>
					<table class="venue_content" style="width:100%">
						<tr>
							<th>Slika</th>
							<th>Naziv</th>
							<th>Tip</th>
							<th>Opis</th>
							<th>Trajanje</th>
						</tr>
						<tr v-for="(c, index) in venue.content">
							<td style="text-align:center"><img v-bind:src=c.image width="50%"></img></td>
							<td>{{c.name}}</td>
							<td>{{c.type}}</td>
							<td>{{c.description}}</td>
							<td style="text-align:center">{{c.duration}}</td>
						</tr>
					</table>
				</td>
			</tr>
			<tr v-if=trainings.length>
				<td>Treninzi</td>
				<td></td>
			</tr>
			<tr v-if=trainings.length>
				<td colspan=2>
					<table class="venue_trainings" style="width:100%">
						<tr>
							<th>Slika</th>
							<th>Naziv</th>
							<th>Tip</th>
							<th>Opis</th>
							<th>Trener</th>
							<th>Cena</th>
						</tr>
						<tr v-for="(t, index) in trainings">
							<td style="text-align:center"><img v-bind:src=t.image width="50%"></img></td>
							<td>{{t.name}}</td>
							<td>{{t.trainingType}}</td>
							<td>{{t.description}}</td>
							<td>{{t.trainer.name}} {{t.trainer.surname}}</td>
							<td style="text-align:center">{{t.price}}</td>
						</tr>
					</table>
				</td>
			</tr>
			<tr v-if=comments.length>
				<td>Komentari</td>
				<td></td>
			</tr>
			<tr v-if=comments.length>
				<td colspan=2>
					<table class="venue_trainings">
						<tr>
							<th>Kupac</th>
							<th>Komentar</th>
							<th>Ocena</th>
							<th v-if="user.role === 'Administrator'">Status</th>
							<th v-if="user.role === 'Administrator'">Akcija</th>
						</tr>
						<tr v-for="(c, index) in comments">
							<td>{{c.customer.name}} {{c.customer.surname}}</td>
							<td>{{c.text}}</td>
							<td style="text-align:center">{{c.grade}}</td>
							<td v-if="user.role === 'Administrator' && c.isApproved">Odobren</td>
							<td v-if="user.role === 'Administrator' && !c.isApproved">Nije odobren</td>
							<td v-if="user.role === 'Administrator'" style="text-align:center"><button v-if="!c.isApproved" class="confirm" @click="approveComment(c.id, c)">Odobri</button><button class="cancel" @click="deleteComment(c.id, index)">Obriši</button></td>
						</tr>
					</table>
				</td>
			</tr>
			<tr v-if="user.role === 'Administrator'">
				<th colspan=2><button v-on:click="deleteVenue" id="delete-venue">Obriši objekat</button></th>
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
		},
		deleteVenue : function() {
    		r = confirm("Da li ste sigurni?")
    		if (r){
	    		axios
	            .delete('rest/venues/delete/' + this.id).then(response => (this.$router.go()));
    		}
    	},
		approveComment : function(id, comment){
			comment.isApproved = true;
			axios.put('rest/comments/edit/' + id, comment);
		},
		deleteComment : function(id, index){
			r = confirm("Da li ste sigurni?")
    		if (r){
	    		axios
	            .delete('rest/comments/delete/' + id).then(response => (this.comments.splice(index, 1)));
    		}
		}
	},
	mounted () {
		this.id = this.value;
		if (this.id > 0){
			this.visible = true;
	        axios
	          .get('rest/venues/' + this.id)
	          .then(response => {
				this.venue = response.data;
				
				const iconFeature = new ol.Feature({
				  geometry: new ol.geom.Point(ol.proj.fromLonLat([this.venue.location.longitude, this.venue.location.latitude])),
				  name: this.venue.name
				});
				
				var map = new ol.Map({
				  layers: [
				    new ol.layer.Tile({source: new ol.source.OSM()}),
					new ol.layer.Vector({
					      source: new ol.source.Vector({
					        features: [iconFeature]
					      }),
					      style: new ol.style.Style({
					        image: new ol.style.Icon({
							  scale: 0.05,
					          anchor: [0.5, 460],
					          anchorXUnits: 'fraction',
					          anchorYUnits: 'pixels',
					          src: './images/icons/location.png'
					        })
					      })
					    })
				  ],
				  view: new ol.View({
				    center: ol.proj.fromLonLat([this.venue.location.longitude, this.venue.location.latitude]),
				    zoom: 15,
					constrainResolution: true
				  }),
				  target: this.$refs['map-root']
				});
		});
			axios.get('rest/trainings/venue/' + this.id)
			.then(response => {
				this.trainings = response.data;
			})
			axios.post('rest/comments/venue/' + this.id, this.user)
			.then(response => {
				this.comments = response.data;
			})
		}else{
			this.visible = false;
		}
    }
});