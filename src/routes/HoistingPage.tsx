import { useRef, useState, } from "react"

const SimpleHoisting = (
  props: {items: number[]}
) => {
  return props.items.map(it => (
    <button key={it}>
      {it}
    </button>
  ))
}

const CallbackHoisting = (props: { items: number[];  onClick(item: number): void}) => {
  return props.items.map(it => (
    <button key={it} onClick={() => props.onClick(it)}>
      {it}
    </button>
  ))
}

const CallbackHoistingMemo = (props: { items: number[];  onClick(item: number): void}) => {
  "use memo"

  return props.items.map(it => (
    <button key={it} onClick={() => props.onClick(it)}>
      {it}
    </button>
  ))
}

const LocalArrayHoisting = (props: { amount: number; onClick(item: number): void }) => {
  const items = useState(
    () =>
      Array.from({
        length: props.amount
      }, () => Math.random() * 100)
  )[0]

  return items.map(it => (
    <button key={it} onClick={() => props.onClick(it)}>
      {it}
    </button>
  ))
}


const TransformHeuristicNoTopLevelJSX = (props: { amount: number}) => {
  return Array.from({ length: props.amount },
    (_, key) => (
      <div key={key}>{key}</div>
    )
  )
}

const TransformHeuristicNoTopLevelJSXWithHook = (props: {  amount: number}) => {
  useRef(null)
  return Array.from({ length: props.amount },
    (_, key) => (
      <div key={key}>{key}</div>
    )
  )
}
const TransformHeuristicTopLevelJSX = (props: { amount: number }) => {
  return <>
    {Array.from(
      { length: props.amount },
    (_, key) => (
      <div key={key}>{key}</div>
    ))}
  </>
}

// const Loading = () => {
//   return <>Loading</>
// }

// const Failed = () => {
//   return <>Error</>
// }

// const Ok = () => {
//   return <>Ok</>
// }

// const ObjectReads = () => {
//   const status = useStatus()
//   const {isLoading, isFailed} = useStatus()

//   return (
//     <>
//       {status.isLoading ? <Loading /> : status.isFailed ? <Failed /> : <Ok />}
//       {isLoading ? <Loading /> : isFailed ? <Failed /> : <Ok />}
//     </>
//   )
// }


export const HoistingPage = () => {
  const items = useState(
    () =>
      Array.from({
        length: 25
      }, () => Math.random() * 100)
  )[0]


  return (
    <>
      <div className="flex max-w-[100vw]">
        <SimpleHoisting items={items} />
      </div>

      <div className="flex max-w-[100vw]">
        <CallbackHoisting onClick={(it) => {
          console.log(it)
        }} items={items} />
      </div>

      <div className="flex max-w-[100vw]">
        <CallbackHoistingMemo onClick={(it) => {
          console.log(it)
        }} items={items} />
      </div>

      <div className="flex max-w-[100vw]">
        <LocalArrayHoisting onClick={(it) => {
          console.log(it)
        }} amount={25} />
      </div>
  </>
  )
}
