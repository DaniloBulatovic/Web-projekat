Vue.component("menu-bar", {
	data: function () {
		    return {
		      user: { username: "", password: "", role: ""}
		    }
	},
	template: ` 
<div class="menu-bar" style="display: table; margin:auto; width:50%; height:100%">
	<div class="first" style="width:25%; height:100%; display: table-cell">
		<div class="center">
			<button @click="showVenuesTable">Sportski objekti</button>
		</div>
	</div>
	<div class="second" style="width:25%; height:100%; display: table-cell">
		<div class="center">
			<button v-if="user.role === 'Administrator'" @click="showUsersTable">Korisnici</button>
			<button v-if="user.role === 'Menadžer'" @click="showManagersVenue">Moj sportski objekat</button>
		</div>
	</div>
	<div class="third" style="width:25%; height:100%; display: table-cell">
		<div class="center">
		</div>
	</div>
	<div class="fourth" style="width:25%; height:100%; display: table-cell">
		<div class="center">
		</div>
	</div>
</div>		  
`
	, 
	methods : {
		showUsersTable : function(){
			router.push('/users');
		},
		showVenuesTable : function(){
			router.push('/');
		},
		showManagersVenue : function(){
			router.push('/venue');
		}
	},
	mounted () {
		axios.post('rest/users/getlogged', this.user, {withCredentials: true}).
					then(response => { 
						this.user = { username: "", password: "", role: ""};
						if (response.data != "ERROR" && response.data != null){
							this.user = response.data;
						}
			});
    }
});