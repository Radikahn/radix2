import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { CurseForgeFinder } from "./components/curse-forge";
import { ToastContainer } from "react-toastify";

import "./index.css";
import { Suggestions } from "./components/suggestions";

const queryClient = new QueryClient();

const rootElement = document.getElementById("root")!;
const root = createRoot(rootElement);

const Root = () => {
    return (
        <main className="p-2">
            <header className="mb-4 flex flex-col items-center justify-center">
                <h1 className="uppercase text-blue-400 text-4xl font-semibold flex items-center justify-center gap-x-2 animate-wiggle">
                    Radix Packs
                </h1>
            </header>

            <ToastContainer position="bottom-left" autoClose={2_500} />

            <div className="flex">
                <CurseForgeFinder />
                <Suggestions />
            </div>
        </main>
    );
};

root.render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <Root />
        </QueryClientProvider>
    </StrictMode>,
);
