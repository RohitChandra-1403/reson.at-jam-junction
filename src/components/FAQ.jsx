import React from 'react';
import { HelpCircle } from 'lucide-react';

export default function FAQ() {
  const faqs = [
    { q: "Do I need to be a professional musician?", a: "Absolutely not! Jam Junction is for everyone, from bathroom singers to touring artists. It's about community, not perfection." },
    { q: "Should I bring my own instrument?", a: "Yes! If you have one, bring it. We usually have a few spare acoustic guitars and cajons passing around, but having your own is always better." },
    { q: "Is there an entry fee?", a: "Usually, our community jams are free or have a very small cover charge just to pay for the venue and basic gear. Check the RSVP details for the specific session." },
    { q: "Can I just come to listen?", a: "100%. We need an audience as much as we need performers! Come vibe, have a coffee, and enjoy the music." }
  ];

  return (
    <section className="py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-4 mb-12">
        <HelpCircle className="w-8 h-8 text-amber-500" />
        <h2 className="text-3xl md:text-4xl font-bold">Newcomer FAQ</h2>
      </div>

      <div className="space-y-6">
        {faqs.map((faq, idx) => (
          <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 hover:bg-white/10 transition-colors">
            <h3 className="text-xl font-bold mb-3 text-violet-400">{faq.q}</h3>
            <p className="text-gray-300 leading-relaxed">{faq.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
