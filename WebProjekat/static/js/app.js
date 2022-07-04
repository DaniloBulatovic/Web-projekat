const Venues = { template: '<venues></venues>'}
const Venue = { template: '<venue></venue>'}
const NewVenue = { template: '<new-venue></new-venue>'}
const RegisterLogin = { template: '<register-login></register-login>'}
const UserProfile = { template: '<user-profile></user-profile>'}
const Users = { template: '<users></users>'}
const MenuBar = { template: '<menu-bar></menu-bar>'}
const ManagerVenue = { template: '<manager-venue></manager-venue>'}
const Training = { template: '<training></training>'}
const NewTraining = { template: '<new-training></new-training>'}

const router = new VueRouter({
	mode: 'hash',
	  routes: [
		{ path: '/', name:'home', components: { default: Venues, RegisterLogin: RegisterLogin, LeftPane: Venue, Menu: MenuBar}},
	    { path: '/users/:id', components: { default: Venues, RegisterLogin: RegisterLogin, LeftPane: Venue, Menu: MenuBar}},
	    { path: '/profile', components: { default: UserProfile, RegisterLogin: RegisterLogin, Menu: MenuBar}},
	    { path: '/users', components: { default: Users, RegisterLogin: RegisterLogin, Menu: MenuBar}},
		{ path: '/venue', components: { default: ManagerVenue, RegisterLogin: RegisterLogin, Menu: MenuBar}}
	  ]
});

var app = new Vue({
	router,
	el: '#container'
});