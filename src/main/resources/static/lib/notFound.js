let text = document.getElementsByClassName("texto")
let cards = document.getElementsByClassName("card")
let divtable = document.getElementsByClassName("div-tabla")
let divprincipal = document.getElementById("div-principal")

var app = new Vue({
	el: "#app",
	data: {
		message: "Hello Vue!",
		nightmode: 0,
		showModal: true,
		loadingPage: true,
		fecha: "",
		clients: [],
		firstName: "",
		lastName: "",
		email: "",
		collap: "menu-expanded",
	},
	created() {
		this.loadData()
		this.chequeo()
	},
	methods: {
		chequeo() {
			if (this.nightmode == 1) {
				body1.style.backgroundColor = "#4f4f4f"
				for (let i = 0; i < text.length; i++) {
					text[i].style.color = "white"
				}
				noche.style.color = "white"
				noche.style.fontWeight = "bold"
				titulo.style.textShadow = "2px 2px 8px white"
			} else {
				body1.style.backgroundColor = "white"
				for (let i = 0; i < text.length; i++) {
					text[i].style.color = "black"
				}
				noche.style.color = "black"
				noche.style.fontWeight = ""
				titulo.style.textShadow = "2px 2px 7px black"
			}
		},
		check() {
			if (this.collap == "menu-collapsed") {
				this.collap = "menu-expanded"
			} else {
				this.collap = "menu-collapsed"
			}
		},
		loadData() {
			axios.get("/api/clients/current").then((response) => {
				// handle success
				this.showModal = false
				this.loadingPage = false
				this.clients = response.data
				this.firstName = response.data.firstName
				this.lastName = response.data.lastName
				this.email = response.data.email
				let photo = document.querySelector("#photo")
				photo.setAttribute("src", this.clients.photo)
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
	},
})

window.onresize = function () {
	if (screen.width > 800) {
		app.collap = "menu-expanded"
	} else {
		app.collap = ""
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
