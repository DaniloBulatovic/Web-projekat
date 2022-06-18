const Venues = { template: '<venues></venues>'}
const RegisterLogin = { template: '<register-login></register-login>'}
const UserProfile = { template: '<user-profile></user-profile>'}

const router = new VueRouter({
	mode: 'hash',
	  routes: [
	    { path: '/', name:'home', components: { default: Venues, RegisterLogin: RegisterLogin}},
	    { path: '/users/:id', components: { default: Venues, RegisterLogin: RegisterLogin}},
	    { path: '/profile/:id', components: { default: UserProfile}}
	  ]
});

var app = new Vue({
	router,
	el: '#container'
});