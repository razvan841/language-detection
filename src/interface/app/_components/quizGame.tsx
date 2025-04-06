"use client";
import React, { useEffect, useState } from "react";
import { quiz } from "../dashboard/data.js";

export default function Quiz({ doneQuiz }: { doneQuiz: () => void }) {
	const [activeQuestion, setActiveQuestion] = useState<number>(0);
	const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<
		number | null
	>(null);
	const [correctAnswers, setCorrectAnswers] = useState(0);
	const [questions, setQuestions] = useState<
		{
			id: number;
			question: string;
			answers: string[];
			correctAnswer: string;
		}[]
	>([]);

	useEffect(() => {
		const shuffled = quiz.sort(() => 0.5 - Math.random());
		const questions = shuffled.slice(0, 5);

		setQuestions(questions);
	}, []);

	const currentQuestion = questions[activeQuestion];

	////////////////////////////////////////////////////////////////////////////////////////////
	// These are the functions that we are using

	//caluculates the score and increments it to the next question
	const nextQuestion = () => {
		if (selectedAnswerIndex === null) return;

		// Update score
		if (
			currentQuestion.answers[selectedAnswerIndex] ===
			currentQuestion.correctAnswer
		)
			setCorrectAnswers((prev) => prev + 1);

		setActiveQuestion((prev) =>
			prev + 1 >= questions.length ? -1 : prev + 1
		);
		setSelectedAnswerIndex(null);
	};
	const restartQuiz = () => {
		setCorrectAnswers(() => 0);
		setActiveQuestion(() => 0);
		setSelectedAnswerIndex(null);
	};

	/////////////////////////////////////////////////////////////////////////////////////

	return (
		<section className="flex justify-center">
			<div className="bg-black/30 absolute -top-full -bottom-full -left-full -right-full"></div>
			<div className="p-10 flex-col flex bg-white border-4 border-alarm rounded-lg-100 z-10">
				<div className="gap-0 text-xl sm:gap-10 sm:flex-row font-black text-black flex flex-col">
					<div>Quiz game</div>
					{currentQuestion && (
						<h2>
							Question: {activeQuestion + 1}
							<span>/{questions.length}</span>
						</h2>
					)}
				</div>

				{/* Now we have the list elements */}
				{currentQuestion ? (
					<div className="flex flex-col items-start">
						<h3 className="py-2">
							{questions[activeQuestion].question}
						</h3>
						{currentQuestion.answers.map((answer, idx) => (
							// In the list class you need to make the styling for hover and for selecting
							<li
								key={idx}
								onClick={() => setSelectedAnswerIndex(idx)}
								className={
									selectedAnswerIndex === idx
										? "text-center w-full my-2 rounded-lg p-4 list-none bg-primary text-white"
										: "text-center w-full my-2 border-2 rounded-lg p-4 list-none hover:bg-gray-50 cursor-pointer"
								}
							>
								<span>{answer}</span>
							</li>
						))}

						{selectedAnswerIndex !== null ? (
							//the next button
							<button
								onClick={nextQuestion}
								className="text-center w-full my-2 rounded-lg p-4 bg-green-400"
							>
								{activeQuestion === questions.length - 1
									? "Finish"
									: "Next"}
							</button>
						) : (
							//When we have nothig selected
							<div className="w-full p-4 text-alarm text-center ">
								Nothing selected
							</div>
						)}
					</div>
				) : (
					<div className="flex flex-col items-start">
						{/* This is where we will show the reuslts */}
						{correctAnswers < questions.length ? (
							<div className="flex flex-col justify-center items-center">
								<div className="p-10">
									You failed the quiz, {correctAnswers}/
									{questions.length}, and you have to do it
									all over again
								</div>
								<button
									className="bg-alarm w-full max-w-[30vw] p-4 rounded-lg text-white"
									onClick={restartQuiz}
								>
									Restart
								</button>
							</div>
						) : (
							<div className="p-10">
								You got it correct and the Alarm will now turn
								off
								<button
									className="text-center w-full my-2 rounded-lg p-4 bg-green-400"
									onClick={doneQuiz}
								>
									Disable
								</button>
							</div>
						)}
					</div>
				)}
			</div>
		</section>
	);
}
