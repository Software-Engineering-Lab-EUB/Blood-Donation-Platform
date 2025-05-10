"use client";
import React, { useState } from "react";

type FAQItem = {
  question: string;
  answer: string;
};

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Toggle FAQ item
  const toggleFAQ = (index: number) => {
    if (openIndex === index) {
      setOpenIndex(null);
    } else {
      setOpenIndex(index);
    }
  };

  // FAQ data
  const faqItems: FAQItem[] = [
    {
      question: "Who is eligible to donate blood?",
      answer:
        "Generally, you can donate blood if you are in good health, at least 17 years old (16 with parental consent in some states), and weigh at least 110 pounds. However, eligibility can vary based on medical history, medications, travel history, and other factors. Our staff conducts a thorough screening before donation to ensure your safety and the safety of blood recipients.",
    },
    {
      question: "How often can I donate blood?",
      answer:
        "For whole blood donations, you can donate once every 56 days (about 8 weeks). If you're donating platelets, you can donate more frequently - up to 24 times per year. For plasma, you can donate every 28 days, and for double red cells, you can donate every 112 days.",
    },
    {
      question: "What happens during the blood donation process?",
      answer:
        "The donation process includes registration, a mini-physical examination (checking temperature, blood pressure, pulse, and hemoglobin levels), the actual donation which takes about 8-10 minutes, and a brief rest period with refreshments. The entire process usually takes about an hour, though the actual blood drawing only takes about 10 minutes.",
    },
    {
      question: "Is donating blood painful?",
      answer:
        "Most donors report feeling only a brief pinch when the needle is inserted. The actual donation process is typically painless. Our trained staff works to ensure your comfort throughout the process.",
    },
    {
      question: "How should I prepare for blood donation?",
      answer:
        "Before donating, make sure to get a good night's sleep, eat a healthy meal, drink plenty of fluids (water is best), and avoid fatty foods. Wear comfortable clothing with sleeves that can be rolled up. Bring a valid ID and a list of medications you're taking.",
    },
    {
      question: "What blood types are most needed?",
      answer:
        "All blood types are needed, but O negative (O-) is particularly valuable as it's the universal donor type that can be given to anyone in an emergency. AB positive (AB+) individuals are universal recipients, and AB negative (AB-) plasma can be given to anyone. Type O, A, and B negative blood types are always in high demand.",
    },
    {
      question: "How is my blood used after donation?",
      answer:
        "After donation, your blood is tested, processed, and separated into components (red cells, plasma, platelets). These components may help multiple patients with different needs, from trauma victims and surgery patients to those with cancer, blood disorders, or chronic illnesses.",
    },
    {
      question: "Are there any side effects of donating blood?",
      answer:
        "Most donors feel fine after donating. Some may experience light-headedness, dizziness, or fatigue. These symptoms typically resolve quickly with rest and refreshments. We recommend drinking extra fluids, avoiding strenuous activities for 24 hours, and keeping the bandage on for several hours.",
    },
    {
      question: "Can I donate if I'm taking medication?",
      answer:
        "Many medications are acceptable for blood donation. However, some medications may require a waiting period after your last dose before you can donate. During your pre-donation screening, be sure to inform our staff about all medications you're taking.",
    },
    {
      question: "How do I find blood donation drives in my area?",
      answer:
        "You can find local blood drives by searching on our platform, contacting your local blood center, or checking with community organizations, schools, or workplaces that might host drives. Our platform also allows you to set up notifications for upcoming drives in your area.",
    },
  ];

  return (
    <section className="py-6 sm:py-8 md:py-12 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-red-600 mb-4 sm:mb-6 md:mb-8">
            Frequently Asked Questions
          </h2>
          <p className="text-sm sm:text-base text-gray-600 text-center mb-6 sm:mb-8">
            Find answers to common questions about blood donation, eligibility,
            and our platform.
          </p>

          {/* FAQ Accordion */}
          <div className="space-y-2 sm:space-y-3 md:space-y-4">
            {faqItems.map((item, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <button
                  className="flex justify-between items-center w-full px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-sm sm:text-base font-medium text-gray-800 hover:bg-gray-50 focus:outline-none"
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={openIndex === index}
                  aria-controls={`faq-answer-${index}`}
                >
                  <span className="pr-2">{item.question}</span>
                  <svg
                    className={`flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 text-red-600 transform ${
                      openIndex === index ? "rotate-180" : ""
                    } transition-transform duration-200`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                <div
                  id={`faq-answer-${index}`}
                  className={`px-3 sm:px-4 md:px-6 py-3 sm:py-4 bg-gray-50 text-xs sm:text-sm md:text-base text-gray-600 ${
                    openIndex === index ? "block" : "hidden"
                  }`}
                >
                  {item.answer}
                </div>
              </div>
            ))}
          </div>

          {/* Additional Help */}
          <div className="mt-8 sm:mt-10 md:mt-12 bg-red-50 p-4 sm:p-5 md:p-6 rounded-lg text-center">
            <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">
              Still have questions?
            </h3>
            <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-3 sm:mb-4">
              Our team is here to help with any additional questions about blood
              donation.
            </p>
            <button className="bg-red-600 hover:bg-red-700 text-white text-sm sm:text-base font-medium py-2 px-4 sm:px-6 rounded-lg transition duration-300">
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}