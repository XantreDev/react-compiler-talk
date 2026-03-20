---
theme: ./theme
title: Искусство ухода за React Compiler
info: |
  ## Разбираемся, как работает React Compiler, чтобы генерить быстрый код
# apply UnoCSS classes to the current slide
class: text-center
# https://sli.dev/features/drawing
drawings:
  persist: false
# slide transition: https://sli.dev/guide/animations.html#slide-transitions
transition: slide-left
layout: default
# enable Comark Syntax: https://comark.dev/syntax/markdown
comark: true
# duration of the presentation
duration: 40min
---

# Искусство ухода за React Compiler

<div class="flex">

<img src="/the-art-of-react-compiler-maintenance.excalidraw.svg" class="h-30dvh mx-auto mt-4" />

</div>



---

## Йоу, я Валера

<div class="grid grid-cols-2">

<div class="text-xl mt-4">

- фронтенжу в стартапах
- люблю закопаться
- слежу за performance

</div>

<img src="/me.webp" class="ml-auto h-36dvh rounded-xl border-[2px] border-[#00ff04]" />

</div>

---
class: "flex flex-col"
---

# React Compiler - это крута!!!

<div class="flex">

<img src="/great-comp-3.jpg" class="h-20dvh min-w-0 w-auto block rounded-[12px] border-2 border-purple" />

</div>

- React 17+
- никаких `useMemo`, `useCallback`
- быстро по дефолту
- никаких `React.memo`

---

## Что с деньгами?

<SlidevVideo src="/check-compiler.mp4" loop class="h-35dvh mx-auto" autoplay autoreset='slide' muted />

---

## О чём сёдня поговорим?

<div class="mt-10">

<div class="grid grid-cols-2">

- что мы ожидаем
- внутреннее устройство компайлера
- научимся ухаживать за компайлером

<img src="/repo.svg" class="size-100" />

</div>

</div>

<!-- TODO: add stickman -->

---

<div class="-mt-8">

## Шо мы хотим от компайлера?

</div>

<v-click>

````md magic-move

```tsx 
export default function MyApp() {
  const [counter, setCounter] = useState(0)

  return <div onClick={() => setCounter(it => it + 1)}>
    Hello World {counter}
  </div>;
}
```


```tsx {all|2}
export default function MyApp() {
  const cache = useRef(new Array(3).fill(Symbol.for("react.memo_cache_sentinel"))).current;
  
  const [counter, setCounter] = useState(0)

  return <div onClick={() => setCounter(it => it + 1)}>
    Hello World {counter}
  </div>;
}
```

```tsx {all|1-3,6}
const useMemoCache = (slots: number) => useRef(
  new Array(slots).fill(Symbol.for("react.memo_cache_sentinel"))
).current;

export default function MyApp() {
  const cache = useMemoCache(3);
  
  const [counter, setCounter] = useState(0)

  return <div onClick={() => setCounter(it => it + 1)}>
    Hello World {counter}
  </div>;
}
```


```tsx {all|1,4}
import { c as _c } from "react/compiler-runtime"; // useMemoCache

export default function MyApp() {
  const $ = _c(3);
  
  const [counter, setCounter] = useState(0)
  
  return <div onClick={() => setCounter(it => it + 1)}>
    Hello World {counter}
  </div>;
}
```


<!--
```tsx
import { c as _c } from "react/compiler-runtime"; // useMemoCache

export default function MyApp() {
  const $ = _c(3);
  
  const [counter, setCounter] = useState(0)
  
  let t0;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    t0 = () => setCounter(it => it + 1);
    $[0] = t0;
  } else {
    t0 = $[0];
  }
  
  return <div onClick={t0}>
    Hello World {counter}
  </div>;
}
```-->

```tsx
import { c as _c } from "react/compiler-runtime"; // useMemoCache
export default function MyApp() {
  const $ = _c(3);
  const [counter, setCounter] = useState(0)
  let t0;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    t0 = () => setCounter(it => it + 1);
    $[0] = t0;
  } else {
    t0 = $[0];
  }
  let t1;
  if ($[1] !== counter) {
    t1 = (
      <div onClick={t0}>
        Hello World {counter}
      </div>
    );
    $[1] = counter;
    $[2] = t1;
  } else {
    t1 = $[2];
  }
  return t1;
}
```
````

</v-click>

