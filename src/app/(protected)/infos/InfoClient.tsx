'use client'

import { useInvite } from '@/app/context/InviteContext'
import { useRouter } from 'next/navigation'
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component'
import 'react-vertical-timeline-component/style.min.css'
import { FaGlassCheers, FaRegClock, FaUtensils } from 'react-icons/fa'
import { useEffect, useState } from 'react'
import { supabase } from '@/app/lib/supabaseClient'

export default function InfoClient() {
  const router = useRouter()
  const { ids } = useInvite()
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


  const programme = [
    {
      title: 'Vendredi 28 août',
      description: 'Cérémonie civile à la Mairie de Savenay à 15h30. Arrivée au domaine à 18h.',
      icon: <FaRegClock />,
      visibleFor: ['Marie', 'temoin']
    },
    {
      title: 'Samedi 29 août',
      description: 'Cérémonie laïque au Domaine du Chalonges à 14h, vin d’honneur à 16h, dîner et soirée festive à partir de 19h30.',
      icon: <FaGlassCheers />,
      visibleFor: ['Marie']
    },
    {
      title: 'Dimanche 30 août',
      description: 'Brunch convivial pour ceux qui souhaitent prolonger la fête.',
      icon: <FaUtensils />,
      visibleFor: []
    }
  ]

  return (
    <div className="min-h-[calc(100vh-57px)] flex flex-col items-center bg-gradient-to-br from-[#f7f4eb] via-[#b68542]/10 to-powderblue/10 p-8">

      {/* TITRE CENTRÉ EN HAUT */}
      <h1 className="text-5xl font-bold text-powderblue mb-12 text-center w-full">
        Bienvenue sur notre site de mariage
      </h1>

      {/* Bloc central large */}
      <div className="max-w-10xl w-full h-full grid md:grid-cols-2 gap-12  mb-16 justify-center items-center">

        {/* Texte accueil centre */}
        <div className="text-center md:text-left flex flex-col items-center justify-center">
          <p className="text-lg mb-8 text-gray-700 ">
            Nous avons hâte de partager cette journée unique avec vous, entre rires, émotions et souvenirs inoubliables.
          </p>

          <h2 className="text-2xl font-semibold text-[#b68542] mb-2">
            Samedi 29 août 2026
          </h2>
          <p className="text-gray-700 mb-6">Domaine du Chalonges, Héric</p>

          {['famille', 'temoin'].includes(invite.profil) && (
            <p className="text-md text-gray-600 mb-6">
              Cérémonie civile : Vendredi 28 août à 15h — Mairie de Nantes
            </p>
          )}

          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            <button
              onClick={() => router.push('/rsvp')}
              className="px-6 py-3 rounded-lg bg-powderblue text-white font-medium hover:bg-powderblue/80 transition"
            >
              Confirmer ma présence
            </button>
            <a
              href="/faq"
              className="px-6 py-3 rounded-lg bg-[#b68542] text-white font-medium hover:bg-[#b68542]/80 transition"
            >
              En savoir plus
            </a>
          </div>
        </div>

        {/* Timeline droite */}
        <div className="w-full">
          <VerticalTimeline>
            {programme
              .filter(item => !item.visibleFor.length || item.visibleFor.includes(invite.profil))
              .map((item, idx) => (
                <VerticalTimelineElement
                  key={idx}
                  date={item.title}
                  iconStyle={{ background: '#b68542', color: '#fff' }}
                  icon={item.icon}
                  contentStyle={{ background: 'rgba(247, 244, 235, 0.6)', color: '#333', borderRadius: '16px', padding: '16px' }}
                  contentArrowStyle={{ borderRight: '7px solid #b68542' }}
                >
                  <p>{item.description}</p>
                </VerticalTimelineElement>
              ))}
          </VerticalTimeline>
        </div>

      </div>
    </div>
  )
}
