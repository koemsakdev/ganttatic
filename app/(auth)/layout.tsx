import React from "react";
import { Navbar } from "../(dashboard)/_components/navbar";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="relative min-h-screen w-full">
            <div className="fixed top-0 left-0 w-full z-50">
                <Navbar isAuthLayout={true} />
            </div>
            <div className={"h-screen w-full flex items-center justify-center"}>
                {children}
            </div>
        </div>
    )
}

export default AuthLayout;