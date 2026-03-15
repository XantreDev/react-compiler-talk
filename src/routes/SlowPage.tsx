import { useReducer, useRef, useState } from "react";

const waitMS = (ms: number) => {
	const now = performance.now();
	while (performance.now() - now < ms) {}
};

const fetchNetwork = () =>
	new Promise((res) => setTimeout(res, 50)).then(
		() => (Math.random() * 10_000) | 0,
	);

const useMutation = () => {
	const statusRef = useRef("stale");
	const [, bump] = useReducer((acc: number) => acc + 1, 0);

	return {
		get status() {
			return statusRef.current;
		},
		get loading() {
			return statusRef.current === "pending";
		},
		mutate: async () => {
			if (statusRef.current === "pending")
				throw new Error("concurrent exeception");
			try {
				statusRef.current = "pending";
				bump();
				const res = await fetchNetwork();
				statusRef.current = "stale";
				bump();
				return res;
			} catch (err) {
				statusRef.current = "error";
				bump();
				throw err;
			}
		},
	};
};

const SlowComponent = (props: { onClick(): void }) => {
	waitMS(400);

	return (
		<button type="button" className="btn" onClick={props.onClick}>
			slow increment
		</button>
	);
};

export const SlowPage = () => {
	const [counter, setCounter] = useState(0);

	const mutation = useMutation();
	const onClick = async () => {
		if (mutation.loading) {
			console.log("loading -> skipping");
			return;
		}
		const res = await mutation.mutate();
		setCounter(res);
	};

	return (
		<div className="flex flex-col gap-3">
			<div>Counter: {counter}</div>
			<div>is loading: {String(mutation.loading)}</div>

			<div className="flex gap-2">
				<SlowComponent onClick={onClick} />
			</div>
		</div>
	);
};
