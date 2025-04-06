"use client";
import React, { use, useState } from "react";

export default function BrickGame() {
	//Here you put the TypeScript functions
	const [activeMole, setActiveMole] = useState<number>(
		Math.floor(Math.random() * 5)
	);
	const [moleHits, setMoleHits] = useState<number>(0);
	const [moleMisses, setMoleMisses] = useState<number>(0);
	const [missedMole, setMissedMole] = useState<boolean>(false);
	const [gameState, setGameState] = useState<number>(0);
	console.log(activeMole);

	const startGameFunction = () => {
		setGameState(1);
	};

	const nextActiveMole = (moleIndex: number) => {
		if (moleIndex === activeMole) {
			//The right mole has been hit
			console.log("hit the right mole");
			setMoleHits((prev) => prev + 1);
		} else {
			//the wrong mole has been hit
			//it should show the miss sign
			//if a certain amount of misses has been met, the game should stop
			setMoleMisses((prev) => prev + 1);
			if (moleMisses === 5) {
				setGameState(-1);
			}
		}
	};

	//Here we put the html
	return (
		<section className="flex justify-center">
			<div className="flex-col pb-10 m-20 w-full max-w-2xl items-center flex bg-white border-4 border-alarm rounded-lg-100 z-10">
				<div className="py-10 font-black text-black text-xl">
					Be Fast and Click
				</div>
				{gameState > 0 ? (
					<div className="flex items-center justify-content flex-col">
						<div
							className={
								missedMole ? "max-w-sm z-10 absolute" : "hidden"
							}
						>
							<img
								className="rotate-45"
								src="/static/images/missed.svg"
								alt="missed sign"
							/>
						</div>
						<div className="flex flex-col floating:flex-row w-full floating:gap-40">
							<div
								onClick={() => nextActiveMole(0)}
								className="animate-bounce"
							>
								<img
									className="w-12"
									src={
										activeMole === 0
											? "/static/images/moleAndHole.png"
											: "/static/images/hole.png"
									}
									alt="mole"
								/>
							</div>
							<div
								onClick={() => nextActiveMole(1)}
								className="animate-bounce"
							>
								<img
									className="w-12"
									src={
										activeMole === 1
											? "/static/images/moleAndHole.png"
											: "/static/images/hole.png"
									}
									alt="mole"
								/>
							</div>
						</div>
						<div
							onClick={() => nextActiveMole(2)}
							className="animate-bounce"
						>
							<img
								className="w-12"
								src={
									activeMole === 2
										? "/static/images/moleAndHole.png"
										: "/static/images/hole.png"
								}
								alt="mole"
							/>
						</div>
						<div className="flex flex-col floating:flex-row w-full floating:gap-40">
							<div
								onClick={() => nextActiveMole(3)}
								className="animate-bounce"
							>
								<img
									className="w-12"
									src={
										activeMole === 3
											? "/static/images/moleAndHole.png"
											: "/static/images/hole.png"
									}
									alt="mole"
								/>
							</div>
							<div
								onClick={() => nextActiveMole(4)}
								className="animate-bounce"
							>
								<img
									className="w-12"
									src={
										activeMole === 4
											? "/static/images/moleAndHole.png"
											: "/static/images/hole.png"
									}
									alt="mole"
								/>
							</div>
						</div>
					</div>
				) : (
					<div
						className="border-2 border-alarm py-4 px-10 rounded-xl"
						onClick={startGameFunction}
					>
						Start Game
					</div>
				)}
			</div>
		</section>
	);
}
