Vue.component("user-profile", {
	data: function () {
		    return {
			  id: -1,
		      user: null,
		      error: ""
		    }
	},
	template: ` 
<div class="middlepane" style="float:right; height:100%;margin:auto">
	<h2>Profil</h2>
	<form>
		<table id="profile_table" style="margin-right:auto">
			<tr>
				<td>Korisničko ime</td>
				<td><input type = "text" v-model = "user.username" v-on:input="validateFields()"></td>
				<td><label v-if="this.user.username === ''" style="color:red">{{error}}</label></td>
			</tr>
			<tr>
				<td>Lozinka</td>
				<td><input type = "text" v-model = "user.password" v-on:input="validateFields()"></td>
				<td><label v-if="this.user.password === ''" style="color:red">{{error}}</label></td>
			</tr>
			<tr>
				<td>Ime</td>
				<td><input type = "text" v-model = "user.name" v-on:input="validateFields()"></td>
				<td><label v-if="this.user.name === ''" style="color:red">{{error}}</label></td>
			</tr>
			<tr>
				<td>Prezime</td>
				<td><input type = "text" v-model = "user.surname" v-on:input="validateFields()"></td>
				<td><label v-if="this.user.surname === ''" style="color:red">{{error}}</label></td>
			</tr>
			<tr>
				<td>Pol</td>
				<td><select v-model="user.gender" v-on:change="validateFields()"><option>Muško</option><option>Žensko</option></select></td>
				<td><label v-if="this.user.gender === ''" style="color:red">{{error}}</label></td>
			</tr>
			<tr>
				<td>Datum rođenja</td>
				<td><input type = "date" v-model = "user.dateOfBirth" v-on:input="validateFields()"></td>
				<td><label v-if="this.user.dateOfBirth === ''" style="color:red">{{error}}</label></td>
			</tr>
			<tr v-if="user.role === 'Trener'">
				<td>Istorija treninga</td>
				<td><input type = "text" v-model = "user.trainingHistory" readonly></td>
			</tr>
			<tr v-if="user.role === 'Menadžer'">
				<td>Sportski objekat</td>
				<td><input type = "text" v-model = "user.sportsVenue" readonly></td>
			</tr>
			<tr v-if="user.role === 'Kupac' && user.membership">
				<th>Članarina</th>
			</tr>
			<tr v-if="user.role === 'Kupac' && user.membership">
				<td colspan=2>
					<table style="background:lightgray">
						<tr>
							<td>Tip</td>
							<td><input type="text" v-model="user.membership.type" readonly></td>
						</tr>
						<tr>
							<td>Datum plaćanja</td>
							<td><input type="text" v-model="user.membership.dateOfPaying" readonly></td>
						</tr>
						<tr>
							<td>Datum isteka</td>
							<td><input type="text" v-model="user.membership.expirationDate" readonly></td>
						</tr>
						<tr>
							<td>Cena</td>
							<td><input type="text" v-model="user.membership.price" readonly></td>
						</tr>
						<tr>
							<td>Broj termina</td>
							<td v-if="user.membership.numberOfAppointments !== 0"><input type="text" v-model="user.membership.numberOfAppointments" readonly></td>
							<td v-if="user.membership.numberOfAppointments === 0"><input type="text" value="Neograničeno" readonly></td>
						</tr>
					</table>
				</td>
			</tr>
			<tr v-if="user.role === 'Kupac' && user.visitedVenues">
				<th>Posećeni objekti</th>
			</tr>
			<tr v-if="user.role === 'Kupac' && user.visitedVenues">
				<td colspan=2>
					<table class="default-table">
						<tr>
							<th>Logo</th>
							<th>Naziv</th>
							<th>Tip</th>
							<th>Lokacija</th>
							<th>Prosečna ocena</th>
							<th>Radno vreme</th>
						</tr>
						<tr v-for="(v, index) in user.visitedVenues">
							<td style="text-align:center"><img v-bind:src=v.logoPath width="75%"></img></td>
			    			<td>{{v.name}}</td>
			    			<td>{{v.venueType}}</td>
			    			<td>{{v.location.address.street}} {{v.location.address.number}}, {{v.location.address.city}}, {{v.location.address.postalCode}} ({{v.location.latitude}}, {{v.location.longitude}})</td>
			    			<td style="text-align:center">{{v.averageGrade}}</td>
			    			<td style="text-align:center">{{v.workingHours}}</td>
						</tr>
					</table>
				</td>
			</tr>
			<tr v-if="user.role === 'Kupac'">
				<td>Tip kupca</td>
				<td><input type = "text" v-model = "user.customerType.typeName" readonly></td>
			</tr>
			<tr v-if="user.role === 'Kupac'">
				<td>Poeni</td>
				<td><input type = "text" v-model = "user.points" readonly></td>
			</tr>
			<tr>
				<th><input class="confirm" type = "submit" v-on:click = "editUser" value = "Sačuvaj izmene" style="text-align:center"></th>
				<th><input class="cancel" type = "submit" v-on:click = "cancel" value = "Otkaži" style="text-align:center"></th>
			</tr>
		</table>
	</form>
</div>		  
`
	, 
	methods : {
		cancel : function (){
			event.preventDefault();
			router.push('/');
		},
		editUser : function () {
			event.preventDefault();
			this.validateFields();
			if (this.error === ''){
				this.user.dateOfBirth = this.user.dateOfBirth + 'T12:00:00';
				axios.put('rest/users/edit/' + this.user.id, this.user).
				then(response => {
					router.push(`/`);
				});
			}
		},
		validateFields : function(){
			if (this.user.username === ''
				|| this.user.password === ''
				|| this.user.name === ''
				|| this.user.surname === ''
				|| this.user.gender === ''
				|| this.user.dateOfBirth === '')
				this.error = "Obavezno!";
			else
				this.error = "";
		},
		formatDate(date) {
    		return new Intl.DateTimeFormat('en-US').format(new Date(date))
  		}
	},
	mounted () {
		axios.post('rest/users/getlogged', this.user, {withCredentials: true}).
					then(response => { 
						this.user = { username: "", password: "", role: ""};
						if (response.data != "ERROR" && response.data != null){
							this.user = response.data;
							axios.get('rest/users/' + this.user.id).then(response => {
								this.user = response.data;
								this.user.dateOfBirth = new Date(this.user.dateOfBirth).toISOString().slice(0, -14);
							})
						}
			});
    }
});