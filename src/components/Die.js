import React from 'react';
import dice1 from '../assets/images/dice1.svg';
import dice2 from '../assets/images/dice2.svg';
import dice3 from '../assets/images/dice3.svg';
import dice4 from '../assets/images/dice4.svg';
import dice5 from '../assets/images/dice5.svg';
import dice6 from '../assets/images/dice6.svg';


export default function Die(props) {
	const diceImgArr = [dice1, dice2, dice3, dice4, dice5, dice6];
	return (

		<div>
			<img src={diceImgArr[props.value - 1]}
				className={`die-face ${props.isHeld ? "held" : "normal"}`}
				alt="dice"
				onClick={props.holdDice} />
		</div >
	);
}