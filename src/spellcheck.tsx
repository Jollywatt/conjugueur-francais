function computeWagnerFischerMatrix(a: string, b: string) {

	const d = Array(a.length + 1).fill().map(i => Array(b.length + 1).fill(0))

	for (let i = 1; i <= a.length; i++) d[i][0] = i
	for (let j = 1; j <= b.length; j++) d[0][j] = j

	for (let i = 1; i <= a.length; i++) {
		for (let j = 1; j <= b.length; j++) {
			let subsitutionCost = a[i-1] == b[j-1] ? 0 : 1
			d[i][j] = Math.min(
				d[i-1][j] + 1,
				d[i][j-1] + 1,
				d[i-1][j-1] + subsitutionCost,
			)
		}
	}

	return d
}

function pushOrExtendLast(steps, key, value) {
	if (steps.length > 0 && steps[steps.length - 1][key] !== undefined) {
		steps[steps.length - 1][key] = value + steps[steps.length - 1][key]
	} else {
		steps.push({[key]: value})
	}
}

const normalize = (x: string) => x.replace(/[‘’]/, "'").toLowerCase().normalize()

export function comptuteStringEdits(a: string, b: string) {
	const d = computeWagnerFischerMatrix(normalize(a), normalize(b))

	let i = d.length - 1
	let j = d[0].length - 1

	const steps = []

	while (i + j > 0) {
		if (d[i][j-1] < d[i][j]) {
			// insertion operation
			j -= 1
			pushOrExtendLast(steps, 'insert', b[j])
		} else if (d[i-1][j] < d[i][j]) {
			// deletion operation
			i -= 1
			pushOrExtendLast(steps, 'delete', a[i])
		} else if (d[i-1][j-1] < d[i][j]) {
			// substitution operation
			i -= 1
			j -= 1
			const lasti = steps.length - 1
			if (steps[lasti]?.insert !== undefined) {
				// merge following insertion with current substitution
				steps.splice(lasti, 1, {
					swap: a[i],
					with: b[j] + steps[lasti].insert,
				})
			} else if (steps[lasti]?.delete !== undefined) {
				// merge following deletion with current substitution
				steps.splice(lasti, 1, {
					swap: a[i] + steps[lasti].delete,
					with: b[j]
				})
			} else if (steps[lasti]?.swap !== undefined) {
				// merge with following substitution
				steps.splice(lasti, 1, {
					swap: a[i] + steps[lasti].swap,
					with: b[j] + steps[lasti].with,
				})
			} else {
				// add new substitution
				steps.push({swap: a[i], with: b[j]})
			}
		} else {
			// no operation (character is correct)
			i -= 1
			j -= 1
			pushOrExtendLast(steps, 'correct', a[i])
		}
	}
	return steps.reverse()
}


export function formatSpellcheck(response: string, answer: string) {
	const steps = comptuteStringEdits(response, answer)

	let html = ''
	for (let step of steps) {
		if (step.correct !== undefined) {
			html += step.correct
		} else if (step.delete !== undefined) {
			html += `<span class="delete">${step.delete}</span>`
		} else if (step.swap !== undefined) {
			html += `<span class="swap" annotation="${(step.with)}">${(step.swap)}</span>`
		} else if (step.insert !== undefined) {
			let hint = step.insert.slice(0, 2)
			if (step.insert.length > 2) hint += "..."
			html += `<span class="insert" annotation="${(hint)}"/>`
		}
	}
	return html
}
