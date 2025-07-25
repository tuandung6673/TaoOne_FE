import React, { createContext, useState, useContext, ReactNode } from "react";

interface SpinnerContextType {
    loading: boolean;
    showSpinner: () => void;
    hideSpinner: () => void;
}

const SpinnerContext = createContext<SpinnerContextType | undefined>(undefined);

export const SpinnerProvider = ({ children }: { children: ReactNode }) => {
    const [loading, setLoading] = useState(false);

    const showSpinner = () => setLoading(true);
    const hideSpinner = () => setLoading(false);

    return (
        <SpinnerContext.Provider value={{ loading, showSpinner, hideSpinner }}>
            {children}
        </SpinnerContext.Provider>
    );
};

export const useSpinner = (): SpinnerContextType => {
    const context = useContext(SpinnerContext);
    if (!context) {
        throw new Error("useSpinner must be used within a SpinnerProvider");
    }
    return context;
};

export {}; // Thêm dòng này ở cuối file
