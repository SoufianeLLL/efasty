import React from 'react'
import Head from 'next/head'
// import { withTranslation } from '../i18n'
import Layout from '../components/Layout'
import firebase from '../server/firebase'

const db = firebase.firestore()
const pr = ['6.5', '25', '40', '40']
const sz = ['1.27', '1.56', '1.76', '1.79']


const getAge = (age) => {
	let a = age
	if ( a >= 18 && a <= 29 ) {
		a = '18-29'
	}
	else if ( a >= 30 && a <= 39 ) {
		a = '30-39'
	}
	else if ( a >= 40 && a <= 49 ) {
		a = '40-49'
	}
	else if ( a >= 50 ) {
		a = '+50'
	}
	return a
}

const getWeightNeeded = (current_weight, goal_weight, t) => {
	let pr, output,
		w = current_weight,
		g = goal_weight
		w = w.replace(/ /g, '')
		g = g.replace(/ /g, '')
	if ( w.includes('Pound') ) {
		pr = 'Pound'
		w = w.replace(/Pound/g, '')
		w = w / 2.2046
		//
		g = g.replace(/Pound/g, '')
		g = g.split('-')
		g = g / 2.2046
	}
	else {
		pr = 'Kg'
		w = w.replace(/Kg/g, '')
		g = g.replace(/Kg/g, '')
		g = g.split('-')
	}

	w = parseFloat(w).toFixed(0)
	let min = g[0]
	let max = g[1]

	if ( w <= max && w >= min ) {
		output = `<span className='green__'>${t}</span>`
	}
	else if ( w > max ) {
		output = `<span className='red__'>- ${w - max} ${pr}</span>`
	}
	else if ( w < min ) {
		output = `<span className='red__'>+ ${min - w} ${pr}</span>`
	}

	return output
}


class Result extends React.Component {

