interface CategoryProps {
  name: string;
  url: string;
}
export default function Category({ name, url }: CategoryProps) {
  return (
    <div className="flex flex-col">
      <img src={url} alt="" className="w-32 h-32 rounded-full" />
      <h2 className="text-center">{name}</h2>
    </div>
  );
}
