Vue.component("menu-bar", {
	data: function () {
		    return {
		      user: { username: "", password: "", role: ""}
		    }
	},
	template: ` 
<div class="menu-bar" style="display: table; width:70%; height:100%">
	<div style="width:16%; height:100%; display: table-cell">
		<div class="menu-logo" @click="showVenuesTable">
			FitPass
		</div>
	</div>
	<div style="width:16%; height:100%; display: table-cell">
		<div class="menu-button1" @click="showVenuesTable">
			Sportski objekti
		</div>
	</div>
	<div style="width:16%; height:100%; display: table-cell">
		<div class="menu-button2" v-if="user.role === 'Administrator'" @click="showUsersTable">
			Korisnici
		</div>
		<div class="menu-button2" v-if="user.role === 'Menadžer'" @click="showManagersVenue">
			Moj sportski objekat
			<button v-if="user.role === 'Trener' || user.role === 'Kupac'" @click="showTrainings">Moji treninzi</button>
		</div>
		<div class="menu-button2" v-if="user.role === 'Trener' || user.role === 'Kupac'" @click="showTrainings">
			Moji treninzi
		</div>
	</div>
	<div style="width:16%; height:100%; display: table-cell">
		<div class="menu-button1" v-if="user.role === 'Menadžer' || user.role === 'Administrator'" @click="showTrainings">
			Treninzi
		</div>
		<div class="menu-button1" v-if="user.role === 'Kupac'" @click="showMemberships">
			Članarine
		</div>
	</div>
	<div style="width:16%; height:100%; display: table-cell">
		<div class="menu-button2" v-if="user.role === 'Administrator'" @click="showMemberships">
			Članarine
		</div>
	</div>
	<div style="width:16%; height:100%; display: table-cell">
		<div class="menu-button1" v-if="user.role === 'Administrator'" @click="showPromoCodes">
			Promo kodovi
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
		},
		showTrainings : function(){
			router.push('/trainings');
		},
		showMemberships : function(){
			router.push('/memberships');
		},
		showPromoCodes : function(){
			router.push('/promocodes');
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