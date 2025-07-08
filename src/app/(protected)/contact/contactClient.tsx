'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function ContactPage() {
  const [sent, setSent] = useState(false)

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

      <div className="absolute right-0 top-0 h-full w-[40%] bg-white/80 p-10 z-10 flex flex-col justify-center shadow-2xl">
        <h1 className="text-3xl font-bold mb-4">Nous contacter</h1>
        <p className="mb-6 text-gray-700">
          Une question, une demande spéciale ? Écrivez-nous !
        </p>

        {sent ? (
          <div className="text-green-600 font-semibold">Message envoyé ! Merci 💌</div>
        ) : (
          <form
            action="https://formspree.io/f/mwkgevrr"  // ← remplace par ton propre lien Formspree
            method="POST"
            className="flex flex-col gap-4"
            onSubmit={() => setSent(true)}
          >
            <input
              type="text"
              name="nom"
              placeholder="Votre nom"
              className="border p-2 rounded"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Votre email"
              className="border p-2 rounded"
              required
            />
            <textarea
              name="message"
              placeholder="Votre message"
              className="border p-2 rounded h-32 resize-none"
              required
            />
            <button
              type="submit"
              className="bg-pink-500 text-white py-2 px-4 rounded hover:bg-pink-600 transition"
            >
              Envoyer
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
