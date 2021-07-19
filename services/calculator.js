
// BMI ≤ 18.5, 	return 	"Underweight"
// BMI ≤ 25, 	return 	"Normal"
// BMI ≤ 30, 	return 	"Overweight"
// BMI > 30, 	return  "Obese"


// Body Fat Percentage Categories
//
// Classification		Women (% fat)	 	 Men (% fat)
// Essential Fat		10-12%				 2-4%
// Athletes				14-20%				 6-13%
// Fitness				21-24%				 14-17%
// Acceptable			25-31%				 18-25%
// Obese				32%+				 25%+



const getHeight = (height) => {
	let h = height.replace(/ /g, "")
	if ( h.includes('feet') ) {
		h = h.split(',')
		let feet = h[0]
		let inches = h[1]
		feet = feet.replace(/feet/g, "")
		inches = inches.replace(/inches/g, "")
		h = ((feet / 3.2808) + inches / 39.370)
	}
	else {
		var t = h.replace(/cm/g, "")
		h = t / 100
	}
	return parseFloat(h).toFixed(2)
}

const getWeight = (weight, with_pr=false) => {
	let w = weight
	w = w.replace(/ /g, '')
	if ( w.includes('Pound') ) {
		w = w.replace(/Pound/g, '')
		w = w / 2.2046
		if ( with_pr ) w = `${w} Pound`
	}
	else {
		w = w.replace(/Kg/g, '')
		if ( with_pr ) w = `${w} Kg`
	}
	return parseFloat(w).toFixed(0)
}

const getBodyFatPercentage = (gender, weight, waist, wrist, hips, forearm, age, height, leanBodyMass=false) => {
	let FA, FB, FC, FD, FE, LBM, BFW, BFP, w = getWeight(weight)
	if ( gender == 'female' ) {
		FA = (w * 0.732) + 8.987
		FB = wrist / 3.140
		FC = waist * 0.157
		FD = hips * 0.249
		FE = forearm * 0.434
		LBM = FA + FB - FC - FD + FE
		BFW = w - LBM
		BFP = (BFW * 100) / w
	}
	else {
		// FA = (w * 1.082) + 94.42
		// FB = waist * 4.15
		// LBM = FB - FA
		// BFW = w - LBM
		// BFP = (BFW * 100) / w
		let a = ( age == '+50' ? '60' : ( age == '18-29' ? '24' : ( age == '30-39' ? '34' : '44' ) ) )
		let BMI = (getWeight(weight) / (getHeight(height)**2))
		BFP = (1.20 * BMI) + (0.23 * a) - (10.8 * 1) - 5.4
		let FM = (getWeight(weight) * BMI) / 100
		LBM = getWeight(weight) - FM
	}

	if ( leanBodyMass ) {
		let t = parseFloat(LBM).toFixed(0)
		if ( weight.includes('Pound') ) {
			return `${t} Pound`
		}
		else {
			return `${t} Kg`
		}
	}
	return parseFloat(BFP).toFixed(0)
}

const getIdealBodyWeight = (weight, gender, height) => {
	let h = getHeight(height)
		h = h * 100
	if ( gender == 'female' ) {
		h = (h - 130) + ' - ' + (h - 87)
		if ( w.includes('Pound') ) {
			h = `${h} Pound`
		}
		else {
			h = `${h} Kg`
		}
	}
	else {
		h = (h - 120) + ' - ' + (h - 95)
	}
	
	if ( weight.includes('Pound') ) {
		return `${h} Pound`
	}
	else {
		return `${h} Kg`
	}
}

const getBasalMetabolicRate = (height, weight, age, gender) => {
	let BMR, 
		h = getHeight(height),
		w = getWeight(weight)
		h = h * 100

	if ( gender == 'female' ) {
		BMR = 66.47 + (13.75 * w) + (5.003 * h) - (6.755 * age)
	}
	else {
		BMR = 655.1 + (9.563 * w) + (1.85 * h) - (4.676 * age)
	}
	return parseFloat(BMR).toFixed(0)
}

