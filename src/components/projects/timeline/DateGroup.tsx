interface DateGroupProps {
  date: string;
  children: React.ReactNode;
}

export const DateGroup = ({ date, children }: DateGroupProps) => {
  return (
    <div className="relative">
      <div className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 py-2">
        <h3 className="text-sm font-medium">{date}</h3>
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
};