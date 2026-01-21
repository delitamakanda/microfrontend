import { useEffect, useState } from "react" 
import { Spinner } from "./ui/spinner"

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
            <div className="flex flex-col items-center gap-3 py-10">
                <Spinner className="h-8 w-8" />
                <h1 className="text-sm font-medium text-muted-foreground">Loading...</h1>
            </div>
        )}
        </>
    )
}

export default SplashScreen;
