Vue.component("new-content", {
	props: ['contentId', 'venueId'],
	data: function () {
		    return {
		      id : 0,
			  visible : false,
		      content: {id: '', name:'', type:'', description:null, duration:0, image:'./images/icons/no-image.png'},
	 		  isImageSelected: false,
			  error: ''
		    }
	},
	template: ` 
<div>
	<form v-if=visible>
	<h3>Dodaj novi sadržaj</h3>
		<table id="content" style="width:100%; background:aliceblue; table-layout: fixed; border: 1px solid gray">
			<tr>
				<td><img v-bind:src=content.image width="75%"></img></td>
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
				<td><input type = "text" v-model = "content.name"></td>
			</tr>
			<tr>
				<td></td>
				<td><label v-if="content.name === '' || this.venue.content.filter(c => c.name === this.content.name).length > 0" style="color:red">{{error}}</label></td>
			</tr>
			<tr>
				<td>Tip</td>
				<td>
					<select v-model= "content.type">
						<option>Sauna</option>
						<option>Bazen</option>
					</select>
				</td>
			</tr>
			<tr>
				<td></td>
				<td><label v-if="content.type === ''" style="color:red">{{error}}</label></td>
			</tr>
			<tr>
				<td>Opis</td>
				<td><input type = "text" v-model = "content.description"></td>
			</tr>
			<tr>
				<td>Trajanje</td>
				<td><input type = "number" v-model = "content.duration"></td>
			</tr>
			<tr>
				<th colspan=2><button v-on:click="addContent" class="confirm">Kreiraj sadržaj</button></th>
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
				this.content.image = response.data;
				this.isImageSelected = true;
			});
		},
		addContent: function () {
			event.preventDefault();
			this.validateFields();
			if (this.error === ''){
				this.content.id = this.venue.content.length + 1;
				this.venue.content.push(this.content);
			
				axios.put('rest/venues/edit/' + this.venue.id, this.venue).
				then(response => {
					this.visible = false;
					this.$router.go();
				});
			}
		},
		validateFields : function(){
			if (this.isImageSelected === false
				|| this.content.name === ''
				|| this.content.type === '')
				this.error = "Obavezno!";
			else if(this.venue.content.filter(c => c.name === this.content.name).length > 0)
				this.error = "Naziv je zauzet!";
			else
				this.error = "";
		}
	},
	mounted () {
		this.id = this.contentId;
		if (this.id == -1){
			this.visible = true;
			axios
	          .get('rest/venues/' + this.venueId)
	          .then(response => {
				this.venue = response.data;
			});
		}else{
			this.visible = false;
		}
    }
});