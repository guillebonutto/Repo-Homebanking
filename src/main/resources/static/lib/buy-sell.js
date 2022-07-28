let text = document.getElementsByClassName("texto")
let cards = document.getElementsByClassName("card")
let divprincipal = document.getElementById("div-principal")
var app = new Vue({
	el: "#app",
	data: {
		message: "Hello Vue!",
		clients: [],
		accounts: [],
		dollarAccounts: [],
		amount: 0,
		firstName: "",
		lastName: "",
		email: "",
		showModal: true,
		loadingPage: true,
		nightmode: "",
		dolarCompra: 0,
		dolarVenta: 0,
		buying: false,
		selling: false,
		filterAccount: [],
		originAccount: "",
		destinyAccount: "",
		collap: "menu-expanded",
	},
	created() {
		this.loadData()
		this.chequeo()
	},
	methods: {
		chequeo() {
			for (let h = 0; h < cards.length; h++) {
				cards[h].style.color = "black"
			}
			if (this.nightmode == 1) {
				body1.style.backgroundColor = "black"
				for (let i = 0; i < text.length; i++) {
					text[i].style.color = "white"
				}
				noche.style.color = "white"
				noche.style.fontWeight = "bold"
				// titulo.style.textShadow = "2px 2px 8px white"
			} else {
				body1.style.backgroundColor = "white"
				for (let i = 0; i < text.length; i++) {
					text[i].style.color = "black"
				}
				noche.style.color = "black"
				noche.style.fontWeight = ""
				// titulo.style.textShadow = "2px 2px 7px black"
			}
		},
		check() {
			if (this.collap == "menu-collapsed") {
				this.collap = "menu-expanded"
				document.getElementById("pestania").style.marginLeft = "11rem"
				document.getElementById("div-principal").style.marginLeft = "12rem"
				document.getElementById("saldo-total").style.marginRight = "3rem"
			} else {
				this.collap = "menu-collapsed"
				document.getElementById("pestania").style.marginLeft = "3rem"
				document.getElementById("div-principal").style.marginLeft = "4rem"
				document.getElementById("saldo-total").style.marginRight = "5rem"
			}
		},
		loadData() {
			axios.get("/api/clients/current").then((response) => {
				// handle success
				this.clients = response.data
				this.accounts = response.data.accounts
				this.firstName = response.data.firstName
				this.lastName = response.data.lastName
				this.email = response.data.email
				let photo = document.querySelector("#photo")
				photo.setAttribute("src", this.clients.photo)
			})
			axios
				.get(`https://www.dolarsi.com/api/api.php?type=valoresprincipales`)
				.then((response) => {
					this.showModal = false
					this.loadingPage = false
					this.dolarVenta = response.data[0].casa.compra
					this.dolarCompra = response.data[6].casa.venta
				})
				.catch((error) => {
					// handle error
					console.log(error)
				})
		},
		signOut() {
			axios.post("/api/logout").then(() => {
				window.location.href = "/index.html"
			})
		},
		redirectIfExist(pagina) {
			axios
				.get("/web/" + pagina + ".html")
				.then(() => {
					window.location.href = "/web/" + pagina + ".html"
				})
				.catch((error) => {
					if (error.response.status == 404) {
						window.location.href = "/web/NotFound.html"
					}
				})
		},
		buy() {
			let comprarrrr = Math.trunc(this.dolarCompra)
			let cmmm = this.amount
			let come = cmmm * comprarrrr
			if (!this.buying) {
				let btn1 = document.querySelector("#btnbuy")
				let btn2 = document.querySelector("#btnsell")
				this.buying = true
				this.selling = false
				btn1.disabled = false
				btn2.disabled = true
				btn1.style.pointerEvents = "auto"
				btn2.style.pointerEvents = "none"
			} else {
				this.originAccount = this.accounts.filter((type) => type.type == "SAVING_ACCOUNT")
				this.dollarAccounts = this.accounts.filter((type) => type.type == "DOLLARS_ACCOUNT")
				if (this.dollarAccounts.length > 0) {
					this.dollarAccounts = this.dollarAccounts.filter((deleted) => deleted.deleted == false)
					this.destinyAccount = this.dollarAccounts[0].number
				}
				this.originAccount = this.originAccount[0].number
				axios
					.post(
						"/api/clients/current/accounts/dollars",
						`amount=${this.amount * this.dolarCompra}&originAccount=${
							this.originAccount
						}&destinyAccount=${this.destinyAccount}`
					)
					.then((response) => {
						Swal.fire({
							icon: "success",
							text: "Successful purchase",
							timer: 1500,
						})
					})
					.catch((error) => {
						if (error.response.data == "You don't have a dollar account") {
							Swal.fire({
								icon: "info",
								title: "You don't have a dollar account",
								text: "Do you want to create one?",
								showDenyButton: true,
								showCancelButton: true,
								confirmButtonText: "Yes!",
							}).then((result) => {
								/* Read more about isConfirmed, isDenied below */
								if (result.isConfirmed) {
									axios
										.post("/api/clients/current/accounts", "type=DOLLARS_ACCOUNT")
										.then(() => {
											Swal.fire({
												icon: "success",
												text: "You created a new account",
											}).then(() => {
												axios.get("/api/clients/current").then((response) => {
													// handle success
													this.accounts = response.data.accounts
													this.buy()
												})
											})
										})
										.catch((err) => {
											Swal.fire({
												icon: "error",
												title: "Error",
												text: "An error occurred in the proccess 🥺 try again and if the error persist don not hesitate to contact us 😊",
											})
										})
								} else if (result.isDenied) {
									Swal.fire("Changes are not saved", "", "info")
								}
							})
						}
					})
			}
		},
		sell() {
			if (!this.delling) {
				let btn2 = document.querySelector("#btnsell")
				this.buying = false
				this.selling = true
				btn1.disabled = false
				btn2.disabled = true
				btn1.style.pointerEvents = "auto"
				btn2.style.pointerEvents = "none"
			} else {
				this.originAccount = this.accounts.filter((type) => type.type == "DOLLARS_ACCOUNT")
				this.destinyAccount = this.accounts.filter((type) => type.type == "SAVING_ACCOUNT")
				this.originAccount = this.originAccount[0].number
				this.destinyAccount = this.destinyAccount[0].number
				if (this.destinyAccount != "") {
					axios
						.post(
							"/api/clients/current/accounts/dollars",
							`amount=${this.amount / this.dolarVenta}&originAccount=${
								this.originAccount
							}&destinyAccount=${this.destinyAccount}`
						)
						.then((response) => {
							console.log("Sell success")
							this.buying = true
							this.selling = false
						})
				}
			}
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
