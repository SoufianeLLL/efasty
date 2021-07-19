import React from 'react'
import crypto from 'crypto'
import Router from 'next/router'
import calculator from '../services/calculator'
import Layout from '../components/Layout'
import Footer from '../components/Footer'
import Countdown from '../components/Countdown'
// import { withTranslation } from '../i18n'
import firebase from '../server/firebase'

const db   = firebase.firestore()
const min  = 1
const max  = 8
let p      = 0

const StartPage = class extends React.Component {
	state = {
		gender: Buffer.from(this.props.query.g, 'base64').toString(),
		step: this.props.query.st,
		fullname: null,
		user_email: null,
		userEmailError: null,
		timeleft: 0,
		stepRule: 1,
		isLoading: true,
		activeIndex: 0,
		activeAgeIndex: 0,
		activeBodyTypeIndex: 0,
		activeLifeStyleIndex: 0,
		activeQ1Index: 0,
		activeQ2Index: 0,
		activeQ3Index: 0,
		activeQ4Index: 0,
		activeQ5Index: 0,
		activeQ6Index: 0,
		activeQ7Index: 0,
		activeQ8Index: 0,
		activeQ9Index: 0,
		activeHabitsIndexs: [],
		activeVegetablesIndexs: [], 
		activeFoodsIndexs: [],
		activeMeatIndexs: [],
		weight: 0,
		height: 0,
		hips: 0,
		wrist: 0,
		waist: 0,
		forearm: 0,
		age: 0,
		lifeStyle: null,
		weightUnit: 'Kg',
		heightUnit: 'cm',
		isWeightNm: false,
		nextStep: false,
		nextStepTwo: false,
		nextStepTree: false,
		dataSent: false,
		data: [],
		result: null
	}

	static getInitialProps ({ query }) {
		return {
			// namespacesRequired: ['common'],
			query
		}
	}

	componentWillUnmount = () => {
		clearInterval(this.state.timeleft)
		clearInterval(p)
	}

	checkQuestion = (index, stp, ans, q) => {
		if ( q == 'category' ) {
			this.setState({
				activeIndex: index,
				stepRule: 2,
				data: [{
					gender: this.state.gender,
				}, {
					category: ans
				}]
			})
		}
		else if ( q == 'age' ) {
			this.setState({
				stepRule: 5,
				activeAgeIndex: index,
				age: ans,
				data: [...this.state.data, {
					age: ans
				}]
			})
		}
		else if ( q == 'body_type' ) {
			this.setState({
				stepRule: 6,
				activeBodyTypeIndex: index,
				data: [...this.state.data, {
					body_type: ans
				}]
			})
		}
		else if ( q == 'life_style' ) {
			this.setState({
				stepRule: 7,
				activeLifeStyleIndex: index,
				lifeStyle: ans,
				data: [...this.state.data, {
					life_style: ans
				}]
			})
		}
		else if ( q == 'last_time_having_good_weight' ) {
			this.setState({
				stepRule: 9,
				activeQ1Index: index,
				data: [...this.state.data, {
					last_time_having_good_weight: ans
				}]
			})
		}
		else if ( q == 'fitness_routine' ) {
			this.setState({
				stepRule: 11,
				activeQ2Index: index,
				data: [...this.state.data, {
					fitness_routine: ans
				}]
			})
		}
		else if ( q == 'your_energy' ) {
			this.setState({
				stepRule: 12,
				activeQ3Index: index,
				data: [...this.state.data, {
					your_energy: ans
				}]
			})
		}
		else if ( q == 'sleep_routine' ) {
			this.setState({
				stepRule: 13,
				activeQ4Index: index,
				data: [...this.state.data, {
					sleep_routine: ans
				}]
			})
		}
		else if ( q == 'water' ) {
			this.setState({
				stepRule: 14,
				activeQ5Index: index,
				data: [...this.state.data, {
					water: ans
				}]
			})
		}
		else if ( q == 'need_motivation' ) {
			this.setState({
				stepRule: 15,
				activeQ6Index: index,
				data: [...this.state.data, {
					need_motivation: ans
				}]
			})
		}
		else if ( q == 'life_issues' ) {
			this.setState({
				stepRule: 16,
				activeQ7Index: index,
				data: [...this.state.data, {
					life_issues: ans
				}]
			})
		}
		else if ( q == 'prepare_food_duration' ) {
			this.setState({
				stepRule: 20,
				activeQ8Index: index,
				data: [...this.state.data, {
					prepare_food_duration: ans
				}]
			})
		}
		setTimeout(() => {
			this.setState({
				step: stp
			})
		}, 1600);
	}

	generateSelectorNum = ( min, max ) => {
		let output = ''
		for ( let i = min; i < max; i++ ) {
			output += `<option value="${i}">${i}</option>`
		}
		return output
	}

	checkEmail = (email) => {
		const { t } = this.props
		if ( /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email) ) {
			this.setState({
				user_email: email,
				userEmailError: null
			})
		}
		else {
			this.setState({
				userEmailError: 'The email you entered is invalid'
			})
		}
	}

	storeIntoDatabase = async () => {
		const ID    = crypto.randomBytes(12).toString('hex')
		const token = crypto.randomBytes(22).toString('hex')
		let xData;

		this.setState({
			dataSent: true
		})

		const { result, user_email, fullname } = this.state
		if ( result && user_email ) {
			xData = JSON.stringify(result)
			xData = (xData ? JSON.parse(xData) : null)

			// Store data into Firestore
			db.collection('meal_plans')
			.doc(ID)
			.set({
				ID,
				token,
				name: fullname,
				email: user_email,
				data: xData,
				created_at: firebase.firestore.FieldValue.serverTimestamp(),
			}, { merge: true })
			.then(() => {
				// Send email message
				// Redirecct
				Router.push({
					// pathname: '/thankyou'
					pathname: `/result/${ID}`
				})
			})
		}
	}

	getStepPage = () => {
		const { t } = this.props
		const { step, gender, activeIndex, weightUnit, nextStep, nextStepTwo, age, timeleft, 
			isWeightNm, weight, data, heightUnit, height, activeAgeIndex, activeBodyTypeIndex,
			activeLifeStyleIndex, activeHabitsIndexs, activeQ1Index, activeQ2Index, activeQ3Index, 
			activeQ4Index, activeQ5Index, activeQ6Index, activeQ7Index, activeQ8Index, lifeStyle, 
			activeVegetablesIndexs, activeFoodsIndexs, activeMeatIndexs, userEmailError, dataSent } = this.state
		if ( step === process.env.stepOne ) {
			return (
				<div className="w-100 step__ d-inline-block">
					<h1 className="h2 font-weight-bold text-center">
						{ gender == 'male' ? 'Inform us' : 'Inform us' } About your goal <br />
					</h1>
					<h3 className="h5 text-center">What is the desired goal to be achieved?</h3>
					<div className="mt-4 d-inline-block w-100 categories__list">
						<div onClick={() => this.checkQuestion(1, process.env.stepTwo, 'weight_loss', 'category')} 
						className={ activeIndex === 1 ? 'active col-cat__b col-12 w-100 mb-3 p-0' : 'col-cat__b col-12 w-100 mb-3 p-0' }>
							<div style={{ backgroundImage: `url(./static/imgs/thumbs/basic-${gender}-img-1.png)` }} className="cat_thumbnail"></div>
							<div className="cat_details">
								<h4 className="h5 font-weight-bold">Weight loss</h4>
								<div className="w-100 h6 d-inline-block mb-0">Burn extra calories and fats, converts what you eat and drink into energy.</div>
							</div>
						</div>
						<div onClick={() => this.checkQuestion(2, process.env.stepTwo, 'muscle_building', 'category')} 
						className={ activeIndex === 2 ? 'active col-cat__b col-12 w-100 mb-3 p-0' : 'col-cat__b col-12 w-100 mb-3 p-0' }>
							<div style={{ backgroundImage: `url(./static/imgs/thumbs/basic-${gender}-img-2.png)` }} className="cat_thumbnail"></div>
							<div className="cat_details">
								<h4 className="h5 font-weight-bold">Muscle Building</h4>
								<div className="w-100 h6 d-inline-block mb-0">Set new goals of mass gains and accelerate muscle growth</div>
							</div>
						</div>
						<div onClick={() => this.checkQuestion(3, process.env.stepTwo, 'healthy_eating_habits', 'category')} 
						className={ activeIndex === 3 ? 'active col-cat__b col-12 w-100 mb-3 p-0' : 'col-cat__b col-12 w-100 mb-3 p-0' }>
							<div style={{ backgroundImage: `url(./static/imgs/thumbs/basic-${gender}-img-3.png)` }} className="cat_thumbnail"></div>
							<div className="cat_details">
								<h4 className="h5 font-weight-bold">The best healthy eating habits</h4>
								<div className="w-100 h6 d-inline-block mb-0">Quit fast food and harmful to health and focus on everything that benefits the body</div>
							</div>
						</div>
					</div>
				</div>
			)
		}
		else if ( step === process.env.stepTwo ) {
			return (
				<div className="w-100 step__ d-inline-block">
					<h1 className="h2 font-weight-bold text-center">Perfect weight</h1>
					<h3 className="h5 text-center">
						Well then, what weight are you aiming to reach?
					</h3>
					<div className="mt-3 mb-3 d-inline-block w-100 page_collect__prog">
						<div className="weight_unit">
							<span onClick={() => this.setState({ weightUnit: 'Pound' })} 
							className={ weightUnit == 'Pound' ? 'active' : null }>Pound</span>
							<span onClick={() => this.setState({ weightUnit: 'Kg' })} 
							className={ weightUnit == 'Kg' ? 'active' : null }>Kg</span>
						</div>
						<div className="weight__">
							<span className="float-right">{ weightUnit == 'Pound' ? 'Pound' : 'Kg' }</span>
							<input onChange={(n) => this.setState({
								isWeightNm: isNaN(n.target.value) ?? false,
								nextStep: !isNaN(n.target.value) ?? false,
								weight: n.target.value
							})} type="text" placeholder="--" />
							{ isWeightNm && <div className="error">The number appears to be incorrect, try again</div> }
						</div>
						<div className="next__step">
							<div onClick={() => this.setState({
								stepRule: 3,
								step: process.env.stepTree,
								data: [...data, {
									weight: `${weight} ${weightUnit}`
								}]
							})} 
							className={ nextStep ? 'button btn-step' : 'button btn-step disabled' }>Continue</div>
						</div>
					</div>
				</div>
			)
		}
		else if ( step === process.env.stepTree ) {
			return (
				<div className="w-100 step__ d-inline-block">
					<h1 className="h2 font-weight-bold text-center">Current body specifications</h1>
					<h3 className="h5 text-center">
						AHA! Wonderful, tell us now about your current weight and height
					</h3>
					<div className="mt-3 mb-3 d-inline-block w-100 page_collect__prog">
						<div className="weight_unit">
							<span onClick={() => this.setState({ 
								heightUnit: 'cm',
								nextStepTwo: false
							})} 
							className={ heightUnit == 'cm' ? 'active' : null }>Metric system</span>
							<span onClick={() => this.setState({ 
								heightUnit: 'feet',
								nextStepTwo: false
							})} 
							className={ heightUnit == 'feet' ? 'active' : null }>British system</span>
						</div>
						{ heightUnit == 'cm' ?
						<div className="mt-5 selector__">
							<label>Current Length (cm):</label>
							<select 
							onChange={(h) => this.setState({
								nextStepTwo: true,
								height: `${h.target.value} ${heightUnit}`,
							})}
							className="card-input__input -select"
							dangerouslySetInnerHTML={{__html: this.generateSelectorNum(120, 220)}}>
							</select>
						</div>
						:
						<React.Fragment>
							<div className="selector__">
								<label>Current length (feet):</label>
								<select 
								onChange={(h) => this.setState({
									height: `${h.target.value} feet`,
								})}
								className="card-input__input -select"
								dangerouslySetInnerHTML={{__html: this.generateSelectorNum(4, 8)}}>
								</select>
							</div>
							<div className="mt-5 selector__">
								<label>Current length (inches):</label>
								<select 
								onChange={(h) => this.setState({
									nextStepTwo: true,
									height: `${height}, ${h.target.value} inches`,
								})}
								className="card-input__input -select"
								dangerouslySetInnerHTML={{__html: this.generateSelectorNum(0, 13)}}>
								</select>
							</div>
						</React.Fragment>
						}
						{ activeIndex == 1 &&
						<React.Fragment>
							<div className="mt-5 selector__">
								<label>Waist (cm):</label>
								<select 
								onChange={(n) => this.setState({
									nextStepTwo: true,
									waist: n.target.value,
								})}
								className="card-input__input -select"
								dangerouslySetInnerHTML={{__html: this.generateSelectorNum(10, 100)}}>
								</select>
							</div>
							{ gender == 'female' &&
							<React.Fragment>
								<div className="mt-5 selector__">
									<label>Thighs (cm):</label>
									<select 
									onChange={(h) => this.setState({
										hips: h.target.value,
									})}
									className="card-input__input -select"
									dangerouslySetInnerHTML={{__html: this.generateSelectorNum(10, 100)}}>
									</select>
								</div>
								<div className="mt-5 selector__">
									<label>Wrist (cm):</label>
									<select 
									onChange={(w) => this.setState({
										wrist: w.target.value,
									})}
									className="card-input__input -select"
									dangerouslySetInnerHTML={{__html: this.generateSelectorNum(10, 100)}}>
									</select>
								</div>
								<div className="mt-5 selector__">
									<label>Arm (cm):</label>
									<select 
									onChange={(f) => this.setState({
										nextStepTwo: true,
										forearm: f.target.value,
									})}
									className="card-input__input -select"
									dangerouslySetInnerHTML={{__html: this.generateSelectorNum(10, 100)}}>
									</select>
								</div>
							</React.Fragment> }
						</React.Fragment> }
						<div className="next__step">
							<div onClick={() => this.setState({
								step: process.env.stepFour,
								stepRule: 4,
								data: [...data, {
									height: height,
								}]
							})} 
							className={ nextStepTwo ? 'button btn-step' : 'button btn-step disabled' }>Continue</div>
						</div>
					</div>
				</div>
			)
		}
		else if ( step === process.env.stepFour ) {
			return (
				<div className="w-100 step__ d-inline-block">
					<h1 className="h2 font-weight-bold text-center">Age</h1>
					<h3 className="h5 text-center">
						What age group do you belong to?
					</h3>
					<div className="mt-3 mb-3 page_collect__prog age_container p-0">
						<div onClick={() => this.checkQuestion(1, process.env.stepFive, '18-29', 'age')} 
						className={ activeAgeIndex === 1 ? 'active col-cat__b age_category__ col-6 mb-3 p-0' : 'col-cat__b age_category__ col-6 mb-3 p-0' }>
							<div style={{ backgroundImage: `url(./static/imgs/thumbs/age-${ gender }-img-1.png)` }} 
							className="cat_thumbnail gender__img"></div>
							<div className="cat_details text-center mt-5">
								<h4>Twenties</h4>
								<div className="w-100 d-inline-block">18-29</div>
							</div>
						</div>
						<div onClick={() => this.checkQuestion(2, process.env.stepFive, '30-39', 'age')} 
						className={ activeAgeIndex === 2 ? 'active col-cat__b age_category__ col-6 mb-3 p-0' : 'col-cat__b age_category__ col-6 mb-3 p-0' }>
							<div style={{ backgroundImage: `url(./static/imgs/thumbs/age-${ gender }-img-2.png)` }} 
							className="cat_thumbnail gender__img"></div>
							<div className="cat_details text-center mt-5">
								<h4>Thirties</h4>
								<div className="w-100 d-inline-block">30-39</div>
							</div>
						</div>
						<div onClick={() => this.checkQuestion(3, process.env.stepFive, '40-49', 'age')} 
						className={ activeAgeIndex === 3 ? 'active col-cat__b age_category__ col-6 mb-3 p-0' : 'col-cat__b age_category__ col-6 mb-3 p-0' }>
							<div style={{ backgroundImage: `url(./static/imgs/thumbs/age-${ gender }-img-3.png)` }} 
							className="cat_thumbnail gender__img"></div>
							<div className="cat_details text-center mt-5">
								<h4>Forties</h4>
								<div className="w-100 d-inline-block">40-49</div>
							</div>
						</div>
						<div onClick={() => this.checkQuestion(4, process.env.stepFive, '+50', 'age')} 
						className={ activeAgeIndex === 4 ? 'active col-cat__b age_category__ col-6 mb-3 p-0' : 'col-cat__b age_category__ col-6 mb-3 p-0' }>
							<div style={{ backgroundImage: `url(./static/imgs/thumbs/age-${ gender }-img-4.png)` }} 
							className="cat_thumbnail gender__img"></div>
							<div className="cat_details text-center mt-5">
								<h4>Fifties</h4>
								<div className="w-100 d-inline-block">+50</div>
							</div>
						</div>
					</div>
				</div>
			)
		}
		else if ( step === process.env.stepFive ) {
			return (
				<div className="w-100 step__ d-inline-block">
					<h1 className="h2 font-weight-bold text-center">Nature of the body</h1>
					<h3 className="h5 text-center">Please tell us, which of the following is your body type?</h3>
					<h3 className="h6 text-grey text-center">Each of us has a distinctive body, which is why our bodies differ in fat burning rates</h3>
					<div className="mt-4 d-inline-block w-100 categories__list">
						<div onClick={() => this.checkQuestion(1, process.env.stepSix, 'endomorph', 'body_type')} 
						className={ activeBodyTypeIndex === 1 ? 'active col-cat__b col-12 w-100 mb-3 p-0' : 'col-cat__b col-12 w-100 mb-3 p-0' }>
							<div style={{ backgroundImage: `url(./static/imgs/thumbs/basic-${gender}-img-1.png)` }} 
							className="cat_thumbnail"></div>
							<div className="cat_details mt-4">
								<h4 className="mb-0 mt-4">Endomorph</h4>
							</div>
						</div>
						<div onClick={() => this.checkQuestion(2, process.env.stepSix, 'mesomorph', 'body_type')} 
						className={ activeBodyTypeIndex === 2 ? 'active col-cat__b col-12 w-100 mb-3 p-0' : 'col-cat__b col-12 w-100 mb-3 p-0' }>
							<div style={{ backgroundImage: `url(./static/imgs/thumbs/body-type-${gender}-img-1.png)` }} 
							className="cat_thumbnail"></div>
							<div className="cat_details mt-4">
								<h4 className="mb-0 mt-4">Mesomorph</h4>
							</div>
						</div>
						<div onClick={() => this.checkQuestion(3, process.env.stepSix, 'ectomorph', 'body_type')} 
						className={ activeBodyTypeIndex === 3 ? 'active col-cat__b col-12 w-100 mb-3 p-0' : 'col-cat__b col-12 w-100 mb-3 p-0' }>
							<div style={{ backgroundImage: `url(./static/imgs/thumbs/body-type-${gender}-img-2.png)` }} 
							className="cat_thumbnail"></div>
							<div className="cat_details mt-4">
								<h4 className="mb-0 mt-4">Ectomorph</h4>
							</div>
						</div>
					</div>
				</div>
			)
		}
		else if ( step === process.env.stepSix ) {
			return (
				<div className="w-100 step__ d-inline-block">
					<h1 className="h2 font-weight-bold text-center">Daily lifestyle</h1>
					<h3 className="h5 text-center">Please describe your daily lifestyle</h3>
					<h3 className="h6 text-grey text-center">
						Those still of { ( age == '18-29' ? 'Twenties' : ( age == '30-39' ? 'Thirties' : ( age == '40-49' ? 'Forties' : 'Fifties' )))} Of their age wanting to improve their physical fitness
						<br /> In general, they need special regimens and diets that suit their current lifestyle
					</h3>
					<div className="mt-4 text-center mb-3 page_collect__prog age_container">
						<div onClick={() => this.checkQuestion(1, process.env.stepSeven, 'walk_a_lot', 'life_style')} 
						style={{ minHeight: '225px' }}
						className={ activeLifeStyleIndex === 1 ? 'active col-cat__b age_category__ col-6 mb-3 p-0' : 'col-cat__b age_category__ col-6 mb-3 p-0' }>
							<div style={{
								backgroundImage: `url(./static/imgs/thumbs/type-day-${gender}-img-2.png)`,
								backgroundSize: 'contain'
							}} className="cat_thumbnail w-100 gender__img"></div>
							<div className="cat_details text-center w-100 p-3 m-0">
								<h5 className="m-0">I workout and walk a lot every day</h5>
							</div>
						</div>
						<div onClick={() => this.checkQuestion(2, process.env.stepSeven, 'spend_time_in_the_office', 'life_style')} 
						style={{ minHeight: '225px' }}
						className={ activeLifeStyleIndex === 2 ? 'active col-cat__b age_category__ col-6 mb-3 p-0' : 'col-cat__b age_category__ col-6 mb-3 p-0' }>
							<div style={{
								backgroundImage: `url(./static/imgs/thumbs/type-day-${gender}-img-1.png)`,
								backgroundSize: 'contain'
							}} className="cat_thumbnail w-100 gender__img"></div>
							<div className="cat_details text-center w-100 p-3 m-0">
								<h5 className="m-0">I spend most of my time in the office</h5>
							</div>
						</div>
						<div onClick={() => this.checkQuestion(3, process.env.stepSeven, 'spend_time_in_home', 'life_style')} 
						style={{ minHeight: '265px' }}
						className={ activeLifeStyleIndex === 3 ? 'active col-cat__b age_category__ col-6 mb-3 p-0' : 'col-cat__b age_category__ col-6 mb-3 p-0' }>
							<div style={{
								backgroundImage: `url(./static/imgs/thumbs/type-day-${gender}-img-4.png)`,
								backgroundSize: 'contain'
							}} className="cat_thumbnail w-100 gender__img"></div>
							<div className="cat_details text-center w-100 p-3 m-0">
								<h5 className="m-0">I spend most of my time at home</h5>
							</div>
						</div>
						<div onClick={() => this.checkQuestion(4, process.env.stepSeven, 'lot_of_exertion', 'life_style')} 
						style={{ minHeight: '265px' }}
						className={ activeLifeStyleIndex === 4 ? 'active col-cat__b age_category__ col-6 mb-3 p-0' : 'col-cat__b age_category__ col-6 mb-3 p-0' }>
							<div style={{
								backgroundImage: `url(./static/imgs/thumbs/type-day-${gender}-img-3.png)`
							}} className="cat_thumbnail w-100 gender__img"></div>
							<div className="cat_details text-center w-100 p-3 m-0">
								<h5 className="m-0">My day includes a lot of physical activities</h5>
							</div>
						</div>
					</div>
				</div>
			)
		}
		else if ( step === process.env.stepSeven ) {
			return (
				<div className="w-100 step__ d-inline-block">
					<h1 className="h2 font-weight-bold text-center">Daily Behavior Change - strict diets</h1>
					<h3 className="h5 text-center">
						We helped, many individuals in <br />
						{ ( age == '18-29' ? 'Twenties' : ( age == '30-39' ? 'Thirties' : ( age == '40-49' ? 'Forties' : 'Fifties' )))} Of their age to improve their overall physical fitness
					</h3>
					<div className="mt-4 text-center mb-3 page_collect__prog age_container">
						<img width="100%" src="./static/imgs/behavior-change-praph_ar.svg" alt="Daily behavior change" />
						<div className="mt-3 w-100 d-inline-block">
							Our strategy is focused on changing the wrong daily behaviors and habits instead of following drastic diets, which is why we are proud to achieve long-term results.
						</div>
						<div className="next__step">
							<div onClick={() => this.setState({
								stepRule: 8,
								step: process.env.stepEight
							})} 
							className="button btn-step">Aha, you see!</div>
						</div>
					</div>
				</div>
			)
		}
		else if ( step === process.env.stepEight ) {
			return (
				<div className="w-100 step__ d-inline-block">
					<h1 className="h2 font-weight-bold text-center">About the ideal weight</h1>
					<h3 className="h5 text-center"></h3>
					<div className="mt-4 d-inline-block w-100 categories__list">
						<div className="full_max_width">
							<div className="w-50 pl-3">
								<div style={{
									backgroundImage: `url(./static/imgs/thumbs/goal-weight-${gender}-img.png)`,
									height: '400px',
									backgroundPosition: 'center',
									backgroundSize: 'cover'
								}}></div>
							</div>
							<div className="w-50">
								<div onClick={() => this.checkQuestion(1, process.env.stepNine, 'less_than_year', 'last_time_having_good_weight')} 
								className={ activeQ1Index === 1 ? 'active col-cat__b col-12 w-100 mb-3' : 'col-cat__b col-12 w-100 mb-3' }>
									<h4 className="mb-0 h5">less than one year</h4>
								</div>
								<div onClick={() => this.checkQuestion(2, process.env.stepNine, 'less_than_two_years', 'last_time_having_good_weight')} 
								className={ activeQ1Index === 2 ? 'active col-cat__b col-12 w-100 mb-3' : 'col-cat__b col-12 w-100 mb-3' }>
									<h4 className="mb-0 h5">From one to two years</h4>
								</div>
								<div onClick={() => this.checkQuestion(3, process.env.stepNine, 'less_than_tree_years', 'last_time_having_good_weight')} 
								className={ activeQ1Index === 3 ? 'active col-cat__b col-12 w-100 mb-3' : 'col-cat__b col-12 w-100 mb-3' }>
									<h4 className="mb-0 h5">More than 3 years</h4>
								</div>
								<div onClick={() => this.checkQuestion(4, process.env.stepNine, 'cant_remember', 'last_time_having_good_weight')} 
								className={ activeQ1Index === 4 ? 'active col-cat__b col-12 w-100 mb-3' : 'col-cat__b col-12 w-100 mb-3' }>
									<h4 className="mb-0 h5">I don't remember reaching my ideal weight before</h4>
								</div>
							</div>
						</div>
					</div>
				</div>
			)
		}
		else if ( step === process.env.stepNine ) {
			return (
				<div className="w-100 step__ d-inline-block">
					<h1 className="h2 font-weight-bold text-center">Eating habits</h1>
					<h3 className="h5 text-center">
						Please choose the habits you usually do from below
					</h3>
					<div className="mt-5 text-center mb-3 page_collect__prog habits_container">
						<div onClick={() => {
							let d = 'eating_sweets_and_sugar'
							let i = activeHabitsIndexs.indexOf(d)
							this.setState({ 
								activeHabitsIndexs: ( i > -1 ? activeHabitsIndexs.splice(i, 1) : [...activeHabitsIndexs, d] ) 
							})
						}}
						style={{ minHeight: '180px' }}
						className={ activeHabitsIndexs.includes('eating_sweets_and_sugar') ? 'active col-cat__b habits_category__ col-6 mb-3' : 'col-cat__b habits_category__ col-6 mb-3' }>
							<div className="cat_details text-center w-100 mt-0 p-0">
								<div style={{
									backgroundImage: 'url(./static/imgs/thumbs/habits-image-1.png)',
									backgroundSize: 'contain',
									height: '50px'
								}} className="cat_thumbnail"></div>
								<h5 className="mb-0">Not a day can pass without eating sweets and sugar</h5>
							</div>
						</div>
						<div onClick={() => {
							let d = 'dont_sleep_enough'
							let i = activeHabitsIndexs.indexOf(d)
							this.setState({ 
								activeHabitsIndexs: ( i > -1 ? activeHabitsIndexs.splice(i, 1) : [...activeHabitsIndexs, d] ) 
							})
						}}
						style={{ minHeight: '180px' }}
						className={ activeHabitsIndexs.includes('dont_sleep_enough') ? 'active col-cat__b habits_category__ col-6 mb-3' : 'col-cat__b habits_category__ col-6 mb-3' }>
							<div className="cat_details text-center w-100 mt-0 p-0">
								<div style={{
									backgroundImage: 'url(./static/imgs/thumbs/habits-image-2.png)',
									backgroundSize: 'contain',
									height: '50px'
								}} className="cat_thumbnail"></div>
								<h5 className="mb-0">I don't sleep well enough</h5>
							</div>
						</div>
						<div onClick={() => {
							let d = 'eating_at_night'
							let i = activeHabitsIndexs.indexOf(d)
							this.setState({ 
								activeHabitsIndexs: ( i > -1 ? activeHabitsIndexs.splice(i, 1) : [...activeHabitsIndexs, d] ) 
							})
						}}
						style={{ minHeight: '180px' }}
						className={ activeHabitsIndexs.includes('eating_at_night') ? 'active col-cat__b habits_category__ col-6 mb-3' : 'col-cat__b habits_category__ col-6 mb-3' }>
							<div className="cat_details text-center w-100 mt-0 p-0">
								<div style={{
									backgroundImage: 'url(./static/imgs/thumbs/habits-image-3.png)',
									backgroundSize: 'contain',
									height: '50px'
								}} className="cat_thumbnail"></div>
								<h5 className="mb-0">I usually eat late at night</h5>
							</div>
						</div>
						<br />
						<div onClick={() => {
							let d = 'eating_lot_of_salt'
							let i = activeHabitsIndexs.indexOf(d)
							this.setState({ 
								activeHabitsIndexs: ( i > -1 ? activeHabitsIndexs.splice(i, 1) : [...activeHabitsIndexs, d] ) 
							})
						}}
						style={{ minHeight: '160px' }}
						className={ activeHabitsIndexs.includes('eating_lot_of_salt') ? 'active col-cat__b habits_category__ col-6 mb-3' : 'col-cat__b habits_category__ col-6 mb-3' }>
							<div className="cat_details text-center w-100 mt-0 p-0">
								<div style={{
									backgroundImage: 'url(./static/imgs/thumbs/habits-image-4.png)',
									backgroundSize: 'contain',
									height: '50px'
								}} className="cat_thumbnail"></div>
								<h5 className="mb-0">I love salt and I consume it in large quantities</h5>
							</div>
						</div>
						<div onClick={() => {
							let d = 'love_soft_drinks'
							let i = activeHabitsIndexs.indexOf(d)
							this.setState({ 
								activeHabitsIndexs: ( i > -1 ? activeHabitsIndexs.splice(i, 1) : [...activeHabitsIndexs, d] ) 
							})
						}}
						style={{ minHeight: '160px' }}
						className={ activeHabitsIndexs.includes('love_soft_drinks') ? 'active col-cat__b habits_category__ col-6 mb-3' : 'col-cat__b habits_category__ col-6 mb-3' }>
							<div className="cat_details text-center w-100 mt-0 p-0">
								<div style={{
									backgroundImage: 'url(./static/imgs/thumbs/habits-image-5.png)',
									backgroundSize: 'contain',
									height: '50px'
								}} className="cat_thumbnail"></div>
								<h5 className="mb-0">I love soft drinks</h5>
							</div>
						</div>
						<div onClick={() => this.setState({ activeHabitsIndexs: [] })} 
						style={{ minHeight: '160px' }}
						className={ activeHabitsIndexs.length <= 0 ? 'active col-cat__b habits_category__ col-6 mb-3' : 'col-cat__b habits_category__ col-6 mb-3' }>
							<div className="cat_details text-center w-100 mt-0 p-0">
								<svg style={{ marginBottom: '1em' }} xmlns="http://www.w3.org/2000/svg" width="60" height="50" viewBox="0 0 24 24"><path fill="red" d="M23.954 21.03l-9.184-9.095 9.092-9.174-2.832-2.807-9.09 9.179-9.176-9.088-2.81 2.81 9.186 9.105-9.095 9.184 2.81 2.81 9.112-9.192 9.18 9.1z"/></svg>
								<h5 className="mb-0">None of the above</h5>
							</div>
						</div>
						<div className="next__step">
							<div onClick={() => this.setState({
								stepRule: 10,
								step: process.env.stepTen,
								data: [...data, {
									habits: activeHabitsIndexs
								}]
							})} 
							className={ activeHabitsIndexs.length > 0 ? 'button btn-step' : 'button btn-step' }>Continue</div>
						</div>
					</div>
				</div>
			)
		}
		else if ( step === process.env.stepTen ) {
			return (
				<div className="w-100 step__ d-inline-block">
					<h1 className="h2 font-weight-bold text-center">Physical fitness and movement</h1>
					<h3 className="h5 text-center">
						What level of physical activity do you do daily?
					</h3>
					<h4 className="h6 text-center">
						As an adult who wants to gain 5 kg based on your previous choice: { lifeStyle }, <br /> 
						You should bear in mind that level of physical activity and movement plays an important role in this process
					</h4>
					<div className="mt-4 d-inline-block w-100 categories__list">
						<div onClick={() => this.checkQuestion(1, process.env.stepEleven, 'no_exertion', 'fitness_routine')} 
						className={ activeQ2Index === 1 ? 'active col-cat__b col-12 w-100 mb-3' : 'col-cat__b col-12 w-100 mb-3' }>
							<h4>I am not a fan of action at all</h4>
						</div>
						<div onClick={() => this.checkQuestion(2, process.env.stepEleven, 'exercises_one_two_weekly', 'fitness_routine')} 
						className={ activeQ2Index === 2 ? 'active col-cat__b col-12 w-100 mb-3' : 'col-cat__b col-12 w-100 mb-3' }>
							<h4>Exercise one to two times a week</h4>
						</div>
						<div onClick={() => this.checkQuestion(3, process.env.stepEleven, 'exercises_tree_five_weekly', 'fitness_routine')} 
						className={ activeQ2Index === 3 ? 'active col-cat__b col-12 w-100 mb-3' : 'col-cat__b col-12 w-100 mb-3' }>
							<h4>Exercise 3 to 5 times a week</h4>
						</div>
						<div onClick={() => this.checkQuestion(4, process.env.stepEleven, 'exercises_five_seven_weekly', 'fitness_routine')} 
						className={ activeQ2Index === 4 ? 'active col-cat__b col-12 w-100 mb-3' : 'col-cat__b col-12 w-100 mb-3' }>
							<h4>Exercise 5 to 7 times a week</h4>
						</div>
						<div onClick={() => this.checkQuestion(5, process.env.stepEleven, 'exertion_work', 'fitness_routine')} 
						className={ activeQ2Index === 5 ? 'active col-cat__b col-12 w-100 mb-3' : 'col-cat__b col-12 w-100 mb-3' }>
							<h4>Very active, I work in a physically demanding job</h4>
						</div>
					</div>
				</div>
			)
		}
		else if ( step === process.env.stepEleven ) {
			return (
				<div className="w-100 step__ d-inline-block">
					<h1 className="h2 font-weight-bold text-center">Daily energy levels</h1>
					<h3 className="h5 text-center">You think you can maintain the same activity level - energy throughout your entire day?</h3>
					<div className="mt-4 d-inline-block w-100 categories__list">
						<div onClick={() => this.checkQuestion(1, process.env.stepTwelve, 'energy_levels_remain_nearly_constant', 'your_energy')} 
						className={ activeQ3Index === 1 ? 'active col-cat__b col-12 w-100 mb-3 p-0' : 'col-cat__b col-12 w-100 mb-3 p-0' }>
							<div style={{ backgroundImage: `url(./static/imgs/thumbs/ability-${gender}-img-1.png)` }} className="cat_thumbnail"></div>
							<div className="cat_details">
								<h4 className="h5 mb-0 mt-2">Yes, my energy levels remain nearly constant throughout the day</h4>
							</div>
						</div>
						<div onClick={() => this.checkQuestion(2, process.env.stepTwelve, 'feel_a_little_lethargic_before_meal', 'your_energy')} 
						className={ activeQ3Index === 2 ? 'active col-cat__b col-12 w-100 mb-3 p-0' : 'col-cat__b col-12 w-100 mb-3 p-0' }>
							<div style={{ backgroundImage: `url(./static/imgs/thumbs/ability-${gender}-img-2.png)` }} className="cat_thumbnail"></div>
							<div className="cat_details">
								<h4 className="h5 mb-0 mt-3">I feel a little lethargic before meal times</h4>
							</div>
						</div>
						<div onClick={() => this.checkQuestion(3, process.env.stepTwelve, 'feel_sleepy_after_eating_lunch', 'your_energy')} 
						className={ activeQ3Index === 3 ? 'active col-cat__b col-12 w-100 mb-3 p-0' : 'col-cat__b col-12 w-100 mb-3 p-0' }>
							<div style={{ backgroundImage: `url(./static/imgs/thumbs/ability-${gender}-img-3.png)` }} className="cat_thumbnail"></div>
							<div className="cat_details">
								<h4 className="h5 mb-0 mt-3">I feel sleepy after eating lunch</h4>
							</div>
						</div>
					</div>
				</div>
			)
		}
		else if ( step === process.env.stepTwelve ) {
			return (
				<div className="w-100 step__ d-inline-block">
					<h1 className="h2 font-weight-bold text-center">Sleep system</h1>
					<h3 className="h5 text-center">
						How many hours do you sleep per day?
					</h3>
					<h4 className="h6 text-center">
						You should bear in mind that sleep is essential in an operation <br /> Getting to look your best
					</h4>
					<div className="mt-4 d-inline-block w-100 categories__list">
						<div onClick={() => this.checkQuestion(1, process.env.stepThirteen, 'less_than_f_hours', 'sleep_routine')} 
						className={ activeQ4Index === 1 ? 'active col-cat__b col-12 w-100 mb-3' : 'col-cat__b col-12 w-100 mb-3' }>
							<h4>Less than 5 hours</h4>
						</div>
						<div onClick={() => this.checkQuestion(2, process.env.stepThirteen, 'from_f_to_s_hours', 'sleep_routine')} 
						className={ activeQ4Index === 2 ? 'active col-cat__b col-12 w-100 mb-3' : 'col-cat__b col-12 w-100 mb-3' }>
							<h4>5 to 6 hours</h4>
						</div>
						<div onClick={() => this.checkQuestion(3, process.env.stepThirteen, 'from_s_to_e_hours', 'sleep_routine')} 
						className={ activeQ4Index === 3 ? 'active col-cat__b col-12 w-100 mb-3' : 'col-cat__b col-12 w-100 mb-3' }>
							<h4>7 to 8 hours</h4>
						</div>
						<div onClick={() => this.checkQuestion(4, process.env.stepThirteen, 'more_than_e_hours', 'sleep_routine')} 
						className={ activeQ4Index === 4 ? 'active col-cat__b col-12 w-100 mb-3' : 'col-cat__b col-12 w-100 mb-3' }>
							<h4>More than 8 hours</h4>
						</div>
					</div>
				</div>
			)
		}
		else if ( step === process.env.stepThirteen ) {
			return (
				<div className="w-100 step__ d-inline-block">
					<h1 className="h2 font-weight-bold text-center">Water</h1>
					<h3 className="h5 text-center">
						How much water do you drink / drink daily?
					</h3>
					<h4 className="h6 text-center">Water is the secret of life, and it is one of the primary factors that can help you achieve your goals quickly</h4>
					<div className="mt-4 d-inline-block w-100 categories__list">
						<div onClick={() => this.checkQuestion(1, process.env.stepFourteen, 'drink_coffee_or_tea', 'water')} 
						className={ activeQ5Index === 1 ? 'active col-cat__b col-12 w-100 mb-3' : 'col-cat__b col-12 w-100 mb-3' }>
							<h4>I only drink coffee or tea</h4>
						</div>
						<div onClick={() => this.checkQuestion(2, process.env.stepFourteen, 'less_than_two_cups', 'water')} 
						className={ activeQ5Index === 2 ? 'active col-cat__b col-12 w-100 mb-3' : 'col-cat__b col-12 w-100 mb-3' }>
							<h4>Less than two cups (0,5 liter)</h4>
						</div>
						<div onClick={() => this.checkQuestion(3, process.env.stepFourteen, 'two_to_six_cups', 'water')} 
						className={ activeQ5Index === 3 ? 'active col-cat__b col-12 w-100 mb-3' : 'col-cat__b col-12 w-100 mb-3' }>
							<h4>2 to 6 cups</h4>
						</div>
						<div onClick={() => this.checkQuestion(4, process.env.stepFourteen, 'more_than_six_cups', 'water')} 
						className={ activeQ5Index === 4 ? 'active col-cat__b col-12 w-100 mb-3' : 'col-cat__b col-12 w-100 mb-3' }>
							<h4>More than 6 cups</h4>
						</div>
					</div>
				</div>
			)
		}
		else if ( step === process.env.stepFourteen ) {
			return (
				<div className="w-100 step__ d-inline-block">
					<h1 className="h2 font-weight-bold text-center">Motivation and determination</h1>
					<h3 className="h5 text-center">Does the following sentence apply to you?</h3>
					<div className="quote mt-4">
						<svg style={{ opacity: '0.3' }} xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24"><path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.571-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z"/></svg>
						I usually need constant stimulation in order to continue on the path toward my goal, as I often give up once I'm feeling a little frustrated or stressed.
					</div>
					<div className="mt-4 d-inline-block w-100 categories__list text-center">
						<div onClick={() => this.checkQuestion(1, process.env.stepFifteen, 'no_need_for_motivation', 'need_motivation')} 
						className={ activeQ6Index === 1 ? 'active chose_q col-cat__b w-50 mb-3' : 'chose_q col-cat__b w-50 mb-3' }>
							<img className="qu_vote" src="./static/imgs/question-icon-no.svg" width="50" height="40" />
							<h4 className="mb-0 h5 mt-2">no I'm not</h4>
						</div>
						<div onClick={() => this.checkQuestion(2, process.env.stepFifteen, 'yes_need_motivation', 'need_motivation')} 
						className={ activeQ6Index === 2 ? 'active chose_q col-cat__b w-50 mb-3' : 'chose_q col-cat__b w-50 mb-3' }>
							<img className="qu_vote" src="./static/imgs/question-icon-yes.svg" width="50" height="40" />
							<h4 className="mb-0 h5 mt-2">Yes im this person</h4>
						</div>
					</div>
				</div>
			)
		}
		else if ( step === process.env.stepFifteen ) {
			return (
				<div className="w-100 step__ d-inline-block">
					<h1 className="h2 font-weight-bold text-center">Concerns of life</h1>
					<h3 className="h5 text-center">Does the following sentence apply to you?</h3>
					<div className="quote mt-4">
						<svg style={{ opacity: '0.3' }} xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24"><path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.571-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z"/></svg>
						I feel that I will not have enough time to perform my daily activities and tasks to keep me busy with exercise and dieting.
					</div>
					<div className="mt-4 d-inline-block w-100 categories__list text-center">
						<div onClick={() => this.checkQuestion(1, process.env.stepSixteen, 'no_life_issues', 'life_issues')} 
						className={ activeQ7Index === 1 ? 'active chose_q col-cat__b w-50 mb-3' : 'chose_q col-cat__b w-50 mb-3' }>
							<img className="qu_vote" src="./static/imgs/question-icon-no.svg" width="50" height="40" />
							<h4 className="mb-0">No, I don't think that way</h4>
						</div>
						<div onClick={() => this.checkQuestion(2, process.env.stepSixteen, 'yes_having_life_issues', 'life_issues')} 
						className={ activeQ7Index === 2 ? 'active chose_q col-cat__b w-50 mb-3' : 'chose_q col-cat__b w-50 mb-3' }>
							<img className="qu_vote" src="./static/imgs/question-icon-yes.svg" width="50" height="40" />
							<h4 className="mb-0">Yes, I think so.</h4>
						</div>
					</div>
				</div>
			)
		}
		else if ( step === process.env.stepSixteen ) {
			return (
				<div className="w-100 step__ d-inline-block">
					<h1 className="h2 font-weight-bold text-center">Vegetables</h1>
					<h3 className="h5 text-center">
						Please choose the vegetables that you would like to be part of the diet
					</h3>
					<h4 className="h6 text-center">We are almost done! Let's design the diet that's right for you</h4>
					<div className="mt-5 text-center mb-3 page_collect__prog habits_container">
						<div onClick={() => {
							let i = activeVegetablesIndexs.indexOf('sweet_potato')
							this.setState({ 
								activeVegetablesIndexs: ( i > -1 ? activeVegetablesIndexs.splice(i, 1) : [...activeVegetablesIndexs, 'sweet_potato'] ) 
							})
						}}
						className={ activeVegetablesIndexs.includes('sweet_potato') ? 'active col-cat__b habits_category__ col-6 mb-3' : 'col-cat__b habits_category__ col-6 mb-3' }>
							<div className="cat_details text-center w-100 mt-0 p-0">
								<div style={{
									backgroundImage: 'url(./static/imgs/thumbs/vegitarian-img-1.png)',
									backgroundSize: 'contain',
									height: '50px'
								}} className="cat_thumbnail"></div>
								<h5 className="mb-0">Sweet potato</h5>
							</div>
						</div>
						<div onClick={() => {
							let i = activeVegetablesIndexs.indexOf('broccoli')
							this.setState({ 
								activeVegetablesIndexs: ( i > -1 ? activeVegetablesIndexs.splice(i, 1) : [...activeVegetablesIndexs, 'broccoli'] ) 
							})
						}}
						className={ activeVegetablesIndexs.includes('broccoli') ? 'active col-cat__b habits_category__ col-6 mb-3' : 'col-cat__b habits_category__ col-6 mb-3' }>
							<div className="cat_details text-center w-100 mt-0 p-0">
								<div style={{
									backgroundImage: 'url(./static/imgs/thumbs/vegitarian-img-2.png)',
									backgroundSize: 'contain',
									height: '50px'
								}} className="cat_thumbnail"></div>
								<h5 className="mb-0">Broccoli</h5>
							</div>
						</div>
						<div onClick={() => {
							let i = activeVegetablesIndexs.indexOf('tomatoes')
							this.setState({ 
								activeVegetablesIndexs: ( i > -1 ? activeVegetablesIndexs.splice(i, 1) : [...activeVegetablesIndexs, 'tomatoes'] ) 
							})
						}}
						className={ activeVegetablesIndexs.includes('tomatoes') ? 'active col-cat__b habits_category__ col-6 mb-3' : 'col-cat__b habits_category__ col-6 mb-3' }>
							<div className="cat_details text-center w-100 mt-0 p-0">
								<div style={{
									backgroundImage: 'url(./static/imgs/thumbs/vegitarian-img-3.png)',
									backgroundSize: 'contain',
									height: '50px'
								}} className="cat_thumbnail"></div>
								<h5 className="mb-0">Tomatoes</h5>
							</div>
						</div>
						<br />
						<div onClick={() => {
							let i = activeVegetablesIndexs.indexOf('mushrooms')
							this.setState({ 
								activeVegetablesIndexs: ( i > -1 ? activeVegetablesIndexs.splice(i, 1) : [...activeVegetablesIndexs, 'mushrooms'] ) 
							})
						}}
						className={ activeVegetablesIndexs.includes('mushrooms') ? 'active col-cat__b habits_category__ col-6 mb-3' : 'col-cat__b habits_category__ col-6 mb-3' }>
							<div className="cat_details text-center w-100 mt-0 p-0">
								<div style={{
									backgroundImage: 'url(./static/imgs/thumbs/vegitarian-img-4.png)',
									backgroundSize: 'contain',
									height: '50px'
								}} className="cat_thumbnail"></div>
								<h5 className="mb-0">Mushrooms</h5>
							</div>
						</div>
						<div onClick={() => {
							let i = activeVegetablesIndexs.indexOf('spinach')
							this.setState({ 
								activeVegetablesIndexs: ( i > -1 ? activeVegetablesIndexs.splice(i, 1) : [...activeVegetablesIndexs, 'spinach'] ) 
							})
						}}
						className={ activeVegetablesIndexs.includes('spinach') ? 'active col-cat__b habits_category__ col-6 mb-3' : 'col-cat__b habits_category__ col-6 mb-3' }>
							<div className="cat_details text-center w-100 mt-0 p-0">
								<div style={{
									backgroundImage: 'url(./static/imgs/thumbs/vegitarian-img-5.png)',
									backgroundSize: 'contain',
									height: '50px'
								}} className="cat_thumbnail"></div>
								<h5 className="mb-0">Spinach</h5>
							</div>
						</div>
						<div onClick={() => {
							let i = activeVegetablesIndexs.indexOf('beans')
							this.setState({ 
								activeVegetablesIndexs: ( i > -1 ? activeVegetablesIndexs.splice(i, 1) : [...activeVegetablesIndexs, 'beans'] ) 
							})
						}}
						className={ activeVegetablesIndexs.includes('beans') ? 'active col-cat__b habits_category__ col-6 mb-3' : 'col-cat__b habits_category__ col-6 mb-3' }>
							<div className="cat_details text-center w-100 mt-0 p-0">
								<div style={{
									backgroundImage: 'url(./static/imgs/thumbs/vegitarian-img-6.png)',
									backgroundSize: 'contain',
									height: '50px'
								}} className="cat_thumbnail"></div>
								<h5 className="mb-0">Beans</h5>
							</div>
						</div>
						<br />
						<div onClick={() => {
							let i = activeVegetablesIndexs.indexOf('pepper')
							this.setState({ 
								activeVegetablesIndexs: ( i > -1 ? activeVegetablesIndexs.splice(i, 1) : [...activeVegetablesIndexs, 'pepper'] ) 
							})
						}}
						className={ activeVegetablesIndexs.includes('pepper') ? 'active col-cat__b habits_category__ col-6 mb-3' : 'col-cat__b habits_category__ col-6 mb-3' }>
							<div className="cat_details text-center w-100 mt-0 p-0">
								<div style={{
									backgroundImage: 'url(./static/imgs/thumbs/vegitarian-img-7.png)',
									backgroundSize: 'contain',
									height: '50px'
								}} className="cat_thumbnail"></div>
								<h5 className="mb-0">Pepper</h5>
							</div>
						</div>
						<div onClick={() => {
							let i = activeVegetablesIndexs.indexOf('cabbage')
							this.setState({ 
								activeVegetablesIndexs: ( i > -1 ? activeVegetablesIndexs.splice(i, 1) : [...activeVegetablesIndexs, 'cabbage'] ) 
							})
						}}
						className={ activeVegetablesIndexs.includes('cabbage') ? 'active col-cat__b habits_category__ col-6 mb-3' : 'col-cat__b habits_category__ col-6 mb-3' }>
							<div className="cat_details text-center w-100 mt-0 p-0">
								<div style={{
									backgroundImage: 'url(./static/imgs/thumbs/vegitarian-img-25.png)',
									backgroundSize: 'contain',
									height: '50px'
								}} className="cat_thumbnail"></div>
								<h5 className="mb-0">Cabbage</h5>
							</div>
						</div>
						<div onClick={() => {
							let i = activeVegetablesIndexs.indexOf('carrots')
							this.setState({ 
								activeVegetablesIndexs: ( i > -1 ? activeVegetablesIndexs.splice(i, 1) : [...activeVegetablesIndexs, 'carrots'] ) 
							})
						}}
						className={ activeVegetablesIndexs.includes('carrots') ? 'active col-cat__b habits_category__ col-6 mb-3' : 'col-cat__b habits_category__ col-6 mb-3' }>
							<div className="cat_details text-center w-100 mt-0 p-0">
								<div style={{
									backgroundImage: 'url(./static/imgs/thumbs/vegitarian-img-26.png)',
									backgroundSize: 'contain',
									height: '50px'
								}} className="cat_thumbnail"></div>
								<h5 className="mb-0">Carrots</h5>
							</div>
						</div>
						<br />
						<div onClick={() => {
							let i = activeVegetablesIndexs.indexOf('celery')
							this.setState({ 
								activeVegetablesIndexs: ( i > -1 ? activeVegetablesIndexs.splice(i, 1) : [...activeVegetablesIndexs, 'celery'] ) 
							})
						}}
						className={ activeVegetablesIndexs.includes('celery') ? 'active col-cat__b habits_category__ col-6 mb-3' : 'col-cat__b habits_category__ col-6 mb-3' }>
							<div className="cat_details text-center w-100 mt-0 p-0">
								<div style={{
									backgroundImage: 'url(./static/imgs/thumbs/vegitarian-img-27.png)',
									backgroundSize: 'contain',
									height: '50px'
								}} className="cat_thumbnail"></div>
								<h5 className="mb-0">Celey</h5>
							</div>
						</div>
						<div onClick={() => {
							let i = activeVegetablesIndexs.indexOf('corn')
							this.setState({ 
								activeVegetablesIndexs: ( i > -1 ? activeVegetablesIndexs.splice(i, 1) : [...activeVegetablesIndexs, 'corn'] ) 
							})
						}}
						className={ activeVegetablesIndexs.includes('corn') ? 'active col-cat__b habits_category__ col-6 mb-3' : 'col-cat__b habits_category__ col-6 mb-3' }>
							<div className="cat_details text-center w-100 mt-0 p-0">
								<div style={{
									backgroundImage: 'url(./static/imgs/thumbs/vegitarian-img-28.png)',
									backgroundSize: 'contain',
									height: '50px'
								}} className="cat_thumbnail"></div>
								<h5 className="mb-0">Corn</h5>
							</div>
						</div>
						<div onClick={() => {
							let i = activeVegetablesIndexs.indexOf('potatoes')
							this.setState({ 
								activeVegetablesIndexs: ( i > -1 ? activeVegetablesIndexs.splice(i, 1) : [...activeVegetablesIndexs, 'potatoes'] ) 
							})
						}}
						className={ activeVegetablesIndexs.includes('potatoes') ? 'active col-cat__b habits_category__ col-6 mb-3' : 'col-cat__b habits_category__ col-6 mb-3' }>
							<div className="cat_details text-center w-100 mt-0 p-0">
								<div style={{
									backgroundImage: 'url(./static/imgs/thumbs/vegitarian-img-29.png)',
									backgroundSize: 'contain',
									height: '50px'
								}} className="cat_thumbnail"></div>
								<h5 className="mb-0">Potatoes</h5>
							</div>
						</div>
						<div className="next__step">
							<div onClick={() => this.setState({
								stepRule: 17,
								step: process.env.stepSeventeen,
								data: [...data, {
									vegetables: activeVegetablesIndexs
								}]
							})} 
							className={ activeVegetablesIndexs.length > 0 ? 'button btn-step' : 'button btn-step disabled' }>Continue</div>
						</div>
					</div>
				</div>
			)
		}
		else if ( step === process.env.stepSeventeen ) {
			return (
				<div className="w-100 step__ d-inline-block">
					<h1 className="h2 font-weight-bold text-center">Food products</h1>
					<h3 className="h5 text-center">
						Please choose the food products that you like <br /> Being part of the diet
					</h3>
					<div className="mt-5 text-center mb-3 page_collect__prog habits_container">
						<div onClick={() => {
							let i = activeFoodsIndexs.indexOf('eggs')
							this.setState({ 
								activeFoodsIndexs: ( i > -1 ? activeFoodsIndexs.splice(i, 1) : [...activeFoodsIndexs, 'eggs'] ) 
							})
						}}
						style={{ minHeight: '140px' }}
						className={ activeFoodsIndexs.includes('eggs') ? 'active col-cat__b habits_category__ col-6 mb-3' : 'col-cat__b habits_category__ col-6 mb-3' }>
							<div className="cat_details text-center w-100 mt-0 p-0">
								<div style={{
									backgroundImage: 'url(./static/imgs/thumbs/vegitarian-img-9.png)',
									backgroundSize: 'contain',
									height: '50px'
								}} className="cat_thumbnail"></div>
								<h5 className="mb-0">Eggs</h5>
							</div>
						</div>
						<div onClick={() => {
							let i = activeFoodsIndexs.indexOf('apricot')
							this.setState({ 
								activeFoodsIndexs: ( i > -1 ? activeFoodsIndexs.splice(i, 1) : [...activeFoodsIndexs, 'apricot'] ) 
							})
						}}
						style={{ minHeight: '140px' }}
						className={ activeFoodsIndexs.includes('apricot') ? 'active col-cat__b habits_category__ col-6 mb-3' : 'col-cat__b habits_category__ col-6 mb-3' }>
							<div className="cat_details text-center w-100 mt-0 p-0">
								<div style={{
									backgroundImage: 'url(./static/imgs/thumbs/vegitarian-img-30.png)',
									backgroundSize: 'contain',
									height: '50px'
								}} className="cat_thumbnail"></div>
								<h5 className="mb-0">Apricot</h5>
							</div>
						</div>
						<div onClick={() => {
							let i = activeFoodsIndexs.indexOf('banana')
							this.setState({ 
								activeFoodsIndexs: ( i > -1 ? activeFoodsIndexs.splice(i, 1) : [...activeFoodsIndexs, 'banana'] ) 
							})
						}}
						style={{ minHeight: '140px' }}
						className={ activeFoodsIndexs.includes('banana') ? 'active col-cat__b habits_category__ col-6 mb-3' : 'col-cat__b habits_category__ col-6 mb-3' }>
							<div className="cat_details text-center w-100 mt-0 p-0">
								<div style={{
									backgroundImage: 'url(./static/imgs/thumbs/vegitarian-img-31.png)',
									backgroundSize: 'contain',
									height: '50px'
								}} className="cat_thumbnail"></div>
								<h5 className="mb-0">Banana</h5>
							</div>
						</div>
						<br />
						<div onClick={() => {
							let i = activeFoodsIndexs.indexOf('blueberries')
							this.setState({ 
								activeFoodsIndexs: ( i > -1 ? activeFoodsIndexs.splice(i, 1) : [...activeFoodsIndexs, 'blueberries'] ) 
							})
						}}
						style={{ minHeight: '140px' }}
						className={ activeFoodsIndexs.includes('blueberries') ? 'active col-cat__b habits_category__ col-6 mb-3' : 'col-cat__b habits_category__ col-6 mb-3' }>
							<div className="cat_details text-center w-100 mt-0 p-0">
								<div style={{
									backgroundImage: 'url(./static/imgs/thumbs/vegitarian-img-32.png)',
									backgroundSize: 'contain',
									height: '50px'
								}} className="cat_thumbnail"></div>
								<h5 className="mb-0">Blueberries</h5>
							</div>
						</div>
						<div onClick={() => {
							let i = activeFoodsIndexs.indexOf('grapes')
							this.setState({ 
								activeFoodsIndexs: ( i > -1 ? activeFoodsIndexs.splice(i, 1) : [...activeFoodsIndexs, 'grapes'] ) 
							})
						}}
						style={{ minHeight: '140px' }}
						className={ activeFoodsIndexs.includes('grapes') ? 'active col-cat__b habits_category__ col-6 mb-3' : 'col-cat__b habits_category__ col-6 mb-3' }>
							<div className="cat_details text-center w-100 mt-0 p-0">
								<div style={{
									backgroundImage: 'url(./static/imgs/thumbs/vegitarian-img-33.png)',
									backgroundSize: 'contain',
									height: '50px'
								}} className="cat_thumbnail"></div>
								<h5 className="mb-0">Grapes</h5>
							</div>
						</div>
						<div onClick={() => {
							let i = activeFoodsIndexs.indexOf('oranges')
							this.setState({ 
								activeFoodsIndexs: ( i > -1 ? activeFoodsIndexs.splice(i, 1) : [...activeFoodsIndexs, 'oranges'] ) 
							})
						}}
						style={{ minHeight: '140px' }}
						className={ activeFoodsIndexs.includes('oranges') ? 'active col-cat__b habits_category__ col-6 mb-3' : 'col-cat__b habits_category__ col-6 mb-3' }>
							<div className="cat_details text-center w-100 mt-0 p-0">
								<div style={{
									backgroundImage: 'url(./static/imgs/thumbs/vegitarian-img-34.png)',
									backgroundSize: 'contain',
									height: '50px'
								}} className="cat_thumbnail"></div>
								<h5 className="mb-0">Oranges</h5>
							</div>
						</div>
						<br />
						<div onClick={() => {
							let i = activeFoodsIndexs.indexOf('peaches')
							this.setState({ 
								activeFoodsIndexs: ( i > -1 ? activeFoodsIndexs.splice(i, 1) : [...activeFoodsIndexs, 'peaches'] ) 
							})
						}}
						style={{ minHeight: '140px' }}
						className={ activeFoodsIndexs.includes('peaches') ? 'active col-cat__b habits_category__ col-6 mb-3' : 'col-cat__b habits_category__ col-6 mb-3' }>
							<div className="cat_details text-center w-100 mt-0 p-0">
								<div style={{
									backgroundImage: 'url(./static/imgs/thumbs/vegitarian-img-35.png)',
									backgroundSize: 'contain',
									height: '50px'
								}} className="cat_thumbnail"></div>
								<h5 className="mb-0">Peaches</h5>
							</div>
						</div>
						<div onClick={() => {
							let i = activeFoodsIndexs.indexOf('avocado')
							this.setState({ 
								activeFoodsIndexs: ( i > -1 ? activeFoodsIndexs.splice(i, 1) : [...activeFoodsIndexs, 'avocado'] ) 
							})
						}}
						style={{ minHeight: '140px' }}
						className={ activeFoodsIndexs.includes('avocado') ? 'active col-cat__b habits_category__ col-6 mb-3' : 'col-cat__b habits_category__ col-6 mb-3' }>
							<div className="cat_details text-center w-100 mt-0 p-0">
								<div style={{
									backgroundImage: 'url(./static/imgs/thumbs/vegitarian-img-10.png)',
									backgroundSize: 'contain',
									height: '50px'
								}} className="cat_thumbnail"></div>
								<h5 className="mb-0">Avocado</h5>
							</div>
						</div>
						<div onClick={() => {
							let i = activeFoodsIndexs.indexOf('cottage_cheese')
							this.setState({ 
								activeFoodsIndexs: ( i > -1 ? activeFoodsIndexs.splice(i, 1) : [...activeFoodsIndexs, 'cottage_cheese'] ) 
							})
						}}
						style={{ minHeight: '140px' }}
						className={ activeFoodsIndexs.includes('cottage_cheese') ? 'active col-cat__b habits_category__ col-6 mb-3' : 'col-cat__b habits_category__ col-6 mb-3' }>
							<div className="cat_details text-center w-100 mt-0 p-0">
								<div style={{
									backgroundImage: 'url(./static/imgs/thumbs/vegitarian-img-11.png)',
									backgroundSize: 'contain',
									height: '50px'
								}} className="cat_thumbnail"></div>
								<h5 className="mb-0">Cottage cheese</h5>
							</div>
						</div>
						<br />
						<div onClick={() => {
							let i = activeFoodsIndexs.indexOf('yogurt')
							this.setState({ 
								activeFoodsIndexs: ( i > -1 ? activeFoodsIndexs.splice(i, 1) : [...activeFoodsIndexs, 'yogurt'] ) 
							})
						}}
						style={{ minHeight: '140px' }}
						className={ activeFoodsIndexs.includes('yogurt') ? 'active col-cat__b habits_category__ col-6 mb-3' : 'col-cat__b habits_category__ col-6 mb-3' }>
							<div className="cat_details text-center w-100 mt-0 p-0">
								<div style={{
									backgroundImage: 'url(./static/imgs/thumbs/vegitarian-img-12.png)',
									backgroundSize: 'contain',
									height: '50px'
								}} className="cat_thumbnail"></div>
								<h5 className="mb-0">Yogurt</h5>
							</div>
						</div>
						<div onClick={() => {
							let i = activeFoodsIndexs.indexOf('olives')
							this.setState({ 
								activeFoodsIndexs: ( i > -1 ? activeFoodsIndexs.splice(i, 1) : [...activeFoodsIndexs, 'olives'] ) 
							})
						}}
						style={{ minHeight: '140px' }}
						className={ activeFoodsIndexs.includes('olives') ? 'active col-cat__b habits_category__ col-6 mb-3' : 'col-cat__b habits_category__ col-6 mb-3' }>
							<div className="cat_details text-center w-100 mt-0 p-0">
								<div style={{
									backgroundImage: 'url(./static/imgs/thumbs/vegitarian-img-13.png)',
									backgroundSize: 'contain',
									height: '50px'
								}} className="cat_thumbnail"></div>
								<h5 className="mb-0">Olives</h5>
							</div>
						</div>
						<div onClick={() => {
							let i = activeFoodsIndexs.indexOf('brie_cheese')
							this.setState({ 
								activeFoodsIndexs: ( i > -1 ? activeFoodsIndexs.splice(i, 1) : [...activeFoodsIndexs, 'brie_cheese'] ) 
							})
						}}
						style={{ minHeight: '140px' }}
						className={ activeFoodsIndexs.includes('brie_cheese') ? 'active col-cat__b habits_category__ col-6 mb-3' : 'col-cat__b habits_category__ col-6 mb-3' }>
							<div className="cat_details text-center w-100 mt-0 p-0">
								<div style={{
									backgroundImage: 'url(./static/imgs/thumbs/vegitarian-img-14.png)',
									backgroundSize: 'contain',
									height: '50px'
								}} className="cat_thumbnail"></div>
								<h5 className="mb-0">Brie cheese</h5>
							</div>
						</div>
						<br />
						<div onClick={() => {
							let i = activeFoodsIndexs.indexOf('nuts')
							this.setState({ 
								activeFoodsIndexs: ( i > -1 ? activeFoodsIndexs.splice(i, 1) : [...activeFoodsIndexs, 'nuts'] ) 
							})
						}}
						style={{ minHeight: '140px' }}
						className={ activeFoodsIndexs.includes('nuts') ? 'active col-cat__b habits_category__ col-6 mb-3' : 'col-cat__b habits_category__ col-6 mb-3' }>
							<div className="cat_details text-center w-100 mt-0 p-0">
								<div style={{
									backgroundImage: 'url(./static/imgs/thumbs/vegitarian-img-15.png)',
									backgroundSize: 'contain',
									height: '50px'
								}} className="cat_thumbnail"></div>
								<h5 className="mb-0">Nuts</h5>
							</div>
						</div>
						<div onClick={() => {
							let i = activeFoodsIndexs.indexOf('peanut_butter')
							this.setState({ 
								activeFoodsIndexs: ( i > -1 ? activeFoodsIndexs.splice(i, 1) : [...activeFoodsIndexs, 'peanut_butter'] ) 
							})
						}}
						style={{ minHeight: '140px' }}
						className={ activeFoodsIndexs.includes('peanut_butter') ? 'active col-cat__b habits_category__ col-6 mb-3' : 'col-cat__b habits_category__ col-6 mb-3' }>
							<div className="cat_details text-center w-100 mt-0 p-0">
								<div style={{
									backgroundImage: 'url(./static/imgs/thumbs/vegitarian-img-16.png)',
									backgroundSize: 'contain',
									height: '50px'
								}} className="cat_thumbnail"></div>
								<h5 className="mb-0">Peanut butter</h5>
							</div>
						</div>
						<div onClick={() => {
							let i = activeFoodsIndexs.indexOf('milk')
							this.setState({ 
								activeFoodsIndexs: ( i > -1 ? activeFoodsIndexs.splice(i, 1) : [...activeFoodsIndexs, 'milk'] ) 
							})
						}}
						style={{ minHeight: '140px' }}
						className={ activeFoodsIndexs.includes('milk') ? 'active col-cat__b habits_category__ col-6 mb-3' : 'col-cat__b habits_category__ col-6 mb-3' }>
							<div className="cat_details text-center w-100 mt-0 p-0">
								<div style={{
									backgroundImage: 'url(./static/imgs/thumbs/vegitarian-img-17.png)',
									backgroundSize: 'contain',
									height: '50px'
								}} className="cat_thumbnail"></div>
								<h5 className="mb-0">Milk</h5>
							</div>
						</div>
						<div className="next__step">
							<div onClick={() => this.setState({
								stepRule: 18,
								step: process.env.stepEighteen,
								data: [...data, {
									foods: activeFoodsIndexs
								}]
							})} 
							className={ activeFoodsIndexs.length > 0 ? 'button btn-step' : 'button btn-step disabled' }>Continue</div>
						</div>
					</div>
				</div>
			)
		}
		else if ( step === process.env.stepEighteen ) {
			return (
				<div className="w-100 step__ d-inline-block">
					<h1 className="h2 font-weight-bold text-center">Meat and fish</h1>
					<h3 className="h5 text-center">
						Please choose the meat you like <br/> Being part of the diet
					</h3>
					<div className="mt-5 text-center mb-3 page_collect__prog habits_container">
						<div onClick={() => {
							let i = activeMeatIndexs.indexOf('fish')
							this.setState({ 
								activeMeatIndexs: ( i > -1 ? activeMeatIndexs.splice(i, 1) : [...activeMeatIndexs, 'fish'] ) 
							})
						}}
						style={{ minHeight: '140px' }}
						className={ activeMeatIndexs.includes('fish') ? 'active col-cat__b habits_category__ col-6 mb-3' : 'col-cat__b habits_category__ col-6 mb-3' }>
							<div className="cat_details text-center w-100 mt-0 p-0">
								<div style={{
									backgroundImage: 'url(./static/imgs/thumbs/vegitarian-img-18.png)',
									backgroundSize: 'contain',
									height: '50px'
								}} className="cat_thumbnail"></div>
								<h5 className="mb-0">Fish</h5>
							</div>
						</div>
						<div onClick={() => {
							let i = activeMeatIndexs.indexOf('turkey_meat')
							this.setState({ 
								activeMeatIndexs: ( i > -1 ? activeMeatIndexs.splice(i, 1) : [...activeMeatIndexs, 'turkey_meat'] ) 
							})
						}}
						style={{ minHeight: '140px' }}
						className={ activeMeatIndexs.includes('turkey_meat') ? 'active col-cat__b habits_category__ col-6 mb-3' : 'col-cat__b habits_category__ col-6 mb-3' }>
							<div className="cat_details text-center w-100 mt-0 p-0">
								<div style={{
									backgroundImage: 'url(./static/imgs/thumbs/vegitarian-img-19.png)',
									backgroundSize: 'contain',
									height: '50px'
								}} className="cat_thumbnail"></div>
								<h5 className="mb-0">Turkey meat</h5>
							</div>
						</div>
						<div onClick={() => {
							let i = activeMeatIndexs.indexOf('chicken')
							this.setState({ 
								activeMeatIndexs: ( i > -1 ? activeMeatIndexs.splice(i, 1) : [...activeMeatIndexs, 'chicken'] ) 
							})
						}}
						style={{ minHeight: '140px' }}
						className={ activeMeatIndexs.includes('chicken') ? 'active col-cat__b habits_category__ col-6 mb-3' : 'col-cat__b habits_category__ col-6 mb-3' }>
							<div className="cat_details text-center w-100 mt-0 p-0">
								<div style={{
									backgroundImage: 'url(./static/imgs/thumbs/vegitarian-img-20.png)',
									backgroundSize: 'contain',
									height: '50px'
								}} className="cat_thumbnail"></div>
								<h5 className="mb-0">Chicken</h5>
							</div>
						</div>
						<br />
						<div onClick={() => {
							let i = activeMeatIndexs.indexOf('cattle_meat')
							this.setState({ 
								activeMeatIndexs: ( i > -1 ? activeMeatIndexs.splice(i, 1) : [...activeMeatIndexs, 'cattle_meat'] ) 
							})
						}}
						style={{ minHeight: '140px' }}
						className={ activeMeatIndexs.includes('cattle_meat') ? 'active col-cat__b habits_category__ col-6 mb-3' : 'col-cat__b habits_category__ col-6 mb-3' }>
							<div className="cat_details text-center w-100 mt-0 p-0">
								<div style={{
									backgroundImage: 'url(./static/imgs/thumbs/vegitarian-img-21.png)',
									backgroundSize: 'contain',
									height: '50px'
								}} className="cat_thumbnail"></div>
								<h5 className="mb-0">Cattle meat</h5>
							</div>
						</div>
						<div onClick={() => {
							let i = activeMeatIndexs.indexOf('pork')
							this.setState({ 
								activeMeatIndexs: ( i > -1 ? activeMeatIndexs.splice(i, 1) : [...activeMeatIndexs, 'pork'] ) 
							})
						}}
						style={{ minHeight: '140px' }}
						className={ activeMeatIndexs.includes('pork') ? 'active col-cat__b habits_category__ col-6 mb-3' : 'col-cat__b habits_category__ col-6 mb-3' }>
							<div className="cat_details text-center w-100 mt-0 p-0">
								<div style={{
									backgroundImage: 'url(./static/imgs/thumbs/vegitarian-img-22.png)',
									backgroundSize: 'contain',
									height: '50px'
								}} className="cat_thumbnail"></div>
								<h5 className="mb-0">Pork</h5>
							</div>
						</div>
						<div onClick={() => this.setState({ activeMeatIndexs: [] })} 
						style={{ minHeight: '140px' }}
						className={ activeMeatIndexs.length <= 0 ? 'active col-cat__b habits_category__ col-6 mb-3' : 'col-cat__b habits_category__ col-6 mb-3' }>
							<div className="cat_details text-center w-100 mt-0 p-0">
								<svg style={{ marginBottom: '1em' }} xmlns="http://www.w3.org/2000/svg" width="60" height="50" viewBox="0 0 24 24"><path fill="red" d="M23.954 21.03l-9.184-9.095 9.092-9.174-2.832-2.807-9.09 9.179-9.176-9.088-2.81 2.81 9.186 9.105-9.095 9.184 2.81 2.81 9.112-9.192 9.18 9.1z"/></svg>
								<h5>None of the above</h5>
							</div>
						</div>
						<div className="next__step">
							<div onClick={() => this.setState({
								stepRule: 19,
								step: process.env.stepNineteen,
								data: [...data, {
									meat: activeMeatIndexs
								}]
							})} 
							className={ activeMeatIndexs.length > 0 ? 'button btn-step' : 'button btn-step' }>Continue</div>
						</div>
					</div>
				</div>
			)
		}
		else if ( step === process.env.stepNineteen ) {
			return (
				<div className="w-100 step__ d-inline-block">
					<h1 className="h2 font-weight-bold text-center">Time to prepare food</h1>
					<h3 className="h5 text-center">
						Oh! Almost forgotten. Tell us / tell us how long you can dedicate to preparing food each day
					</h3>
					<div className="mt-4 d-inline-block w-100 categories__list">
						<div onClick={() => this.checkQuestion(1, process.env.stepTwenty, 'less_than_tth_minutes', 'prepare_food_duration')} 
						className={ activeQ8Index === 1 ? 'active col-cat__b col-12 w-100 mb-3' : 'col-cat__b col-12 w-100 mb-3' }>
							<h4>Less than 30 minutes</h4>
						</div>
						<div onClick={() => this.checkQuestion(2, process.env.stepTwenty, 'from_tth_to_sth_minutes', 'prepare_food_duration')} 
						className={ activeQ8Index === 2 ? 'active col-cat__b col-12 w-100 mb-3' : 'col-cat__b col-12 w-100 mb-3' }>
							<h4>30 to 60 minutes</h4>
						</div>
						<div onClick={() => this.checkQuestion(3, process.env.stepTwenty, 'more_than_hour', 'prepare_food_duration')} 
						className={ activeQ8Index === 3 ? 'active col-cat__b col-12 w-100 mb-3' : 'col-cat__b col-12 w-100 mb-3' }>
							<h4>More than an hour</h4>
						</div>
					</div>
				</div>
			)
		}
		else if ( step === process.env.stepTwenty ) {
			if ( timeleft < 100 ) {
				setInterval(() => {
					let x = min + Math.random() * (max - min)
					let y = p + x
					if ( p == timeleft ) {
						this.setState({
							timeleft: (y > 100 ? 100 : y)
						}, () => {
							p = (y > 100 ? 100 : y)
						})
					}
				}, 1000);
			}
			else {
				clearInterval(p)
				clearInterval(timeleft)
				const res = calculator(data)
				this.setState({
					result: res,
					step: process.env.stepTwentyOne
				})
			}
			return (
				<div className="w-100 step__ d-inline-block">
					<div className="loading_spiner">
						<Countdown progress={parseFloat(timeleft).toFixed(0)} />
					</div>
					<h1 className="h4 font-weight-bold text-center">Creating data ...</h1>
				</div>
			)
		}
		else if ( step === process.env.stepTwentyOne ) {
			return (
				<div className="w-100 step__ d-inline-block">
					<div className="full_max_width p-4">
						<div className="text-center">
							Get systems specially designed for you such as: Fitness Improvement System in a jiffy, and we'll make sure to send them to your email immediately!
						</div>
						<div className="user_email mt-3">
							<input onChange={(fullname) => this.setState({
								fullname: fullname.target.value
							})} 
							type="fullname" placeholder={t('please-enter-your-name')} />
						</div>
						<div className="user_email mt-3">
							<input onChange={(email) => this.checkEmail(email.target.value)} 
							type="email" placeholder={t('please-enter-your-email-address')} />
						</div>
						{ userEmailError && <div className="error">{ userEmailError }</div> }
						<div className="h5 mt-3 text-center">
							Please be aware that we do not in any way publish any of your personal information, we only send
							<br /> Systems to your email so you can access them at any time
						</div>
						{!dataSent &&
						<div className="next__step">
							<div onClick={() => {
								( !userEmailError && this.storeIntoDatabase() )
							}} 
							className={ !userEmailError ? 'button btn-step' : 'button btn-step disabled' }>Continue</div>
						</div> }
					</div>
				</div>
			)
		}
	}

	render () {
		const { t } = this.props 
		const { stepRule } = this.state 
		return (
			<React.Fragment>
				<Layout withBackLink={true} title="The best exercises and diets vegetarian, keto or intermittent fasting strategies.">
					<div className="w-100 d-inline-block">
						{ this.getStepPage() }
					</div>
					{ stepRule < 20 && <Footer step={stepRule} /> }
				</Layout>
			</React.Fragment>
		)
	}

}

export default StartPage
// export default withTranslation('common')(StartPage)