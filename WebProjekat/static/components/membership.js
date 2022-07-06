Vue.component("membership", {
	props: ['value', 'user'],
	data: function () {
		    return {
		      id : '',
			  visible : false,
			  membership: { type: '', dateOfPaying: '', expirationDate: null, price: null, numberOfAppointments: null},
			  promoCode: null
		    }
	},
	template: ` 
<div>
	<form v-if=visible>
	<h3 style="text-align:center">Kupovina članarine</h3>
		<table style="background:aliceblue; border: 1px solid gray; margin:auto">
			<tr>
				<td>Tip</td>
				<td><input type="text" v-model="membership.type" readonly></input></td>
			</tr>
			<tr>
				<td>Datum plaćanja</td>
				<td><input type="text" v-model="membership.dateOfPaying" readonly></input></td>
			</tr>
			<tr>
				<td>Datum isteka</td>
				<td><input type="text" v-model="membership.expirationDate" readonly></input></td>
			</tr>
			<tr>
				<td>Cena</td>
				<td><input type="text" v-model="membership.price" readonly></input></td>
			</tr>
			<tr>
				<td>Broj termina</td>
				<td><input type="text" v-model="membership.numberOfAppointments" readonly></input></td>
			</tr>
			<tr><th colspan="3">Promo kod (opciono)</th></tr>
			<tr>
				<td>Unesite promo kod</td>
				<td><input type="text" v-model="promoCode"></input></td>
				<td><button class="button">Proveri važenje koda</button></td>
			</tr>
			<tr>
				<td></td>
				<td><button class="confirm" @click="buyMembership">Kupi članarinu</button></td>
				<td><button class="cancel" @click="cancelPurchase">Otkaži</button></td>
			</tr>
    	</table>
	</form>
</div>		  
`
	, 
	methods : {
		buyMembership : function () {
			event.preventDefault();
			this.user.membership = this.membership;
			this.user.membership.isActive = true;
			this.user.membership.dateOfPaying = new Date().toISOString().slice(0, -5);
			if (this.user.membership.type === 'Godišnje')
				this.user.membership.expirationDate = new Date(new Date().setYear(new Date().getFullYear() + 1)).toISOString().slice(0, -5);
			else if (this.user.membership.type === 'Mesečno')
				this.user.membership.expirationDate = new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().slice(0, -5);

			axios.put('rest/users/edit/' + this.user.id, this.user).
			then(response => {
				this.visible = false;
				this.$emit('membership', this.user.membership);
			});
		},
		cancelPurchase : function(){
			this.visible = false;
		},
		formatDate(date) {
    		return new Intl.DateTimeFormat('rs-SR', { dateStyle: 'medium'}).format(new Date(date))
  		}
	},
	mounted () {
		this.id = this.value;
		if (this.id !== '' && this.id !== 0){
			this.visible = true;
	        axios
	          .get('rest/memberships/' + this.id)
	          .then(response => {
					this.membership = response.data;
					this.membership.dateOfPaying = this.formatDate(new Date());
					if (this.membership.type === 'Godišnje')
						this.membership.expirationDate = this.formatDate(new Date().setYear(new Date().getFullYear() + 1));
					else if (this.membership.type === 'Mesečno')
						this.membership.expirationDate = this.formatDate(new Date().setMonth(new Date().getMonth() + 1));
				});
		}else{
			this.visible = false;
		}
    }
});