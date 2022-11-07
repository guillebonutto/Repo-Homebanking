var app = new Vue({
	el: '#app',
	data: {
		message: 'Hello Vue!',
		nightmode: 0,
		showModal: true,
		loadingPage: true,
		firstName: '',
		lastName: '',
		email: '',
		emailRegister: '',
		password: '',
		tooltip: 'Show password',
		passwordRegister: '',
		active: '',
		showPassword: 'far fa-eye',
	},
	created() {
		let input1 = document.querySelector('#input1')
		let input2 = document.querySelector('#input2')
		let input3 = document.querySelector('#input3')
		let input4 = document.querySelector('#input4')
		let inputemail = document.querySelector('#inputEmail')
		let inputpass = document.querySelector('#inputPass')
		this.chequeo()
	},
	methods: {
		chequeo() {
			if (this.nightmode == 1) {
				body1.style.backgroundColor = 'black'
			} else {
				body1.style.backgroundColor = 'white'
			}
		},
		login() {
			axios
				.post('/api/login', 'email=' + this.email + '&password=' + this.password)
				.then((response) => {
				axios.get("/api/clients")
				    .then((response) => {
						window.location.href = '/admin.html'
				    })
					.catch((error) => window.location.href = 'web/accounts.html')
				})
				.catch((error) => {
					if (error.response == 'Missing data') {
						Swal.fire({
							icon: 'error',
							title: 'Oops...',
							text: 'No data received. Please check the fields and try again',
						})
					} else if (
						!this.email ||
						!this.email.includes('@') ||
						!this.email.includes('hotmail.com') ||
						!this.email.includes('gmail.com') ||
						!this.email.includes('yahoo.com')
					) {
						Swal.fire({
							icon: 'error',
							title: 'Oops...',
							text: 'Please, complete your email address',
						})
					} else if (!this.password) {
						Swal.fire({
							icon: 'error',
							title: 'Oops...',
							text: 'Please, complete your password',
						})
					} else if (error.response.status === 401) {
						Swal.fire({
							icon: 'error',
							title: 'Oops...',
							text: 'It seems that you are not registered or you entered a wrong e-mail/password',
						})
					}
				})
		},
		registering() {
			axios
				.post(
					'/api/clients',
					'photo=../images/Client.png' +
						'&firstName=' +
						this.firstName +
						'&lastName=' +
						this.lastName +
						'&email=' +
						this.emailRegister +
						'&password=' +
						this.passwordRegister)
				.then((response) => {
					Swal.fire({
						icon: 'success',
						title: 'Excelent',
						text: 'Your registration was successfull',
						timer: 1500,
					}).then(() => {
						this.email = this.emailRegister
						this.password = this.passwordRegister
						this.login()
					})
				})
				.catch((error) => {
					if (error.response == 'Missing data') {
						Swal.fire({
							icon: 'error',
							title: 'Oops...',
							text: 'No data received. Please check the fields and try again',
						})
					} else {
						Swal.fire({
							icon: 'error',
							text: error.message,
							timer: 1500,
						})
					}
				})
		},
		ocultar() {
			if (this.active != 'active') this.active = 'active'
			else this.active = ''
		},
		showingPassword() {
			if (this.showPassword == 'far fa-eye') {
				this.showPassword = 'far fa-eye-slash'
				this.tooltip = 'Hide password'
				input4.type = 'text'
			} else {
				this.showPassword = 'far fa-eye'
				this.tooltip = 'Show password'
				input4.type = 'password'
			}
		},
		enter(keyboard) {
			if (keyboard == 'name') input2.focus()
			if (keyboard == 'lastName') inputemail.focus()
			if (keyboard == 'emailRegist') inputpass.focus()
			if (keyboard == 'passwordRegist') this.registering()
			if (keyboard == 'email') input4.focus()
			if (keyboard == 'password') this.login()
		},
	},
})

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
