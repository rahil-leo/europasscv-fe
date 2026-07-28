import React from 'react';
import { Link } from 'react-router-dom';

export default function TemplateCard({ template }) {
    return (
        <Link
            to={`/templates/${template._id}`}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden block"
        >
            <img
                src={template.imageUrl}
                alt={template.name}
                className="w-full h-80 object-contain bg-slate-100"
            />
            <div className="p-4">
                <h3 className="font-semibold text-slate-800">{template.name}</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                    {(template.qualities || []).slice(0, 3).map((q, i) => (
                        <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                            {q}
                        </span>
                    ))}
                </div>
            </div>
        </Link>
    );
}