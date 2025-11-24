// src/components/ui/Card.tsx
// Componente de Card genérico para organizar blocos de conteúdo.

import { ReactNode } from "react";

interface CardProps {
  title?: string;
  description?: string;
  children?: ReactNode;
}

export function Card({ title, description, children }: CardProps) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow">
      {title && <h2 className="text-lg font-semibold mb-1">{title}</h2>}
      {description && (
        <p className="text-sm text-gray-400 mb-3">{description}</p>
      )}
      {children}
    </div>
  );
}