<div v-click class="absolute right-0 top-1/2 -translate-1/2 text-xl">

Сложна! Как оно работает?

</div>

<!-- TODO: rework
https://playground.react.dev/#N4Igzg9grgTgxgUxALhAgHgBwjALgAgBMEAzAQygBsCSoA7OXASwjvwFkBPAQU0wAoAlPmAAdNvjiswBANpT6uBDAA0+MAlwBhaHSUwAuvgC8+KBoDKuMkv4AGQePH58MTbDYAeQkwBu+Vi1KJjgAa2NgIRMAPnVNHUVlfiYCY1iU-ABqfABGQQBfaOcXfAAJBEpKCHwAdRxKQhEFPWV84s8Aeh9faIBucTa6EBUQKToSJgBzFBAmAFtsPHxcTkwEEXwABUooSaY6AHlMZml8fPwSGAg5-AByACMye4qAWkwdvboXtzJGF6kFkxKMoukwZLd+nRxPwxBIOh0AZggTYWHR2BBiMh8KIQGRKjiBuoUWAJggwFsPvsjic6GBBL1huAABYQADuAEkWjA6HiwChyJQNPkgA -->

---

## А как компилировать?

<div class="absolute" v-click.hide="+1">

<img class="h-10dvh mt-4" src="/babel.png" />

Говорят, что React Compiler - это просто babel plugin

</div>

<v-click>

<img src="/pipeline.excalidraw.svg" class="h-32dvh -ml-6" />

</v-click>

<v-click>

<div class="absolute top-8 right-8">

## The logo

<img class="h-8dvh" src="/compiler-logo.excalidraw.svg" />

</div>

</v-click>


---

## Кто такой Babel?

<div class="grid grid-cols-2 gap-4 mt-4">

<div>



```ts 
log("Ты собака" + "я собака")
```


<div v-click="+2">

- Создан для изменения кода
- типов нету

</div>

</div>


<img v-click src='/babel-ast.excalidraw.svg' class="h-35dvh" />


</div>


<!-----

## JS для зумеров

##### `babel-plugin-glowup-vibes`

<div class="grid grid-cols-2 gap-4">


| Your Code                                                              | JS                                                   |
|------------------------------------------------------------------------|------------------------------------------------------|
| `cap`                                                                    | `false`                                                |
| `noCap`                                                                  | `true`                                                 |
| `lowkey.stan` | `console.log`|
| `.skibidi(clbk)` | `.filter(clbk)` |
| `ghosted` | `return null` |

````md magic-move
```ts
lowkey.stan(
  [1, 2, 3, 4].skibidi(it => {
    if (it < 2) ghosted
    
    toilet(noCap)
  })
)
```
```ts
console.log(
  [1, 2, 3, 4].filter((it) => {
    if (it < 2) return null;
    
    return true;
  })
);
```
````


</div>

-->

---

<Progress step="1" total="6" />

## High-Level Intermediate Representation


```ts 
log("Ты собака" + "я собака")
```

<img v-click src="/HIR.excalidraw.svg" class="h-32dvh mx-auto" />

---

<Progress step="2" total="6" />

## Пре оптимизация

<img v-click.hide="+1" src="/pre-opts.excalidraw.svg" class="h-34dvh inset-x-0 mx-auto absolute" />

<v-click>

````md magic-move

```ts
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
```
```ts
const MULT = 4;

const coolFunc = (value: number) => {
	const str = "cool";
	const mult = str.length * MULT;

	const _ = str + 10;

	let repeats: number;

	if (true) {
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
```
```ts
const MULT = 4;

const coolFunc = (value: number) => {
	const str = "cool";
	const mult = str.length * MULT;

	const _ = str + 10;

	let repeats: number;

	repeats = value * mult;

	return repeats;
};
```
```ts
const coolFunc = (value: number) => {
	const str = "cool";
	const mult = str.length * 4;

	const _ = str + 10;

	let repeats: number;

	repeats = value * mult;

	return repeats;
};
```
```ts
const coolFunc = (value: number) => {
	const mult = "cool".length * 4;
	
	const _ = "cool" + 10;

	let repeats: number;

	repeats = value * mult;

	return repeats;
};
```
```ts
const coolFunc = (value: number) => {
	const mult = 4 * 4;

	const _ = "cool" + 10;

	let repeats: number;

	repeats = value * mult;

	return repeats;
};
```
```ts
const coolFunc = (value: number) => {
	const mult = 16;

	const _ = "cool" + 10;

	let repeats: number;

	repeats = value * mult;

	return repeats;
};
```
```ts
const coolFunc = (value: number) => {
	const _ = "cool" + 10;

	let repeats: number;

	repeats = value * 16;

	return repeats;
};
```
```ts
const coolFunc = (value: number) => {
	let repeats: number;

	repeats = value * 16;

	return repeats;
};
```
````

