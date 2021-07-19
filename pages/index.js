import React from 'react'
import Router from 'next/router'
import Link from 'next/link'
import Layout from '../components/Layout'
import Footer from '../components/Footer'
// import { Link, withTranslation } from '../i18n'


const HomePage = class extends React.Component {

	// static async getInitialProps() {
	// 	return {
	// 		namespacesRequired: ['common'],
	// 	}
	// }

	render () {
		const { t } = this.props
		return (
			<React.Fragment>
				<Layout title="The best exercises and diets vegetarian, keto or intermittent fasting strategies.">
					<div className="w-100 d-inline-block">
						<h1 className="text-center">
							We will now start collecting information <br />
							Necessary to configure plans and systems <br />
							Suitable for your body
						</h1>
						<div className="mt-5">
							<div className="text-center position-relative">
								<div onClick={() => Router.push({
									pathname: '/start',
									query: {
										st: process.env.stepOne,
										g: btoa('male')
									}
								})} className="btn btn-male position-absolute">
									<ion-icon name="man"></ion-icon>
									Male
								</div>
								<img src="./static/imgs/efasty-start__wm-mn.png" alt="eFasty" />
								<div onClick={() => Router.push({
									pathname: '/start',
									query: {
										st: process.env.stepOne,
										g: btoa('female')
									}
								})} className="btn btn-female position-absolute">
									<ion-icon name="woman"></ion-icon>
									Female
								</div>
							</div>
						</div>
					</div>
				</Layout>
				<footer className="i-bottom_end">
					<div className="container">
						<Footer step={0} />
						<div className="footer_navigation d-inline-block w-100">
							<div className="text-center w-100">Upon proceeding, you agree to</div>
							<div className="text-center w-100 hrefs-footer__navigation">
								<Link href="/terms"><a>Our terms</a></Link>
								<Link href="/policies"><a>Privacy policy</a></Link>
							</div>
							<div className="mt-2 text-center w-100">Copyright, All Reserved © 2021</div>
						</div>
					</div>
				</footer>
			</React.Fragment>
		)
	}
}

export default HomePage
// export default withTranslation('common')(HomePage)