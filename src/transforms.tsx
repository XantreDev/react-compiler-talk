import { useRef, useState, type ReactNode } from "react";

const SimpleHoisting = (props: { items: number[] }) => {
	return props.items.map((it) => <button key={it}>{it}</button>);
};

const CallbackHoisting = (props: {
	items: number[];
	onClick(item: number): void;
}) => {
	return props.items.map((it) => (
		<button key={it} onClick={() => props.onClick(it)}>
			{it}
		</button>
	));
};

const CallbackHoistingMemo = (props: {
	items: number[];
	onClick(item: number): void;
}) => {
	"use memo";

	return props.items.map((it) => (
		<button key={it} onClick={() => props.onClick(it)}>
			{it}
		</button>
	));
};

const LocalArrayHoisting = (props: {
	amount: number;
	onClick(item: number): void;
}) => {
	const items = useState(() =>
		Array.from(
			{
				length: props.amount,
			},
			() => Math.random() * 100,
		),
	)[0];

	return items.map((it) => (
		<button key={it} onClick={() => props.onClick(it)}>
			{it}
		</button>
	));
};

const TransformHeuristicNoTopLevelJSX = (props: { amount: number }) => {
	return Array.from({ length: props.amount }, (_, key) => (
		<div key={key}>{key}</div>
	));
};

const TransformHeuristicNoTopLevelJSXWithHook = (props: { amount: number }) => {
	useRef(null);
	return Array.from({ length: props.amount }, (_, key) => (
		<div key={key}>{key}</div>
	));
};
const TransformHeuristicTopLevelJSX = (props: { amount: number }) => {
	return (
		<>
			{Array.from({ length: props.amount }, (_, key) => (
				<div key={key}>{key}</div>
			))}
		</>
	);
};

const useData = () => {
	return {
		isLoading: true,
		isFailed: false,
		retry: () => {},
		data: [] as { id: string; data: ReactNode }[],
	};
};

const ObjectReadDeopt = () => {
	const data = useData();

	return (
		<>
			{data.isLoading ? (
				<p>Loading</p>
			) : data.isFailed ? (
				<div>
					Failed
					<button type="button" onClick={() => data.retry()}>
						Retry
					</button>
				</div>
			) : (
				data.data.map((it) => <div key={it.id}>{it.data}</div>)
			)}
		</>
	);
};

const ObjectRead = () => {
	const { retry, isLoading, isFailed, data } = useData();

	return (
		<>
			{isLoading ? (
				<p>Loading</p>
			) : isFailed ? (
				<div>
					Failed
					<button className="assadfa" onClick={() => retry()}>
						Retry
					</button>
				</div>
			) : (
				data.map((it) => <Card key={it.id} data={it.data} />)
			)}
		</>
	);
};

const TRUE = true;
const StaticEvaluationDeopt = () => {
	if (TRUE) {
		return <>I am statically evaluated. I it's the only branch</>;
	} else {
		return <>I am king kong</>;
	}
};

const StaticEvaluation = () => {
	const TRUE = true;
	if (TRUE) {
		return <>I am statically evaluated. I it's the only branch</>;
	} else {
		return <>I am king kong</>;
	}
};

const ArrayCreation = (props: { onClick(item: number): void }) => {
	const arr = [1, 2, 3, 4];
	const jsx: ReactNode[] = [];
	for (let i = 0; i < arr.length; ++i) {
		const item = arr[i];
		jsx.push(
			<div key={item} onClick={() => props.onClick(item)}>
				{item}
			</div>,
		);
	}
	return <>{jsx}</>;
};

const ArrayCreationDeopt = (props: { onClick(item: number): void }) => {
	const arr = useArray(1, 2, 3, 4);
	const jsx: ReactNode[] = useArray();
	for (let i = 0; i < arr.length; ++i) {
		const item = arr[i];
		jsx.push(
			<div key={item} onClick={() => props.onClick(item)}>
				{item}
			</div>,
		);
	}
	return <>{jsx}</>;
};

export const HoistingPage = () => {
	const items = useState(() =>
		Array.from(
			{
				length: 25,
			},
			() => Math.random() * 100,
		),
	)[0];

	return (
		<>
			<div className="flex max-w-[100vw]">
				<SimpleHoisting items={items} />
			</div>

			<div className="flex max-w-[100vw]">
				<CallbackHoisting
					onClick={(it) => {
						console.log(it);
					}}
					items={items}
				/>
			</div>

			<div className="flex max-w-[100vw]">
				<CallbackHoistingMemo
					onClick={(it) => {
						console.log(it);
					}}
					items={items}
				/>
			</div>

			<div className="flex max-w-[100vw]">
				<LocalArrayHoisting
					onClick={(it) => {
						console.log(it);
					}}
					amount={25}
				/>
			</div>
		</>
	);
};
