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
        { question: "Où et quand a lieu la cérémonie civile ?", answer: `La cérémonie civile se déroule à la mairie de Savenay le vendredi 28 à 15h30. <div style="display: flex; justify-content: center; margin-top: 1rem;"> <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3255.223874044167!2d-1.9468952232719519!3d47.35895010504562!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x480581794c7d45ff%3A0xf1f6affe51dfffca!2sMairie!5e1!3m2!1sfr!2sfr!4v1762186684065!5m2!1sfr!2sfr" center width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div>`,visibleForProfile: ['All in', 'All out', 'Demi pension', 'Marie', 'Témoin'] },
        { question: "Où et quand a lieu la cérémonie laïque  ?", answer: `La cérémonie laïque aura lieu le 29 aout 2026 au domaine du l'écodomaine du Chalonges à Héric.<div style="display: flex; justify-content: center; margin-top: 1rem;"> <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d16923.339465287983!2d-1.5957124487456429!3d47.402620405578205!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4805f5cc7853c08b%3A0xf984f8327e52c6ce!2s%C3%89co-Domaine%20du%20Chalonge!5e1!3m2!1sfr!2sfr!4v1762958850982!5m2!1sfr!2sfr" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div>`,visibleForProfile: [] },
        { question: "Qu’est-ce qu’une cérémonie laïque ?", answer: " La cérémonie laïque est une célébration symbolique, libre et personnalisée sans connotations religieuses ou administratives.",visibleForProfile: []  },
        { question: "À quelle heure devons-nous arriver ?", answer: "Nous vous attendons à 14h30 au domaine",visibleForProfile: []  },

        { question: "Y a-t-il un parking sur place ?", answer: "Oui, un parking gratuit est disponible pour les invités.",visibleForProfile: []  },
        { question: "Y a-t-il des hébergements à proximité ?", answer: "Vous pouvez réserver un logement à l'hôtel l'Abreuvoir ou sur airbnb. Il y a aussi des gîtes en location à la semaine pour les vacanciers (par exemple : au paradis des 4 saisons).",visibleForProfile: ['All out','Externe']  },
        { question: "Y a-t-il des hébergements à proximité ?", answer: "Vous pouvez demander un logement sur le site dans le RSVP. Sinon vous pouvez réserver un logement à l'hôtel l'Abreuvoir ou sur airbnb. Il y a aussi des gîtes en location à la semaine pour les vacanciers (par exemple : au paradis des 4 saisons).",visibleForProfile: ['All in','Cantine','Demi pension','Marie','Témoin']  },
        { question: "Comment ça se passe si j’ai un logement sur place ?", answer: "Les logements sont disponibles à partir du vendredi soir 18h ou le samedi matin. Les concernés auront plus de détails ultérieurement (Nous non plus on sait pas). ",visibleForProfile: ['All in','Cantine','Demi pension','Marie','Témoin']  },
        ]
    },
    {
      category: "Organisation de la journée",
      items: [

        { question: "Y a-t-il un dress code ?", answer: " Il n'y a pas de dress code imposé. Nous vous suggérons une tenue chic et confortable. Une grande partie de la journée se passera sur l'herbe.",visibleForProfile: []  },
        /*{ question: "Quelle est la différence entre la cérémonie civile/religieuse et la fête ?", answer: "La cérémonie est le moment officiel, suivi de la réception et de la fête pour célébrer ensemble.",visibleForProfile: []  },*/
        { question: "Y aura-t-il un plan de table ?", answer: "Oui, un plan de table sera disponible à l'entrée de la réception.",visibleForProfile: []  },
        { question: "Puis-je amener mes enfants, mon +1 ?", answer: "Non, les faire-part sont nominatifs.",visibleForProfile: []  },
        { question: "Les animaux de compagnie sont-ils acceptés ?", answer: "Malheureusement, les animaux ne sont pas autorisés sur le domaine.",visibleForProfile: []  },
        { question: "Y a-t-il des activités prévues le lendemain ?", answer: "Oui, un retour de noce est prévu entre 11h et 15h.",visibleForProfile: []  },
      ]
    },
    {
      category: "Repas & boissons",
      items: [
        { question: "Que faire si j'ai des allergies ou un régime alimentaire particulier ?", answer: "Merci de nous le signaler via le formulaire RSVP afin que nous puissions nous organiser.",visibleForProfile: []  },
        { question: "Puis-je choisir mon plat à l’avance ? Y aura-t-il un menu végétarien ?", answer: "Oui, vous pouvez indiquer votre choix entre un plat végé et un plat au canard via le formulaire RSVP",visibleForProfile: []  },
      ]
    },
    {
      category: "Cadeaux",
      items: [

        { question: "Avez-vous une liste de mariage ou une cagnotte ?", answer: "Oui, toutes les informations sont disponibles sur notre page 'Cagnotte'.",visibleForProfile: []  },
        { question: "Peut-on offrir quelque chose en dehors de la liste ?", answer: " Bien sûr ! Si vous préférez offrir un autre cadeau, cela nous touchera beaucoup. Cependant, nous avons déjà tout ce qu'il nous faut pour la maison (si ce n'est la maison !) et notre plus grand rêve est de vivre une belle aventure pour notre voyage de noces. C'est pourquoi une participation à la cagnotte serait le plus beau des cadeaux pour nous aider à créer de merveilleux souvenirs",visibleForProfile: []  },
        /*{ question: "Préférez-vous un cadeau ou une participation au voyage de noces ?", answer: "Nous laissons le choix à chacun selon ses envies.",visibleForProfile: []  },*/
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
                        <div
  className="py-3 prose max-w-none justify"
  dangerouslySetInnerHTML={{ __html: item.answer }}
/>
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