var app = new Vue({
	el: '#app',
	data: {
		firstName: '',
		lastName: '',
		email: '',
		nightmode: 0,
		clients: [],
		showModal: true,
		loadingPage: true,
		collap: 'menu-expanded',
	},
	created() {
		this.chequeo()
		this.loadData()
	},
	methods: {
		check() {
			if (this.collap == 'menu-collapsed') {
				this.collap = 'menu-expanded'
			} else {
				this.collap = 'menu-collapsed'
			}
		},
		chequeo() {
			if (this.nightmode == 1) {
				body1.style.backgroundColor = '#4f4f4f'
				noche.style.color = 'white'
				noche.style.fontWeight = 'bold'
				// titulo.style.textShadow = "2px 2px 8px white"
			} else {
				body1.style.backgroundColor = 'white'
				noche.style.color = 'black'
				noche.style.fontWeight = ''
				// titulo.style.textShadow = "2px 2px 7px black"
			}
		},
		loadData() {
			axios
				.get('/api/clients/current')
				.then((response) => {
					// handle success
					this.showModal = false
					this.loadingPage = false
					this.clients = response.data
					this.firstName = response.data.firstName
					this.lastName = response.data.lastName
					this.email = response.data.email
					photo.setAttribute('src', this.clients.photo)
				})
				.catch((error) => {
					// handle error
					console.log(error)
				})
		},
		redirectIfExist(pagina) {
			axios
				.get('/web/' + pagina + '.html')
				.then(() => {
					window.location.href = '/web/' + pagina + '.html'
				})
				.catch((error) => {
					if (error.response.status == 404) {
						window.location.href = '/web/NotFound.html'
					}
				})
		},
		sendForm() {
			let input1 = document.querySelector('#name')
			let input2 = document.querySelector('#lastName')
			let input3 = document.querySelector('#email')

			if (input1.value != '' && input2.value != '' && input3.value != '') {
				Swal.fire({
					icon: 'success',
					text: "Thank you for contacting us, we'll get in touch with you soon 😉",
					showConfirmButton: false,
				})
				setTimeout(() => {
					window.location.reload()
				}, 2000)
			} else {
				Swal.fire({
					icon: 'error',
					text: 'Unfilled fields detected!',
					showConfirmButton: false,
					timer: 2000,
				})
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
