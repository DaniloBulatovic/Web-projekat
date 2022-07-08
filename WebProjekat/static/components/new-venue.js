Vue.component("new-venue", {
	props: ['value'],
	data: function () {
		    return {
		      id : 0,
			  visible : false,
		      venue: {id: ' ', name:'', venueType:'', content:null, isWorking:true, location: { latitude:0, longitude:0, address:{ street:'', number:'', city:'', country:'', postalCode:''}}, logoPath:'./images/icons/no-image.png', averageGrade:null, workingHours:null},
			  hoursFrom: 0,
			  hoursTo: 0,
			  selectedFile: null,
			  managers: [],
			  selectedIndex: null,
			  selectedManager: null,
			  selectedAddress: null,
			  newManager: {username: null, password: null, role: "Menadžer"},
			  map: null,
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
						<button class="button" @click="onUpload">Otpremi</button>
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
			<tr>
				<td>Radno vreme</td>
				<td></td>
			</tr>
			<tr>
				<td></td>
				<td><input type = "number" min="0" max="23" v-model = "hoursFrom" placeholder="Od..."></td>
			</tr>
			<tr>
				<td></td>
				<td v-if="(Number(this.hoursFrom) < 0 || Number(this.hoursFrom) > 23)" style="color:red">Mora biti između 0 i 23!</td>
			</tr>
			<tr>
				<td></td>
				<td><input type = "number" min="0" max="23" v-model = "hoursTo" placeholder="Do..."></td>
			</tr>
			<tr>
				<td></td>
				<td v-if="(Number(this.hoursTo) < 0 && Number(this.hoursTo) > 23)" style="color:red">Mora biti između 0 i 23!</td>
			</tr>
			<tr v-if="managers.length > 0">
				<td>Menadžer</td>
				<td><select v-model="selectedIndex" @change="switchView($event, $event.target.selectedIndex)"><option v-for="(m, index) in managers">{{m.name}} {{m.surname}}</option></select></td>
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
				<th colspan=2><input class="button" type="submit" v-on:click="addNewManager" value="Kreiraj novog menadžera"></th>
			</tr>
			<tr v-if="managers.length == 0">
				<th colspan=2 style="color:red">{{managerError}}</th>
			</tr>
			<tr>
				<td></td>
				<td><label v-if="selectedManager === null" style="color:red">{{error}}</label></td>
			</tr>
			<tr>
				<th colspan=2><input type="submit" class="confirm" v-on:click="addVenue" value="Kreiraj sportski objekat"></th>
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
							this.selectedManager = this.managers[0];
						});
					}
				});
		},
		addVenue : function () {
			event.preventDefault();
			this.validateFields();
			if (this.error === ''){
				this.venue.workingHours = this.hoursFrom + "-" + this.hoursTo;
				axios.post('rest/venues/add', this.venue)
				.then(response => {
					this.selectedManager.sportsVenue = response.data;
					axios.put('rest/users/edit/' + this.selectedManager.id, this.selectedManager);
					this.visible = false;
					this.$router.go();
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
				|| this.selectedManager === null
				|| (Number(this.hoursFrom) < 0 || Number(this.hoursFrom) > 23)
				|| (Number(this.hoursTo) < 0 || Number(this.hoursTo) > 23))
				this.error = "Obavezno!";
			else
				this.error = "";
		},
		mapClick : function (event) {
		  	var coord = ol.proj.toLonLat(event.coordinate);
			this.venue.location.latitude = coord[1].toFixed(6);
			this.venue.location.longitude = coord[0].toFixed(6);
			this.reverseGeocode(coord).then(response => {
				this.venue.location.address.street = this.transliterate(response.address.road);
				this.venue.location.address.number = response.address.house_number != undefined ? this.transliterate(response.address.house_number) : 'BB';
				this.venue.location.address.city = this.transliterate(response.address.city);
				this.venue.location.address.country = this.transliterate(response.address.country);
				this.venue.location.address.postalCode = this.transliterate(response.address.postcode);
				
				const iconFeature = new ol.Feature({
				  geometry: new ol.geom.Point(ol.proj.fromLonLat([this.venue.location.longitude, this.venue.location.latitude])),
				  name: this.venue.name
				});
				
				let layer = new ol.layer.Vector({
						  name: 'Marker',
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
					    });
	
				this.map.getLayers().forEach(layer => {
				  if (layer && layer.get('name') === 'Marker') {
				    this.map.removeLayer(layer);
				  }
				});
				
				this.map.addLayer(layer);
			});
		},
		reverseGeocode : async function(coords) {
		  const response = await fetch('http://nominatim.openstreetmap.org/reverse?format=json&lon=' + coords[0] + '&lat=' + coords[1]);
            return await response.json();
		},
		transliterate : function(word){
		    let answer = ""
		      , a = {};
		
		   	a["А"]="A";a["Б"]="B";a["В"]="V";a["Г"]="G";a["Д"]="D";a["Ђ"]="Đ";a["Е"]="E";a["Ж"]="Ž";a["З"]="Z";a["И"]="I";a["Ј"]="J";a["К"]="K";a["Л"]="L";a["Љ"]="LJ";
		   	a["М"]="M";a["Н"]="N";a["Њ"]="NJ";a["О"]="O";a["П"]="P";a["Р"]="R";a["С"]="S";a["Т"]="T";a["Ћ"]="Ć";a["У"]="U";a["Ф"]="F";a["Х"]="H";a["Ц"]="C";
		   	a["Ч"]="Č";a["Џ"]="DŽ";a["Ш"]="Š";
		   	a["а"]="a";a["б"]="b";a["в"]="v";a["г"]="g";a["д"]="d";a["ђ"]="đ";a["е"]="e";a["ж"]="ž";a["з"]="z";a["и"]="i";a["ј"]="j";a["к"]="k";a["л"]="l";a["љ"]="lj";
		   	a["м"]="m";a["н"]="n";a["њ"]="nj";a["о"]="o";a["п"]="p";a["р"]="r";a["с"]="s";a["т"]="t";a["ћ"]="ć";a["у"]="u";a["ф"]="f";a["х"]="h";a["ц"]="c";
		   	a["ч"]="č";a["џ"]="dž";a["ш"]="š";
		
		   for (i in word){
		     if (word.hasOwnProperty(i)) {
		       if (a[word[i]] === undefined){
		         answer += word[i];
		       } else {
		         answer += a[word[i]];
		       }
		     }
		   }
		   return answer;
		}
	},
	mounted () {
		this.id = this.value;
		if (this.id == -1){
			this.visible = true;
			axios.get('rest/managers/')
			.then(response => {
				this.managers = response.data;
				
				this.map = new ol.Map({
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
				this.map.on('click', this.mapClick);
			});
		}else{
			this.visible = false;
		}
    }
});