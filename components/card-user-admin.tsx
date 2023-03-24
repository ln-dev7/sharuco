export default function CardUserAdmin({
  pseudo,
  displayName,
  photoURL,
}: {
  pseudo: string
  displayName: string
  photoURL: string
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <h1 className="text-4xl font-bold">{displayName}</h1>
    </div>
  )
}
