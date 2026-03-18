---
theme: default
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
layout: statement
# enable Comark Syntax: https://comark.dev/syntax/markdown
comark: true
# duration of the presentation
duration: 35min
---

## Искусство ухода за React Compiler

---

## Йоу, я Валера

- фронтенжу в стартапах
- люблю закопаться
- слежу за performance

---
class: "flex flex-col"
---

### React Compiler - это крута!!!

<Compiler />

---

### Что с деньгами?

<video src="/check-compiler.mp4" loop class="mt-2 h-55dvh mx-auto" autoPlay muted />

---

### Что вообще компилятор делает?

<!-- https://playground.react.dev/#N4Igzg9grgTgxgUxALhAgHgBwjALgAgBMEAzAQygBsCSoA7OXASwjvwFkBPAQU0wAoAlPmAAdNvjiswBANpT6uBDAA0+MAlwBhaHSUwAuvgC8+KBoDKuMkv4AGQePH58MTbDYAeQkwBu+Vi1KJjgAa2NgIRMAPnVNHUVlfiYCY1iU-ABqfABGQQBfaOcXfAAJBEpKCHwAdRxKQhEFPWV84s8Aeh9faIBucTa6EBUQKToSJgBzFBAmAFtsPHxcTkwEEXwABUooSaY6AHlMZml8fPwSGAg5-AByACMye4qAWkwdvboXtzJGF6kFkxKMoukwZLd+nRxPwxBIOh0AZggTYWHR2BBiMh8KIQGRKjiBuoUWAJggwFsPvsjic6GBBL1huAABYQADuAEkWjA6HiwChyJQNPkgA -->

<img src='/the-goal.webp' class="h-45dvh mx-auto" />

<v-click>

`_c(3)` ~= `useArray(3)`

`Symbol.for('react.memo_cache_sentinel')` = `<empty-slot>`

</v-click>

<!-----

### React vs Compiler

<br />

<v-click>

```sh
-------------------------------------------------------------------------------
Project                     files          blank        comment           code
-------------------------------------------------------------------------------
react                          50            346           1015           3265
react-dom                      73            422            654           3921
compiler                      142           2809           7975          43268
-------------------------------------------------------------------------------
```

<br />

- кто у мамы такой пухляш?

</v-click>-->

---

### А как компилировать?

<div v-click class="grid grid-cols-2 gap-4 mt-4">

<div>
<img class="h-10dvh mx-auto" src="/babel.png" />



```ts 
log("Ты собака" + "я собака")
```

- AST Tree


</div>


<img src='/babel-ast.svg' class="h-45dvh" />


</div>

---

#### `babel-plugin-glowup-vibes`

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

<v-click>

- AST деревья
- Создан для изменения и валидации кода
- типов нету

</v-click>

</div>

---


<img src="/pipeline.svg" class="w-80dvw mt-2dvh" />

---


<Progress step="1" total="6" />

### High-Level Intermediate Representation


```ts 
log("Ты собака" + "я собака")
```

<img v-click src="/HIR.excalidraw.svg" class="h-45dvh mx-auto" />

---

<Progress step="2" total="6" />

### Пре оптимизация

<img v-click.hide="+1" src="/pre-opts.excalidraw.svg" class="h-45dvh inset-x-0 mx-auto absolute" />

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

### Type & Effect inference

<img src="/types-and-effects.excalidraw.svg" class="h-40dvh mx-auto" />

<div v-click class="mt-4">

Мы знаем, что мы вообще можем оптимизировать

</div>

---

<Progress step="4" total="6" />

### Reactivity detection

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

### Optimization + validation

- перетряхивание скоупов
- удаление плохих оптимизаций

---


<Progress step="6" total="6" />

### Codegen

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

### Итоги

<img src="/pipeline-details.excalidraw.svg" class="h-52dvh mx-auto" />

---
layout: statement
---

## Пошли чинить пример

---

### Pain points

- чтение объектов по условию
- HIR несовместимый код
- компилятор делает что-то странное

---

## Q&A

---

## Моя телега
