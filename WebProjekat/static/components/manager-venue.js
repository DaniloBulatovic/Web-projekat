Vue.component("manager-venue", {
	data: function () {
		    return {
		      id : 0,
			  visible : false,
		      venue: {id: '', name:null, venueType:0, content:[], isWorking:true, location:{ latitude:null, longitude:null, address:{ street:null, number:null, city:null, country:null, postalCode:null}}, logoPath:'./images/icons/no-image.png', averageGrade:null, workingHours:null},
			  trainings: [],
			  comments: [],
			  users: [],
			  user: {username: null, password: null, role: null},
			  reloadTraining: false,
			  reloadNewTraining: 1,
		      reloadContent: 2,
			  reloadNewTraining: 3,
			  trainingId: 0,
			  contentId: 0,
			  trainers: []
		    }
	},
	template: ` 
<div>
	<div style="display:inline-block; width:75%">
		<div style="width:40%; height:100%; display: inline-block">
			<training :value = this.trainingId :key="this.reloadTraining"></training>
			<new-training :value = this.trainingId :venue = this.venue :key="this.reloadNewTraining"></new-training>
			<venue-content :contentId = this.contentId :venueId = this.venue.id :key="this.reloadContent"></venue-content>
			<new-content :contentId = this.contentId :venueId = this.venue.id :key="this.reloadNewContent"></new-content>
		</div>
		<div style="width:60%; height: 100%; display: inline-block; float:right">
		<form v-if=visible>
		<h3>Prikaz vašeg sportskog objekta</h3>
			<table style="width:100%; height:100%; background:aliceblue; border: 1px solid gray">
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
				<tr>
					<td>Sadržaj</td>
					<td></td>
				</tr>
				<tr>
					<td><button id="add-content" @click="addContent">Dodaj sadržaj</button></td>
				</tr>
				<tr v-if=venue.content>
					<td colspan=2>
						<table class="venue_content" style="margin:auto; width:100%; text-align:center">
							<tr>
								<th>Slika</th>
								<th>Naziv</th>
								<th>Tip</th>
								<th>Opis</th>
								<th>Trajanje</th>
								<th>Akcija</th>
							</tr>
							<tr v-for="(c, index) in venue.content">
								<td style="text-align:center"><img v-bind:src=c.image width="50%"></img></td>
								<td>{{c.name}}</td>
								<td>{{c.type}}</td>
								<td>{{c.description}}</td>
								<td>{{c.duration}}</td>
								<td><button class="edit-content" v-on:click="editContent(c.id)">Izmeni</button></td>
							</tr>
						</table>
					</td>
				</tr>
				<tr>
					<td>Treninzi</td>
				<tr>
				<tr>
					<td><button id="add-training" @click="addTraining">Dodaj trening</button></td>
				</tr>
				<tr v-if=trainings.length>
					<td colspan=2>
						<table class="venue_trainings" style="margin:auto; width:100%; text-align:center">
							<tr>
								<th>Slika</th>
								<th>Naziv</th>
								<th>Tip</th>
								<th>Opis</th>
								<th>Trener</th>
								<th>Trajanje</th>
								<th>Cena</th>
								<th>Akcija</th>
							</tr>
							<tr v-for="(t, index) in trainings">
								<td style="text-align:center"><img v-bind:src=t.image width="50%"></img></td>
								<td>{{t.name}}</td>
								<td>{{t.trainingType}}</td>
								<td>{{t.description}}</td>
								<td>{{t.trainer.name}} {{t.trainer.surname}}</td>
								<td>{{t.duration}}</td>
								<td style="text-align:center">{{t.price}}</td>
								<td><button class="edit-training" v-on:click="editTraining(t.id)">Izmeni</button></td>
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
							</tr>
							<tr v-for="(c, index) in comments">
								<td>{{c.customer.name}} {{c.customer.surname}}</td>
								<td>{{c.text}}</td>
								<td style="text-align:center">{{c.grade}}</td>
							</tr>
						</table>
					</td>
				</tr>
			</table>
		</form>
		</div>
	</div>
	<div style="width:25%; display: inline-block; float:right; margin: 0 -25%">
		<h3>Treneri</h3>
		<table class="venue_trainings">
			<tr>
				<th>Ime</th>
				<th>Prezime</th>
				<th>Datum rođenja</th>
			</tr>
			<tr v-for="(t, index) in trainers">
				<td>{{t.trainer.name}}</td>
				<td>{{t.trainer.surname}}</td>
				<td>{{t.trainer.dateOfBirth}}</td>
			</tr>
		</table>
		<h3>Korisnici koji su posetili objekat</h3>
		<table class="venue_trainings">
			<tr>
				<th>Ime</th>
				<th>Prezime</th>
				<th>Datum rođenja</th>
				<th>Tip korisnika</th>
				<th>Bodovi</th>
			</tr>
			<tr v-for="(u, index) in users">
				<td>{{u.name}}</td>
				<td>{{u.surname}}</td>
				<td>{{u.dateOfBirth}}</td>
				<td v-if="u.customerType != null">{{u.customerType.typeName}}</td>
				<td v-if="u.customerType == null"> </td>
	    		<td style="text-align:center">{{u.points}}</td>
			</tr>
		</table>
	</div>
</div>		  
`
	, 
	methods : {
		addTraining : function() {
    		this.trainingId = -1;
			this.contentId = 0;
			this.reloadComponents();
    	},
		editTraining : function(id) {
    		event.preventDefault();
			this.trainingId = id;
			this.contentId = 0;
			this.reloadComponents();
    	},
		addContent : function() {
			this.trainingId = 0;
    		this.contentId = -1;
			this.reloadComponents();
    	},
		editContent : function(id) {
    		event.preventDefault();
			this.trainingId = 0;
			this.contentId = id;
			this.reloadComponents();
    	},
		reloadComponents : function(){
			this.reloadTraining = !this.reloadTraining;
			this.reloadNewTraining += this.reloadNewTraining;
			this.reloadContent += this.reloadContent;
			this.reloadNewContent += this.reloadNewContent;
		}
	},
	mounted () {
		axios.post('rest/users/getlogged', this.user, {withCredentials: true}).
					then(response => { 
						this.user = { username: "", password: "", role: ""};
						if (response.data != "ERROR" && response.data != null){
							this.user = response.data;
							if(this.user.role === 'Menadžer' && this.user.sportsVenue !== null){
								this.id = this.user.sportsVenue.id;
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
										const uniqueElementsBy = (arr, fn) =>
											  arr.reduce((acc, v) => {
											    if (!acc.some(x => fn(v, x))) acc.push(v);
											    return acc;
											  }, []);
										this.trainers = uniqueElementsBy(this.trainings,(a, b) => a.trainer.id === b.trainer.id);
									})
									axios.post('rest/comments/venue/' + this.id, this.user)
									.then(response => {
										this.comments = response.data;
									})
									axios.get('rest/users/venue/' + this.id)
									.then(response => {
										this.users = response.data;
									})
								}else{
									this.visible = false;
								}
							}
						}else{
								router.push('/');
						}
			});
    }
});