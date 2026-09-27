import React, { useState } from 'react';

const FAQS = [
    {
        question: "How does the CV booking process work?",
        answer: "Once you browse and select a template, click 'Book this Template'. You will fill out a short form with your details. Our team will then reach out to you directly to get your information and begin crafting your CV."
    },
    {
        question: "Are these templates ATS-friendly?",
        answer: "Yes! Many of our templates are specifically designed to pass through Applicant Tracking Systems (ATS) smoothly, ensuring your resume gets seen by human recruiters."
    },
    {
        question: "How long does it take to receive my completed CV?",
        answer: "Typically, we deliver your professionally formatted CV within 24-48 hours after we receive all your information and requirements."
    },
    {
        question: "Do I get the source file so I can edit it later?",
        answer: "Depending on your request, we can provide an editable format (like Word or Docs) alongside the final PDF version, so you can make minor updates in the future."
    },
    {
        question: "Can I request changes if I don't like something?",
        answer: "Absolutely. We offer revisions to make sure you are 100% satisfied with the final design and layout of your new CV."
    }
];

export default function FaqSection() {
    const [openIndex, setOpenIndex] = useState(0); // First one open by default

    return (
        <section className="py-16 px-4 max-w-4xl mx-auto text-white">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
                <p className="text-slate-300">Everything you need to know about our service.</p>
            </div>
            
            <div className="space-y-3">
                {FAQS.map((faq, index) => {
                    const isOpen = openIndex === index;
                    return (
                        <div 
                            key={index} 
                            className={`border ${isOpen ? 'border-blue-500 bg-slate-800/80' : 'border-slate-700 bg-slate-800/40 hover:bg-slate-800/60'} rounded-xl overflow-hidden transition-all duration-200 backdrop-blur-sm`}
                        >
                            <button
                                className="w-full text-left px-6 py-4 flex justify-between items-center font-medium focus:outline-none"
                                onClick={() => setOpenIndex(isOpen ? -1 : index)}
                            >
                                <span className="text-lg">{faq.question}</span>
                                <span className={`text-xl transform transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-400' : 'text-slate-400'}`}>
                                    ↓
                                </span>
                            </button>
                            
                            <div 
                                className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                                    isOpen ? 'max-h-48 pb-4 opacity-100' : 'max-h-0 opacity-0'
                                }`}
                            >
                                <p className="text-slate-300 leading-relaxed pt-2 border-t border-slate-700/50">
                                    {faq.answer}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
