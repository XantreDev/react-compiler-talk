import { useState } from "react";

const waitMS = (ms: number) => {
	const now = performance.now();
	while (performance.now() - now < ms) {}
};

interface Control {
	key: string;
	title: string;
}
const control = (key: string, title: string): Control => ({
	key,
	title,
});

const RocketScienceControl = (props: {
	item: Control;
	checked: boolean;
	onClick(key: string): void;
}) => {
	waitMS(100);
	return (
		<input
			type="checkbox"
			checked={props.checked}
			onChange={() => {
				props.onClick(props.item.key);
			}}
			className="toggle"
		/>
	);
};

const IS_EXTENDED = import.meta.env.VITE_EXTENDED === "true";
export function CommunicatePage() {
	const controls = [
		control("new-releases", "Push notifications on new product release"),
		control("sound", "Sound enabled"),
	];
	const [disabled, setDisabled] = useState<string[]>([]);

	if (IS_EXTENDED) {
		controls.push(control("offers", "Push notifications about new offerings"));
	}

	const onClick = (key: string) => {
		setDisabled((controls) => {
			if (controls.includes(key)) {
				return controls.filter((it) => it !== key);
			} else {
				return [...controls, key];
			}
		});
	};

	return (
		<section>
			<header className="mb-6">
				<h1 className="text-3xl font-semibold tracking-tight text-slate-100 md:text-4xl">
					Settings
				</h1>
				<p className="mt-2 text-sm text-slate-300">This settings page</p>
			</header>

			<div className="rounded-xl border border-slate-700 bg-slate-900/60 p-6 text-left text-slate-200">
				<ul className="flex flex-col gap-2">
					{controls.map((control) => (
						<li className="flex flex-row justify-between" key={control.key}>
							{control.title}

							<RocketScienceControl
								item={control}
								checked={!disabled.includes(control.key)}
								onClick={onClick}
							/>
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}
