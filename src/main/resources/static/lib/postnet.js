var app = new Vue({
	el: '#app',
	data: {
		message: 'Hello Vue!',
		showModal: true,
		loadingPage: false,
		firstName: '',
		lastName: '',
		email: '',
		nightmode: 0,
		clients: [],
		accounts: [],
		cards: [],
		cardNumber: 'Select card',
		cvv: '',
		balance: '',
		accounts2: [],
		destiny: '',
		amount: '',
		description: '',
		accountselected: 'self',
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
					this.showModal = false
					this.loadingPage = false
					// handle success
					this.clients = response.data
					this.accounts = response.data.accounts
					this.cards = response.data.cards
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
		cardSelected() {
			this.cvv = this.cards.filter((item) => item.number == this.cardNumber)
			this.cvv = this.cvv[0].cvv
			this.balance = this.accounts.filter(
				(item) => item.number == this.cards[0].associatedAccount
			)
			this.balance = this.balance[0].balance
		},
		createPurchase() {
			if (
				this.amount != '' &&
				this.description != '' &&
				this.originAccount != 'Select current account'
			) {
				if (this.destiny != 'Select destination account' || this.destiny != '') {
					Swal.fire({
						title: 'Are you sure you want to make the transfer?',
						showDenyButton: true,
						showCancelButton: true,
						confirmButtonText: 'Yes!',
					}).then((result) => {
						/* Read more about isConfirmed, isDenied below */
						if (result.isConfirmed) {
							axios
								.post(
									'/api/postnet',
									{
										cardNumber: this.cardNumber,
										cvv: this.cvv,
										amount: this.amount,
										description: this.description,
										destiny: this.destiny,
									},
									{ headers: { 'content-type': 'application/json' } }
								)
								.then(() => {
									Swal.fire({
										icon: 'success',
										title: 'Successful transaction 🥳',
										showConfirmButton: false,
									})
									setTimeout(() => {
										window.location.reload()
									}, 2000)
								})
								.catch((error) => {
									Swal.fire({
										icon: 'error',
										title: 'Error',
										text: 'An error occurred',
									})
								})
						} else if (result.isDenied) {
							Swal.fire('Changes are not saved', '', 'info')
						}
					})
				}
			} else {
				if (
					this.amount == '' &&
					this.description == '' &&
					this.currentaccount == 'Select current account'
				) {
					if (this.destiny == 'Select destination account' || this.destiny == '') {
						Swal.fire('There are empty fields 🥺', '', 'info')
					}
				} else if (this.originAccount == 'Select current account') {
					Swal.fire('Enter the origin account', '', 'info')
				} else if (this.destiny == 'Select destination account') {
					Swal.fire('Enter the destination account', '', 'info')
				} else if (this.amount == '') {
					Swal.fire('Enter amount', '', 'info')
				} else if (this.description == '') {
					Swal.fire('Please, enter description', '', 'info')
				}
			}
		},
		changeColor() {
			let text = document.querySelector('.inputAmount')
			if (text.value > this.balance[0].balance) {
				text.style.color = 'red'
			} else {
				text.style.color = 'black'
			}
		},
		enter(keyboard) {
			let inputamount = document.querySelector('.inputAmount')
			let inputdescription = document.querySelector('.inputDescription')
			if (keyboard == 'destiny') inputamount.focus()
			if (keyboard == 'amount') inputdescription.focus()
			if (keyboard == 'description') this.createTransfer()
		},
		signOut() {
			axios.post('/api/logout').then(() => {
				window.location.href = '/index.html'
			})
		},
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
