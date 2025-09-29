'use client'

import { useState } from 'react'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid'

export default function FaqClient() {
  const faqData = [
    {
      category: "Informations pratiques",
      items: [
        { question: "Où et quand a lieu la cérémonie ?", answer: "La cérémonie aura lieu le [date] à [lieu]." },
        { question: "À quelle heure devons-nous arriver ?", answer: "Nous vous recommandons d’arriver 15 à 30 minutes avant le début de la cérémonie." },
        { question: "Y a-t-il un dress code ?", answer: "Nous vous suggérons une tenue chic et confortable. Pas besoin de costume/cravate obligatoires." },
        { question: "Comment accéder au lieu ?", answer: "Le lieu est accessible en voiture, en train et via navette depuis certains hôtels." },
        { question: "Y a-t-il un parking sur place ?", answer: "Oui, un parking gratuit est disponible pour les invités." },
        { question: "Y a-t-il des hébergements à proximité ?", answer: "Nous avons listé des hôtels proches dans la section 'Hébergement' de notre site." },
      ]
    },
    {
      category: "Organisation de la journée",
      items: [
        { question: "Quelle est la différence entre la cérémonie civile/religieuse et la fête ?", answer: "La cérémonie est le moment officiel, suivi de la réception et de la fête pour célébrer ensemble." },
        { question: "Y aura-t-il un plan de table ?", answer: "Oui, un plan de table sera disponible à l'entrée de la réception." },
        { question: "Puis-je amener mes enfants ?", answer: "Oui, ils sont les bienvenus. Une animation spéciale sera prévue pour eux." },
        { question: "Les animaux de compagnie sont-ils acceptés ?", answer: "Malheureusement, les animaux ne sont pas autorisés sur le lieu de la cérémonie et de la réception." },
        { question: "Y a-t-il des activités prévues le lendemain ?", answer: "Oui, un brunch sera organisé pour ceux qui souhaitent prolonger la fête." },
      ]
    },
    {
      category: "Repas & boissons",
      items: [
        { question: "Que faire si j’ai des allergies ou un régime alimentaire particulier ?", answer: "Merci de nous le signaler via le formulaire RSVP afin que nous puissions nous organiser." },
        { question: "Y aura-t-il un menu végétarien / vegan / sans gluten ?", answer: "Oui, nous proposons plusieurs options adaptées à différents régimes." },
        { question: "Puis-je choisir mon plat à l’avance ?", answer: "Oui, vous pourrez indiquer votre choix lors de votre confirmation de présence." },
      ]
    },
    {
      category: "Cadeaux",
      items: [
        { question: "Avez-vous une liste de mariage ou une cagnotte ?", answer: "Oui, toutes les informations sont disponibles sur notre page 'Cadeaux'." },
        { question: "Peut-on offrir quelque chose en dehors de la liste ?", answer: "Bien sûr, tout cadeau est apprécié, mais la liste/cagnotte est là pour vous guider." },
        { question: "Préférez-vous un cadeau ou une participation au voyage de noces ?", answer: "Nous laissons le choix à chacun selon ses envies." },
      ]
    },
    {
      category: "RSVP / Réponses",
      items: [
        { question: "Comment confirmer ma présence ?", answer: "Vous pouvez confirmer votre présence via le formulaire RSVP sur notre site." },
        { question: "Jusqu’à quelle date puis-je répondre ?", answer: "Merci de répondre avant le [date limite]." },
        { question: "Puis-je venir accompagné(e) ?", answer: "Oui, vous pouvez indiquer le nombre de personnes dans le formulaire RSVP." },
        { question: "Comment signaler que je ne pourrai finalement pas venir ?", answer: "Vous pouvez mettre à jour votre réponse via le formulaire RSVP ou nous contacter directement." },
      ]
    },
    {
      category: "Divers",
      items: [
        { question: "Y aura-t-il un photographe / photobooth ?", answer: "Oui, nous aurons un photographe officiel et un photobooth pour tous les invités." },
        { question: "Pouvons-nous prendre des photos pendant la cérémonie ?", answer: "Nous préférons que vous laissiez le photographe faire son travail, mais quelques photos discrètes sont acceptées." },
        { question: "Où partager nos photos après le mariage ?", answer: "Nous créerons un album en ligne où vous pourrez déposer vos photos." },
        { question: "Que se passe-t-il en cas de pluie ?", answer: "La cérémonie et la réception sont prévues à l'intérieur si nécessaire." },
        { question: "Qui contacter en cas de question de dernière minute ?", answer: "Vous pouvez nous contacter directement via le formulaire de contact ou par téléphone." },
      ]
    }
  ]

  const [openIndex, setOpenIndex] = useState(null)

  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-10 text-center text-pink-900">FAQ - Questions fréquentes</h1>
      {faqData.map((section, idx) => (
        <div key={idx} className="mb-8">
          <h2 className={`text-2xl font-semibold mb-5 border-b pb-2`}>{section.category}</h2>
          <div className="space-y-3">
            {section.items.map((item, index) => {
              const isOpen = openIndex === `${idx}-${index}`
              return (
                <div key={index} className="border rounded-lg overflow-hidden shadow-sm">
                  <button
                    className={`w-full flex justify-between items-center p-4 font-medium text-left transition-colors `}
                    onClick={() =>
                      setOpenIndex(isOpen ? null : `${idx}-${index}`)
                    }
                  >
                    {item.question}
                    <span className="ml-2 text-pink-900 font-bold">{isOpen ? '−' : '+'}</span>
                  </button>
                  <div
                    className={`transition-all duration-300 overflow-hidden px-4`}
                    style={{ maxHeight: isOpen ? '500px' : '0' }}
                  >
                    <p className="py-3 text-pink-900">{item.answer}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}