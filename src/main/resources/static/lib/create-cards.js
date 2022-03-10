var app = new Vue({
	el: "#app",
	data: {
		message: "Hello Vue!",
		firstName: "",
		lastName: "",
		email: "",
		nightmode: 0,
		clients: [],
		accounts: [],
		cards: [],
		showModal: true,
		loadingPage: true,
		cardHolder: "",
		cardNumber: "",
		cvv: "",
		expireMonth: "",
		expireYear: "",
		associatedAccount: "Select account to link card",
		credit: [],
		debit: [],
		filterStatusCredit: "",
		filterStatusDebit: "",
		type: "",
		color: "Select card color",
		collap: "menu-expanded",
	},
	created() {
		this.chequeo()
		this.loadData()
	},
	methods: {
		check() {
			if (this.collap == "menu-collapsed") {
				this.collap = "menu-expanded"
			} else {
				this.collap = "menu-collapsed"
			}
		},
		chequeo() {
			if (this.nightmode == 1) {
				body1.style.backgroundColor = "#4f4f4f"
				// for (let i = 0; i < text.length; i++) {
				// 	text[i].style.color = "white"
				// }
				noche.style.color = "white"
				noche.style.fontWeight = "bold"
				// titulo.style.textShadow = "2px 2px 8px white"
			} else {
				body1.style.backgroundColor = "white"
				// for (let i = 0; i < text.length; i++) {
				// 	text[i].style.color = "black"
				// }
				noche.style.color = "black"
				noche.style.fontWeight = ""
				// titulo.style.textShadow = "2px 2px 7px black"
			}
		},
		loadData() {
			axios
				.get("/api/clients/current")
				.then((response) => {
					// handle success
					this.showModal = false
					this.loadingPage = false
					this.clients = response.data
					this.accounts = response.data.accounts
					this.firstName = response.data.firstName
					this.lastName = response.data.lastName
					this.email = response.data.email
					this.cards = response.data.cards
					this.cardNumber = JSON.parse(localStorage.getItem("cardNumber"))
					this.cvv = JSON.parse(localStorage.getItem("cvv"))
					this.expireMonth = JSON.parse(localStorage.getItem("month"))
					this.expireYear = JSON.parse(localStorage.getItem("year"))
					for (let i = 0; i < this.cards.length; i++) {
						if (this.cards[i].type == "DEBIT") {
							this.debit.push(this.cards[i])
						} else {
							this.credit.push(this.cards[i])
						}
					}
					this.filter()
					photo.setAttribute("src", this.clients.photo)
				})
				.catch((error) => {
					// handle error
					console.log(error)
				})
		},
		redirectIfExist(pagina) {
			axios
				.get("http://localhost:8080/web/" + pagina + ".html")
				.then(() => {
					window.location.href = "/web/" + pagina + ".html"
				})
				.catch((error) => {
					if (error.response.status == 404) {
						window.location.href = "/web/NotFound.html"
					}
				})
		},
		signOut() {
			axios.post("/api/logout").then(() => {
				window.location.href = "/index.html"
			})
		},
		createCard() {
			axios
				.post(
					"/api/clients/current/cards",
					`type=${this.type}&color=${this.color}&account=${this.associatedAccount}`
				)
				.then(() => {
					window.location.href = "/web/cards.html"
				})
				.catch((error) => {})
		},
		filter() {
			this.filterStatusCredit = this.credit.filter((card) => card.disabled === false)
			this.filterStatusDebit = this.debit.filter((card) => card.disabled === false)
		},
	},
})

window.onresize = function () {
	if (screen.width > 800) {
		app.collap = "menu-expanded"
	} else {
		app.collap = "menu-collapsed"
	}
}

if (screen.width > 800) {
	app.collap = "menu-expanded"
} else {
	app.collap = "menu-collapsed"
}

console.log(
	"%cWARNING!",
	"color: yellow;text-shadow: -1px 0 black, 0 2px black, 2px 0 black, 0 -1px black;font-size: 45px;font-weight:bold"
)
console.log(
	"%cIf someone told you to copy/paste something here you are going to be scammed",
	"font-size: 15px;font-weight:bold"
)
console.log(
	"%cPasting anything in here could give attackers access to your Ecobank account",
	"color:red;font-size: 16px;font-weight:bold"
)
