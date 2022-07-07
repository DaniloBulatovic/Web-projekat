Vue.component("register-login", {
	data: function () {
		    return {
		      title: "Prijava",
		      value: "Prijavi se",
		      action : "login",
		      error: "",
		      loggedIn: false,
		      displayTable: true,
		      displayAdminTable: false,
		      passwordInputType: "password",
		      user: { username: "", password: "", role: ""},
		      newUser: {username: "", password: "", role: "Menadžer"}
		    }
	},
	template: ` 
<div style="display: flex; flex-direction: column;width:70%; float:right">
	<div v-if=!loggedIn style="display: table; height:100%; width:100%">
		<div class="menu-login" @click="showRegister" style="width:50%; height:100%; display: table-cell"><p>Registracija</p></div>
		<div class="menu-login" @click="showLogin" style="width:50%; height:100%; display: table-cell"><p>Prijava</p></div>
	</div>
	<div v-if=loggedIn style="display: table; height:100%; width:100%">
		<div @click="profile" class="menu-login" style="width:50%; height:100%; display: table-cell"><p>{{user.username}} ({{user.role}})</p></div>
		<div @click="logout" class="menu-login" style="width:50%; height:100%; display: table-cell"><p>Odjavi se</p></div>
	</div>
	<div v-if=loggedIn>
		<button v-if="this.user.role === 'Administrator'" class="button" @click="displayAdminTable = !displayAdminTable" style="display:block;float:right">
			Kreiraj novog menadžera / trenera
		</button>
	</div>
	<form v-if=!loggedIn>
		<table v-if=displayTable style="margin:auto; width:100%">
			<tr>
				<th colspan="2">{{title}}</th>
			</tr>
			<tr>
				<td><label>Korisničko ime</label></td>
				<td><input type="text" v-model="user.username" name="username"></td>
			</tr>
			<tr>
				<td><label>Lozinka</label></td>
				<td><input v-bind:type="this.passwordInputType" v-model="user.password" name="password"></td>
			</tr>
			<tr>
				<td></td>
				<td><input type="checkbox" v-on:click="togglePassword">Prikaži lozinku</td>
			</tr>
			<tr>
				<th colspan="2">
					<input class="button" type="submit" v-on:click="register" v-bind:value="this.value" style="float:right">
				</th>
			</tr>
			<tr>
				<th colspan="2">
					<p style="color:red">{{error}}</p>
				</th>
			</tr>
		</table>
	</form>
	<form v-if=displayAdminTable>
		<table style="margin:auto; width:100%">
			<tr>
				<th colspan="2">Kreiraj menadžera / trenera</th>
			</tr>
			<tr>
				<td><label>Korisničko ime</label></td>
				<td><input type="text" v-model="newUser.username" name="username"></td>
			</tr>
			<tr>
				<td><label>Lozinka</label></td>
				<td><input v-bind:type="this.passwordInputType" v-model="newUser.password" name="password"></td>
			</tr>
			<tr>
				<td></td>
				<td><input type="checkbox" v-on:click="togglePassword">Prikaži lozinku</td>
			</tr>
			<tr>
				<td><label>Uloga</label></td>
				<td><select v-model="newUser.role" name="role"><option selected>Menadžer</option><option>Trener</option></select></td>	
			</tr>
			<tr>
				<th colspan="2">
					<input class="button" type="submit" v-on:click="adminRegister" value="Kreiraj" style="float:right">
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
			this.user.name = "";
			this.user.surname = "";
			event.preventDefault();
			if (this.action != "register"){
				axios.post('rest/users/login', this.user).
				then(response => { 
					if (response.data == "ERROR"){
						this.error = "Pogrešno korisničko ime i/ili lozinka!";
					}else{
						this.loggedIn = true;
						this.user = response.data;
						this.$router.go();
					}
				});
			}
			else {
				this.user.name = "";
				this.user.surname = "";
				this.user.role = "Kupac";
				axios.post('rest/users/add', this.user).
				then(response => {
					if (response.data == "ERROR"){
						this.error = "Korisničko ime je zauzeto!";
					}else{
						axios.post('rest/users/login', this.user).
						then(response => {
							this.loggedIn = true;
							this.user = response.data;
						});	
					}
				});
			}
		},
		adminRegister : function(){
			event.preventDefault();
			this.newUser.name = "";
			this.newUser.surname = "";
			axios.post('rest/users/add', this.newUser).
				then(response => {
					if (response.data == "ERROR"){
						this.error = "Korisničko ime je zauzeto!";
					}else{
						this.newUser = {username: "", password: "", role: ""};
						alert("Uspešno registrovan novi " + response.data.role.toLowerCase());
						this.displayAdminTable = false;
					}
				});
		},
		logout : function(){
			event.preventDefault();
			this.error = "";
			axios.post('rest/users/logout', this.user, {withCredentials: true}).
			then(response => {
				this.loggedIn = false;
				this.displayAdminTable = false;
				this.user = { username: "", password: "", role: ""};
				router.push('/');
				this.$router.go();
			});
		},
		togglePassword : function(){
			if(this.passwordInputType === "password")
				this.passwordInputType = "text";
			else
				this.passwordInputType = "password";	
		},
		profile : function(){
			router.push('/profile');
		},
		showLogin : function(){
			this.displayTable = !this.displayTable;
			router.push('/users/login');
		},
		showRegister : function(){
			this.displayTable = !this.displayTable;
			router.push('/users/register');
		}
	},
	mounted () {
		this.action = this.$route.params.id;
		if (this.action == "register"){
			this.title = "Registracija";
			this.value = "Registruj se";
		}
		axios.post('rest/users/getlogged', this.user, {withCredentials: true}).
					then(response => { 
						this.user = { username: "", password: "", role: ""};
						if (response.data != "ERROR" && response.data != null){
							this.loggedIn = true;
							this.user = response.data;
						}
			});
    }
});