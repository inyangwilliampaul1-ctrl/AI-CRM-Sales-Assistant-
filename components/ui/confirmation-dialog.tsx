"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface ConfirmationDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    buttonText?: string;
    onConfirm: () => void;
}

export function ConfirmationDialog({
    isOpen,
    title,
    message,
    buttonText = "OK",
    onConfirm,
}: ConfirmationDialogProps) {
    const [show, setShow] = useState(isOpen);

    useEffect(() => {
        setShow(isOpen);
    }, [isOpen]);

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-lg bg-background p-6 shadow-lg animate-in fade-in zoom-in-95 duration-200">
                <div className="flex flex-col space-y-4 text-center">
                    <div className="rounded-full bg-green-100 p-3 mx-auto w-fit">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6 text-green-600"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                            />
                        </svg>
                    </div>
                    <h2 className="text-xl font-semibold">{title}</h2>
                    <p className="text-muted-foreground">{message}</p>
                    <Button
                        onClick={() => {
                            setShow(false);
                            onConfirm();
                        }}
                        className="w-full"
                    >
                        {buttonText}
                    </Button>
                </div>
            </div>
        </div>
    );
}
