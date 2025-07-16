type HeaderCellProps = {
  label: string;
};

export default function HeaderCell({ label }: HeaderCellProps) {
  return (
    <div className="w-12 h-12 flex items-center justify-center text-xl font-bold">
      {label}
    </div>
  );
}
