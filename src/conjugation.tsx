function findVoice(lang: String) {
	return speechSynthesis.getVoices().filter(v => v.lang == lang)[0]
}

export function speak(text: String) {
	let v = findVoice()

	let u = new SpeechSynthesisUtterance(text)
	speechSynthesis.speak(u)
}

