import { useRef, useState } from "react";

const waitMS = (ms: number) => {
	const now = performance.now();
	while (performance.now() - now < ms) {}
};

const SlowComponent = () => {
	waitMS(100);

	return <div>slow component</div>;
};

const fetchNetwork = () =>
	new Promise((res) => setTimeout(res, 50)).then(
		() => (Math.random() * 10_000) | 0,
	);

export const ReadThoughtsPage = () => {
	const [counter, setCounter] = useState(0);

	const lock = useRef(false);
	const onClick = async () => {
		if (lock.current) return;
		try {
			lock.current = true;
			setCounter(await fetchNetwork());
		} finally {
			lock.current = false;
		}
	};

	return (
		<div className="flex flex-col gap-3">
			<button type="button" className="btn" onClick={onClick}>
				Increment {counter}
			</button>

			<div className="flex gap-2">
				<SlowComponent />
				<SlowComponent />
				<SlowComponent />
				<SlowComponent />
				<SlowComponent />
				<SlowComponent />
			</div>
		</div>
	);
};
