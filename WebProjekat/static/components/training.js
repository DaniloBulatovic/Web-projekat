Vue.component("training", {
	props: ['value'],
	data: function () {
		    return {
		      id : 0,
			  visible : false,
		      training: {id: '', name:null, trainingType:0, sportsVenue:null, duration:0, trainer:{ name: null, surname: null}, description:null, image:'./images/icons/no-image.png', price:0},
			  oldTraining: null,
			  trainers: [],
			  selectedIndex: null,
			  selectedTrainer: null,
			  isImageSelected: false,
			  error: ''
		    }
	},
	template: ` 
<div>
	<form v-if=visible>
	<h3>Izmena treninga</h3>
		<table style="width:100%; background:aliceblue; table-layout: fixed; border: 1px solid gray">
			<tr>
				<td><img v-bind:src=training.image width="75%"></img></td>
				<td></td>
			</tr>
			<tr>
				<td>
					<form method='post' enctype='multipart/form-data'>
						<input type= "file" @change="onFileSelected" name="uploaded_file" accept="image/png, image/jpeg">
						<button class="button" @click="onUpload">Otpremi</button>
					</form>
				</td>
			</tr>
			<tr>
				<td><label v-if="isImageSelected === false" style="color:red">{{error}}</label></td>
				<td></td>
			</tr>
			<tr>
				<td>Naziv</td>
				<td><input type = "text" v-model = "training.name"></td>
			</tr>
			<tr>
				<td></td>
				<td><label v-if="training.name === ''" style="color:red">{{error}}</label></td>
			</tr>
			<tr>
				<td>Tip</td>
				<td>
					<select v-model= "training.trainingType">
						<option>Grupni</option>
						<option>Personalni</option>
						<option>Teretana</option>
					</select>
				</td>
			</tr>
			<tr>
				<td></td>
				<td><label v-if="training.trainingType === ''" style="color:red">{{error}}</label></td>
			</tr>
			<tr>
				<td>Opis</td>
				<td><input type = "text" v-model = "training.description"></td>
			</tr>
			<tr>
				<td>Trajanje</td>
				<td><input type = "number" v-model = "training.duration"></td>
			</tr>
			<tr>
				<td>Trener</td>
				<td><select v-model="this.training.trainer.name + ' ' + this.training.trainer.surname" @change="switchView($event, $event.target.selectedIndex)"><option v-for="(t, index) in trainers">{{t.name}} {{t.surname}}</option></select></td>
			</tr>
			<tr>
				<td></td>
				<td><label v-if="training.trainer.name === ' ' || training.trainer.surname === ' '" style="color:red">{{error}}</label></td>
			</tr>
			<tr>
				<td>Cena</td>
				<td><input type = "number" v-model = "training.price"></td>
			</tr>
			<tr>
				<td><button v-on:click="editTraining" class="confirm">Sačuvaj izmene</button></td>
				<td><button v-on:click="cancelTrainingEdit" class="cancel">Otkaži</button></td>
			</tr>
		</table>
	</form>
</div>		  
`
	, 
	methods : {
		onFileSelected : function(event){
			this.selectedFile = event.target.files[0];
		},
		onUpload : function(){
			event.preventDefault();
			let data = new FormData();
			data.append('uploaded_file', this.selectedFile, this.selectedFile.name);
		
			axios.post('rest/trainings/upload', data, {
			  headers: {
			    'accept': '*/*',
			    'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
			  }
			})
			.then(response =>{
				this.training.image = response.data;
				this.isImageSelected = true;
			});
		},
		switchView : function(event, selectedIndex) {
      		this.training.trainer = this.trainers[selectedIndex];
    	},
		editTraining : function () {
			event.preventDefault();
			this.validateFields();
			if (this.error === ''){
				axios.put('rest/trainings/edit/' + this.training.id, this.training).
				then(response => {
					this.visible = false;
					this.$router.go();
				});
			}
		},
		validateFields : function(){
			if (this.isImageSelected === false
				|| this.training.name === ''
				|| this.training.trainingType === ''
				|| this.training.trainer.name === ' '
				|| this.training.trainer.surname === ' ')
				this.error = "Obavezno!";
			else
				this.error = "";
		},
		cancelTrainingEdit : function() {
    		event.preventDefault();
			this.training = this.oldTraining;
			this.visible = false;
			this.$router.go();
    	},
	},
	mounted () {
		this.id = this.value;
		if (this.id > 0){
			this.visible = true;
	        axios
	          .get('rest/trainings/' + this.id)
	          .then(response => {
				this.training = response.data;
				this.oldTraining = this.training;
				if (this.training.image !== './images/icons/no-image.png'){
					this.isImageSelected = true;
				}
				}).then(response =>{
					axios.get('rest/trainers/').then(response => {
						this.trainers = response.data;
						this.selectedIndex = this.trainers.findIndex(t => t.id === this.training.trainer.id);
					});
				});
		}else{
			this.visible = false;
		}
    }
});