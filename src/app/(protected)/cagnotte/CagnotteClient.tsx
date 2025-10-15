'use client'

import Image from 'next/image'

export default function CagnottePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f9f6ed] p-8">
      <div className="flex w-full max-w-6xl gap-8">

        {/* Colonne gauche : photos */}
        <div className="flex flex-col gap-8 w-1/2 items-center">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Voyage de noces</h2>
            <div className="w-full h-80 bg-[#55608f] rounded-lg flex items-center justify-center text-white font-bold text-lg">
              PHOTO ISLANDE
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Achat ou construction</h2>
            <div className="w-full h-80 bg-[#55608f] rounded-lg flex items-center justify-center text-white font-bold text-lg">
              PHOTO MAISON
            </div>
          </div>
        </div>

        {/* Colonne droite : texte */}
        <div className="flex flex-col justify-center w-1/2 text-gray-700 text-lg">
          <p className="mb-6">
            Aidez-nous à réaliser nos rêves de voyage et de maison via l’urne mise à votre disposition le jour du mariage.
          </p>
          <p>
            Pour les malheureux absents (déjà bouh) ce RIB saura nous retrouver :<br />
            <span className="font-semibold">FR76...</span>
          </p>
        </div>

      </div>
    </div>
  )
}
