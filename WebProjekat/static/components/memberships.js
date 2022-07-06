Vue.component("memberships", { 
	data: function () {
	    return {
		  activeMembership: null,
	      memberships: null,
	      user: { username: "", password: "", role: ""},
		  selectedId: 0,
		  reloadMembership: false
	    }
	},
	    template: ` 
    	<div class="middlepane" style="float:right">
			<h2 v-if="user.role !== 'Administrator'">Aktivna članarina</h2>
    		<table v-if="activeMembership && user.role !== 'Administrator'" class="trainings_table" style="width:100%; text-align:center">
	    		<tr>
	    			<th>Tip</th>
					<th>Datum plaćanja</th>
					<th>Datum isteka</th>
					<th>Cena</th>
					<th>Broj termina</th>
	    		</tr>
	    		<tr>
	    			<td>{{activeMembership.type}}</td>
					<td>{{formatDate(activeMembership.dateOfPaying)}}</td>
					<td>{{formatDate(activeMembership.expirationDate)}}</td>
					<td>{{activeMembership.price}}</td>
					<td>{{activeMembership.numberOfAppointments}}</td>
				</tr>
	    	</table>
			<label v-if="!activeMembership && user.role !== 'Administrator'" style="color:red">Nemate aktivnu članarinu</label>
    		<h2>Članarine</h2>
    		<table class="trainings_table" style="width:100%; text-align:center">
	    		<tr>
	    			<th>Tip</th>
					<th>Cena</th>
					<th>Broj termina</th>
					<th>Akcija</th>
	    		</tr>
	    		<tr v-for="(m, index) in memberships">
	    			<td>{{m.type}}</td>
					<td>{{m.price}}</td>
					<td v-if="m.numberOfAppointments !== 0">{{m.numberOfAppointments}}</td>
					<td v-if="m.numberOfAppointments === 0">Neograničeno</td>
					<td v-if="user.role !== 'Administrator'"><button class="confirm" @click="viewMembership(m.id)">Kupi</button></td>
					<td v-if="user.role === 'Administrator'"><button class="cancel" @click="deleteMembership(m.id, index)">Obriši</button></td>
				</tr>
	    	</table>
			<membership :value="this.selectedId" :user="this.user" :key="this.reloadMembership" @membership="updateActiveMembership"></membership>
    	</div>
    	`,
    methods: {
		viewMembership : function(id){
			this.selectedId = id;
			this.reloadMembership = !this.reloadMembership;
		},
		deleteMembership : function(id, index){
			r = confirm("Da li ste sigurni?")
    		if (r){
	    		axios
	            .delete('rest/memberships/delete/' + id).then(response => (this.memberships.splice(index, 1)));
    		}
		},
		updateActiveMembership : function(membership){
			this.activeMembership = membership;
		},
		formatDate(date) {
    		return new Intl.DateTimeFormat('rs-SR', { dateStyle: 'medium'}).format(new Date(date))
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
							}).then(response =>{
								if(this.user.role === 'Kupac'){
									this.activeMembership = this.user.membership;
									axios.get('rest/memberships/').then(response => (this.memberships = response.data));
								}else if(this.user.role === 'Administrator'){
									axios.get('rest/memberships/').then(response => (this.memberships = response.data));
								}else{
									router.push("/");
								}
							});
						}else{
							router.push("/");
						}
			});
    }
});