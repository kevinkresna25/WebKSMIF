export default function App(){
    return(
        <>
            <div className="bg-gradient-to-b from-[#302176] via-[#120D2C] to-[#302176] h-screen w-full min-h-[7020px] relative overflow-hidden">
                {/* Lingkaran blur utama */}
                <div className="flex justify-center">
                    <div className="w-[52rem] h-[52rem] rounded-full bg-[#2BE0F1] blur-[497px] absolute top-[-803px]"></div>
                </div>

                {/* Konten area */}
                <div className="relative z-10 p-4 sm:p-8">
                    {/* Demo konten */}
                    <div className="flex flex-col items-center justify-center min-h-screen text-white">
                        <h1 className="text-4xl sm:text-6xl font-bold mb-4">Lorem Ipsum</h1>
                        <p className="text-lg sm:text-xl opacity-80">Test Konten satu dua tiga</p>
                    </div>
                </div>
            </div>
        </>
    );
}
