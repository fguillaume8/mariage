'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '../../lib/supabaseClient'
import { useInvite } from '../../context/InviteContext'

type Invite = {
  id: string
  prenom: string
  nom: string
  repas: string | null
  logement: boolean | null
}

export default function RsvpPage() {
  const searchParams = useSearchParams()
  const { ids, setIds } = useInvite()
  const [invites, setInvites] = useState<Invite[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const idsParam = searchParams.get('ids')
    if (idsParam) {
      const splitIds = idsParam.split(',')
      if (!ids || ids.length === 0 || ids.join(',') !== idsParam) {
        setIds(splitIds)
      }
    }
  }, [searchParams, ids, setIds])

  useEffect(() => {
    if (!ids || ids.length === 0) {
      setInvites([])
      setLoading(false)
      return
    }

    async function fetchInvites() {
      setLoading(true)
      if (!ids || ids.length === 0) {
        setInvites([])
        setLoading(false)
        return
      }
      const { data, error } = await supabase.from('invites').select('*').in('id', ids)
      if (error) {
        setError('Erreur chargement des invités')
        setInvites([])
      } else {
        setInvites(data || [])
        setError(null)
      }
      setLoading(false)
    }

    fetchInvites()
  }, [ids])

  const handleChange = (id: string, field: keyof Invite, value: string | boolean | null) => {
    setInvites((prev) => prev.map((inv) => (inv.id === id ? { ...inv, [field]: value } : inv)))
  }

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    setSuccess(false)

    try {
      for (const invite of invites) {
        const { error } = await supabase
          .from('invites')
          .update({
            repas: invite.repas,
            logement: invite.logement,
          })
          .eq('id', invite.id)

        if (error) throw error
      }
      setSuccess(true)
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
        <div key={invite.id} className="mb-8 p-4 border rounded bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">
            {invite.prenom} {invite.nom}
          </h2>

          <label className="block mb-2">
            Repas :
            <select
              value={invite.repas || ''}
              onChange={(e) => handleChange(invite.id, 'repas', e.target.value)}
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
              onChange={(e) => handleChange(invite.id, 'logement', e.target.checked)}
              className="ml-2"
            />
          </label>
        </div>
      ))}

      {success && <p className="mb-4 text-green-600">Réponses sauvegardées avec succès !</p>}

      <button
        onClick={handleSave}
        disabled={saving}
        className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 disabled:opacity-50"
      >
        {saving ? 'Sauvegarde en cours...' : 'Enregistrer mes réponses'}
      </button>
    </div>
  )
}
