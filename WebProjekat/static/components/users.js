Vue.component("users", { 
	data: function () {
	    return {
		  search: "",
	      users: null,
	      user: { username: "", password: "", role: ""}
	    }
	},
	    template: ` 
    	<div class="middlepane" style="float:right">
    		<h2>Prikaz svih korisnika</h2>
    		<p id="searchParagraph">
    			<label>Uloga</label>
    			<select id="roleDropdown" v-on:change="filterTableByRole()">
    			 	<option>Sve</option>
				    <option>Kupac</option>
				    <option>Trener</option>
				    <option>Menadžer</option>
				    <option>Administrator</option>
				</select>
				<label>Tip korisnika</label>
    			<select id="typeDropdown" v-on:change="filterTableByType()">
    			 	<option>Sve</option>
				    <option>Bronzani</option>
				    <option>Srebrni</option>
				    <option>Zlatni</option>
				</select>
    			<input type="text" v-model="search" placeholder="Pretraga korisnika..">
    		</p>
    		<table id="users_table" class="default-table">
	    		<tr>
	    			<th v-on:click="sortTable(0, false)" style="cursor:pointer">Ime</th>
	    			<th v-on:click="sortTable(1, false)" style="cursor:pointer">Prezime</th>
	    			<th v-on:click="sortTable(2, false)" style="cursor:pointer">Korisničko ime</th>
	    			<th>Datum rođenja</th>
	    			<th>Uloga</th>
	    			<th>Tip korisnika</th>
	    			<th v-on:click="sortTable(6, true)" style="cursor:pointer">Broj sakupljenih bodova</th>
					<th>Akcija</th>
	    		</tr>
	    		<tr v-for="(u, index) in filteredUsers">
	    			<td>{{u.name}}</td>
	    			<td>{{u.surname}}</td>
	    			<td>{{u.username}}</td>
	    			<td style="text-align:center">{{formatDate(u.dateOfBirth)}}</td>
	    			<td>{{u.role}}</td>
	    			<td v-if="u.customerType != null">{{u.customerType.typeName}}</td>
					<td v-if="u.customerType == null"> </td>	
	    			<td style="text-align:center">{{u.points}}</td>
					<td><button class="cancel" @click="deleteUser(u.id, index)">Obriši</button></td>
	    		</tr>
	    	</table>
    	</div>		  
    	`,
    mounted () {
		axios.post('rest/users/getlogged', this.user, {withCredentials: true}).
					then(response => { 
						this.user = { username: "", password: "", role: ""};
						if (response.data != "ERROR" && response.data != null){
							this.user = response.data;
							if (this.user.role !== "Administrator"){
								router.push('/');
							}
						}
			});
			
        axios
          .get('rest/users/')
          .then(response => (this.users = response.data))
    },
    methods: {
		deleteUser : function(id, index) {
    		r = confirm("Da li ste sigurni?")
    		if (r){
	    		axios
	            .delete('rest/users/delete/' + id).then(response => (this.users.splice(index, 1)));
    		}
    	},
		formatDate(date) {
			if (date)
    		return new Intl.DateTimeFormat('rs-SR', { dateStyle: 'medium'}).format(new Date(date))
  		},
		filteredRoles: function (val, idx, arr) {
          for(var i = 0; i < idx; i++) {
            if(arr[i].role === val.role) {
              return false;
            }
          }
          return true;
        },
    	sortTable(n, isNumber) {
			  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
			  table = document.getElementById("users_table");
			  switching = true;
			  dir = "asc";
			  while (switching) {
			    switching = false;
			    rows = table.rows;
			    for (i = 1; i < (rows.length - 1); i++) {
			      shouldSwitch = false;
			      x = rows[i].getElementsByTagName("TD")[n];
			      y = rows[i + 1].getElementsByTagName("TD")[n];
			      if(isNumber){
					let a = x.innerHTML;
					let b = y.innerHTML;
					if (dir == "asc") {
				        if (Number(a) > Number(b)) {
				          shouldSwitch = true;
				          break;
				        }
				    } else if (dir == "desc") {
				        if (Number(a) < Number(b)) {
				          shouldSwitch = true;
				          break;
				        }
				    }
				  }else{
				      if (dir == "asc") {
				        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
				          shouldSwitch = true;
				          break;
				        }
				      } else if (dir == "desc") {
				        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
				          shouldSwitch = true;
				          break;
				        }
				      }
				  }
			    }
			    if (shouldSwitch) {
			      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
			      switching = true;
			      switchcount ++;
			    } else {
			      if (switchcount == 0 && dir == "asc") {
			        dir = "desc";
			        switching = true;
			      }
			    }
			}
		},
		filterTableByRole() {
		  let dropdown, table, rows, cells, type, filter;
		  dropdown = document.getElementById("roleDropdown");
		  table = document.getElementById("users_table");
		  rows = table.getElementsByTagName("tr");
		  filter = dropdown.value;
		
		  for (let row of rows) {
		    cells = row.getElementsByTagName("td");
		    type = cells[4] || null;
		    if (filter === "Sve" || !type || (filter === type.textContent)) {
		      row.style.display = "";
		    }
		    else {
		      row.style.display = "none";
		    }
		  }
		},
		filterTableByType() {
		  let dropdown, table, rows, cells, type, filter;
		  dropdown = document.getElementById("typeDropdown");
		  table = document.getElementById("users_table");
		  rows = table.getElementsByTagName("tr");
		  filter = dropdown.value;
		
		  for (let row of rows) {
		    cells = row.getElementsByTagName("td");
		    type = cells[5] || null;
		    if (filter === "Sve" || !type || (filter === type.textContent)) {
		      row.style.display = "";
		    }
		    else {
		      row.style.display = "none";
		    }
		  }
		}
    },
    computed: {
		filteredUsers() {
			if (this.users == null){ 
				axios.get('rest/users/').then(response => (this.users = response.data));
				return this.users;
			}
			else{
				return this.users.filter(user => {
    	     			return (user.name.toLowerCase().indexOf(this.search.toLowerCase()) > -1)
    	     			 || (user.surname.toLowerCase().indexOf(this.search.toLowerCase()) > -1)
    	     			 || (user.username.toLowerCase().indexOf(this.search.toLowerCase()) > -1)})
			}
		}
	}
});