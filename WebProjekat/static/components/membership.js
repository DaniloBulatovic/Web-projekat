Vue.component("membership", {
	props: ['value', 'user'],
	data: function () {
		    return {
		      id : '',
			  visible : false,
			  membership: { type: '', dateOfPaying: '', expirationDate: null, price: null, numberOfAppointments: null},
			  promoCode: '',
			  validPromoCode: null,
			  error: ''
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
				<td><button class="button" @click="validatePromoCode">Proveri važenje koda</button></td>
			</tr>
			<tr>
				<td></td>
				<td v-if="promoCode === ''" style="color:red">{{error}}</td>
				<td></td>
			</tr>
			<tr>
				<td></td>
				<td v-if="validPromoCode" style="color:green">Validan kod (popust {{validPromoCode.discount}}%)</td>
				<td></td>
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

			if(this.user.customerType){
				this.user.membership.price -= this.user.membership.price * this.user.customerType.discount / 100;
			}

			if (this.validPromoCode){
				this.validPromoCode.amount -= 1;
				axios.put('rest/promoCodes/edit/' + this.validPromoCode.id, this.validPromoCode).then(response =>{
					this.user.membership.price -= this.user.membership.price * this.validPromoCode.discount / 100;
				}).then(response => {
					axios.put('rest/users/edit/' + this.user.id, this.user).
					then(response => {
						this.visible = false;
						this.$emit('membership', this.user.membership);
					});
				});
			}else{
				axios.put('rest/users/edit/' + this.user.id, this.user).
				then(response => {
					this.visible = false;
					this.$emit('membership', this.user.membership);
				});
			}
		},
		cancelPurchase : function(){
			this.visible = false;
		},
		validatePromoCode : function(){
			if (this.promoCode !== ''){
				axios.get('rest/promoCodes/code/' + this.promoCode).then(response =>{
					this.validPromoCode = response.data;
					
				});
			}else{
				this.error = "Niste uneli promo kod!";
			}
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