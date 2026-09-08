type FormSectionProps = {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
};

export default function FormSection({
  icon,
  title,
  children,
}: FormSectionProps) {
  return (
    <section className="overflow-hidden rounded-lg border">
      <div className="flex items-center gap-3 border-b bg-muted/40 px-5 py-3">
        <span className="text-primary">{icon}</span>

        <h2 className="font-semibold text-primary">{title}</h2>
      </div>

      <div className="p-5">{children}</div>
    </section>
  );
}