const getCaloriesByWeight = (routine, BMR) => {
	let result = null
	if ( routine == 'no_exertion' ) {
		result = BMR * 1.2
	}
	else if ( routine == 'exercises_one_two_weekly' ) {
		result = BMR * 1.375
	}
	else if ( routine == 'exercises_tree_five_weekly' ) {
		result = BMR * 1.55
	}
	else if ( routine == 'exercises_five_seven_weekly' ) {
		result = BMR * 1.725
	}
	else if ( routine == 'exertion_work' ) {
		result = BMR * 1.9
	}
	return parseFloat(result).toFixed(0)
}

const getCalculatedPercentageWeight = (weight, category, routine) => {
	let percent, max_per_week
	if ( routine == 'no_exertion' ) {
		max_per_week = (weight.includes('Pound') ? `${parseFloat(0.5 * 2.20462262185).toFixed(2)} Pound` : '0.5 Kg')
		if ( category == 'weight_loss' ) {
			percent = [{
				1: '87%',
				2: '75%',
				3: '50%'
			}]
		}
		else if ( category == 'muscle_building' ) {
			percent = [{
				1: '113%',
				2: '125%',
				3: '150%'
			}]
		}
		else {
			precent = [{
				1: '100%',
				2: '100%',
				3: '100%'
			}]
		}
	}
	else if ( routine == 'exercises_one_two_weekly' ) {
		max_per_week = (weight.includes('Pound') ? `${parseFloat(0.5 * 2.20462262185).toFixed(2)} Pound` : '0.5 Kg')
		if ( category == 'weight_loss' ) {
			percent = [{
				1: '89%',
				2: '78%',
				3: '56%'
			}]
		}
		else if ( category == 'muscle_building' ) {
			percent = [{
				1: '111%',
				2: '122%',
				3: '144%'
			}]
		}
		else {
			precent = [{
				1: '100%',
				2: '100%',
				3: '100%'
			}]
		}
	}
	else if ( routine == 'exercises_tree_five_weekly' ) {
		max_per_week = (weight.includes('Pound') ? `${parseFloat(1 * 2.20462262185).toFixed(2)} Pound` : '1 Kg')
		if ( category == 'weight_loss' ) {
			percent = [{
				1: '90%',
				2: '79%',
				3: '59%'
			}]
		}
		else if ( category == 'muscle_building' ) {
			percent = [{
				1: '110%',
				2: '121%',
				3: '141%'
			}]
		}
		else {
			precent = [{
				1: '100%',
				2: '100%',
				3: '100%'
			}]
		}
	}
	else if ( routine == 'exercises_five_seven_weekly' ) {
		max_per_week = null
		if ( category == 'weight_loss' ) {
			percent = [{
				1: '91%',
				2: '82%',
				3: '65%'
			}]
		}
		else if ( category == 'muscle_building' ) {
			percent = [{
				1: '109%',
				2: '118%',
				3: '135%'
			}]
		}
		else {
			precent = [{
				1: '100%',
				2: '100%',
				3: '100%'
			}]
		}
	}
	else if ( routine == 'exertion_work' ) {
		max_per_week = null
		if ( category == 'weight_loss' ) {
			percent = [{
				1: '92%',
				2: '84%',
				3: '68%'
			}]
		}
		else if ( category == 'muscle_building' ) {
			percent = [{
				1: '108%',
				2: '116%',
				3: '132%'
			}]
		}
		else {
			precent = [{
				1: '100%',
				2: '100%',
				3: '100%'
			}]
		}
	}
	return [{
		max_per_week,
		percent
	}]
}


