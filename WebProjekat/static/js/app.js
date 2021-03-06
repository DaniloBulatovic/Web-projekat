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
const Content = { template: '<venue-content></venue-content>'}
const NewContent = { template: '<new-content></new-content>'}
const Trainings = { template: '<trainings></trainings>'}
const Memberships = { template: '<memberships></memberships>'}
const Membership = { template: '<membership></membership>'}
const PromoCodes = { template: '<promo-codes></promo-codes>'}

const router = new VueRouter({
	mode: 'hash',
	  routes: [
		{ path: '/', name:'home', components: { default: Venues, RegisterLogin: RegisterLogin, LeftPane: Venue, Menu: MenuBar }},
	    { path: '/users/:id', components: { default: Venues, RegisterLogin: RegisterLogin, LeftPane: Venue, Menu: MenuBar }},
	    { path: '/profile', components: { default: UserProfile, RegisterLogin: RegisterLogin, Menu: MenuBar }},
	    { path: '/users', components: { default: Users, RegisterLogin: RegisterLogin, Menu: MenuBar }},
		{ path: '/venue', components: { default: ManagerVenue, RegisterLogin: RegisterLogin, Menu: MenuBar }},
		{ path: '/trainings', components: {default: Trainings, RegisterLogin: RegisterLogin, Menu: MenuBar }},
		{ path: '/memberships', components: {default: Memberships, RegisterLogin: RegisterLogin, Menu: MenuBar }},
		{ path: '/promocodes', components: {default: PromoCodes, RegisterLogin: RegisterLogin, Menu: MenuBar }}
	  ]
});

var app = new Vue({
	router,
	el: '#container'
});