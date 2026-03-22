---
theme: ./theme
title: Искусство ухода за React Compiler
colorSchema: dark
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
class: mt-2
step: 1
---

## High-Level Intermediate Representation

<div class="relative w-full h-full flex">


<div v-click.hide="+1" class="absolute inset-0">

- так наш код видит компйлер
- крутое представление для оптимизации
- инструкции

<img src="/HIR.excalidraw.svg" class="h-28dvh mx-auto" />

</div>

<div class="m-auto">

<img v-click src="/unopt-hir-node.excalidraw.svg" class="w-100" />

- многа инструкций
 
</div>

</div>

---
class: mt-2
step: 2
---

## Как выглядит процесс оптимизации?

```ts
while (true) {
  const optimizedHIR = optimiationPass(hir)
  if (optimizedHIR.equals(hir)) {
    break
  }
  hir = optimizedHIR
}
```

- check
- optimize
- repeat


---
class: mt-2
step: 2
---

## Фаза пре оптимизации

<div class="flex flex-row">

<div>
Оптимизационные проходы:

- constant propagation
```ts
const a = true
const b = a
```
- dead code elimination
```ts
if (true) somethingExpensive()
```

<img src="/unopt-hir-node.excalidraw.svg" class="w-60 mt-4" />

</div>


<div v-click />

<div v-click.after="-1"  class="ml-4 grow-1">

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

</div>

</div>

---
class: mt-2
step: 3
---

## Type & Effect inference

<div class="grid grid-cols-1 grid-rows-1 *:row-span-full *:col-span-full">

<img v-click.hide="+1" src="/types-and-effects.excalidraw.svg" class="h-33dvh mx-auto" />

<div class="m-auto">

<img v-click src="/hir-with-meta.excalidraw.svg" class="h-16dvh" />

</div>

</div>

---
class: mt-2
step: 4
---


## Что такое реактивность?

<div class="grid grid-cols-1 grid-rows-1 *:row-span-full *:col-span-full">

<div v-click.hide="+1" class="mx-auto">
  <img src="/rethinking-reactivity.webp" class="mt-10 rounded h-26dvh" />
   <i class="block mt-2 text-center w-full text-xl">Rich Harris - Rethinking reactivity</i>
</div>


<div class="m-auto">
<img v-click src="/reactivity.jpg" class="h-25dvh" />
</div>

</div>

<!-- https://youtu.be/AdNJ3fydeao?si=S0340hrr5ImKZ0P9 -->

---
class: mt-2
step: 4
---

## При чём тут React?

<div class="max-w-160 text-center mt-35 mx-auto text-3xl">

Если бы названия технолгий не врали, то React бы назывался Rerender

</div>

---
class: mt-2
step: 4
---

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
  const arr = [] // array
  if (props.count > 10) {
    arr.push(10)
  } else {
    arr.push(20)
  }
}
```
```ts
const Component = (props /* reactive object */) => {
  const arr = [] // array
  if (props.count > 10) {
    arr.push(10) 
  } else {
    arr.push(20)
  }
}
```ts
const Component = (props /* reactive object */) => {
  const arr = [] // array
  if (/* reactive read */ props.count > 10) {
    arr.push(10) 
  } else {
    arr.push(20)
  }
}
```
```ts
const Component = (props /* reactive object */) => {
  const arr = [] // array
  if (/* reactive read */ props.count > 10) {
    arr.push(10) 
  } else {
    arr.push(20)
  }
}
```
```ts
const Component = (props /* reactive object */) => {
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
const Component = (props /* reactive object */) => {
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
const Component = (props /* reactive object */) => {
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
const Component = (props /* reactive object */) => {
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

---
class: mt-2
step: 4
---

## React compiler - реактивность больного человека

<SlidevVideo src="/idiocracy-dumb.webm" muted autoplay loop class="mx-auto" />

---
class: mt-2
step: 5
---

## Optimization

<img src="/reactive-functions.excalidraw.svg" class="h-12dvh" />

- перетряхивание скоупов
- удаление плохих оптимизаций
- ещё куча всего

---
class: mt-2
step: 5
---

## Мерджинг веток

````md magic-move
```tsx
let t0;
if ($[0] !== props.values) {
  t0 = props.values > 10 ? { key: props.values } : null;
  $[0] = props.values;
  $[1] = t0;
} else {
  t0 = $[1];
}
const obj = t0;
let t1;
if ($[2] !== props.values) {
  t1 = props.values > 10 ? { key: props.values } : null;
  $[2] = props.values;
  $[3] = t1;
} else {
  t1 = $[3];
}
const obj2 = t1
```
```tsx
let t0;
let t1;
if ($[0] !== props.values) {
  t0 = props.values > 10 ? { key: props.values } : null;
  $[0] = props.values;
  $[1] = t0;
  
  t1 = props.values > 10 ? { key: props.values } : null;
  $[2] = props.values;
  $[3] = t1;
} else {
  t0 = $[1];
  t1 = $[3];
}
const obj = t0;
const obj2 = t1;
```
````

---
class: mt-2
step: 6
---


## Codegen

<img src="/codegen.excalidraw.svg" class="h-16dvh mt-20 mx-auto" />

---

## Итоги

<img src="/pipeline.excalidraw.svg" class="-ml-8 h-38dvh" />

---
class: text-center 
---

## Back to business


---

## Как ухаживать за React Compiler?

<img src="/how-to-look-after-the-compiler.excalidraw.svg" class="h-28dvh mx-auto mt-8" />

---
class: text-center 
---

## Вы должны научиться слушать

<img src="/how-to-listen.excalidraw.svg" class="h-28dvh mx-auto mt-8" />

# Читаем сгенеренный код

---
class: text-center 
---

## Вы должны научиться читать мысли компилятора

<img src="/how-to-read-thoughs.excalidraw.svg" class="h-30dvh mx-auto mt-8" />

<div class="text-3xl">

`panicThreshold: 'all_errors'`

</div>

---
class: text-center 
---

## Вы должны говорить о своих потребностях

<img src="/communicate-your-demands.excalidraw.svg" class="h-30dvh mx-auto mt-8" />


<v-click>

# Помечаем чистые функции useMemo

</v-click>

---
class: text-center 
---

# Итог

<img src="/ending.excalidraw.svg" class="h-35dvh mx-auto" />

---
class: isolate
---

## Q&A

<div class="mx-auto flex flex-col items-center">

# Моя телега

<img src="/telegram.svg" class="w-30dvh -z-10 -my-8" />

Жаваскриптезёр (`@javastrippt`)

</div>
