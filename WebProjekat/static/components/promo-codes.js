Vue.component("promo-codes", { 
	data: function () {
	    return {
	      promoCodes: null,
		  newPromoCode: { id: '', code: '', expirationDate: '', discount: '', amount: ''},
	      user: { username: "", password: "", role: ""},
		  addTableVisibility: false,
		  error: ''
	    }
	},
	    template: ` 
    	<div class="middlepane" style="float:right">
    		<h2>Promo kodovi</h2>
			<button class="confirm" @click="showAddTable">Dodaj promo kod</button>
    		<table class="default-table" style="width:100%; text-align:center">
	    		<tr>
	    			<th>Kod</th>
					<th>Popust</th>
					<th>Količina</th>
					<th>Datum isteka</th>
					<th>Akcija</th>
	    		</tr>
	    		<tr v-for="(p, index) in promoCodes">
	    			<td>{{p.code}}</td>
					<td>{{p.discount}}</td>
					<td>{{p.amount}}</td>
					<td>{{formatDate(p.expirationDate)}}</td>
					<td><button class="cancel" @click="deletePromoCode(p.id, index)">Obriši</button></td>
				</tr>
	    	</table>
			<h3 v-if=addTableVisibility style="text-align:center">Dodaj novi promo kod</h3>
			<table v-if=addTableVisibility style="background:aliceblue; border: 1px solid gray; margin:auto">
				<tr>
					<td>Kod</td>
					<td><input type="text" v-model="newPromoCode.code"></input></td>
				</tr>
				<tr>
					<td></td>
					<td><label v-if="newPromoCode.code === ''" style="color:red">{{error}}</label></td>
				</tr>
				<tr>
					<td>Popust</td>
					<td><input type="text" v-model="newPromoCode.discount"></input></td>
				</tr>
				<tr>
					<td></td>
					<td><label v-if="newPromoCode.discount === ''" style="color:red">{{error}}</label></td>
				</tr>
				<tr>
					<td>Količina</td>
					<td><input type="text" v-model="newPromoCode.amount"></input></td>
				</tr>
				<tr>
					<td></td>
					<td><label v-if="newPromoCode.amount === ''" style="color:red">{{error}}</label></td>
				</tr>
				<tr>
					<td>Datum isteka</td>
					<td><input type="date" v-model="newPromoCode.expirationDate"></input></td>
				</tr>
				<tr>
					<td></td>
					<td><label v-if="newPromoCode.expirationDate === ''" style="color:red">{{error}}</label></td>
				</tr>
				<tr>
					<td></td>
					<td><button class="confirm" @click="addPromoCode">Kreiraj</button></td>
				</tr>
			</table>
    	</div>
    	`,
    methods: {
		showAddTable : function(){
			this.addTableVisibility = true;
		},
		addPromoCode : function(){
			event.preventDefault();
			this.validateFields();
			if(this.error === ''){
				this.newPromoCode.expirationDate = new Date(this.newPromoCode.expirationDate).toISOString().slice(0, -5);
				axios.post('rest/promoCodes/add', this.newPromoCode).then(response => {
					this.$router.go();
				});
			}
		},
		deletePromoCode : function(id, index){
			r = confirm("Da li ste sigurni?")
    		if (r){
	    		axios
	            .delete('rest/promoCodes/delete/' + id).then(response => (this.promoCodes.splice(index, 1)));
    		}
		},
		validateFields : function(){
			if (this.newPromoCode.code === ''
				|| this.newPromoCode.discount === ''
				|| this.newPromoCode.amount === ''
				|| this.newPromoCode.expirationDate === '')
				this.error = "Obavezno!";
			else
				this.error = "";
		},
		formatDate(date) {
			if(date)
    		return new Intl.DateTimeFormat('rs-SR', { dateStyle: 'medium'}).format(new Date(date))
  		}
    },
    mounted () {
		axios.post('rest/users/getlogged', this.user, {withCredentials: true}).
					then(response => { 
						this.user = { username: "", password: "", role: ""};
						if (response.data != "ERROR" && response.data != null){
							this.user = response.data;
							if(this.user.role === 'Administrator'){
								axios.get('rest/promoCodes/').then(response => (this.promoCodes = response.data));
							}else{
								router.push("/");
							}
						}else{
							router.push("/");
						}
			});
    }
});