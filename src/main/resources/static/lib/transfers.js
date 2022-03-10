var app = new Vue({
	el: "#app",
	data: {
		message: "Hello Vue!",
		showModal: true,
		loadingPage: true,
		firstName: "",
		lastName: "",
		email: "",
		nightmode: 0,
		clients: [],
		accounts1: [],
		currentaccount: "Select current account",
		balance: "",
		accounts2: [],
		destiny: "Select destination account",
		amount: "",
		description: "",
		accountselected: "self",
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
				noche.style.color = "white"
				noche.style.fontWeight = "bold"
				// titulo.style.textShadow = "2px 2px 8px white"
			} else {
				body1.style.backgroundColor = "white"
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
					this.accounts1 = response.data.accounts
					this.accounts1 = this.accounts1.sort(function (a, b) {
						return a.id - b.id
					})
					this.firstName = response.data.firstName
					this.lastName = response.data.lastName
					this.email = response.data.email
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
		accountClick(type) {
			if (type == "self") {
				this.destiny = "Select destination account"
			} else if (type == "third") {
				this.destiny = ""
			}
		},
		accountSelected() {
			this.accounts2 = this.accounts1.filter((item) => item.number != this.currentaccount)
			this.balance = this.accounts1.filter((item) => item.number == this.currentaccount)
		},
		createTransfer() {
			if (
				this.amount != "" &&
				this.description != "" &&
				this.originAccount != "Select current account"
			) {
				if (this.destiny != "Select destination account" || this.destiny != "") {
					Swal.fire({
						title: "Are you sure you want to make the transfer?",
						showDenyButton: true,
						showCancelButton: true,
						confirmButtonText: "Yes!",
					}).then((result) => {
						/* Read more about isConfirmed, isDenied below */
						if (result.isConfirmed) {
							axios
								.post(
									"/api/transactions",
									`amount=${this.amount}&description=${this.description}&originAccount=${this.currentaccount}&destinyAccount=${this.destiny}`
								)
								.then(() => {
									Swal.fire({
										icon: "success",
										title: "Successful transaction 🥳",
										showConfirmButton: false,
									})
									setTimeout(() => {
										window.location.reload()
									}, 2000)
								})
								.catch((error) => {
									Swal.fire({
										icon: "error",
										title: "Error",
										text: "An error occurred",
									})
								})
						} else if (result.isDenied) {
							Swal.fire("Changes are not saved", "", "info")
						}
					})
				}
			} else {
				if (
					this.amount == "" &&
					this.description == "" &&
					this.currentaccount == "Select current account"
				) {
					if (this.destiny == "Select destination account" || this.destiny == "") {
						Swal.fire("There are empty fields 🥺", "", "info")
					}
				} else if (this.originAccount == "Select current account") {
					Swal.fire("Enter the origin account", "", "info")
				} else if (this.destiny == "Select destination account") {
					Swal.fire("Enter the destination account", "", "info")
				} else if (this.amount == "") {
					Swal.fire("Enter amount", "", "info")
				} else if (this.description == "") {
					Swal.fire("Please, enter description", "", "info")
				}
			}
		},
		changeColor() {
			let text = document.querySelector(".inputAmount")
			if (text.value > this.balance[0].balance) {
				text.style.color = "red"
			} else {
				text.style.color = "black"
			}
		},
		transferAll() {
			document.querySelector(".transferAll").style.display = "none"
			this.amount = this.balance[0].balance
		},
		enter(keyboard) {
			let inputamount = document.querySelector(".inputAmount")
			let inputdescription = document.querySelector(".inputDescription")
			if (keyboard == "destiny") inputamount.focus()
			if (keyboard == "amount") inputdescription.focus()
			if (keyboard == "description") this.createTransfer()
		},
		signOut() {
			axios.post("/api/logout").then(() => {
				window.location.href = "/index.html"
			})
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
