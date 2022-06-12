const Venue = { template: '<edit-venue></edit-venue>'}
const Venues = { template: '<venues></venues>'}

const router = new VueRouter({
	mode: 'hash',
	  routes: [
	    { path: '/', name:'home', component: Venues},
	    { path: '/venues/:id', component: Venue}
	  ]
});

var app = new Vue({
	router,
	el: '#venues'
});