</v-click>

<v-click>

Теперь проще оптимизировать!

</v-click>

---

<Progress step="3" total="6" />

## Type & Effect inference

<img src="/types-and-effects.excalidraw.svg" class="h-33dvh mx-auto" />

<div v-click class="mt-4">

Мы знаем, что мы вообще можем оптимизировать

</div>


---

## Что такое реактивность?

---

<Progress step="4" total="6" />

## Reactivity detection

````md magic-move
```ts
const Component = (props) => {
	const arr = []
  if (props.count > 10) {
    arr.push(10)
  } else {
    arr.push(20)
  }
}
```
```ts
const Component = (props) => {
  const arr = []
  if (/* reactive read */ props.count > 10) {
    arr.push(10)
  } else {
    arr.push(20)
  }
}
```
```ts
const Component = (props) => {
  const arr = [] // array
  if (/* reactive read */ props.count > 10) {
    arr.push(10) 
  } else {
    arr.push(20)
  }
}
```
```ts
const Component = (props) => {
  const arr = [] // array
  if (/* reactive read */ props.count > 10) {
    // reactive write
    arr.push(10) 
  } else {
    // reactive write
    arr.push(20)
  }
}
```
```ts
const Component = (props) => {
  const arr = [] // reactive array
  // reactive block
  if (/* reactive read */ props.count > 10) {
    arr.push(10) 
  } else {
    arr.push(20)
  }
}
```
```ts
const Component = (props) => {
  { // reactive scope
    const arr = [] // reactive array
    // reactive block
    if (/* reactive read */ props.count > 10) {
      arr.push(10) 
    } else {
      arr.push(20)
    }
  }
}
```
```ts
const Component = (props) => {
  let _arr 
  if ($$changed(props.count)) { // reactive scope
    const arr = [] // reactive array
    // reactive block
    if (/* reactive read */ props.count > 10) {
      arr.push(10) 
    } else {
      arr.push(20)
    }
    $$update_cache(arr)
    _arr = arr
  } else {
    _arr = $$cache()
  }
}
```
````

<v-click>

Мы умеем мемоизировать

</v-click>

---

<Progress step="5" total="6" />

## Optimization + validation

- перетряхивание скоупов
- удаление плохих оптимизаций

---


<Progress step="6" total="6" />

## Codegen

````md magic-move

```ts
let str: string
if (counter === 0) {
  str = "Zero is ok"
} else if (counter === 1) {
  str = "1 is ok"
} else {
  str = `${counter} is not ok`
}
```

```ts
let str;
if (counter === 0) {
  str = "Zero is ok";
} else {
  if (counter === 1) {
    str = "1 is ok";
  } else {
    str = `${counter} is not ok`;
  }
}
```

````

---

## Итоги

<img src="/pipeline-details.excalidraw.svg" class="h-38dvh mx-auto" />

---
class: text-center 
---

## Как ухаживать за React Compiler?

<img src="/how-to-look-after-the-compiler.excalidraw.svg" class="h-28dvh mx-auto mt-8" />

---
class: text-center 
---

## Вы должны научиться слушать

<img src="/how-to-listen.excalidraw.svg" class="h-28dvh mx-auto mt-8" />


---
class: text-center 
---

## Вы должны научиться читать мысли компилятора

<img src="/how-to-read-thoughs.excalidraw.svg" class="h-30dvh mx-auto mt-8" />

---
class: text-center 
---

## Вы должны говорить о своих потребностях

<img src="/communicate-your-demands.excalidraw.svg" class="h-30dvh mx-auto mt-8" />

---
class: text-center 
---

# Итог

<img src="/ending.excalidraw.svg" class="h-35dvh mx-auto" />



<!--## Pain points

- чтение объектов по условию
- HIR несовместимый код
- компилятор делает что-то странное
-->
---

## Q&A

---

## Моя телега

<img src="/telegram.svg" class="w-30dvh mx-auto" />
