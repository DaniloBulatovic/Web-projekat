Vue.component("register-login", {
	data: function () {
		    return {
		      title: "Prijava",
		      value: "Prijavi se",
		      action : "login",
		      error: "",
		      loggedIn: false,
		      displayTable: true,
		      loggedUsername: "",
		      user: { username: "", password: ""}
		    }
	},
	template: ` 
<div>
	<div id="menu" v-if=!loggedIn>
		<a href="#/users/login" @click="displayTable = !displayTable" style="float:right">Prijava</a>
		<a href="#/users/register" @click="displayTable = !displayTable" style="float:right">Registracija</a>
	</div>
	<div id="userMenu" v-if=loggedIn>
		<input type="submit" v-on:click="logout" value="Odjavi se" style="float:right">
		<label>{{loggedUsername}}</label>
	</div>
	<form v-if=!loggedIn>
		<table v-if=displayTable>
			<tr>
				<th colspan="2">{{title}}</th>
			</tr>
			<tr>
				<td><label>Korisničko ime</label></td>
				<td><input type="text" v-model="user.username" name="username"></td>
			</tr>
			<tr>
				<td><label>Lozinka</label></td>
				<td><input type="text" v-model="user.password" name="password"></td>
			</tr>
			<tr>
				<th colspan="2">
					<input type="submit" v-on:click="register" v-bind:value="this.value" style="float:right">
				</th>
			</tr>
			<tr>
				<th colspan="2">
					<p style="color:red">{{error}}</p>
				</th>
			</tr>
		</table>
	</form>
</div>		  
`
	, 
	methods : {
		register : function () {
			this.error = "";
			event.preventDefault();
			if (this.id == "login"){
				axios.post('rest/users/login', this.user).
				then(response => { 
					if (response.data == "ERROR"){
						this.error = "Pogrešno korisničko ime i/ili lozinka!";
					}else{
						this.loggedIn = true;
						this.loggedUsername = response.data.username;
					}
				});
			}
			else{
				this.user.role = "Kupac";
				axios.post('rest/users/add', this.user).
				then(response => {
					if (response.data == "ERROR"){
						this.error = "Korisničko ime je zauzeto!";
					}else{
						axios.post('rest/users/login', this.user).
						then(response => {
							this.loggedIn = true;
							this.loggedUsername = response.data.username;
						});	
					}
				});
			}
		},
		logout : function(){
			event.preventDefault();
			axios.get('rest/users/logout').
			then(response => {
				this.loggedIn = false;
				this.user = { username: "", password: ""};
			});
		}
	},
	mounted () {
		this.id = this.$route.params.id;
		if (this.id == "register"){
			this.title = "Registracija";
			this.value = "Registruj se";
		}
    }
});