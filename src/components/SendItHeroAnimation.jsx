'use client'

export default function SendItHeroAnimation() {

  return (

    <div className="relative w-full h-[260px] overflow-hidden rounded-3xl mt-4">

      {/* MAP BACKGROUND */}

      <div
        className="absolute inset-0 bg-cover bg-center opacity-70"
        style={{
          backgroundImage:
            "url(https://tile.openstreetmap.org/13/4096/3072.png)"
        }}
      />

      {/* DARK OVERLAY */}

      <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/20" />



      {/* MOVING COURIERS */}

      <div className="absolute inset-0">

        <div className="bike bike1">🏍️</div>
        <div className="bike bike2">🏍️</div>
        <div className="bike bike3">🏍️</div>

      </div>



      {/* RADAR */}

      <div className="absolute inset-0 flex items-center justify-center">

        <div className="relative flex items-center justify-center">

          <div className="ring"></div>
          <div className="ring delay1"></div>
          <div className="ring delay2"></div>

          <div className="logo">
            SendIt
          </div>

        </div>

      </div>



      {/* CSS */}

      <style jsx>{`

        .bike{
          position:absolute;
          font-size:24px;
        }

        .bike1{
          top:60%;
          left:-10%;
          animation:ride1 12s linear infinite;
        }

        @keyframes ride1{
          from{left:-10%}
          to{left:110%}
        }


        .bike2{
          top:35%;
          left:110%;
          animation:ride2 15s linear infinite;
        }

        @keyframes ride2{
          from{left:110%}
          to{left:-10%}
        }


        .bike3{
          top:80%;
          left:-10%;
          animation:ride3 18s linear infinite;
        }

        @keyframes ride3{
          from{left:-10%}
          to{left:110%}
        }



        .ring{
          position:absolute;
          width:120px;
          height:120px;
          border-radius:50%;
          border:2px solid rgba(255,255,255,0.5);
          animation:pulse 3s infinite;
        }

        .delay1{
          animation-delay:1s;
        }

        .delay2{
          animation-delay:2s;
        }

        @keyframes pulse{
          0%{
            transform:scale(0.5);
            opacity:1;
          }
          100%{
            transform:scale(2);
            opacity:0;
          }
        }



        .logo{
          width:70px;
          height:70px;
          border-radius:50%;
          background:#4f46e5;
          color:white;
          display:flex;
          align-items:center;
          justify-content:center;
          font-weight:700;
          font-size:14px;
          z-index:2;
        }

      `}</style>

    </div>

  )

      }
