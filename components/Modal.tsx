"use client";

import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { IconButton } from "@mui/material";

type Props = {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
};

export default function Modal({ title, children, onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="py-6 px-6 border shadow-lg rounded-md bg-white flex flex-col gap-6 relative">
        <IconButton
          className="absolute top-[8px] right-[8px]"
          onClick={onClose}
        >
          <HighlightOffIcon className="text-[24px]" />
        </IconButton>
        <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
        <div>{children}</div>
      </div>
    </div>
  );
}
