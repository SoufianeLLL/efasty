import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
// import { Link, withTranslation } from '../i18n'


const Layout = class extends React.Component {
	state = {
		isLoading: true,
		isDark: false,
		menuState: 'hidden'
	}

	// static async getInitialProps() {
	// 	return {
	// 		namespacesRequired: ['common'],
	// 	}
	// }

	componentDidMount = () => {
		this.setState({
			isDark: (localStorage.getItem('Mode') === null ? false : (
				localStorage.getItem('Mode') == 'Light' ? false : true
			))
		})
	}

	changeMode = () => {
		const { isDark } = this.state
		this.setState({
			isDark: isDark ? false : true
		})
		localStorage.setItem('Mode', (isDark ? 'Light' : 'Dark'));
	}

	toggleMenu = () => {
		const { menuState } = this.state
		if ( menuState == 'hidden' ) {
			document.body.classList.add('hsc');
			this.setState({
				menuState: 'active'
			})
		}
		else {
			document.body.classList.remove('hsc');
			this.setState({
				menuState: 'hidden'
			})
		}
	}

	render () {
		const { isDark } = this.state
		const { t, children, title = '', withBackLink = false } = this.props
		return (
			<React.Fragment>
				<Head>
					<meta charSet="utf-8" />
					<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
					<meta name="environment" content="production" />
					<title>Eat & Fit • {title}</title>
					<link hrel="icon" href="/static/images/favicon.ico" type="image/x-icon" />
					<link href={`/static/css/bootstrap.min.css`} rel="stylesheet" />
					<link href={`/static/css/app.css`} rel="stylesheet" />
					{ isDark ? <link href={`/static/css/dark.css`} rel="stylesheet" /> : '' }
					<link href={`/static/css/ltr.css`} rel="stylesheet" />
					<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
					<link href="//fonts.googleapis.com/css2?family=STIX+Two+Math&display=swap" rel="stylesheet" />
					<script type="module" src="//unpkg.com/ionicons@5.0.0/dist/ionicons/ionicons.esm.js"></script>
					<script nomodule="" src="//unpkg.com/ionicons@5.0.0/dist/ionicons/ionicons.js"></script>
				</Head>
				<div className="i-interface w-100 d-inline-block position-relative mealplan-app">
					<div className='mealplan-container'>
						<div className="menu__">
							<div onClick={() => this.toggleMenu()} className="shadow"></div>
							<div className="menu_navigation">
								<ul>
									<li><Link href="/terms"><a>Our Terms and Policies</a></Link></li>
									<li><Link href="/policies"><a>Privacy policy</a></Link></li>
								</ul>
							</div>
						</div>
						<header className="mlp-header__app w-100 d-inline-block">
							<div className="container">
								<div onClick={() => this.toggleMenu()} className="menuToggle float-right">
									<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M24 6h-24v-4h24v4zm0 4h-24v4h24v-4zm0 8h-24v4h24v-4z"/></svg>
								</div>
								<div className="start-over">
									<Link href="/"><a>Start over</a></Link>
								</div>
								{ withBackLink &&
								<div className="float-left mr-3 goBack__link">
									<Link href="/"><a>
										<svg style={{ marginTop: '-4px' }} xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"><path fill="black" d="M13.427 3.021h-7.427v-3.021l-6 5.39 6 5.61v-3h7.427c3.071 0 5.561 2.356 5.561 5.427 0 3.071-2.489 5.573-5.561 5.573h-7.427v5h7.427c5.84 0 10.573-4.734 10.573-10.573s-4.733-10.406-10.573-10.406z"/></svg>
									</a></Link>
								</div> }
								<div onClick={() => this.changeMode()} className="float-left">
									<span className="dark-light">
										{ !isDark ? <ion-icon name="moon"></ion-icon> : <ion-icon name="sunny"></ion-icon> }
									</span>
								</div>
							</div>
						</header>
						<div className="container">
							<div className="app-logo">
								<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="100%" height="80" viewBox="0 0 995.07 409.75"><g><g><g><path fill="#0d4bf7" d="M625.91,391c-.16-3.29-1.77-6.15-5.63-6.83a2,2,0,0,0-.57-.1c-2.92-.42-5.84.36-8.71.36-6.73.05-12.83-3.86-18.41-7.61-5.37-3.6-10.74-7.25-16.11-10.79-7.19-4.85-10-17.73-12.2-25.6-3.18-11.21-3.75-19.24-5.16-30.71-1.67-13.09-3.7-26.07-5.84-39.11a17.58,17.58,0,0,1-.41-4.38c.15-2.13,1-4.17,1.45-6.3a16.4,16.4,0,0,0-4.64-15.12,6.35,6.35,0,0,0-.88-.84c-10-8.24-12.31-17.36-19.45-27.79-3-4.43-6.26-8.71-9.59-12.88-2.24-2.81-4.59-5.58-7-8.23-.47-.58-1-1.15-1.51-1.72-.21-.16-.47-.47-.89-.84-1.51-1.51-4.48-4.17-7.5-6.93-.94-.84-1.88-1.72-2.82-2.56a2.33,2.33,0,0,0-.47-.47c-2.14-2-4.12-3.91-5.32-5.16a14.67,14.67,0,0,1-1.3-1.62c-.11-.2-.21-.31-.16-.41.21-.58.31-1.15.47-1.77a2.59,2.59,0,0,0,.21-.63h0a53,53,0,0,0,1.25-6.61c6.94-.26,15.07-.84,21.48-3.7s11.63-8.29,18.56-10.43c3-.94,6.16-1.2,9-2.4,1.25-.57,2.24-1.56,3.44-2.14,1.67-.83,3.44-.68,5.22-1.09,2.65-.68,5.73-2.66,8.13-4s4.85-4.22,4.12-7.19A5.63,5.63,0,0,0,564,134a3.27,3.27,0,0,0,.63-3.49,3.1,3.1,0,0,0-1.25-1.25,4,4,0,0,0,.36-3.19,4.92,4.92,0,0,0-1-1.3,3.17,3.17,0,0,0-1-3.07,3.33,3.33,0,0,0-3-.37,4.7,4.7,0,0,0-2.82,2.19,33.46,33.46,0,0,1-4.17,1.36c-1.46.41-2.19.47-2.5.1s-.26-.68,0-1.56a10.59,10.59,0,0,1,1-3.24c.21-.47,2.5-5.26.94-7.3-.11-.1-.47-.57-.89-.52-.78.06-.83,1.67-2.29,3.65-.73,1-.89.84-1.52,1.78-.88,1.35-.88,2.34-1.4,3.64a9.35,9.35,0,0,1-2.56,3.71c1,4,.21,7.45-3.49,9.64a62.53,62.53,0,0,1-9.39,4.64,56.26,56.26,0,0,1-14.39,3.7,73.52,73.52,0,0,1-10.32.68,47.8,47.8,0,0,0,2.72-8.81h0v-.16c.14-.59.24-1.26.33-1.9,0-.19,0-.38.08-.57.14-1,.28-2.16.32-3.26a1.81,1.81,0,0,1,.06-.57,2.28,2.28,0,0,0,.05-.58,46.62,46.62,0,0,0-.21-6.72c.21-1.46.42-2.92.63-4.44a9.25,9.25,0,0,0,.88-1.46,25.41,25.41,0,0,0,1.1-2.39,12.86,12.86,0,0,0,.62-1.67,28.84,28.84,0,0,0,.21-15.59c-.94-3.65-3.91-6.78-4.8-10.27s-.83-10.48.11-13.82A18.93,18.93,0,0,1,510.37,66c1.36-1.82,2.77-3.65,4.12-5.52,2.5-3.29,7-1.36,9.75-4.64a6.75,6.75,0,0,0,1.41-3.71,79.79,79.79,0,0,0,.89-10.37,3.13,3.13,0,0,0,2.6-.89,3.18,3.18,0,0,0,.52-1.3q-2.34-3.75-4.69-7.51a5.63,5.63,0,0,0,1.57-2.5c.41-1.2.31-2.35-.26-4.85A54.4,54.4,0,0,0,524.87,19a17.62,17.62,0,0,0-2.14-9.12,17.91,17.91,0,0,0-8.81-7.51v0c-.6-.25-1.23-.48-1.86-.69l-.19-.07C505.21-.67,497.21-.65,491,2.6c-6.2,3-9,6.47-12.46,12.05-2.36,3.92-3.39,6.1-1.52,10.32a5.83,5.83,0,0,1,3.65-3.39C478.6,31,479.26,40.25,487,46c-6.78-.94-13.81-1.87-20.33.32a54.64,54.64,0,0,0-8.4,4.06,109,109,0,0,1-11.62,5.37c-2.66,1.15-5.37,2.19-8,3.24a123.3,123.3,0,0,0-19.71,9.17,53.4,53.4,0,0,0-6.72,4.75,5.89,5.89,0,0,0-2,2.4v0a3.68,3.68,0,0,0-.15,2.13c.1.68.31,1.36.41,2,.73,2.76,1.52,5.52,2.3,8.23s1.56,5.48,2.34,8.19c.94,3.18,1.88,6.36,2.87,9.54,1.31,4.33,2.66,8.71,4.12,13,.57,1.52,1.1,3.08,1.62,4.59.47,1.31.94,2.61,1.46,3.91a23.81,23.81,0,0,0,2,3.65,8.09,8.09,0,0,0,1.15,1.31c.67.62,1.51,1.3,2.19,2a6.72,6.72,0,0,1,.52.57,3.22,3.22,0,0,1,.67,1.05,2,2,0,0,1,.16.57,11.67,11.67,0,0,1-.36,2.92,6.55,6.55,0,0,0,.05,2.29,4.89,4.89,0,0,0,.47,1.15,2.28,2.28,0,0,0,.52.73,3.4,3.4,0,0,0,2.35,1.1c1.3-.06,2.45-1.1,3.75-1.36s3.44.63,4.95,1.93a4.36,4.36,0,0,1,.68.68,3.31,3.31,0,0,1,.78,1.2.56.56,0,0,1,.16.26c1,3.12-1.93,7.3-3.5,9.75-.67,1.09-1.35,2.19-2.08,3.28-4.12,6.62-8.19,13.56-10.95,21-3.15,8.05-5.19,19.5-2.61,27.74.42,1.35,2.51,4.27,2,5.52-.68,1.46-1.31,2.92-1.88,4.44-2.92,6.93-5.58,13.19-7.93,18.61-1.14,2.8-8.2,19.25-8.81,20.75-2.32,5.66-2.75,8.79-6,11.11a12.21,12.21,0,0,1-6.63,1.51,40,40,0,0,1-5.05-.37c-8.14-1-16.06-4-24.51-3.07a31.44,31.44,0,0,0-14.13,5.16c-.36,0-.73.15-1,.21-1.15.21-2.24.47-3.44.67-4.59.94-9.33,1.73-14.13,2.35a225.49,225.49,0,0,1-24.24,2c-1.91-5.22-4.73-7.85-8.35-11.62-1.72-1.72-3.44-3.34-5.05-5.22a38.81,38.81,0,0,1-2.72-3.7,4.68,4.68,0,0,1-.62-1.14c-.21-.37-.42-.79-.63-1.2l-2.55.15a4.45,4.45,0,0,0-2.09,1.51c-2.44,2.45-5.78,7.75-6.93,9.13-.78,1.09-1.62,2.08-2.45,3.18a70.35,70.35,0,0,0-7.33,11.7,18.24,18.24,0,0,1-2.79,4.31c-2.07,2.53-4.81,4.9-9.43,11.2-.52.73-1.15,1.52-1.67,2.3-.78,1.2-1.62,2.4-2.35,3.65a42.39,42.39,0,0,0-2.08,3.75,57.42,57.42,0,0,0-2.77,6v.05c-.36,1-.67,2.09-1,3.13a31.77,31.77,0,0,0-.67,3.13c-.6,3.06-1.59,7.64.1,10.17,1.94,2.35,5.43,2.37,7.94,1a8.22,8.22,0,0,0,3.4-3.81c2.08-4.09,1.56-3.37,3.26-5.91,2.92-3.6,7.71-4.9,12.09-6.21a2.26,2.26,0,0,0,.58-.21c1.25-.31,2.5-.78,3.75-1.19,1.62-.58,3.23-1.2,4.85-1.88,3.18-1.3,6.31-2.71,9.44-4.17A157.66,157.66,0,0,1,312,298.43a55.72,55.72,0,0,1,9.17-2.14c9.81-1.51,19.76-.1,29.57,1.26,11,1.46,21.37,1.2,32.43,1.46l4.48.15c1.28,0,3.76.19,4.7.25h.36c3.65.32,7.71.73,12.25,1.36a16.73,16.73,0,0,0,9.91,1.77,15.2,15.2,0,0,0,8.91-4.17,16.07,16.07,0,0,0,2.82-4.12c6.88-9.07,13.76-18.25,20.64-27.32.79-1,1.52-2.08,2.24-3.18,4.13-6.1,7.88-13,12.21-19.08,1.56-2.14,3.33-5,5.16-7.51h.05c1.08-1.44,3.56-4.41,5.32-4.85,2.87-1,5.89,1.3,8.65,4.12.1.08,3.5,3.39,3.5,3.39a13.74,13.74,0,0,0,3.18,2.45,32.23,32.23,0,0,0,4.22,1.77c6.72,2.71,13.14,7.09,18.77,11.68a74.28,74.28,0,0,1,6.83,6.26c.83.83,1.67,1.72,2.4,2.55,1,1.15,2,2.3,2.92,3.39a93.58,93.58,0,0,0,1.09,19.45c.42,2.61,1,5.42,1.72,8.24a.07.07,0,0,1,0,.1c.37,1.41.84,2.87,1.31,4.33s1,3,1.61,4.48c.16.52.37,1,.52,1.46a11.86,11.86,0,0,1,.52,1.25c.58,1.2,1,2.14,1.46,3.08.47.78.89,1.56,1.31,2.35a63.6,63.6,0,0,1,3,6c.16.31.32.68.47,1,.52,1.15,1,2.4,1.62,3.86a144.62,144.62,0,0,1,10.06,43.9v.84a4.91,4.91,0,0,1,.05.88,20.51,20.51,0,0,1-1.2,9.13,14.85,14.85,0,0,1-1.51,2.71c-.15.16-.31.36-.52.57a5.77,5.77,0,0,1-.52.63l.16.88v.32a14.79,14.79,0,0,1,.2,2.13v3.5a30.9,30.9,0,0,1-2.08,8.81c-.05.05-.05.1-.11.16s-.36.57-.57.93a3.56,3.56,0,0,0-.31,1.52v.15a3,3,0,0,0,.15.94,3.91,3.91,0,0,0,.42.94,2.85,2.85,0,0,0,.31.52,3.54,3.54,0,0,0,.53.68,6.49,6.49,0,0,0,.88.83,17.2,17.2,0,0,0,6.41,3.65,13.51,13.51,0,0,0,2.56.78,33.72,33.72,0,0,0,14.49,0,27,27,0,0,0,6.1-2,6,6,0,0,1,2.3-.73,4.39,4.39,0,0,1,1.82.37,77,77,0,0,0,26.12,2h.06c6.62-.68,12.87-2.35,17.15-5.58A13.4,13.4,0,0,0,625.91,391ZM445.36,115.48c-.72-2.15-.53-1.34-2.14-4.53a51.7,51.7,0,0,1-2.92-12c-.51-3.56-1.46-11.27-1.46-13.4,2.55-.26,5.11-.47,7.72-.73h.05a87.26,87.26,0,0,0,.31,8.76,91.13,91.13,0,0,0,1.77,10.85c.32,1.09.52,2.14.84,3.07-.47,4-.89,8-1.31,11.94-.41-.36-.78-.62-1.09-.88a6.08,6.08,0,0,1-1.46-2.09A3.65,3.65,0,0,0,445.36,115.48Z"/><path d="M153.34,195l-.48-.1h-125c-1.59,0-4.58.56-6.72,4.25l-.5.86-.13,1c-.09.66-1,9.72-7.68,74.49C12.2,281.85,7.52,327.29,0,400.11l0,.52c0,2.75,1.59,6,6.06,7l.52.12H131.33a8.21,8.21,0,0,0,7.09-4.09l.33-.51.19-.57c.27-.83.45-1.37,4.38-41.95l0-.49c0-3-1.84-6.71-7.05-7.27l-.26,0H62.46c1.36-13,2.09-20.12,2.49-24h58.64a8.47,8.47,0,0,0,7.55-4.25l0,0a13.45,13.45,0,0,0,1.07-4.44c.21-1.72.5-4.34.85-7.76.71-6.83,1.72-17.18,3-30.75l0-.47a7.53,7.53,0,0,0-.44-2.41l-.11-.34-.17-.33a7.74,7.74,0,0,0-7.23-4.23H70.59L73,251.49v-.16c0-.57.08-1.09.12-1.55h74.38a8.19,8.19,0,0,0,7.38-4.61l.22-.41.13-.45c.25-.79.52-1.69,4.44-41.64l0-.49C159.67,199.31,158,195.91,153.34,195Z"/><path d="M288.05,315.3c-1.63.68-3.32,1.34-5,1.93l-1,.33c-.9.31-1.82.63-2.8.89a5.38,5.38,0,0,1-.8.27l-.49.14c-3.74,1.11-7.6,2.25-9.73,4.78a18.25,18.25,0,0,0-1.73,3c-.24.49-.56,1.13-1,2h28.27a8.53,8.53,0,0,0,7.64-4.24l0,0a13.5,13.5,0,0,0,1.08-4.5c.2-1.72.48-4.31.82-7.76.12-1.16.25-2.42.38-3.78-2,.89-4,1.81-6.05,2.79C293.94,312.78,290.89,314.13,288.05,315.3Z"/><path d="M243.23,319.84l.07-.35c.18-1.18.46-2.29.73-3.37l0-.16c.26-.88.53-1.79.84-2.71v-.07l.24-.66a61,61,0,0,1,2.9-6.36c.71-1.48,1.52-2.85,2.22-4,.55-1,1.17-1.88,1.78-2.79l.63-.95c.37-.57.77-1.1,1.16-1.62l.59-.8a95,95,0,0,1,7.49-9.05c.8-.87,1.49-1.62,2.09-2.34a15.1,15.1,0,0,0,2.34-3.61,63.48,63.48,0,0,1,4.29-7.49H236.7l2.35-22.39V251c.05-.62.09-1.17.13-1.65h74.7a8.11,8.11,0,0,0,7.36-4.56l.26-.49.14-.54c.19-.72.43-1.61,4.37-41.64l0-.49c0-2.83-1.67-6.2-6.35-7.17l-.5-.1H193.88c-1.62,0-4.66.57-6.75,4.39l-.39.72-.14.81c-.09.51-.28,1.57-7.78,74.86-.66,6.2-5,48.26-12.86,125l0,.51c0,3.55,2.42,6.31,6.17,7l.47.09h43.27a7.78,7.78,0,0,0,7-4.39l.35-.66.13-.73c.12-.61.36-1.86,7.66-73.39h11.56C242.1,325.64,242.73,322.41,243.23,319.84Z"/><path d="M364.82,261.83c6.21-.7,12,.51,17.6,1.68,2.67.55,5.19,1.07,7.73,1.4a37.15,37.15,0,0,0,4.61.34,9.06,9.06,0,0,0,4.68-.92c1.48-1.1,2.05-2.52,3.27-5.82.4-1.09.86-2.32,1.43-3.71.26-.64,1.7-4,3.36-7.9,2.14-5,4.81-11.27,5.45-12.85,2.22-5.13,4.8-11.19,7.92-18.58.47-1.25,1-2.5,1.58-3.8-.2-.47-.53-1.12-.74-1.52a14,14,0,0,1-1-2.31c-1.67-5.31-1.6-11.6-.67-17.49H389.83a9.15,9.15,0,0,0-7,3.52l-.43.5-.29.59c-.29.6-1.18,2.44-30.8,68.93l-1.48,3.25a34.71,34.71,0,0,1,14.48-5.24Z"/><path d="M450,271q-5.14,6.78-10.26,13.58t-10.2,13.51a19.29,19.29,0,0,1-3.28,4.68A18.8,18.8,0,0,1,415.36,308a20.6,20.6,0,0,1-11.47-1.85l-1.12-.15,4.28,20.13H385.72l9.42-21-2.59-.24h-6.31l.17-.29L383,304.5c-2.48-.05-5-.09-7.46-.12A207.36,207.36,0,0,1,350.27,303l-.31,0c-3.9-.54-7.85-1.08-11.8-1.43q-13.25,29.63-37.94,84.91c-5.9,13-5.9,13.42-5.9,14.75v.25a6.31,6.31,0,0,0,5.91,6.27l.28,0h43.07a9,9,0,0,0,7-3.46l.27-.32.22-.36c.32-.53.84-1.4,9.3-20.51h58.89c.6,2.85,1.61,7.5,3.29,15.18,1,8.54,6.12,9.47,8.28,9.47h43.12a6.74,6.74,0,0,0,6.71-5.9l.14-.76-.1-.78c-.09-.67-.27-2.08-15.2-71.82-1.27-6-5.7-26.75-13-60.9l-.08.13C451.58,268.92,450.81,270,450,271Z"/><path d="M523.1,307.67c-.41-1.1-.8-2.19-1.18-3.26l-.46-1.29c-.45-1.4-1-3-1.36-4.52l-.49-1.9,0,0c-.53-2.22-1-4.48-1.33-6.74a96.1,96.1,0,0,1-1.19-18.8c-.61-.72-1.27-1.47-2-2.24s-1.49-1.63-2.29-2.43a71.93,71.93,0,0,0-6.56-6q-3.7-3-7.22-5.36a53.54,53.54,0,0,0,1.72,28.56c3.28,9,9.58,16.72,18.71,23l.13.09c1.24.79,2.57,1.58,4,2.36-.05-.15-.11-.29-.17-.44C523.32,308.32,523.21,308,523.1,307.67Z"/><path d="M537,407.07a4.57,4.57,0,0,1-.5-.82,7.29,7.29,0,0,1-.73-1.65,6.4,6.4,0,0,1-.31-2v-.15a7.14,7.14,0,0,1,.61-2.94l.16-.31c.21-.36.4-.7.6-1a26.71,26.71,0,0,0,1.7-7.32v-3.34a12.33,12.33,0,0,0-.16-1.61l-.47-2.92,1.3-1.29.18-.23.32-.38.14-.15.14-.16a11.53,11.53,0,0,0,1-1.93c.79-1.84,1.07-4.18.91-7.53v-.18a2.8,2.8,0,0,0,0-.29l-.05-.25v-1.06a140.18,140.18,0,0,0-8.67-39.67,6.72,6.72,0,0,0-1.18-.1H491.36a7.68,7.68,0,0,0-7.9,6.35l-.11.5v6.53a66.82,66.82,0,0,0,18.21,45.73l.2.21A67.29,67.29,0,0,0,538,408.27l-.19-.2A6.57,6.57,0,0,1,537,407.07Z"/><path d="M633,213.89c-13.77-14.71-30.85-22.17-50.75-22.17h-.41c-18.9,0-36,6.36-50.86,18.93,1.13,1.55,2.23,3.08,3.25,4.59a120.26,120.26,0,0,1,6.19,10.33c3.46,6.26,6.45,11.67,12.59,16.73a9.85,9.85,0,0,1,1.21,1.13A20.14,20.14,0,0,1,560,255a16.07,16.07,0,0,1,.94-1.38c4.7-4.89,10-7.27,16.27-7.27a16.62,16.62,0,0,1,12.68,5.54c2.47,3.3,3.72,6.38,3.72,9.15V264c0,5,3.48,7.28,6.71,7.28h42.15l.57-.13c6.14-1.45,6.62-6,6.62-7.31V258c0-16.1-5.54-30.87-16.47-43.89Z"/><path d="M558.73,271c1.91,11.67,4.1,25.42,5.86,39.28.23,1.88.44,3.65.64,5.36.35,3,.67,5.73,1,8.43,8.46,4.4,12.77,9.22,12.77,14.35a12.61,12.61,0,0,1-3.27,8.27,27.07,27.07,0,0,1-3.51,3c1.83,5.85,4.31,11.81,8.17,14.41,3.55,2.35,7.13,4.75,10.71,7.16l5.39,3.63c5.71,3.84,10.88,7,16.32,7,.36,0,.73,0,1.11,0,.59-.62,1.18-1.23,1.77-1.87l.09-.11c12.79-14.91,19.27-30.05,19.27-45,0-16.78-6.9-30.15-20.52-39.73-7.53-5.27-18.87-10.35-34.65-15.54-11.79-3.93-18.88-8.72-21.15-14.29a10.53,10.53,0,0,0-.42,2.13A14.77,14.77,0,0,0,558.73,271Z"/><path d="M802,194.35H665.69a7.77,7.77,0,0,0-6.19,3.26l-.15.2-.26.34h0a12.16,12.16,0,0,0-1.3,4.87q-.3,2.58-.84,7.76c-.7,6.82-1.72,17.18-3,30.8l0,.47c0,3.68,2.52,6.51,6.4,7.2l.44.08h39l-1.57,15.87c-.34,3.21-5.15,49.86-13.91,134.91l0,.51c0,3.55,2.42,6.31,6.17,7l.47.09h43.27a7.78,7.78,0,0,0,7-4.39l.4-.76.13-.86c.14-1,.65-5.38,3.44-31.67.58-6.6,4.63-46.11,12.38-120.73h39.51a8.3,8.3,0,0,0,7-3.93l0,0a12.42,12.42,0,0,0,1.22-4.73q.32-2.59.84-7.77c.71-6.83,1.72-17.19,3-30.79l.06-.68-.12-.68C808.39,196.86,805.59,194.35,802,194.35Z"/><path d="M988.69,194.35H940.11a10.76,10.76,0,0,0-6.52,2.56l-.64.49-33.09,48.16c-4-8.17-11-22.27-21.05-42.58-2.67-7.13-6.84-8.63-9.89-8.63H820l-.39.06a6.4,6.4,0,0,0-5.76,6.32,10.77,10.77,0,0,0,1.34,4.52l.1.21c1,1.83,17.91,36.19,50.43,102.12l-9.46,92.54,0,.51c0,2.71,1.58,6,6,7l.55.13h43.45A8,8,0,0,0,912.8,404l.73-1,.15-1.26c.54-4.64,3.72-35.49,9.73-94.32.82-1.23,2.75-4.1,7.24-10.67,38.08-55.61,56.63-82.74,58.25-85.16,5.66-7.86,6.17-9.21,6.17-11.06A6.06,6.06,0,0,0,988.69,194.35Z"/></g></g></g></svg>
							</div>
							{children}
						</div>
					</div>
				</div>
			</React.Fragment>
		)
	}

}


export default Layout
// export default withTranslation('common')(Layout)