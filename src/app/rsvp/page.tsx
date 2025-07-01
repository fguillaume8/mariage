'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '../lib/supabaseClient'

type Invite = {
  id: string
  prenom: string
  nom: string
  repas: string | null
  logement: boolean | null
  // ajoute d'autres champs ici selon ta table
}

export default function RsvpPage() {
  const searchParams = useSearchParams()
  const idsParam = searchParams.get('ids')
  const ids = idsParam ? idsParam.split(',') : []

  const [invites, setInvites] = useState<Invite[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Charge les données depuis Supabase
  useEffect(() => {
    if (ids.length === 0) {
      setLoading(false)
      return
    }

    const fetchInvites = async () => {
      const { data, error } = await supabase
        .from('invites')
        .select('*')
        .in('id', ids)

      if (error) {
        setError('Erreur chargement des invités')
        setLoading(false)
        return
      }
      if (data) {
        setInvites(data)
      }
      setLoading(false)
    }

    fetchInvites()
  }, [ids])

  // Mise à jour des champs localement dans le state
  const handleChange = (id: string, field: keyof Invite, value: any) => {
    setInvites((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, [field]: value } : inv))
    )
  }

  // Sauvegarder en base
  const handleSave = async () => {
    setSaving(true)
    setError(null)

    try {
      // On fait une mise à jour en batch pour chaque invité
      for (const invite of invites) {
        const { error } = await supabase
          .from('invites')
          .update({
            repas: invite.repas,
            logement: invite.logement,
            // ajoute ici les autres champs modifiables
          })
          .eq('id', invite.id)

        if (error) throw error
      }
      alert('Réponses sauvegardées !')
    } catch (e) {
      setError('Erreur lors de la sauvegarde')
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p>Chargement...</p>

  if (error) return <p className="text-red-600">{error}</p>

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">RSVP - Confirmation de présence</h1>

      {invites.map((invite) => (
        <div
          key={invite.id}
          className="mb-8 p-4 border rounded bg-gray-50"
        >
          <h2 className="text-xl font-semibold mb-4">
            {invite.prenom} {invite.nom}
          </h2>

          <label className="block mb-2">
            Repas :
            <select
              value={invite.repas || ''}
              onChange={(e) =>
                handleChange(invite.id, 'repas', e.target.value)
              }
              className="mt-1 p-2 border rounded w-full"
            >
              <option value="">-- Choisir un repas --</option>
              <option value="viande">Viande</option>
              <option value="poisson">Poisson</option>
              <option value="vegetarien">Végétarien</option>
            </select>
          </label>

          <label className="block mb-2">
            Logement nécessaire :
            <input
              type="checkbox"
              checked={invite.logement || false}
              onChange={(e) =>
                handleChange(invite.id, 'logement', e.target.checked)
              }
              className="ml-2"
            />
          </label>

          {/* Ajoute ici d’autres champs selon besoin */}
        </div>
      ))}

      <button
        onClick={handleSave}
        disabled={saving}
        className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700"
      >
        {saving ? 'Sauvegarde en cours...' : 'Enregistrer mes réponses'}
      </button>
    </div>
  )
}
