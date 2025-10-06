'use client'


import { useState } from 'react'
import { useInvite } from '@/app/context/InviteContext'


interface FaqItem {
  question: string
  answer: string
  visibleForProfile?: string[]
}

interface FaqSection {
  category: string
  items: FaqItem[]
}
export default function FaqClient() {
  const { ids } = useInvite()
  const [openIndex, setOpenIndex] = useState<string | null>(null)

  // Ici on prend juste le premier invité pour l'exemple
  // Tu peux adapter si tu veux gérer plusieurs invités
  const invite = ids && ids.length > 0 ? { profil: 'logement_Oui' } : { profil: '' }

  const faqData: FaqSection[] = [
    {
      category: "Informations pratiques",
      items: [
        { question: "Où et quand a lieu la cérémonie ?", answer: "La cérémonie laïque aura lieu le 29 aout 2026 au domaine du Chalonges à Héric.",visibleForProfile: [] },
        { question: "À quelle heure devons-nous arriver ?", answer: "Nous vous attendons à 14h30 au domaine",visibleForProfile: []  },
        { question: "Y a-t-il un dress code ?", answer: "Nous vous suggérons une tenue chic et confortable. Il n'y a dress code imposé.",visibleForProfile: []  },
        { question: "Y a-t-il un parking sur place ?", answer: "Oui, un parking gratuit est disponible pour les invités.",visibleForProfile: []  },
        { question: "Y a-t-il des hébergements à proximité ?", answer: "Nous avons listé des hôtels proches dans la section 'Hébergement' de notre site.",visibleForProfile: ['aa']  },
      ]
    },
    {
      category: "Organisation de la journée",
      items: [
        { question: "Quelle est la différence entre la cérémonie civile/religieuse et la fête ?", answer: "La cérémonie est le moment officiel, suivi de la réception et de la fête pour célébrer ensemble.",visibleForProfile: []  },
        { question: "Y aura-t-il un plan de table ?", answer: "Oui, un plan de table sera disponible à l'entrée de la réception.",visibleForProfile: []  },
        { question: "Puis-je amener mes enfants ?", answer: "Oui, ils sont les bienvenus. Une animation spéciale sera prévue pour eux.",visibleForProfile: []  },
        { question: "Les animaux de compagnie sont-ils acceptés ?", answer: "Malheureusement, les animaux ne sont pas autorisés sur le lieu de la cérémonie et de la réception.",visibleForProfile: []  },
        { question: "Y a-t-il des activités prévues le lendemain ?", answer: "Oui, un brunch sera organisé pour ceux qui souhaitent prolonger la fête.",visibleForProfile: []  },
      ]
    },
    {
      category: "Repas & boissons",
      items: [
        { question: "Que faire si j’ai des allergies ou un régime alimentaire particulier ?", answer: "Merci de nous le signaler via le formulaire RSVP afin que nous puissions nous organiser.",visibleForProfile: []  },
        { question: "Y aura-t-il un menu végétarien / vegan / sans gluten ?", answer: "Oui, nous proposons plusieurs options adaptées à différents régimes.",visibleForProfile: []  },
        { question: "Puis-je choisir mon plat à l’avance ?", answer: "Oui, vous pourrez indiquer votre choix lors de votre confirmation de présence.",visibleForProfile: []  },
      ]
    },
    {
      category: "Cadeaux",
      items: [
        { question: "Avez-vous une liste de mariage ou une cagnotte ?", answer: "Oui, toutes les informations sont disponibles sur notre page 'Cadeaux'.",visibleForProfile: []  },
        { question: "Peut-on offrir quelque chose en dehors de la liste ?", answer: "Bien sûr, tout cadeau est apprécié, mais la liste/cagnotte est là pour vous guider.",visibleForProfile: []  },
        { question: "Préférez-vous un cadeau ou une participation au voyage de noces ?", answer: "Nous laissons le choix à chacun selon ses envies.",visibleForProfile: []  },
      ]
    },
    {
      category: "RSVP / Réponses",
      items: [
        { question: "Comment confirmer ma présence ?", answer: "Vous pouvez confirmer votre présence via le formulaire RSVP sur notre site.",visibleForProfile: []  },
        { question: "Jusqu’à quelle date puis-je répondre ?", answer: "Merci de répondre avant le [date limite].",visibleForProfile: []  },
        { question: "Puis-je venir accompagné(e) ?", answer: "Oui, vous pouvez indiquer le nombre de personnes dans le formulaire RSVP.",visibleForProfile: []  },
        { question: "Comment signaler que je ne pourrai finalement pas venir ?", answer: "Vous pouvez mettre à jour votre réponse via le formulaire RSVP ou nous contacter directement.",visibleForProfile: []  },
      ]
    },
    {
      category: "Divers",
      items: [
        { question: "Y aura-t-il un photographe / photobooth ?", answer: "Oui, nous aurons un photographe officiel et un photobooth pour tous les invités.",visibleForProfile: []  },
        { question: "Pouvons-nous prendre des photos pendant la cérémonie ?", answer: "Nous préférons que vous laissiez le photographe faire son travail, mais quelques photos discrètes sont acceptées.",visibleForProfile: []  },
        { question: "Où partager nos photos après le mariage ?", answer: "Nous créerons un album en ligne où vous pourrez déposer vos photos.",visibleForProfile: []  },
        { question: "Que se passe-t-il en cas de pluie ?", answer: "La cérémonie et la réception sont prévues à l'intérieur si nécessaire.",visibleForProfile: []  },
        { question: "Qui contacter en cas de question de dernière minute ?", answer: "Vous pouvez nous contacter directement via le formulaire de contact ou par téléphone.",visibleForProfile: []  },
      ]
    }
  ]

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-10 text-center">FAQ - Questions fréquentes</h1>
      {faqData.map((section, idx) => (
        <div key={idx} className="mb-8">
          <h2 className="text-2xl font-semibold mb-5 border-b pb-2">{section.category}</h2>
          <div className="space-y-3">
            {section.items
              .filter(
                item =>
                  !item.visibleForProfile ||
                  item.visibleForProfile.length === 0 ||
                  item.visibleForProfile.includes(invite.profil)
              )
              .map((item, index) => {
                const isOpen = openIndex === `${idx}-${index}`
                return (
                  <div key={index} className="border rounded-lg overflow-hidden shadow-sm">
                    <button
                      className="w-full flex justify-between items-center p-4 font-medium text-left bg-white hover:bg-gray-100 transition-colors"
                      onClick={() => setOpenIndex(isOpen ? null : `${idx}-${index}`)}
                    >
                      {item.question}
                      <span className="ml-2 font-bold">{isOpen ? '−' : '+'}</span>
                    </button>
                    <div
                      className="transition-all duration-300 overflow-hidden bg-gray-50 px-4"
                      style={{ maxHeight: isOpen ? '500px' : '0' }}
                    >
                      <p className="py-3">{item.answer}</p>
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