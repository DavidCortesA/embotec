export default function Header() {
  return (
    <div className="w-full h-[700px] bg-green-400">
      <div className="flex flex-row container">
        <div className="w-1/2">
          <h1>Hola Mundo</h1>
          <p>texto</p>
          <button>Prueba</button>
        </div>
        <div className="w-1/2">
          <span className="w-[350px] h-[350px] bg-neutral-400" />
        </div>
      </div>
    </div>
  );
}
