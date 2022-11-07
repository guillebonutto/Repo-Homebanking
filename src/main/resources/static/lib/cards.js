let text = document.getElementsByClassName('texto')
let cards = document.getElementsByClassName('card')

var app = new Vue({
	el: '#app',
	data: {
		message: 'Hello Vue!',
		nightmode: 0,
		clients: [],
		showModal: true,
		loadingPage: true,
		cards: [],
		debit: [],
		credit: [],
		filterStatus: '',
		active: '',
		fecha: '',
		cardNumber: '',
		cardAsked: false,
		collap: 'menu-expanded',
	},
	created() {
		this.loadData()
		this.chequeo()
		document.getElementById('pestania').style.marginLeft = '12.5rem'
	},
	methods: {
		chequeo() {
			for (let h = 0; h < cards.length; h++) {
				cards[h].style.color = '#4f4f4f'
			}
			if (this.nightmode == 1) {
				body1.style.backgroundColor = '#4f4f4f'
				for (let i = 0; i < text.length; i++) {
					text[i].style.color = 'white'
				}
				noche.style.color = 'white'
				noche.style.fontWeight = 'bold'
				// titulo.style.textShadow = "2px 2px 8px white"
			} else {
				body1.style.backgroundColor = 'white'
				for (let i = 0; i < text.length; i++) {
					text[i].style.color = 'black'
				}
				noche.style.color = 'black'
				noche.style.fontWeight = ''
				// titulo.style.textShadow = "2px 2px 7px black"
			}
		},
		check() {
			if (this.collap == 'menu-collapsed') {
				this.collap = 'menu-expanded'
			} else {
				this.collap = 'menu-collapsed'
			}
		},
		loadData() {
			axios
				.get('/api/clients/current')
				.then((response) => {
					this.showModal = false
					this.loadingPage = false
					// handle success
					this.clients = response.data
					let photo = document.querySelector('#photo')
					photo.setAttribute('src', this.clients.photo)
					this.firstName = response.data.firstName
					this.lastName = response.data.lastName
					this.email = response.data.email
					this.cards = response.data.cards
					this.filter()
					const today = new Date(Date.now())
					let currentDate
					if (today.getMonth() + 1 < 10) {
						currentDate =
							today.getFullYear().toString() +
							'-0' +
							(today.getMonth() + 1).toString() +
							'-' +
							today.getDate().toString()
					} else {
						currentDate =
							today.getFullYear().toString() +
							'-' +
							(today.getMonth() + 1).toString() +
							'-' +
							today.getDate().toString()
					}
					this.fecha = currentDate
					for (let i = 0; i < this.cards.length; i++) {
						if (this.cards[i].type == 'DEBIT') {
							this.debit.push(this.cards[i])
						} else {
							this.credit.push(this.cards[i])
						}
					}
					// this.cardNumber = this.cards.number
				})
				.catch((error) => {
					// handle error
					console.log(error)
				})
		},
		signOut() {
			axios.post('/api/logout').then(() => {
				window.location.href = '/index.html'
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
		requestCard() {
			// this.cardAsked = true
			// Swal.fire({
			// 	text: "Awesome, your card is on the way!",
			// 	showClass: {
			// 		popup: "animate__animated animate__fadeInDown",
			// 	},
			// 	hideClass: {
			// 		popup: "animate__animated animate__fadeOutUp",
			// 	},
			// 	timer: 2000,
			// 	icon: "success",
			// })
			localStorage.setItem(
				'cardNumber',
				JSON.stringify(
					Math.round(Math.random() * (5299 - 4199) + 4199) +
						'-' +
						Math.round(Math.random() * (9999 - 1111) + 1111) +
						'-' +
						Math.round(Math.random() * (9999 - 1111) + 1111) +
						'-' +
						Math.round(Math.random() * (9999 - 1111) + 1111)
				)
			)
			localStorage.setItem(
				'cvv',
				JSON.stringify(Math.round(Math.random() * (999 - 111) + 111))
			)
			let month = new Date().getMonth() + 1,
				year = (new Date().getFullYear() + 5).toString().substring(2, 4)
			if (month < 10) localStorage.setItem('month', JSON.stringify('0' + month))
			else localStorage.setItem('month', JSON.stringify(month))
			localStorage.setItem('year', JSON.stringify(year))
			window.location.href = '/web/create-cards.html'
		},
		link(link) {
			var miUrl = `/web/account.html?id=${link.id}`
			window.open(miUrl, '_self')
		},
		copy(number) {
			navigator.clipboard.writeText(number)
			Swal.fire('Good job!', 'The number: ' + number + ' was copied', 'success')
		},
		hiddeCard(id) {
			axios
				.patch(`/api/clients/current/cards/${id}`, 'statusHide=true')
				.then((response) => {
					Swal.fire({
						icon: 'success',
						title: 'Success',
						text: 'Your card was deleted',
					}).then(() => {
						window.location.reload()
					})
				})
		},
		filter() {
			this.filterStatus = this.cards.filter((card) => card.deleted === false)
		},
		// deleteCard(cardNum) {
		// 	this.cardNumber = cardNum
		// 	axios
		// 		.delete(`/api/clients/current/cards/${this.cardNumber}`)
		// 		.then(() => {
		// 			window.location.reload()
		// 		})
		// 		.catch((error) => {})
		// },
	},
})

window.onresize = function () {
	if (screen.width > 800) {
		app.collap = 'menu-expanded'
	} else {
		app.collap = 'menu-collapsed'
	}
}

if (screen.width > 800) {
	app.collap = 'menu-expanded'
} else {
	app.collap = 'menu-collapsed'
}

console.log(
	'%cWARNING!',
	'color: yellow;text-shadow: -1px 0 black, 0 2px black, 2px 0 black, 0 -1px black;font-size: 45px;font-weight:bold'
)
console.log(
	'%cIf someone told you to copy/paste something here you are going to be scammed',
	'font-size: 15px;font-weight:bold'
)
console.log(
	'%cPasting anything in here could give attackers access to your Ecobank account',
	'color:red;font-size: 16px;font-weight:bold'
)
