'use client'


export default function CagnottePage() {
  return (
    <div className="min-h-[calc(100vh-57px)] flex items-center justify-center bg-[#f9f6ed] p-8">
      <div className="flex w-full max-w-6xl gap-8">

        {/* Colonne gauche : photos */}
          <div className="flex flex-col gap-8 w-1/2 items-center">
            <div className="text-center">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Voyage de noces</h2>
              <div className="w-full h-80 rounded-lg overflow-hidden flex items-center justify-center">
                <img
                  src="/image/islande.jpg"   // <-- ton fichier Islande
                  alt="Voyage en Islande"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="text-center">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Achat ou construction</h2>
              <div className="w-full h-80 rounded-lg overflow-hidden flex items-center justify-center">
                <img
                  src="/image/niche.png"     // <-- ton fichier Niche / Maison
                  alt="Maison ou achat"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

        {/* Colonne droite : texte */}
        <div className="flex flex-col justify-center text-center items-center w-1/2 text-gray-700 text-lg">
          <p className="mb-6">
            Aidez-nous à réaliser nos rêves de voyage et de maison via <span className="font-bold">l’urne </span> mise à votre disposition le jour du mariage.<br />
          </p>
          <p className="mb-6">
            Si vous le souhaitez vous pouvez nous aidez à réaliser nos rêves de voyage et de maison via <span className="font-bold">l’urne </span> mise à votre disposition le jour du mariage.<br />
          </p>
          <p>
            Pour les malheureux absents (déjà bouh) ce RIB saura nous retrouver <br /> <br /> 
            <span className="font-semibold">M FERRAND Guillaume Ou Mme PARISOT Alice <br />  FR76 1451 8292 6707 1826 2704 117 <br />  BIC FTNOFRP1XXX  <br />   </span>
          </p>
        </div>

      </div>
    </div>
  )
}