	render () {
		const { t, data, email, fullname, ID } = this.props
		return (
			<React.Fragment>
				<Head>
					<link href="//unpkg.com/material-components-web@latest/dist/material-components-web.min.css" rel="stylesheet" />
				</Head>
				<Layout title="The best exercises and diets vegetarian, keto or intermittent fasting strategies.">
					<div className="w-100 d-inline-block">
						<h1 className="text-center">Your diet information:</h1>
						<div className="text-center ID__">
							{ID}
							<span></span><span></span><span></span><span></span>
						</div>
						<div className="font-inherit row mt-5 mx-0">
							<div className="col-md-3 col-sm-4 col-xs-12 pr-0">
								<div className="explanation__ ml-4">
									<div className="form-group mb-5">
										<span className="w-100 font-weight-bold mb-2 d-inline-block">
											Details:
										</span>
										<span className="w-100 mb-2 d-inline-block">
											Name: <b>{fullname}</b>
										</span>
										<span className="w-100 mb-4 d-inline-block">
											Email: <b>{email}</b>
										</span>
									</div>
									<div className="form-group mb-4">
										<span className="float-right nmb-exp">1</span>
										<span className="nmb-exp bg-green ml-2 float-right">5</span>: 
										BMI - <b>Body Mass Index</b> is the best international standard for anthropometric measurements, to distinguish excess weight from obesity from thinness from the ideal weight, and through it the fat percentage can be calculated. As shown in Figure 5.
									</div>
									<div className="form-group mb-4">
										<span className="float-right nmb-exp">2</span>
										<span className="nmb-exp bg-green ml-2 float-right">6</span>: 
										<b>The percentage of body fat</b> through which the level of fat is determined in your body, even an athlete has a fat percentage of not less than 6%. As shown in Figure 6.
									</div>
									<div className="form-group mb-4">
										<span className="float-right ml-2 nmb-exp">3</span>: 
										Net weight, is the weight of the body (muscle and bone mass) without the weight of body fat.
									</div>
									<div className="form-group mb-4">
										<span className="float-right ml-2 nmb-exp">4</span>: 
										Calories are what energy contains in food, such as carbohydrates or protein ... They are calculated according to your daily activity. Below are the foods and the corresponding number of calories.
									</div>
									<div className="form-group mb-4">
										<span className="float-right ml-2 nmb-exp bg-green">7</span>: 
										The excess or required weight is calculated based on your ideal body weight and compared with the current height and weight.
									</div>
									<div className="form-group mb-4">
										<span className="float-right ml-2 nmb-exp bg-green">8</span>: 
										An illustrative table of the calorie rate of foods to make it easier for you to choose your diet.
									</div>
								</div>
							</div>
							<div className="col-md-9 col-sm-8 col-xs-12">
								<div className="row background__white mb-5">
									<div className="col-md-4 col-sm-6 col-xs-12">
										<div className="res_box">
											<span className="h4">
												{ data.category == 'weight_loss' 
													? "Weight loss" 
													: ( data.category == 'muscle_building' 
														? "Muscle Building"
														: "The best healthy eating habits" 
													) 
												}
											</span>
											<span>Diet type</span>
										</div>
									</div>
									<div className="col-md-4 col-sm-6 col-xs-12">
										<div className="res_box">
											<span className="h4 direction-ltr">{data.current_weight}</span>
											<span>Current weight</span>
										</div>
									</div>
									<div className="col-md-4 col-sm-6 col-xs-12">
										<div className="res_box">
											<span className="h4 direction-ltr">{data.height}</span>
											<span>Height</span>
										</div>
									</div>
									<div className="col-md-4 col-sm-6 col-xs-12">
										<div className="res_box">
											<span className="h4">{getAge(data.age)}</span>
											<span>Age</span>
										</div>
									</div>
									<div className="col-md-4 col-sm-6 col-xs-12">
										<div className="_box__red res_box">
											<span className="h4">{parseFloat(data.BMI).toFixed(4)}</span>
											<span>BMI - body mass index</span>
											<span className="nmb-exp">1</span>
										</div>
									</div>
									<div className="col-md-4 col-sm-6 col-xs-12">
										<div className="_box__red res_box">
											<span className="h4">{data.bodyFat}%</span>
											<span>Fat percent</span>
											<span className="nmb-exp">2</span>
										</div>
									</div>
									<div className="col-md-4 col-sm-6 col-xs-12">
										<div className="_box__red res_box">
											<span className="h4 direction-ltr">{data.leanBodyMass}</span>
											<span>Net weight</span>
											<span className="nmb-exp">3</span>
										</div>
									</div>
									<div className="col-md-4 col-sm-6 col-xs-12">
										<div className="_box__red res_box">
											<span className="h4">{data.current_calories}</span>
											<span>Calories/Daily</span>
											<span className="nmb-exp">4</span>
										</div>
									</div>
									<div className="col-md-4 col-sm-6 col-xs-12">
										<div className="res_box">
											<span className="h4">
												{data.current_body_type == 'endomorph' ? 'Endomorph'
													: (data.current_body_type == 'mesomorph' ? 'Mesomorph' 
														: 'Ectomorph'
													)
												}
											</span>
											<span>Body type</span>
										</div>
									</div>
									<div className="col-12">
										<hr className="my-4" />
										<div className="BMI_container res_box">
											<div className="w-100 d-inline-block">
												<span className="nmb-exp bg-green float-right">5</span> 
												<h2 className="h5 font-weight-bold float-right">
													BMI - body mass index
													<b className="green__ mr-2">
														{( data.BMI <= 18.5 ? 'Very thin' 
															: ( data.BMI <= 25 ? 'Normal' 
																: ( data.BMI <= 30 ? 'Overweight' : 'Fat')
															)
														)}
													</b>
												</h2>
											</div>
											<div className="row m-0 pt-4 position-relative direction-ltr">
												<div className={`${data.BMI <= 18.5 ? 'active ' : ''}col-md-3 col-sm-3 col-xs-3 col-bmi_ mt-4 pt-1 pb-1 position-relative`}>
													<div className="position-absolute col-bmi__title w-100 text-center">
															<img className="img_thumb__weight" src={`/static/imgs/thumbs/${
																data.gender == 'male' ? 'basic-male-img-1' : 'body-type-female-img-3'
															}.png`} height="100" />
														Very thin
													</div>
												</div>
												<div className={`${(data.BMI <= 25 && data.BMI > 18.5) ? 'active ' : ''}col-md-3 col-sm-3 col-xs-3 col-bmi_ mt-4 pt-1 pb-1 position-relative`}>
													<div className="position-absolute col-bmi__title w-100 text-center">
															<img className="img_thumb__weight" src={`/static/imgs/thumbs/${
																data.gender == 'male' ? 'basic-male-img-2' : 'body-type-female-img-3'
															}.png`} height="100" />
														Normal
													</div>
												</div>
												<div className={`${(data.BMI <= 30 && data.BMI > 25) ? 'active ' : ''}col-md-3 col-sm-3 col-xs-3 col-bmi_ mt-4 pt-1 pb-1 position-relative`}>
													<div className="position-absolute col-bmi__title w-100 text-center">
															<img className="img_thumb__weight" src={`/static/imgs/thumbs/${
																data.gender == 'male' ? 'body-type-male-img-1' : 'body-type-female-img-2'
															}.png`} height="100" />
														Overweight
													</div>
												</div>
												<div className={`${data.BMI > 30 ? 'active ' : ''}col-md-3 col-sm-3 col-xs-3 col-bmi_ mt-4 pt-1 pb-1 position-relative`}>
													<div className="position-absolute col-bmi__title w-100 text-center">
															<img className="img_thumb__weight" src={`/static/imgs/thumbs/${
																data.gender == 'male' ? 'body-type-male-img-2' : 'body-type-female-img-1'
															}.png`} height="100" />
														Fat
													</div>
												</div>
												<div className="cursor_selector position-absolute" style={{
													left: `${( data.BMI <= 18.5 ? (data.BMI + pr[0]) * sz[0] 
																: ( data.BMI <= 25 ? (data.BMI + pr[1]) * sz[1] 
																	: ( data.BMI <= 30 ? (data.BMI + pr[2]) * sz[2] 
																		: (data.BMI + pr[3]) * sz[3])
																)
															)}%`
												}}></div>
											</div>
										</div>
										<hr className="my-4" />
										<div className="BFP_container res_box position-relative mb-0">
											<div className="w-100 d-inline-block">
												<span className="nmb-exp bg-green float-right">6</span> 
												<h2 className="h5 font-weight-bold float-right">
													The type of fat in your body:
													<b className="green__ mr-2">{data.bodyFat}%</b>
												</h2>
												<div className="row w-100">
													<div className="col-md-5 col-sm-5 col-xs-12 pr-5">
														<img style={{
															width: '100%',
															padding: '2em'
														}}
														src={`/static/imgs/thumbs/goal-weight-${data.gender}-img.png`} />
													</div>
													<div className="col-md-7 col-sm-7 col-xs-12">
														<div className="mdc-data-table mt-4 w-100 direction-rtl">
															<div className="mdc-data-table__table-container">
																<table className="mdc-data-table__table" aria-label="Dessert calories">
																<thead>
																	<tr className="mdc-data-table__header-row">
																		<th className="text-right mdc-data-table__header-cell h5" role="columnheader" scope="col">Body type</th>
																		<th className="text-right mdc-data-table__header-cell h5 mdc-data-table__header-cell--numeric" role="columnheader" scope="col">Men %</th>
																		<th className="text-right mdc-data-table__header-cell h5 mdc-data-table__header-cell--numeric" role="columnheader" scope="col">Women %</th>
																	</tr>
																</thead>
																<tbody className="mdc-data-table__content">
																	<tr className={`mdc-data-table__row ${(
																		(data.bodyFat >= 2 && data.bodyFat <= 4 && data.gender == 'male') || 
																		(data.bodyFat >= 10 && data.bodyFat <= 12 && data.gender == 'female') 
																	? 'active' : '')}`}>
																		<th className="text-right mdc-data-table__cell h6 font-weight-bold" scope="row">Essential fats</th>
																		<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">2-4%</td>
																		<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">10-12%</td>
																	</tr>
																	<tr className={`mdc-data-table__row ${(
																		(data.bodyFat >= 6 && data.bodyFat <= 13 && data.gender == 'male') || 
																		(data.bodyFat >= 14 && data.bodyFat <= 20 && data.gender == 'female') 
																	? 'active' : '')}`}>
																		<th className="text-right mdc-data-table__cell h6 font-weight-bold" scope="row">Athlete</th>
																		<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">6-13%</td>
																		<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">14-20%</td>
																	</tr>
																	<tr className={`mdc-data-table__row ${(
																		(data.bodyFat >= 14 && data.bodyFat <= 17 && data.gender == 'male') || 
																		(data.bodyFat >= 21 && data.bodyFat <= 24 && data.gender == 'female') 
																	? 'active' : '')}`}>
																		<th className="text-right mdc-data-table__cell h6 font-weight-bold" scope="row">He is fit</th>
																		<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">14-17%</td>
																		<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">21-24%</td>
																	</tr>
																	<tr className={`mdc-data-table__row ${(
																		(data.bodyFat >= 18 && data.bodyFat <= 25 && data.gender == 'male') || 
																		(data.bodyFat >= 25 && data.bodyFat <= 31 && data.gender == 'female') 
																	? 'active' : '')}`}>
																		<th className="text-right mdc-data-table__cell h6 font-weight-bold" scope="row">Acceptable</th>
																		<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">18-25%</td>
																		<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">25-31%</td>
																	</tr>
																	<tr className={`mdc-data-table__row ${(
																		(data.bodyFat >= 31 && data.gender == 'male') || 
																		(data.bodyFat >= 25 && data.gender == 'female') 
																	? 'active' : '')}`}>
																		<th className="text-right mdc-data-table__cell h6 font-weight-bold" scope="row">Fat</th>
																		<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6 direction-ltr">+31%</td>
																		<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6 direction-ltr">+25%</td>
																	</tr>
																</tbody>
																</table>
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
									<hr className="mb-4" />
									<div className="col-md-6 col-sm-6 col-xs-12">
										<div className="res_box">
											<span className="h4 direction-ltr">{data.goal_weight}</span>
											<span>The ideal weight for your body</span>
										</div>
									</div>
									<div className="col-md-6 col-sm-6 col-xs-12">
										<div className="_box__green res_box">
											<span className="nmb-exp bg-green">7</span>
											<span className="h4 direction-ltr" 
											dangerouslySetInnerHTML={{__html: getWeightNeeded(data.current_weight, data.goal_weight, 'You have perfect weight') }}></span>
											<span>Excess weight / required</span>
										</div>
									</div>
									<hr className="mb-4"></hr>
									<div className="col-12">
										<div className="BFP_container res_box position-relative mb-0">
											<div className="w-100 d-inline-block">
												<h2 className="h5 font-weight-bold float-right">
													Fat Burning Diet Based on:
													<b className="green__ mr-2">
														{data.fitness_routine == 'no_exertion' ? 'I am not a fan of action at all' 
															: data.fitness_routine == 'exercises_one_two_weekly' ? 'Exercise one to two times a week' 
																: data.fitness_routine == 'exercises_tree_five_weekly' ? 'Exercise 3 to 5 times a week' 
																	: data.fitness_routine == 'exercises_five_seven_weekly' ? 'Exercise 5 to 7 times a week' 
																		: 'Very active' 
														}
													</b>
												</h2>
												<h2 className="h5 font-weight-bold float-right">
													Diet type: 
													<b className="green__ mr-2">
														{ data.category == 'weight_loss' ? 'Weight loss' 
															: data.category == 'muscle_building' ? 'Muscle Building' 
																: 'The best healthy eating habits'
														}
													</b>
												</h2>
												{data.goal_calories &&
												<div className="w-100 d-inline-block mt-4">
													<div className="calories__calc_col w-100 d-inline-block col-md-4">
														<div className="float-right ml-3 cal__title pt-4">
															Stay healthy
														</div>
														<div className="float-right green__section__">
															<div className="w-100 d-inline-block cal__calories_percent">
																{data.current_calories}
																<span>100%</span>
															</div>
															<div className="w-100 d-inline-block h6 font-weight-bold">Calories/Daily</div>
														</div>
													</div>
													<div className="calories__calc_col w-100 d-inline-block col-md-4">
														<div className="float-right ml-3 cal__title pt-3">
															{ data.category == 'weight_loss' ? 'Light weight loss' 
																: 'Light weight gain'
															}
															<span>
																{((data.current_weight).includes('Pound') 
																	? `${parseFloat(0.25 * 2.20462262).toFixed(0)} Pound`
																	: '0.25 Kg'
																)} /Weekly
															</span>
														</div>
														<div className="float-right green__section__">
															<div className="w-100 d-inline-block cal__calories_percent">
																{parseFloat(((data.current_calories * (data.goal_calories[0].percent[0][1]).replace(/%/g, "")) / 100)).toFixed(0)}
																<span>{data.goal_calories[0].percent[0][1]}</span>
															</div>
															<div className="w-100 d-inline-block h6 font-weight-bold">Calories/Daily</div>
														</div>
													</div>
													<div className="calories__calc_col w-100 d-inline-block col-md-4">
														<div className="float-right ml-3 cal__title pt-3">
															{ data.category == 'weight_loss' ? 'Weight loss' 
																: 'Increase in weight'
															}
															<span>
																{((data.current_weight).includes('Pound') 
																	? `${parseFloat(0.5 * 2.20462262).toFixed(0)} Pound`
																	: '0.5 Kg'
																)} /Weekly
															</span>
														</div>
														<div className="float-right green__section__">
															<div className="w-100 d-inline-block cal__calories_percent">
																{parseFloat(((data.current_calories * (data.goal_calories[0].percent[0][2]).replace(/%/g, "")) / 100)).toFixed(0)}
																<span>{data.goal_calories[0].percent[0][2]}</span>
															</div>
															<div className="w-100 d-inline-block h6 font-weight-bold">Calories/Daily</div>
														</div>
													</div>
													<div className="calories__calc_col w-100 d-inline-block col-md-4">
														<div className="float-right ml-3 cal__title pt-3">
															{ data.category == 'weight_loss' ? 'Severe weight loss' 
																: 'Quick weight gain'
															}
															<span>
																{((data.current_weight).includes('Pound') 
																	? `${parseFloat(1 * 2.20462262).toFixed(0)} Pound`
																	: '1 Kg'
																)} /Weekly
															</span>
														</div>
														<div className="float-right green__section__">
															<div className="w-100 d-inline-block cal__calories_percent">
																{parseFloat(((data.current_calories * (data.goal_calories[0].percent[0][3]).replace(/%/g, "")) / 100)).toFixed(0)}
																<span>{data.goal_calories[0].percent[0][3]}</span>
															</div>
															<div className="w-100 d-inline-block h6 font-weight-bold">Calories/Daily</div>
														</div>
													</div>
												</div> }
											</div>
										</div>
									</div>
									<hr className="my-4" />
									<div className="col-md-12 col-sm-12 col-xs-12">
										<div className="BFP_container res_box mb-0">
											<span className="nmb-exp bg-green float-right">8</span> 
											<h2 className="h5 font-weight-bold float-right">Calorie rate of foods</h2>
											<div className="food_table__calories mb-4 w-100 d-inline-block">
												<h4 className="h5 font-weight-bold mb-0 mt-3">Meat</h4>
												<div className="mdc-data-table mt-2 w-100">
													<div className="mdc-data-table__table-container">
														<table className="mdc-data-table__table">
															<thead>
																<tr className="mdc-data-table__header-row">
																	<th className="text-right mdc-data-table__header-cell h5" role="columnheader" scope="col"></th>
																	<th className="text-right mdc-data-table__header-cell h5 mdc-data-table__header-cell--numeric" role="columnheader" scope="col">Size (g)</th>
																	<th className="text-right mdc-data-table__header-cell h5 mdc-data-table__header-cell--numeric" role="columnheader" scope="col">Calories</th>
																	<th className="text-right mdc-data-table__header-cell h5 mdc-data-table__header-cell--numeric" role="columnheader" scope="col">Proteins (g)</th>
																	<th className="text-right mdc-data-table__header-cell h5 mdc-data-table__header-cell--numeric" role="columnheader" scope="col">Fat (g)</th>
																</tr>
															</thead>
															<tbody className="mdc-data-table__content">
																<tr className={`mdc-data-table__row ${(data.meat.includes('cattle_meat') ? 'active' : '')}`}>
																	<th className="text-right mdc-data-table__cell h6 font-weight-bold" scope="row">Beef</th>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">100</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">176-313</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">25-29</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">1-21</td>
																</tr>
																<tr className={`mdc-data-table__row ${(data.meat.includes('chicken') ? 'active' : '')}`}>
																	<th className="text-right mdc-data-table__cell h6 font-weight-bold" scope="row">Chicken</th>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">100</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">151-223</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">23-28</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">3-13</td>
																</tr>
																<tr className={`mdc-data-table__row ${(data.meat.includes('turkey_meat') ? 'active' : '')}`}>
																	<th className="text-right mdc-data-table__cell h6 font-weight-bold" scope="row">Turkey meat</th>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">100</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">187-208</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">28</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">2</td>
																</tr>
																<tr className={`mdc-data-table__row ${(data.meat.includes('fish') ? 'active' : '')}`}>
																	<th className="text-right mdc-data-table__cell h6 font-weight-bold" scope="row">Anchovy fish</th>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">100</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">210</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">28</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">9</td>
																</tr>
																<tr className={`mdc-data-table__row ${(data.meat.includes('fish') ? 'active' : '')}`}>
																	<th className="text-right mdc-data-table__cell h6 font-weight-bold" scope="row">Salmon</th>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">100</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">
																		206 (Farmer, Atlantic) <br/>
																		333 (Pink, canned, drained, with bone)
																	</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">22 <br/> 12</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">23 <br/> 4</td>
																</tr>
																<tr className={`mdc-data-table__row ${(data.meat.includes('fish') ? 'active' : '')}`}>
																	<th className="text-right mdc-data-table__cell h6 font-weight-bold" scope="row">Tuna fish</th>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">100</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">187</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">16</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">9</td>
																</tr>
																<tr className={`mdc-data-table__row ${(data.meat.includes('fish') ? 'active' : '')}`}>
																	<th className="text-right mdc-data-table__cell h6 font-weight-bold" scope="row">Whitefish</th>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">100</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">172</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">24</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">7</td>
																</tr>
																<tr className={`mdc-data-table__row ${(data.meat.includes('cattle_meat') ? 'active' : '')}`}>
																	<th className="text-right mdc-data-table__cell h6 font-weight-bold" scope="row">Sheep meat</th>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">100</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">188-246</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">25</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">7-15</td>
																</tr>
																<tr className={`mdc-data-table__row ${(data.meat.includes('pork') ? 'active' : '')}`}>
																	<th className="text-right mdc-data-table__cell h6 font-weight-bold" scope="row">Pork</th>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">100</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">
																		541 (Salted, bacon, grilled, fried or roasted) <br/>
																		225-252 
																	</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">37 <br/> 41</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">28 <br/> 14</td>
																</tr>
															</tbody>
														</table>
													</div>
												</div>
											</div>
											<div className="food_table__calories mb-4 w-100 d-inline-block">
												<h4 className="h5 font-weight-bold mb-0 mt-3">Food products</h4>
												<div className="mdc-data-table mt-2 w-100">
													<div className="mdc-data-table__table-container">
														<table className="mdc-data-table__table">
															<thead>
																<tr className="mdc-data-table__header-row">
																	<th className="text-right mdc-data-table__header-cell h5" role="columnheader" scope="col"></th>
																	<th className="text-right mdc-data-table__header-cell h5 mdc-data-table__header-cell--numeric" role="columnheader" scope="col">The demand</th>
																	<th className="text-right mdc-data-table__header-cell h5 mdc-data-table__header-cell--numeric" role="columnheader" scope="col">Calories</th>
																	<th className="text-right mdc-data-table__header-cell h5 mdc-data-table__header-cell--numeric" role="columnheader" scope="col">Proteins (g)</th>
																	<th className="text-right mdc-data-table__header-cell h5 mdc-data-table__header-cell--numeric" role="columnheader" scope="col">Fat (g)</th>
																</tr>
															</thead>
															<tbody className="mdc-data-table__content">
																<tr className={`mdc-data-table__row ${(data.foods.includes('apple') ? 'active' : '')}`}>
																	<th className="text-right mdc-data-table__cell h6 font-weight-bold" scope="row">Apple</th>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">100g = 1 small</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">52</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">0.3</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">0.2</td>
																</tr>
																<tr className={`mdc-data-table__row ${(data.foods.includes('apricot') ? 'active' : '')}`}>
																	<th className="text-right mdc-data-table__cell h6 font-weight-bold" scope="row">Apricot</th>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">100g = 3 apricots</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">48</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">1</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">0.4</td>
																</tr>
																<tr className={`mdc-data-table__row ${(data.foods.includes('avocado') ? 'active' : '')}`}>
																	<th className="text-right mdc-data-table__cell h6 font-weight-bold" scope="row">Avocado</th>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">100g</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">160</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">2</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">14.7</td>
																</tr>
																<tr className={`mdc-data-table__row ${(data.foods.includes('banana') ? 'active' : '')}`}>
																	<th className="text-right mdc-data-table__cell h6 font-weight-bold" scope="row">Banana</th>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">1 pill size</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">94</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">1.1</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">0.3</td>
																</tr>
																<tr className={`mdc-data-table__row ${(data.foods.includes('blueberries') ? 'active' : '')}`}>
																	<th className="text-right mdc-data-table__cell h6 font-weight-bold" scope="row">Blueberries</th>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">1 cup</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">81</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">1.7</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">0.6</td>
																</tr>
																<tr className={`mdc-data-table__row ${(data.foods.includes('grapes') ? 'active' : '')}`}>
																	<th className="text-right mdc-data-table__cell h6 font-weight-bold" scope="row">Grapes</th>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">1 cup</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">114</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">1</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">1</td>
																</tr>
																<tr className={`mdc-data-table__row ${(data.foods.includes('oranges') ? 'active' : '')}`}>
																	<th className="text-right mdc-data-table__cell h6 font-weight-bold" scope="row">Oranges</th>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">1 large</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">86</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">1.7</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">0.2</td>
																</tr>
																<tr className={`mdc-data-table__row ${(data.foods.includes('peaches') ? 'active' : '')}`}>
																	<th className="text-right mdc-data-table__cell h6 font-weight-bold" scope="row">Peaches</th>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">1 middle</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">42</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">0.7</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">0</td>
																</tr>
																<tr className={`mdc-data-table__row ${(data.foods.includes('eggs') ? 'active' : '')}`}>
																	<th className="text-right mdc-data-table__cell h6 font-weight-bold" scope="row">Eggs</th>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">1 large egg</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">78</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">6.3</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">5.3</td>
																</tr>
																<tr className={`mdc-data-table__row ${(data.foods.includes('eggs') ? 'active' : '')}`}>
																	<th className="text-right mdc-data-table__cell h6 font-weight-bold" scope="row">White egg</th>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">1 cup</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">122</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">25.5</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">0</td>
																</tr>
																<tr className={`mdc-data-table__row ${(data.foods.includes('eggs') ? 'active' : '')}`}>
																	<th className="text-right mdc-data-table__cell h6 font-weight-bold" scope="row">Scrambled eggs</th>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">2 large eggs</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">180</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">19</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">11</td>
																</tr>
																<tr className={`mdc-data-table__row ${(data.foods.includes('milk') ? 'active' : '')}`}>
																	<th className="text-right mdc-data-table__cell h6 font-weight-bold" scope="row">Milk</th>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">1 cup</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">83-146</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">8</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">0-8</td>
																</tr>
																<tr className={`mdc-data-table__row ${(data.foods.includes('cottage_cheese') ? 'active' : '')}`}>
																	<th className="text-right mdc-data-table__cell h6 font-weight-bold" scope="row">Cottage cheese</th>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">1 cup</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">163-203</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">28-31</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">4</td>
																</tr>
																<tr className={`mdc-data-table__row ${(data.foods.includes('yogurt') ? 'active' : '')}`}>
																	<th className="text-right mdc-data-table__cell h6 font-weight-bold" scope="row">Yogurt</th>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">100g/1 cup</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">43-250</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">0-8</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">0-2</td>
																</tr>
																<tr className={`mdc-data-table__row ${(data.foods.includes('olives') ? 'active' : '')}`}>
																	<th className="text-right mdc-data-table__cell h6 font-weight-bold" scope="row">Olives</th>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">100g</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">115–145</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">1.03</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">11-15</td>
																</tr>
																<tr className={`mdc-data-table__row ${(data.foods.includes('brie_cheese') ? 'active' : '')}`}>
																	<th className="text-right mdc-data-table__cell h6 font-weight-bold" scope="row">Brie cheese</th>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">1 ounce 28</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">94</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">6</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">8</td>
																</tr>
															</tbody>
														</table>
													</div>
												</div>
											</div>
											<div className="food_table__calories mb-4 w-100 d-inline-block">
												<h4 className="h5 font-weight-bold mb-0 mt-3">Nuts</h4>
												<div className="mdc-data-table mt-2 w-100">
													<div className="mdc-data-table__table-container">
														<table className="mdc-data-table__table">
															<thead>
																<tr className="mdc-data-table__header-row">
																	<th className="text-right mdc-data-table__header-cell h5" role="columnheader" scope="col"></th>
																	<th className="text-right mdc-data-table__header-cell h5 mdc-data-table__header-cell--numeric" role="columnheader" scope="col">The demand</th>
																	<th className="text-right mdc-data-table__header-cell h5 mdc-data-table__header-cell--numeric" role="columnheader" scope="col">Calories</th>
																	<th className="text-right mdc-data-table__header-cell h5 mdc-data-table__header-cell--numeric" role="columnheader" scope="col">Proteins (g)</th>
																	<th className="text-right mdc-data-table__header-cell h5 mdc-data-table__header-cell--numeric" role="columnheader" scope="col">Fat (g)</th>
																</tr>
															</thead>
															<tbody className="mdc-data-table__content">
																<tr className={`mdc-data-table__row ${(data.foods.includes('peanut_butter') ? 'active' : '')}`}>
																	<th className="text-right mdc-data-table__cell h6 font-weight-bold" scope="row">Peanut Butter</th>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">1/2 cup raw</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">403</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">18.3</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">34.9</td>
																</tr>
																<tr className={`mdc-data-table__row ${(data.foods.includes('nuts') ? 'active' : '')}`}>
																	<th className="text-right mdc-data-table__cell h6 font-weight-bold" scope="row">Almonds</th>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">Not peeled، 1/2 cup</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">410</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">15.1</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">35.9</td>
																</tr>
																<tr className={`mdc-data-table__row ${(data.foods.includes('nuts') ? 'active' : '')}`}>
																	<th className="text-right mdc-data-table__cell h6 font-weight-bold" scope="row">Cashew</th>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">1/2 cup Dry roasted</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">390</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">10.4</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">31.5</td>
																</tr>
																<tr className={`mdc-data-table__row ${(data.foods.includes('nuts') ? 'active' : '')}`}>
																	<th className="text-right mdc-data-table__cell h6 font-weight-bold" scope="row">Coconut meat</th>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">1/2 middle</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">704</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">6.6</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">66.7</td>
																</tr>
																<tr className={`mdc-data-table__row ${(data.foods.includes('nuts') ? 'active' : '')}`}>
																	<th className="text-right mdc-data-table__cell h6 font-weight-bold" scope="row">Pistachio</th>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">1/2 cup</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">317</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">11.7</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">25.3</td>
																</tr>
															</tbody>
														</table>
													</div>
												</div>
											</div>
											<div className="food_table__calories mb-4 w-100 d-inline-block">
												<h4 className="h5 font-weight-bold mb-0 mt-3">Vegetables</h4>
												<div className="mdc-data-table mt-2 w-100">
													<div className="mdc-data-table__table-container">
														<table className="mdc-data-table__table">
															<thead>
																<tr className="mdc-data-table__header-row">
																	<th className="text-right mdc-data-table__header-cell h5" role="columnheader" scope="col"></th>
																	<th className="text-right mdc-data-table__header-cell h5 mdc-data-table__header-cell--numeric" role="columnheader" scope="col">The demand</th>
																	<th className="text-right mdc-data-table__header-cell h5 mdc-data-table__header-cell--numeric" role="columnheader" scope="col">Calories</th>
																	<th className="text-right mdc-data-table__header-cell h5 mdc-data-table__header-cell--numeric" role="columnheader" scope="col">Proteins (g)</th>
																	<th className="text-right mdc-data-table__header-cell h5 mdc-data-table__header-cell--numeric" role="columnheader" scope="col">Fat (g)</th>
																</tr>
															</thead>
															<tbody className="mdc-data-table__content">
																<tr className={`mdc-data-table__row ${(data.vegetables.includes('sweet_potato') ? 'active' : '')}`}>
																	<th className="text-right mdc-data-table__cell h6 font-weight-bold" scope="row">Sweet potato</th>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">1 cup</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">180</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">4</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">0.4</td>
																</tr>
																<tr className={`mdc-data-table__row ${(data.vegetables.includes('broccoli') ? 'active' : '')}`}>
																	<th className="text-right mdc-data-table__cell h6 font-weight-bold" scope="row">Broccoli</th>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">1 cup</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">35</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">2.4</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">0.3</td>
																</tr>
																<tr className={`mdc-data-table__row ${(data.vegetables.includes('tomatoes') ? 'active' : '')}`}>
																	<th className="text-right mdc-data-table__cell h6 font-weight-bold" scope="row">Tomatoes</th>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">1 Tomatoes</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">11</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">0.6</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">0.1</td>
																</tr>
																<tr className={`mdc-data-table__row ${(data.vegetables.includes('mushrooms') ? 'active' : '')}`}>
																	<th className="text-right mdc-data-table__cell h6 font-weight-bold" scope="row">Mushrooms</th>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">1/2 cup</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">20</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">1.4</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">0.4</td>
																</tr>
																<tr className={`mdc-data-table__row ${(data.vegetables.includes('spinach') ? 'active' : '')}`}>
																	<th className="text-right mdc-data-table__cell h6 font-weight-bold" scope="row">Spinach</th>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">1/2 cup</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">20</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">2.6</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">0.3</td>
																</tr>
																<tr className={`mdc-data-table__row ${(data.vegetables.includes('beans') ? 'active' : '')}`}>
																	<th className="text-right mdc-data-table__cell h6 font-weight-bold" scope="row">Beans</th>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">1/2 cup</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">108</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">7.2</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">0.4</td>
																</tr>
																<tr className={`mdc-data-table__row ${(data.vegetables.includes('pepper') ? 'active' : '')}`}>
																	<th className="text-right mdc-data-table__cell h6 font-weight-bold" scope="row">Pepper</th>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">1/2 cup</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">18</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">0.8</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">0.2</td>
																</tr>
																<tr className={`mdc-data-table__row ${(data.vegetables.includes('carrots') ? 'active' : '')}`}>
																	<th className="text-right mdc-data-table__cell h6 font-weight-bold" scope="row">Carrots</th>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">1/2 cup</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">52</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">1.3</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">0.3</td>
																</tr>
																<tr className={`mdc-data-table__row ${(data.vegetables.includes('cabbage') ? 'active' : '')}`}>
																	<th className="text-right mdc-data-table__cell h6 font-weight-bold" scope="row">Cabbage</th>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">1/2 cup</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">41</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">2.1</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">0.1</td>
																</tr>
																<tr className={`mdc-data-table__row ${(data.vegetables.includes('celery') ? 'active' : '')}`}>
																	<th className="text-right mdc-data-table__cell h6 font-weight-bold" scope="row">Celey</th>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">1 cup</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">14</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">0.7</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">0.2</td>
																</tr>
																<tr className={`mdc-data-table__row ${(data.vegetables.includes('corn') ? 'active' : '')}`}>
																	<th className="text-right mdc-data-table__cell h6 font-weight-bold" scope="row">Corn</th>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">1/2 cup</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">80</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">2.6</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">1</td>
																</tr>
																<tr className={`mdc-data-table__row ${(data.vegetables.includes('potatoes') ? 'active' : '')}`}>
																	<th className="text-right mdc-data-table__cell h6 font-weight-bold" scope="row">Potatoes</th>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">1 Potatoes</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">255</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">7</td>
																	<td className="text-right mdc-data-table__cell mdc-data-table__cell--numeric h6">0.4</td>
																</tr>
															</tbody>
														</table>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</Layout>
			</React.Fragment>
		)
	}
}

export async function getServerSideProps ({ res, query }) {
	const ID = (query.order != undefined ? query.order : null)
	if ( !ID ) {
		res.setHeader('location', '/')
		res.statusCode = 302
		res.end()
	}
	let data = null
	try {
		const docRef = db.collection('meal_plans').doc(ID)
        await docRef.get()
		.then((doc) => {
			if ( doc.exists ) {
				data = doc.data()
			}
        })
	}
	catch ( error ) {}

	if ( !data ) {
		res.setHeader('location', '/')
		res.statusCode = 302
		res.end()
	}

	let fullname = data.name
	let email    = data.email
	data         = data.data[0]
	
	return { props: { data, fullname, email, ID } }
}

export default Result
// export default withTranslation('common')(Result)