import { ChevronDownIcon } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";

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
    <Collapsible defaultOpen className="overflow-hidden rounded-lg border">
      <CollapsibleTrigger className="group flex w-full items-center gap-3 border-b bg-muted/40 px-5 py-3">
        <span className="text-primary">{icon}</span>

        <h2 className="font-semibold text-primary">{title}</h2>
        <ChevronDownIcon className="ml-auto transition-transform group-data-[state=open]:rotate-180" />
      </CollapsibleTrigger>

      <CollapsibleContent className="p-5">{children}</CollapsibleContent>
    </Collapsible>
  );
}
