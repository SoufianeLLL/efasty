import React from 'react'
import ProgressBar from 'react-customizable-progressbar'

const Countdown = ({ progress }) => (
	<div className="item">
		<ProgressBar
			radius={100}
			progress={progress}
			strokeWidth={28}
			strokeColor="#ffce54"
			strokeLinecap="butt"
			trackStrokeWidth={14}
			trackStrokeLinecap="butt"
			cut={120}
			rotate={-210}
		>
			<div className="indicator">{progress}%</div>
		</ProgressBar>
	</div>
)

export default Countdown