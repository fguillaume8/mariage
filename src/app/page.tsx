/* eslint-disable @next/next/no-img-element */
'use client'

import { useState, useEffect  } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from './lib/supabaseClient'
import { Invite } from './lib/types'
import { useInvite } from './context/InviteContext'



export default function Home() {
  const [nom, setNom] = useState('')
  const [prenom, setPrenom] = useState('')
  const [erreur, setErreur] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [groupMembers, setGroupMembers] = useState<Invite[]>([])
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const { setIds } = useInvite()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null // ou un loader neutre

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault()
    setErreur('')

    // Cherche l’invité
    const { data: inviteData, error: inviteError } = await supabase
      .from('invites')
      .select()
      .ilike('nom', nom.trim())
      .ilike('prenom', prenom.trim())

    if (inviteError || !inviteData || inviteData.length === 0) {
      setErreur("Aucun invité trouvé avec ce nom/prénom.")
      return
    }

    const invite = inviteData[0]
    if (invite.groupe_id) {
      // Récupère tous les membres du groupe
      const { data: groupData, error: groupError } = await supabase
        .from('invites')
        .select()
        .eq('groupe_id', invite.groupe_id)

      if (groupError || !groupData || groupData.length === 0) {
        setErreur("Erreur lors de la récupération du groupe.")
        return
      }

      if (groupData.length === 1) {
        // Un seul membre dans le groupe, redirige direct
        const ids = [groupData[0].id]
        setIds(ids)
        router.push(`/infos?ids=${groupData[0].id}`)
      } else {
        // Plusieurs membres, ouvre la modale
        setGroupMembers(groupData)
        setSelectedIds(groupData.map((m) => m.id)) // Par défaut, tout coché
        setShowModal(true)
      }
    } 
  }

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const handleModalConfirm = () => {
    if (selectedIds.length === 0) {
      alert("Merci de sélectionner au moins une personne.")
      return
    }
    setShowModal(false)
    setIds(selectedIds)
    router.push(`/infos?ids=${selectedIds.join(',')}`)
  }

  return (
    <main className="min-h-screen flex flex-col">
  {/* Fond avec bandes ocre */}
  <div className="flex min-h-screen">
{/* Bande gauche */}
<div className="hidden md:block w-[15%] bg-yellowfade border-r-2 border-[#b68542]" />


    {/* Contenu central (fond blanc) */}
    <div className="flex-1 bg-white flex flex-col">
      {/* Première div : titre + logo */}
      <div className="flex w-full h-[40%] items-center justify-between p-8 bg-red-100">
        {/* Gauche */}
        <div className="flex flex-col justify-center w-full h-full bg-green-100">
          <h1 className=" text-4xl text-[#7287B1] font-tan whitespace-nowrap text-center">  ALICE &amp; GUILLAUME</h1>
          <h1 className="text-4xl text-[#7287B1] ml-8 mt-2 font-tan ml-8 mt-8 text-center">    29.08.2026  </h1>
        </div>
        {/* Droite */}
        <div className="flex justify-end items-center bg-blue-100 h-full">
          <img
            src="image/logo.svg"
            alt="Logo mariage"
            className="h-150 w-auto object-contain"
          />
        </div>
      </div>

      {/* Deuxième div : formulaire */}
      <div className="flex-1 flex justify-center items-center bg-yellow-100">
        <div className=" flex-1 flex justify-center bg-purple-100" >
          <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
            <img src="/image/feuillage_acc.svg" alt="Décoration feuillage" className="w-full mb-0  object-contain"/>
          <input
            type="text"
            placeholder="Prénom"
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
             className="w-full p-3 border border-[#b68542]/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7287B1]"
            required
          />
          <input
            type="text"
            placeholder="Nom"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          <button
            type="submit"
            className="w-full bg-[#7287B1] text-white p-2 rounded hover:bg-[#5d6d94]"
          >
            Accéder au formulaire
          </button>
          {erreur && <p className="text-red-600">{erreur}</p>}
        </form>
        </div>
      </div>
    </div>

    {/* Bande droite */}
    <div className="hidden md:block w-[15%] bg-yellowfade border-l-2 border-[#b68542]" />
  </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-6 rounded shadow-lg max-w-md w-full">            <h2 className="text-xl font-semibold mb-4">Sélectionnez les invités</h2>
            <div className="max-h-60 overflow-auto mb-4">
              {groupMembers.map((member) => (
                <label key={member.id} className="flex items-center space-x-2 mb-2">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(member.id)}
                    onChange={() => toggleSelection(member.id)}
                  />
                  <span>{member.prenom} {member.nom}</span>
                </label>
              ))}
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Annuler
              </button>
              <button
                onClick={handleModalConfirm}
                className="px-4 py-2 bg-[#7287B1] text-white rounded hover:bg-[#7287B1]"
              >
                Valider
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
