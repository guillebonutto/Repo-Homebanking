let text = document.getElementsByClassName('texto')
let cards = document.getElementsByClassName('card')
let divprincipal = document.getElementById('div-principal')
let sombras = document.getElementsByClassName('shadow')

var app = new Vue({
	el: '#app',
	data: {
		message: 'Hello Vue!',
		nightmode: 0,
		clients: [],
		accounts: [],
		type: 'Select',
		showModal: true,
		loadingPage: true,
		loans: [],
		totalBalance: 0,
		filterStatus: '',
		mobile: false,
		collap: 'menu-collapsed',
	},
	created() {
		this.loadData()
		this.chequeo()
		this.check()
	},
	methods: {
		chequeo() {
			for (let h = 0; h < cards.length; h++) {
				cards[h].style.color = '#4f4f4f'
			}
			if (this.nightmode == 1) {
				for (let g = 0; g < sombras.length; g++) {
					sombras[g].style.boxShadow = '0.5rem 1rem white !important'
				}
				body1.style.backgroundColor = '#4f4f4f'
				for (let i = 0; i < text.length; i++) {
					text[i].style.color = 'white'
				}
				noche.style.color = 'white'
				noche.style.fontWeight = 'bold'
				// titulo.style.textShadow = "2px 2px 8px white"
			} else {
				for (let g = 0; g < sombras.length; g++) {
					sombras[g].style.boxShadow = '0.5rem 1rem rgb(0,0,0,.15) !important'
				}
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
					// handle success
					this.showModal = false
					this.loadingPage = false
					this.clients = response.data
					this.firstName = response.data.firstName
					this.lastName = response.data.lastName
					this.email = response.data.email
					photo.setAttribute('src', this.clients.photo)
					this.accounts = response.data.accounts
					this.loans = response.data.loans
					this.filter()
					this.accounts = this.accounts.sort(function (a, b) {
						return a.id - b.id
					})
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
		link(link) {
			var miUrl = `/web/account.html?id=${link.id}`
			window.open(miUrl, '_self')
		},
		addAccount() {
			// this.type = this.type.toUpperCase()
			// this.type = this.type.replace(" ", "_")
			axios
				.post('/api/clients/current/accounts', `type=${this.type}`)
				.then(() => {
					Swal.fire({
						icon: 'success',
						text: 'You created a new account',
					}).then(() => {
						this.showModal = false
						window.location.reload()
					})
				})
				.catch((err) => {
					Swal.fire({
						icon: 'error',
						title: 'Error',
						text: 'An error occurred in the proccess 🥺 try again and if the error persist don not hesitate to contact us 😊',
					})
				})
		},
		hiddeAccount(id) {
			axios.patch(`/api/clients/current/accounts/${id}`, 'statusHide=true').then(() => {
				Swal.fire({
					icon: 'success',
					title: 'Success',
					text: 'Your account was deleted',
				}).then(() => {
					window.location.reload()
				})
			})
		},
		filter() {
			this.filterStatus = this.accounts.filter((account) => account.deleted === false)
			for (i = 0; i < this.accounts.length; i++) {
				this.totalBalance += this.filterStatus[i].balance
			}
		},
		disableDefault() {
			return false
		},
	},
})

if (screen.width > 800) {
	app.collap = 'menu-expanded'
	app.mobile = false
} else {
	app.collap = 'menu-collapsed'
	app.mobile = true
}

window.onresize = function () {
	if (screen.width > 800) {
		app.collap = 'menu-expanded'
		app.mobile = false
	} else {
		app.collap = 'menu-collapsed'
		app.mobile = true
	}
}

console.log(
	'%cWARNING!',
	'color: yellow;text-shadow: -1px 0 black, 0 2px black, 2px 0 black, 0 -1px black;font-size: 45px;font-weight:bold'
)
console.log(
	'%cIf someone told you to copy/paste something here you are going to be scammed',
	'font-family: Arial, sans-serif;font-size: 18px;font-weight:bold'
)
console.log(
	'%cPasting anything in here could give attackers access to your Ecobank account',
	'color:red;font-size: 19px;font-family: Arial, sans-serif;font-weight:bold'
)