const calculator = (data) => {
	let result = null,
		BMI = null,
		BMR = null,
		weightKg = null,
		heightMeter = null,
		bodyFat = null,
		leanBodyMass = null,
		gender = null,
		category = null,
		age = null,
		forearm = null,
		wrist = null,
		hips = null,
		waist = null,
		current_weight = null,
		goal_weight = null,
		height = null,
		current_body_type = null,
		fitness_routine = null,
		life_issues = null,
		life_style = null,
		last_time_having_good_weight = null,
		need_motivation = null,
		prepare_food_duration = null,
		sleep_routine = null,
		your_energy = null,
		habits = null,
		foods = null,
		meat = null,
		vegetables = null,
		drink_water = null,
		current_calories = null,
		goal_calories = null
		

	if ( data ) {
		data.map((res, index) => {
			
			if ( res.gender !== undefined ) {
				gender = res.gender
			}
			else if ( res.category !== undefined ) {
				category = res.category
			}
			else if ( res.age !== undefined ) {
				age = ( res.age == '+50' ? '60' : ( res.age == '18-29' ? '24' : ( res.age == '30-39' ? '34' : '44' ) ) )
			}
			else if ( res.forearm !== undefined ) {
				forearm = res.forearm
			}
			else if ( res.wrist !== undefined ) {
				wrist = res.wrist
			}
			else if ( res.hips !== undefined ) {
				hips = res.hips
			}
			else if ( res.waist !== undefined ) {
				waist = res.waist
			}
			else if ( res.weight !== undefined ) {
				current_weight = res.weight
				weightKg = getWeight(res.weight, true)
			}
			else if ( res.height !== undefined ) {
				height = res.height
				heightMeter = getHeight(res.height)
			}
			else if ( res.body_type !== undefined ) {
				current_body_type = res.body_type
			}
			else if ( res.fitness_routine !== undefined ) {
				fitness_routine = res.fitness_routine
			}
			else if ( res.life_issues !== undefined ) {
				life_issues = res.life_issues
			}
			// else if ( res.life_style !== undefined ) {
			// 	life_style = res.life_style
			// }
			// else if ( res.last_time_having_good_weight !== undefined ) {
			// 	last_time_having_good_weight = res.last_time_having_good_weight
			// }
			// else if ( res.need_motivation !== undefined ) {
			// 	need_motivation = res.need_motivation
			// }
			else if ( res.prepare_food_duration !== undefined ) {
				prepare_food_duration = res.prepare_food_duration
			}
			// else if ( res.sleep_routine !== undefined ) {
			// 	sleep_routine = res.sleep_routine
			// }
			// else if ( res.your_energy !== undefined ) {
			// 	your_energy = res.your_energy
			// }
			// else if ( res.habits !== undefined ) {
			// 	habits = res.habits
			// }
			else if ( res.foods !== undefined ) {
				foods = res.foods
			}
			else if ( res.meat !== undefined ) {
				meat = res.meat
			}
			else if ( res.vegetables !== undefined ) {
				vegetables = res.vegetables
			}
			else if ( res.water !== undefined ) {
				drink_water = res.water
			}

			if ( height && current_weight ) {
				BMI = (getWeight(current_weight) / (getHeight(height)**2))
			}
			if ( height && current_weight && age && gender ) {
				BMR = getBasalMetabolicRate(height, current_weight, age, gender)
			}
			if ( current_weight && gender && age && height ) {
				bodyFat = getBodyFatPercentage(gender, current_weight, waist, wrist, hips, forearm, age, height)
			}
			if ( current_weight && gender && age && height ) {
				leanBodyMass = getBodyFatPercentage(gender, current_weight, waist, wrist, hips, forearm, age, height, true)
			}
			if ( gender && height ) {
				goal_weight = getIdealBodyWeight(current_weight, gender, height)
			}
			if ( fitness_routine && height && current_weight && age && gender ) {
				current_calories = getCaloriesByWeight(fitness_routine, getBasalMetabolicRate(height, current_weight, age, gender))
			}
			if ( category && fitness_routine ) {
				goal_calories = getCalculatedPercentageWeight(current_weight, category, fitness_routine)
			}
			
		})

		result = [{
			weightKg,
			heightMeter,
			BMI,
			BMR,
			bodyFat,
			leanBodyMass,
			goal_weight,
			current_calories,
			goal_calories,
			gender,
			category,
			age,
			forearm,
			wrist,
			hips,
			waist,
			current_weight,
			height,
			current_body_type,
			fitness_routine,
			life_issues,
			// life_style,
			// last_time_having_good_weight,
			// need_motivation,
			prepare_food_duration,
			// sleep_routine,
			// your_energy,
			// habits,
			foods,
			meat,
			vegetables,
			drink_water
		}]

		return result

	}
	else {
		return null
	}
}

export default calculator