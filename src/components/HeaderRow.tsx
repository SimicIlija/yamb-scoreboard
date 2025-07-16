import HeaderCell from "./HeaderCell";

type HeaderRowProps = {
  labels: string[];
};

export default function HeaderRow({ labels }: HeaderRowProps) {
  return (
    <div className="flex items-center">
      <div className="w-32 pr-2"></div>
      {labels.map((label, index) => (
        <HeaderCell key={index} label={label} />
      ))}
    </div>
  );
}
