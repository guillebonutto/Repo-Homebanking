let text = document.getElementsByClassName('texto')
let cards = document.getElementsByClassName('card')
let divtable = document.getElementsByClassName('div-tabla')
let divprincipal = document.getElementById('div-principal')

var app = new Vue({
	el: '#app',
	data: {
		message: 'Hello Vue!',
		nightmode: 0,
		fecha: '',
		clients: [],
		transactions: [],
		filterTransaction: [],
		showModal: true,
		loadingPage: true,
		id: '',
		balance: 0,
		number: [],
		fromDate: 0,
		toDate: 0,
		firstName: '',
		lastName: '',
		email: '',
		collap: 'menu-expanded',
	},
	created() {
		let urlParams = new URLSearchParams(window.location.search)
		this.id = urlParams.get('id')
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
				.get(`/api/accounts/${this.id}`)
				.then((response) => {
					// handle success
					this.showModal = false
					this.loadingPage = false
					this.transactions = response.data.transactions
					this.transactions = [...this.transactions].sort((a, b) => b.id - a.id)
					this.filterDates()
				})
				.catch((error) => {
					// handle error
					console.log(error)
				})
			axios.get('/api/clients/current').then((response) => {
				// handle success
				this.clients = response.data
				this.firstName = response.data.firstName
				this.lastName = response.data.lastName
				this.email = response.data.email
				let photo = document.querySelector('#photo')
				photo.setAttribute('src', this.clients.photo)
			})
		},
		updateBalance() {
			this.balance = 0
			for (let i = 0; i < this.filterTransaction.length; i++) {
				this.balance += this.filterTransaction[i].amount
			}
			this.balance = this.balance.toFixed(2)
		},
		filterDates() {
			this.transactions.forEach((transaction) => {
				if (
					(transaction.creationDate.substring(0, 10) >= this.fromDate &&
						transaction.creationDate.substring(0, 10) <= this.toDate) ||
					this.fromDate == 0 ||
					this.toDate == 0
				) {
					this.filterTransaction.push(transaction)
				} else {
					this.filterTransaction = []
				}
			})
			this.updateBalance()
		},
		exportPDF() {
			axios({
				url: `/api/pdf/generate/${this.id}`,
				method: 'GET',
				responseType: 'blob',
				params: {
					fromDate: this.fromDate,
					toDate: this.toDate,
				},
			})
				.then((response) => {
					const url = window.URL.createObjectURL(new Blob([response.data]))
					const link = document.createElement('a')
					console.log(response)
					link.href = url
					link.setAttribute(
						'download',
						'ECOBANK_balance_' +
							this.cliente +
							'_' +
							this.fromDate +
							'_to_' +
							this.toDate +
							'.pdf'
					)
					document.body.appendChild(link)
					link.click()
				})
				.catch(function (error) {
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
	},
})

window.onresize = function () {
	if (screen.width > 800) {
		app.collap = 'menu-expanded'
	} else {
		app.collap = ''
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
