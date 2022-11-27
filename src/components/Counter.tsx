interface CounterProps{
  initial: number
}

const Counter: React.FC<CounterProps> = ({ initial }) => {
  const [count, setCount] = useState(initial)
  return (
    <div>
      {count}
      <button onClick={() => setCount(count + 1)}>+1</button>
      <button onClick={() => setCount(count - 1)}>-1</button>
    </div>
  )
}

export default Counter
