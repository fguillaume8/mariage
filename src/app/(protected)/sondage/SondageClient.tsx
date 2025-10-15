'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/app/lib/supabaseClient'
import { useInvite } from '@/app/context/InviteContext'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'

interface Question {
  id_question: number
  question: string
  image_elle: string
  image_lui: string
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

  // 🔄 Récupération des invités à partir des IDs
  useEffect(() => {
    const init = async () => {
      if (!ids || ids.length === 0) return

      const { data: invites, error } = await supabase
        .from('invites')
        .select('id, nom, prenom')
        .in('id', ids)

      if (error || !invites || invites.length === 0) return

      setInviteNames(invites)

      if (invites.length > 1) {
        setSelectingPerson(true)
      } else {
        setCurrentUserId(invites[0].id)
      }
    }

    init()
  }, [ids])

  // 🔄 Récupération des questions et vérification si la personne a déjà répondu
useEffect(() => {
  if (!currentUserId) return;

  const fetchData = async () => {
    const { data: questionsData, error: errorQuestions } = await supabase
      .from('questionellelui')
      .select('*')

    const { data: reponses, error: errorReponses } = await supabase
      .from('reponseellelui')
      .select('id_question')
      .eq('id_invite', currentUserId)

    if (errorQuestions || errorReponses) {
      console.error('Erreur récupération données :', errorQuestions || errorReponses)
      return
    }

    const answeredIds = reponses?.map(r => r.id_question) || []
    const remainingQuestions = (questionsData || []).filter(q => !answeredIds.includes(q.id_question))

    setQuestions(remainingQuestions)

    if (remainingQuestions.length === 0) {
      setHasAnswered(true)
    } else {
      setStep(0)  // recommence au début de la liste restante
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

    if (!error) {
      if (step + 1 < questions.length) {
        setStep(step + 1)
      } else {
        setHasAnswered(true)
      }
    }
  }

  if (hasAnswered) {
    return <div className="text-center text-xl mt-10">Merci pour ta participation 💖</div>
  }

  if (!currentUserId && !selectingPerson) return null

  const question = questions[step]

  return (
    <div className="flex flex-col items-center justify-center bg-[#f7f4eb] min-h-screen p-4" >
      {selectingPerson && (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 ">
          <div className="bg-white w-full max-w-5xl p-8 rounded-2xl shadow-lg text-center border border-gray-300">
            <h2 className="text-lg font-semibold mb-4">Qui répond au quiz ?</h2>
            {inviteNames.map((inv) => (
              <button
                key={inv.id}
                className="block w-full py-2 px-4 mb-2 bg-powderblue text-white rounded hover:bg-ocre"
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
              <button onClick={() => handleVote('elle')} 
                      className="w-[250px] h-[250px] rounded overflow-hidden border-4 border-blue-500 hover:scale-105 transition">
                <Image
                  src={`/image/ElleLui/${question.image_elle}`}
                  alt="Elle"
                  width={150}
                  height={150}
                  className="w-full h-full object-cover"
                />
              </button>
              <button onClick={() => handleVote('lui')} 
                      className="w-[250px] h-[250px] rounded overflow-hidden border-4 border-pink-500 hover:scale-105 transition">
                <Image
                  src={`/image/ElleLui/${question.image_lui}`}
                  alt="Lui"
                  width={150}
                  height={150}
                  className="w-full h-full object-cover"
                />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
