import { useState } from "react";

const faqs = [
    {
        question: "What type of properties does Seman sell?",
        answer:
            "Seman offers a variety of premium real estate options, including both fully developed buildings and strategically located landed properties. Our properties are carefully selected to meet the needs of homeowners, businesses, and investors seeking secure and high-value investments.",
    },
    {
        question:
            "If I make an initial deposit and decide not to proceed, can I request a refund?",
        answer:
            "Yes, you may request a refund if you decide not to proceed after making an initial deposit. However, all refunds are subject to the company's Terms and Conditions. We strongly recommend reviewing these terms or consulting with our representatives for full details before making any payment.",
    },
    {
        question: "What documents will I receive after completing my payment?",
        answer:
            "Upon completion of payment, you will first receive an official Allocation Letter confirming the property assigned to you. Subsequently, once construction on the property reaches the lintel level, a Deed of Assignment will be issued to you as further proof of ownership.",
    },
    {
        question:
            "How soon will I receive my allocation after completing my payment?",
        answer:
            "Your allocation will be processed and issued within two (2) working days after confirmation of full payment. This ensures a swift and transparent transition to property ownership.",
    },
    {
        question: "Is the land payment inclusive of the infrastructural levy?",
        answer:
            "No, the land payment does not include the infrastructural levy. The levy is paid separately and covers the provision of essential estate infrastructure such as roads, drainage systems, electricity, security, and other shared amenities.",
    },
    {
        question:
            "Can I make adjustments to support a different kind of building design?",
        answer:
            "You are free to design the internal layout of your home, including the number of rooms, according to your preferences. However, the external appearance of the building must remain uniform and consistent with the estate's approved architectural design to preserve the planned aesthetics and value of the community.",
    },
];

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="min-h-screen bg-stone-50 px-6 py-20">
            {/* Google Fonts */}
            <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=DM+Sans:wght@300;400;500&display=swap');`}</style>

            <div className="mx-auto max-w-360 px-4">
                {/* Header */}
                <div className="mb-14">
                    <span
                        className="mb-4 inline-block text-xs font-medium uppercase tracking-widest text-amber-700"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                        Support Center
                    </span>
                    <div className="mb-5 h-0.5 w-12 bg-linear-to-r from-amber-700 to-transparent" />
                    <h1
                        className="mb-4 text-5xl font-semibold leading-tight text-stone-900"
                        style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                        Frequently Asked
                        <br />
                        Questions
                    </h1>
                    <p
                        className="max-w-md text-base font-light leading-relaxed text-stone-500"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                        Find answers to common questions about our properties, processes,
                        and ownership documentation.
                    </p>
                </div>

                {/* Accordion */}
                <div>
                    {faqs.map((faq, index) => {
                        const isOpen = openIndex === index;
                        return (
                            <div
                                key={index}
                                className="border-b border-amber-900/10 first:border-t"
                            >
                                <button
                                    onClick={() => toggle(index)}
                                    aria-expanded={isOpen}
                                    className="flex w-full items-center justify-between gap-6 py-7 text-left"
                                >
                                    <span
                                        className={`text-xl font-medium leading-snug transition-colors duration-200 ${isOpen ? "text-amber-700" : "text-stone-900"
                                            }`}
                                        style={{ fontFamily: "'Cormorant Garamond', serif" }}
                                    >
                                        {faq.question}
                                    </span>

                                    {/* Icon */}
                                    <span
                                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-[1.5px] transition-all duration-300 ${isOpen
                                                ? "rotate-45 border-amber-700 bg-amber-700"
                                                : "border-amber-700 bg-transparent"
                                            }`}
                                    >
                                        <svg
                                            width="14"
                                            height="14"
                                            viewBox="0 0 14 14"
                                            fill="none"
                                            stroke={isOpen ? "#fff" : "#b45309"}
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                        >
                                            <line x1="7" y1="1" x2="7" y2="13" />
                                            <line x1="1" y1="7" x2="13" y2="7" />
                                        </svg>
                                    </span>
                                </button>

                                {/* Answer */}
                                <div
                                    className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                                        }`}
                                >
                                    <p
                                        className="pb-7 pr-14 text-base font-light leading-relaxed text-stone-500"
                                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                                    >
                                        {faq.answer}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Contact Strip */}
                <div className="mt-14 flex flex-wrap items-center justify-between gap-4 rounded bg-stone-900 px-9 py-7">
                    <p
                        className="text-sm font-light text-stone-400"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                        <span className="font-medium text-white">Still have questions?</span>{" "}
                        Our team is ready to assist you.
                    </p>
                    <button
                        className="rounded bg-amber-700 px-6 py-3 text-xs font-medium uppercase tracking-widest text-white transition-colors duration-200 hover:bg-amber-600"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                        Contact Us
                    </button>
                </div>
            </div>
        </div>
    );
}