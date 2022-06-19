const Venues = { template: '<venues></venues>'}
const RegisterLogin = { template: '<register-login></register-login>'}
const UserProfile = { template: '<user-profile></user-profile>'}
const Users = { template: '<users></users>'}

const router = new VueRouter({
	mode: 'hash',
	  routes: [
	    { path: '/', name:'home', components: { default: Venues, RegisterLogin: RegisterLogin}},
	    { path: '/users/:id', components: { default: Venues, RegisterLogin: RegisterLogin}},
	    { path: '/profile', components: { default: UserProfile, RegisterLogin: RegisterLogin}},
	    { path: '/users', components: { default: Users, RegisterLogin: RegisterLogin}}
	  ]
});

var app = new Vue({
	router,
	el: '#container'
});