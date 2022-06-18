Vue.component("user-profile", {
	data: function () {
		    return {
			  id: -1,
		      user: null 
		    }
	},
	template: ` 
<div>
	<h2 style="text-align:center">Profil</h2>
	<form>
		<table id="profile_table" style="margin:auto">
			<tr>
				<td>Korisničko ime</td>
				<td><input type = "text" v-model = "user.username"></td>
			</tr>
			<tr>
				<td>Lozinka</td>
				<td><input type = "text" v-model = "user.password"></td>
			</tr>
			<tr>
				<td>Ime</td>
				<td><input type = "text" v-model = "user.name"></td>
			</tr>
			<tr>
				<td>Prezime</td>
				<td><input type = "text" v-model = "user.surname"></td>
			</tr>
			<tr>
				<td>Pol</td>
				<td><select v-model="user.gender"><option>Muško</option><option>Žensko</option></select></td>
			</tr>
			<tr>
				<td>Datum rođenja</td>
				<td><input type = "date" v-model = "user.dateOfBirth"></td>
			</tr>
			<tr v-if="user.role === 'Trener'">
				<td>Istorija treninga</td>
				<td><input type = "text" v-model = "user.trainingHistory" readonly></td>
			</tr>
			<tr v-if="user.role === 'Menadžer'">
				<td>Sportski objekat</td>
				<td><input type = "text" v-model = "user.sportsVenue.name" readonly></td>
			</tr>
			<tr v-if="user.role === 'Kupac'">
				<td>Članstvo</td>
				<td><select v-model="user.membership" readonly><option>Godišnje</option><option>Mesečno</option></select></td>
			</tr>
			<tr v-if="user.role === 'Kupac'">
				<td>Posećeni objekti</td>
				<td><input type = "text" v-model = "user.visitedVenues" readonly></td>
			</tr>
			<tr v-if="user.role === 'Kupac'">
				<td>Tip kupca</td>
				<td><input type = "text" v-model = "user.customerType" readonly></td>
			</tr>
			<tr v-if="user.role === 'Kupac'">
				<td>Poeni</td>
				<td><input type = "text" v-model = "user.points" readonly></td>
			</tr>
			<tr>
				<th colspan="2"><input type = "submit" v-on:click = "editUser" value = "Sačuvaj izmene"></th>
			</tr>
		</table>
	</form>
</div>		  
`
	, 
	methods : {
		editUser : function () {
			event.preventDefault();
			axios.put('rest/users/edit/' + this.user.id, this.user).
			then(response => (router.push(`/`)));
		}
	},
	mounted () {
		this.id = this.$route.params.id;
		if (this.id != -1){
	        axios
	          .get('rest/users/' + this.id)
	          .then(response => (this.user = response.data))
		}
    }
});