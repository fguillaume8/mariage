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
     <div className="w-full min-h-screen flex flex-col md:flex-row">
      {/* Image visible uniquement sur desktop */}
      <div className="hidden md:block md:w-3/5 relative">
        <Image
          src="/image/cri.jpg"
          alt="Image de fond"
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* Formulaire */}
      <div className="w-full md:w-2/5 bg-yellowfade/60 p-6 md:p-10 flex flex-col justify-center shadow-2xl">
        <h1 className="text-2xl md:text-3xl text-powderbluedark font-bold mb-4 text-center md:text-left">
          Nous contacter
        </h1>
        <p className="mb-6 text-ocredark text-center md:text-left">
          Une question, une demande spéciale ? Écrivez-nous !
        </p>

        {sent ? (
          <div className="text-green-600 font-semibold text-center md:text-left">
            Message envoyé ! Merci 💌
          </div>
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
              className="border p-2 rounded font-serif text-gray-800 h-48 md:h-60 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <button
              type="submit"
              className="bg-powderblue text-white py-2 px-4 rounded hover:bg-powderblue transition"
            >
              Envoyer
            </button>
            {error && (
              <p className="text-red-600 text-center md:text-left">
                Une erreur est survenue. Réessayez.
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  )
}
