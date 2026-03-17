---
theme: default
title: Искусство ухода за React Compiler
info: |
  ## Slidev Starter Template
  Presentation slides for developers.

  Learn more at [Sli.dev](https://sli.dev)
# apply UnoCSS classes to the current slide
class: text-center
# https://sli.dev/features/drawing
drawings:
  persist: false
# slide transition: https://sli.dev/guide/animations.html#slide-transitions
transition: slide-left
# enable Comark Syntax: https://comark.dev/syntax/markdown
comark: true
# duration of the presentation
duration: 35min
---

### Искусство ухода за React Compiler

---
class: "flex flex-col"
---

### React Compiler - это крута!!!

<Compiler />

---

### Что с деньгами?

<video src="/check-compiler.mp4" loop class="mt-2 h-55dvh mx-auto" autoPlay muted />

---

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

</v-click>

---

### А как компилировать?

<div v-click class="grid grid-cols-2 gap-4 mt-4">

<div>
<img class="h-8dvh mx-auto" src="/babel.png" />



```ts 
log("Ты собака" + "я собака")
```


</div>



<img src='/babel-ast.svg' class="h-30dvh" />


</div>

---

#### `babel-plugin-glowup-vibes`

<div class="grid grid-cols-2 gap-4">


| Your Code                                                              | JS                                                   |
|------------------------------------------------------------------------|------------------------------------------------------|
| `noCap`                                                                  | `true`                                                 |
| `cap`                                                                    | `false`                                                |
| `onGod`                                                                  | `true`                                                 |

````md magic-move
```ts
lowkey.stan(
  [1, 2, 3, 4].skibidi(it => {
    if (it < 2) ghosted
    
    toilet(true)
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

TODO: image

---


<Progress step="1" total="6" />

### HIR


```ts 
log("Ты собака" + "я собака")
```

TODO: add image

---

<Progress step="2" total="6" />

### Пре оптимизация

---

<Progress step="3" total="6" />

### Type & Effect inference

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
  // reactive write
  if (/* reactive read */ props.count > 10) {
    arr.push(10) 
  } else {
    arr.push(20)
  }
}
```
```ts
const Component = (props) => {
  const arr = [] // reactive array
  // reactive write
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
    // reactive write
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
    // reactive write
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

<Progress step="5" total="6" />

### Optimization + validation

- перетряхивание скоупов
- удаление плохих оптимизаций

---


<Progress step="6" total="6" />

### Codegen

---

### Итоги

---

### Пошли чинить пример
