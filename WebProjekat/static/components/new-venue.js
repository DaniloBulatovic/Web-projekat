Vue.component("new-venue", {
	props: ['value'],
	data: function () {
		    return {
		      id : 0,
			  visible : false,
		      venue: {id: ' ', name:'', venueType:'', content:null, isWorking:true, location: { latitude:0, longitude:0, address:{ street:'', number:'', city:'', country:'', postalCode:''}}, logoPath:null, averageGrade:null, workingHours:null},
			  selectedFile: null,
			  managers: [],
			  selectedIndex: null,
			  selectedManager: null,
			  selectedAddress: null,
			  newManager: {username: null, password: null, role: "Menadžer"},
			  managerError: '',
			  error: ''
			}
	},
	template: ` 
<div>
	<form v-if=visible>
	<h3>Dodavanje novog sportskog objekta</h3>
		<table style="width:100%; background:aliceblue; table-layout: fixed">
			<tr>
				<td><img v-bind:src=venue.logoPath width="75%"></img></td>
			</tr>
			<tr>
				<td>
					<form method='post' enctype='multipart/form-data'>
						<input type= "file" @change="onFileSelected" name="uploaded_file" accept="image/png, image/jpeg">
						<button @click="onUpload">Otpremi</button>
					</form>
				</td>
			</tr>
			<tr>
				<td>Ime</td>
				<td><input type = "text" v-model = "venue.name"></td>
			</tr>
			<tr>
				<td></td>
				<td><label v-if="venue.name === ''" style="color:red">{{error}}</label></td>
			</tr>
			<tr>
				<td>Tip</td>
				<td><select v-model="venue.venueType">
						<option>Teretana</option>
						<option>Bazen</option>
						<option>Sportski centar</option>
						<option>Plesni studio</option>
					</select></td>
			</tr>
			<tr>
				<td></td>
				<td><label v-if="venue.venueType === ''" style="color:red">{{error}}</label></td>
			</tr>
			<tr>
				<td>Lokacija</td>
				<td><input type = "text" v-model = "venue.location.address.street + ' '
													+ venue.location.address.number + ', '
													+ venue.location.address.city + ', ' 
													+ venue.location.address.postalCode"></td>
			</tr>
			<tr>
				<td></td>
				<td><label v-if="venue.location.address.street === ''
						|| venue.location.address.number === ''
						|| venue.location.address.city === ''
						|| venue.location.address.postalCode === ''" style="color:red">{{error}}</label></td>
			</tr>
			<tr>
				<td><input type = "text" v-model = "'Lat: ' + venue.location.latitude"></td>
				<td><input type = "text" v-model = "'Lon: ' + venue.location.longitude"></td>
			</tr>
			<tr>
				<td><label v-if="venue.location.latitude === 0" style="color:red">{{error}}</label></td>
				<td><label v-if="venue.location.longitude === 0" style="color:red">{{error}}</label></td>
			</tr>
			<tr>
				<th colspan=2><div ref="map-root" id="map" class="map" style="height:300px"></div></th>
			</tr>
			<tr v-if="managers.length > 0">
				<td>Menadžer</td>
				<td><select v-model="selectedIndex" @change="switchView($event, $event.target.selectedIndex)"><option v-for="(m, index) in managers">{{m.name}} {{m.surname}}</option></select></td>
			</tr>
			<tr>
				<td></td>
				<td> <label v-if="selectedManager === null" style="color:red">{{error}}</label></td>
			</tr>
			<tr v-if="managers.length == 0">
				<th colspan=2>Nema slobodnog menadžera. Kreirajte novog:</th>
			</tr>
			<tr v-if="managers.length == 0">
				<td>Korisničko ime</td>
				<td><input type= "text" v-model="newManager.username"></td>
			</tr>
			<tr v-if="managers.length == 0">
				<td>Lozinka</td>
				<td><input type= "password" v-model="newManager.password"></td>
			</tr>
			<tr v-if="managers.length == 0">
				<th colspan=2><input type="submit" v-on:click="addNewManager" value="Kreiraj novog menadžera"></th>
			</tr>
			<tr v-if="managers.length == 0">
				<th colspan=2 style="color:red">{{managerError}}</th>
			</tr>
			<tr>
				<th colspan=2><input type="submit" v-on:click="addVenue" value="Kreiraj sportski objekat"></th>
			</tr>
		</table>
	</form>
</div>		  
`
	, 
	methods : {
		onFileSelected : function(event){
			this.selectedFile = event.target.files[0];
		},
		onUpload : function(){
			event.preventDefault();
			let data = new FormData();
			data.append('uploaded_file', this.selectedFile, this.selectedFile.name);
		
			axios.post('rest/venue/upload', data, {
			  headers: {
			    'accept': '*/*',
			    'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
			  }
			})
			.then(response =>{
				console.log(response.data);
				this.venue.logoPath = response.data;
			});
		},
		switchView : function(event, selectedIndex) {
      		this.selectedManager = this.managers[selectedIndex];
    	},
		addNewManager : function(){
			event.preventDefault();
			this.newManager.name = this.newManager.username;
			this.newManager.surname = this.newManager.username;
			axios.post('rest/users/add', this.newManager).
				then(response => {
					if (response.data == "ERROR"){
						this.managerError = "Korisničko ime je zauzeto!";
					}else{
						alert("Uspešno registrovan novi menadžer");
						axios.get('rest/managers/')
						.then(response => {
							this.managers = response.data;
							this.selectedIndex = this.managers[0].name + " " + this.managers[0].surname;
						});
					}
				});
		},
		addVenue : function () {
			event.preventDefault();
			this.validateFields();
			if (this.error === ''){
				this.selectedManager.sportsVenue = this.venue;
				axios.put('rest/users/edit/' + this.selectedManager.id, this.selectedManager);
				axios.post('rest/venues/add', this.venue)
				.then(response => {
					this.visible = false;
					router.push(`/`);
				});
			}
		},
		validateFields : function(){
			if (this.venue.name === ''
				|| this.venue.venueType === ''
				|| this.venue.location.latitude === 0
				|| this.venue.location.longitude === 0
				|| this.venue.location.address.street === ''
				|| this.venue.location.address.number === ''
				|| this.venue.location.address.city === ''
				|| this.venue.location.address.postalCode === ''
				|| this.selectedManager === null)
				this.error = "Obavezno!";
			else
				this.error = "";
		},
		mapClick : function (event) {
		  	var coord = ol.proj.toLonLat(event.coordinate);
			this.venue.location.latitude = coord[1].toFixed(6);
			this.venue.location.longitude = coord[0].toFixed(6);
			this.reverseGeocode(coord).then(response => {
				this.venue.location.address.street = response.address.road;
				this.venue.location.address.number = response.address.house_number != undefined ? response.address.house_number : 'ББ';
				this.venue.location.address.city = response.address.city;
				this.venue.location.address.country = response.address.country;
				this.venue.location.address.postalCode = response.address.postcode;
			});
		},
		reverseGeocode : async function(coords) {
		  const response = await fetch('http://nominatim.openstreetmap.org/reverse?format=json&lon=' + coords[0] + '&lat=' + coords[1]);
            return await response.json();
		}
	},
	mounted () {
		this.id = this.value;
		if (this.id == -1){
			this.visible = true;
			axios.get('rest/managers/')
			.then(response => {
				this.managers = response.data;
				var map = new ol.Map({
				  layers: [
				    new ol.layer.Tile({source: new ol.source.OSM()}),
				  ],
				  view: new ol.View({
				    center: ol.proj.fromLonLat([19.823372, 45.239635]),
				    zoom: 14,
					constrainResolution: true
				  }),
				  target: this.$refs['map-root']
				});
				map.on('click', this.mapClick);
			});
		}else{
			this.visible = false;
		}
    }
});