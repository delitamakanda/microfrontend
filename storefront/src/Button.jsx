import useCount from './store'

export const Button = () => {
    const [count, setCount] = useCount(0);

    return (
        <button onClick={() => setCount(count + 1)}>
            Click me {count} times
        </button>
    );
};

export default Button;
