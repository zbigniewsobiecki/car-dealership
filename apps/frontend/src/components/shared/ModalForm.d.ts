import React from 'react';
interface ModalFormProps {
    title: string;
    onCancel: () => void;
    onSubmit: (e: React.FormEvent) => void;
    submitLabel: string;
    isLoading?: boolean;
    children: React.ReactNode;
}
export declare const ModalForm: ({ title, onCancel, onSubmit, submitLabel, isLoading, children, }: ModalFormProps) => import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=ModalForm.d.ts.map