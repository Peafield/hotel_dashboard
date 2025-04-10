import React from "react";
import { LargeActionButton } from "../buttons/LargeActionButton";

type DeleteConfirmModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
};

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}: DeleteConfirmModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-hugo-tan/80">
      <div className="bg-white p-6 w-full max-w-md">
        <h3 className="text-3xl font-medium leading-6 text-hugo-dark-gray font-sans mb-2">
          Are you sure?
        </h3>
        <div className="mt-5">
          <p className="text-lg text-hugo-dark-gray font-serif">
            You are deleting a room...
          </p>
        </div>
        <div className="mt-5 flex gap-3">
          <LargeActionButton
            title={isLoading ? "Deleting..." : "Yes Delete"}
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-hugo-red"
          />
          <LargeActionButton
            title="No take me back"
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="bg-hugo-dark-gray disabled:opacity-50"
          />
        </div>
      </div>
    </div>
  );
}
