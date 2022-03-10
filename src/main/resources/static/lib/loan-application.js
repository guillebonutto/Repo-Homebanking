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
		showModal: true,
		loadingPage: true,
		accountNumber: "Select account",
		loans: [],
		percentage: "",
		balance: 0,
		dues: [],
		loanFilter: "",
		amount: 0,
		accountSelected: "hipotecario",
		loanSelected: "Select loan type",
		dueSelected: 0,
		totalInterest: 0,
		interest: 0,
		active: "",
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
					this.accounts = response.data.accounts
					this.firstName = response.data.firstName
					this.lastName = response.data.lastName
					this.email = response.data.email
					photo.setAttribute("src", response.data.photo)
				})
				.catch((error) => {
					// handle error
					console.log(error)
				})
			axios
				.get("/api/loans")
				.then((response) => {
					// handle success
					this.loans = response.data
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
		filter() {
			this.dues = this.loans.filter((item) => item.name == this.loanSelected)
			this.percentage = "1." + this.dues[0].percentage
			this.dues = this.dues[0].dues
			this.balance = this.dues[0].maxAmount
			this.loanFilter = this.loans.filter((item) => item.name == this.loanSelected)
			if (this.balance > 0) this.dueSelected = "Select due"
			// this.balance = this.accounts.filter((item) => item.number == this.accountNumber)
		},
		createTransfer() {
			if (
				this.accountNumber != "Select account" &&
				this.loanSelected != "Select loan type" &&
				this.amount != ""
			) {
				Swal.fire({
					title: "Are you sure you want to request the application?",
					showDenyButton: true,
					showCancelButton: true,
					confirmButtonText: "Yes!",
				}).then((result) => {
					/* Read more about isConfirmed, isDenied below */
					if (result.isConfirmed) {
						axios
							.post(
								"/api/loans",
								{
									name: this.loanSelected,
									account: this.accountNumber,
									amount: this.amount,
									due: this.dueSelected,
								},
								{ headers: { "content-type": "application/json" } }
							)
							.then(() => {
								Swal.fire({
									icon: "success",
									title: "Loan requested successfully 🥳",
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
			} else {
				if (this.amount == "" && this.accountNumber == "Select destiny account") {
					if (this.accountSelected == "Select account" || this.destiny == "") {
						Swal.fire("There are empty fields 🥺", "", "info")
					}
				} else if (this.accountNumber == "Select account") {
					Swal.fire("Enter destiny account", "", "info")
				} else if ((this.loanSelected != "Select loan type") == "Select account") {
					Swal.fire("Enter the loan to request", "", "info")
				} else if (this.amount == "") {
					Swal.fire("Enter amount", "", "info")
				}
			}
		},
		Update() {
			let text = document.querySelector(".inputAmount")
			if (text.value > this.balance) {
				text.style.color = "red"
			} else {
				text.style.color = "black"
			}
			this.totalInterest = ((this.amount / this.dueSelected) * this.percentage).toFixed(2)
			this.interest = ((this.amount / this.dueSelected) * 0.2).toFixed(2)
		},
		enter(keyboard) {
			let inputamount = document.querySelector(".inputAmount")
			let input = document.querySelector(".input")
			if (keyboard == "destiny") inputamount.focus()
			if (keyboard == "amount") input.focus()
			if (keyboard == "") this.createTransfer()
		},
		showInterestDetails() {
			// let tooltip = document.querySelector(".tooltipInterest")
			// let tooltip2 = document.querySelector(".interest")
			if (this.active == "ACTIVE") {
				this.active = ""
			} else {
				this.active = "ACTIVE"
			}
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
