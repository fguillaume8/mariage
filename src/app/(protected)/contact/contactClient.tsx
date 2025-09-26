'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function ContactPage() {
  const [sent, setSent] = useState(false)
  const [error, setError] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(false)

    const form = e.currentTarget
    const data = new FormData(form)

    try {
      const res = await fetch(form.action, {
        method: form.method,
        body: data,
        headers: { Accept: 'application/json' },
      })

      if (res.ok) {
        setSent(true)
        form.reset()
      } else {
        setError(true)
      }
      } catch (err) {
        console.error("Erreur d’envoi du formulaire :", err)
        setError(true)
      }
  }

  return (
    <div className="relative w-full h-screen">
      <Image
        src="/image/cri.jpg"
        alt="Image de fond"
        fill
        priority
        className="object-cover z-0"
        style={{ position: 'absolute' }}
      />

      <div className="absolute right-0 top-0 h-full w-[40%] bg-yellowfade/60 p-10 z-10 flex flex-col justify-center shadow-2xl">
        <h1 className="text-3xl text-powderblue font-bold mb-4">Nous contacter</h1>
        <p className="mb-6 text-ocre">
          Une question, une demande spéciale ? Écrivez-nous !
        </p>

        {sent ? (
          <div className="text-green-600 font-semibold">Message envoyé ! Merci 💌</div>
        ) : (
          <form
            action="https://formspree.io/f/xvgwgyzn"
            method="POST"
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
          >
            <input
              type="text"
              name="nom"
              placeholder="Votre nom"
              className="border p-2 rounded font-serif text-gray-800 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Votre email"
              className="border p-2 rounded font-serif text-gray-800 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <textarea
              name="message"
              placeholder="Votre message"
              className="border p-2 rounded font-serif text-gray-800 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <button
              type="submit"
              className="bg-powderblue text-white py-2 px-4 rounded hover:bg-powderblue transition"
            >
              Envoyer
            </button>
            {error && <p className="text-red-600">Une erreur est survenue. Réessayez.</p>}
          </form>
        )}
      </div>
    </div>
  )
}
