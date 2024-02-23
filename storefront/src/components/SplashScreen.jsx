import { useEffect, useState } from "react" 
import { ProgressSpinner } from "primereact/progressspinner"

const SplashScreen = () => {
    const [isVisible, setVisible] = useState(true);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setVisible(false);
        }, 3000);
        return () => clearTimeout(timeout);
    }, []);

    return (
        <>
        {isVisible && (
            <div className="">
                <ProgressSpinner />
                <h1>Loading...</h1>
            </div>
        )}
        </>
    )
}

export default SplashScreen;
