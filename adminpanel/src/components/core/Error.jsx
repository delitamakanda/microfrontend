import { Link } from 'react-router-dom'
export const ErrorComponent = () => {
    return (
        <div className="fixed w-full h-full top-0 left-0 ">
            <div className="flex align-items-center justify-content-center relative">
                <div className="w-full flex justify-content-end align-items-start absolute top-0 left-0 z-1"></div>
                <div className="h-screen flex justify-content-center align-items-center w-full lg:w-6">
                    <div className="z-5 w-6 h-6">
                        <h1 className="text-6xl font-light my-4 mx-0 ">Page Not Found</h1>
                        <Link to="/" className="text-blue-500 hover:text-blue-700">Back to Home</Link>
                    </div>
                </div>
            </div>
        </div>
    )
};