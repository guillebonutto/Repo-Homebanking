let input1 = document.querySelector('#name')
let input2 = document.querySelector('#surname')
let input3 = document.querySelector('#email')
let text = document.getElementsByClassName('texto')

var app = new Vue({
	el: '#app',
	data: {
		message: 'Hello Vue!',
		photo: '',
		clients: [],
		firstName: '',
		lastName: '',
		emailMenu: '',
		showModal: true,
		loadingPage: true,
		url: '',
		json: [],
		name: '',
		surname: '',
		email: '',
		loans: [],
		collap: 'menu-collapsed',
	},
	created() {
		axios
			.get('https://www.dolarsi.com/api/api.php?type=valoresprincipales')
			.then((response) => {
				this.dolarCompra = response.data[0].casa.compra
				this.dolarVenta = response.data[6].casa.venta
			})
		// Make a request for a user with a given ID
		this.loadData()
		this.chequeo()
		this.check()
	},
	methods: {
		check() {
			if (this.collap == 'menu-collapsed') {
				this.collap = 'menu-expanded'
			} else {
				this.collap = 'menu-collapsed'
			}
		},
		loadData() {
			axios
				.get('http://localhost:8080/rest/clients')
				.then((response) => {
					// handle success
					this.clients = response.data._embedded.clients
					this.json = response.data
				})
				.catch((error) => {
					// handle error
					console.log(error)
				})
			axios
				.get('/api/clients/current')
				.then((response) => {
					this.showModal = false
					this.loadingPage = false
					this.firstName = response.data.firstName
					this.lastName = response.data.lastName
					this.emailMenu = response.data.email
					this.loans = response.data.loans
					photo.setAttribute('src', response.data.photo)
				})
				.catch((error) => console.log(error))
		},
		postClient() {
			if (this.name != '' && this.surname != '' && this.email.includes('@')) {
				if (this.email.includes('hotmail.com')) {
					axios
						.post('http://localhost:8080/rest/clients', {
							firstName: this.name,
							lastName: this.surname,
							email: this.email,
						})
						.then((response) => {
							this.loadData()
						})
						.catch((error) => console.log(error))
				}
			}
		},
		deleteClient(person) {
			this.url = person._links.client.href
			axios.delete(this.url).then((deleted) => {
				this.loadData()
			})
		},
		chequeo() {
			if (check.checked) {
				body1.style.backgroundColor = 'black'
				for (let h = 0; h < input.length; h++) {
					input[h].style.color = 'white'
				}
				for (let i = 0; i < text.length; i++) {
					text[i].style.color = 'white'
				}
				for (let j = 0; j < span.length; j++) {
					span[j].style.backgroundColor = 'black'
					span[j].style.color = 'white'
				}
				noche.style.color = 'white'
				noche.style.fontWeight = 'bold'
				titulo.style.textShadow = '2px 2px 8px white'
			} else {
				body1.style.backgroundColor = 'white'
				for (let h = 0; h < input.length; h++) {
					input[h].style.color = 'black'
				}
				for (let i = 0; i < text.length; i++) {
					text[i].style.color = 'black'
				}
				for (let j = 0; j < span.length; j++) {
					span[j].style.backgroundColor = 'white'
					// if (input[j].value == "") {
					span[j].style.color = 'black'
					// } else {
					// 	span[j].style.color = "#4285f4"
					// }
				}
				noche.style.color = 'black'
				noche.style.fontWeight = ''
				titulo.style.textShadow = '2px 2px 7px black'
			}
		},
		signOut() {
			axios.post('/api/logout').then(() => {
				window.location.href = '/index.html'
			})
		},
		disableDefault() {
			return false
		},
	},
})

// input1.addEventListener("keyup", (e) => {
// 	e.preventDefault()
// 	if (e.keyCode === 13) {
// 		input2.focus()
// 	}
// })
// input2.addEventListener("keyup", (e) => {
// 	e.preventDefault()
// 	if (e.keyCode === 13) {
// 		input3.focus()
// 	}
// })
// input3.addEventListener("keyup", (e) => {
// 	e.preventDefault()
// 	if (e.keyCode === 13) {
// 		app.clients.push({
// 			firstName: `${input1.value}`,
// 			lastName: `${input2.value}`,
// 			email: `${input3.value}`,
// 		})
// 	}
// })
