'use client'



import { useInvite } from '@/app/context/InviteContext'
import { useEffect, useState } from 'react'
import { supabase } from '@/app/lib/supabaseClient'

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

 const [invite, setInvite] = useState<{id?: number, profil: string}>({ profil: '' })

  // Récupération du profil depuis Supabase
useEffect(() => {
  const fetchInvite = async () => {
    if (!ids || ids.length === 0) return

    const { data, error } = await supabase
      .from('invites')
      .select('profil')
      .eq('id', Number(ids[0]))
      .single()

    if (error) {
      console.error('Erreur Supabase:', error)
      return
    }

    console.log('Données récupérées:', data) // <-- Ici tu vois le profil
    setInvite({ id: Number(ids[0]), profil: data.profil })
  }

  fetchInvite()
}, [ids])
  console.log('useInvite:', { ids })


  const faqData: FaqSection[] = [
    {
      category: "Informations pratiques",
      items: [
        { question: "Où et quand a lieu la cérémonie ?", answer: "La cérémonie laïque aura lieu le 29 aout 2026 au domaine du Chalonges à Héric.",visibleForProfile: [] },
        { question: "À quelle heure devons-nous arriver ?", answer: "Nous vous attendons à 14h30 au domaine",visibleForProfile: []  },
        { question: "Y a-t-il un dress code ?", answer: "Nous vous suggérons une tenue chic et confortable. Il n'y a pas de dress code imposé.",visibleForProfile: []  },
        { question: "Y a-t-il un parking sur place ?", answer: "Oui, un parking gratuit est disponible pour les invités.",visibleForProfile: []  },
        { question: "Y a-t-il des hébergements à proximité ?", answer: "Nous avons listé des hôtels proches dans la section 'Hébergement' de notre site.",visibleForProfile: ['aa','Nous']  },
        { question: "Y a-t-il des hébergements à proximité ?", answer: "Vous pouvez demander un logement sur le site dans le RSVP",visibleForProfile: ['bb','Nous']  },

      ]
    },
    {
      category: "Organisation de la journée",
      items: [
        { question: "Quelle est la différence entre la cérémonie civile et la fête ?", answer: "La cérémonie civil est le moment officiel,qui se déroule de vendredi à la mairie de Savenay. La fête et la cérémonie laïque se déroule samedi.",visibleForProfile: []  },
        { question: "Y aura-t-il un plan de table ?", answer: "Oui, un plan de table sera disponible à l'entrée de la réception.",visibleForProfile: []  },
        { question: "Puis-je amener mes enfants ?", answer: "Non, les enfants ne sont pas conviés au mariage.",visibleForProfile: []  },
        { question: "Les animaux de compagnie sont-ils acceptés ?", answer: "Malheureusement, les animaux ne sont pas autorisés sur le lieu de la cérémonie et de la réception.",visibleForProfile: []  },
        { question: "Y a-t-il des activités prévues le lendemain ?", answer: "Oui, un retour sera organisé pour ceux qui souhaitent prolonger la fête.",visibleForProfile: []  },
      ]
    },
    {
      category: "Repas & boissons",
      items: [
        { question: "Que faire si j’ai des allergies ou un régime alimentaire particulier ?", answer: "Merci de nous le signaler via le formulaire RSVP afin que nous puissions nous organiser.",visibleForProfile: []  },
        { question: "Y aura-t-il un menu végétarien ?", answer: "Oui, nous proposons une option végé",visibleForProfile: []  },
        { question: "Puis-je choisir mon plat à l’avance ?", answer: "Oui, vous pourrez indiquer votre choix lors de votre confirmation de présence.",visibleForProfile: []  },
      ]
    },
    {
      category: "Cadeaux",
      items: [
        { question: "Avez-vous une liste de mariage ou une cagnotte ?", answer: "Oui, toutes les informations sont disponibles sur notre page 'Cadeaux'.",visibleForProfile: []  },
        { question: "Peut-on offrir quelque chose en dehors de la liste ?", answer: "Bien sûr, tout cadeau est apprécié, mais la cagnotte est là pour vous guider. a retravailler",visibleForProfile: []  },
        { question: "Préférez-vous un cadeau ou une participation au voyage de noces ?", answer: "Nous avons de beaux (et gros) projet ;) .",visibleForProfile: []  },
      ]
    },
    {
      category: "RSVP / Réponses",
      items: [
        { question: "Comment confirmer ma présence ?", answer: "Vous pouvez confirmer votre présence via le formulaire RSVP sur notre site.",visibleForProfile: []  },
        { question: "Jusqu’à quelle date puis-je répondre ?", answer: "Merci de répondre avant le 01/05/2026.",visibleForProfile: []  },
        { question: "Comment signaler que je ne pourrai finalement pas venir ?", answer: "Vous pouvez mettre à jour votre réponse via le formulaire RSVP ou nous contacter directement.",visibleForProfile: []  },
      ]
    },
    {
      category: "Divers",
      items: [
        { question: "Y aura-t-il un photographe / photobooth ?", answer: "Oui, nous aurons un photographe officiel et un photobooth pour tous les invités.",visibleForProfile: []  },
        { question: "Pouvons-nous prendre des photos pendant la cérémonie ?", answer: "Nous préférons que vous laissiez le photographe faire son travail.",visibleForProfile: []  },
        { question: "Où partager nos photos après le mariage ?", answer: "Nous créerons un album en ligne où vous pourrez déposer vos photos.",visibleForProfile: []  },
        { question: "Que se passe-t-il en cas de pluie ?", answer: "La cérémonie et la réception sont prévues à l'intérieur si nécessaire.",visibleForProfile: []  },
        { question: "Qui contacter en cas de question de dernière minute ?", answer: "Vous pouvez nous contacter directement via le formulaire de contact ou par téléphone.",visibleForProfile: []  },
      ]
    }
  ]

  return (
    <div className="bg-[#f7f4eb]">
      <div className="max-w-4xl mx-auto p-6 bg-[#f7f4eb]">
        <h1 className="text-4xl font-bold mb-10  text-powderblue text-center">FAQ - Questions fréquentes</h1>
        {faqData.map((section, idx) => (
          <div key={idx} className="mb-8">
            <h2 className="text-2xl font-semibold mb-5  text-powderblue border-b pb-2">{section.category}</h2>
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
    </div>
  )
}