const ALLOW_MULT = true;
const MULT = 4;

const coolFunc = (value: number) => {
	const str = "cool";
	const mult = str.length * MULT;

	const _ = str + 10;

	let repeats: number;

	if (ALLOW_MULT) {
		repeats = value * mult;
	} else {
		let res = 0;
		for (let i = 0; i < mult; ++i) {
			res += value;
		}
		repeats = res;
	}

	return repeats;
};
