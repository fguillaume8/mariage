'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/app/lib/supabaseClient'
import { useInvite } from '@/app/context/InviteContext'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'

interface Question {
  id_question: number
  question: string
}

export default function ElleOuLui() {
  const { ids } = useInvite()
  const [currentUserId, setCurrentUserId] = useState<string>('')
  const [step, setStep] = useState(0)
  const [questions, setQuestions] = useState<Question[]>([])
  const [hasAnswered, setHasAnswered] = useState(false)
  const [selectingPerson, setSelectingPerson] = useState(true)
  const [inviteNames, setInviteNames] = useState<{ id: string; nom: string; prenom: string }[]>([])

 
  useEffect(() => {
    console.log("✅ SondageClient monté")
  }, [])

  // Récupération des questions et vérification de participation
useEffect(() => {
  const init = async () => {
    if (!ids || ids.length === 0) {
      console.log('Pas d\'ids disponibles.')
      return
    }

    console.log('📦 ids fournis à Supabase:', ids)

    const { data: invites, error } = await supabase
      .from('invites')
      .select('id, nom, prenom')
      .in('id', ids)

    if (error) {
      console.error('❌ Erreur lors de la récupération des invites:', error)
      return
    }

    console.log('✅ Invites récupérés :', invites)

    if (!invites || invites.length === 0) {
      console.log('⚠️ Aucun invité trouvé avec ces ids')
      return
    }

    setInviteNames(invites)

    if (invites.length > 1) {
      console.log('👥 Plusieurs invités détectés, affichage du choix')
      setSelectingPerson(true)
    } else {
      setCurrentUserId(invites[0].id)
    }
  }

  init()
}, [ids])


useEffect(() => {
  console.log('useEffect fetch questions déclenché, currentUserId =', currentUserId)
  if (!currentUserId) return

  const fetchData = async () => {
    console.log('fetchData appelé')
    const { data: reponses, error: errorReponses } = await supabase
      .from('reponseellelui')
      .select('*')
      .eq('id_invite', currentUserId)

    if (errorReponses) {
      console.error('Erreur récupération réponses:', errorReponses)
      return
    }

    if (reponses && reponses.length > 0) {
      console.log('L\'utilisateur a déjà répondu')
      setHasAnswered(true)
      return
    }

    const { data: questionsData, error } = await supabase.from('questionellelui').select('*')
    if (error) {
      console.error('Erreur récupération questions:', error)
    } else {
      console.log('Questions récupérées:', questionsData)
      setQuestions(questionsData || [])
    }
  }

  fetchData()
}, [currentUserId])


  const handleVote = async (reponse: 'elle' | 'lui') => {
    const question = questions[step]
    if (!question || !currentUserId) return

    const { error } = await supabase.from('reponseellelui').insert({
      id_question: question.id_question,
      id_invite: currentUserId,
      reponse,
    })

    if (error) {
      console.error("❌ Erreur lors de l'enregistrement de la réponse :", error)
    } else {
      console.log("✅ Réponse enregistrée :", {
        id_question: question.id_question,
        id_invite: currentUserId,
        reponse,
      })
    }

    if (step + 1 < questions.length) {
      setStep(step + 1)
    } else {
      setHasAnswered(true)
    }
  }

  if (hasAnswered) {
    return <div className="text-center text-xl mt-10">Merci pour ta participation 💖</div>
  }

 if (!currentUserId && !selectingPerson) return null


  const question = questions[step]

  
// 🧪 Logs de debug
console.log("🧪 Étape actuelle :", step)
console.log("🧪 Nombre total de questions :", questions.length)
console.log("🔍 Question actuelle :", question)

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      {selectingPerson && (
      <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full text-center border border-gray-300">
          <h2 className="text-lg font-semibold mb-4">Qui répond au quiz ?</h2>
          {inviteNames.map((inv) => (
            <button
              key={inv.id}
              className="block w-full py-2 px-4 mb-2 bg-pink-500 text-white rounded hover:bg-pink-600"
              onClick={() => {
                setCurrentUserId(inv.id)
                setSelectingPerson(false)
              }}
            >
              {inv.prenom} {inv.nom}
            </button>
          ))}
        </div>
      </div>
    )}



      
<AnimatePresence mode="wait">
  {question && (
    <motion.div
      key={question.id_question}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="text-center"
    >
      <h1 className="text-2xl font-semibold mb-6">{question.question}</h1>
      <div className="flex justify-center gap-10">
        <button onClick={() => handleVote('elle')} className="hover:scale-105 transition">
          <Image
            src="/elle.png"
            alt="Elle"
            width={150}
            height={150}
            className="rounded-full border-2 border-pink-500"
          />
        </button>
        <button onClick={() => handleVote('lui')} className="hover:scale-105 transition">
          <Image
            src="/lui.png"
            alt="Lui"
            width={150}
            height={150}
            className="rounded-full border-2 border-blue-500"
          />
        </button>
      </div>
    </motion.div>
  )}
</AnimatePresence>

    </div>
  )
}
