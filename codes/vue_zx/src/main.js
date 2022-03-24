import Vue from 'vue'
import App from './App'

const vm = new Vue({
	el:'#app',
	// template:`<App></App>`,
	// components:{App},
	render: h => h(App),
	beforeCreate () {
		Vue.prototype.$bus = this 
	}
})
console.log(vm)