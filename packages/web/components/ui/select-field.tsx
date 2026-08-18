"use client";

// Select do produto, com o visual do Select 17 do Watermelon UI já embutido.
//
// Existe como wrapper, e não como composição solta em cada tela, porque o
// aplicativo tinha 39 `<select>` nativos espalhados: sem um ponto único, trocar
// o visual de novo significaria reabrir 25 arquivos. Aqui a chamada é
// `<SelectField value={} onChange={} options={} />` — a mesma superfície do
// `<select>` que ela substitui.
//
// Cores por token do tema (`bg-muted/40`, `border-border`) no lugar do
// `zinc-*` com variante `dark:` do original: o produto tem um tema só, e a
// versão clara apareceria como uma caixa branca no meio da página escura.
//
// Funciona controlado (`value`/`onChange`) e solto (`name` + `defaultValue`).
// A segunda forma importa: metade dos formulários do produto lê os campos por
// `new FormData(form)`, e o Radix só entra nesse pacote quando recebe `name` —
// é ele que renderiza o <select> escondido que o FormData enxerga.

import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

export type SelectOption = { value: string; label: string };

/** Aceita `["a", "b"]` quando rótulo e valor são a mesma coisa. */
export function toOptions(values: readonly string[]): SelectOption[] {
  return values.map((value) => ({ value, label: value }));
}

export function SelectField({
  value,
  onChange,
  options,
  placeholder = "Selecione",
  groupLabel,
  className,
  contentClassName,
  // `id` e os `aria-*` descrevem o campo, então precisam ir para o gatilho: o
  // `Select` raiz do Radix é só contexto e não renderiza nenhum nó, de modo
  // que qualquer atributo deixado nele some sem aviso.
  id,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
  ...props
}: {
  /** Controlado. Omitido, o campo roda solto — use `name` + `defaultValue`. */
  value?: string;
  onChange?: (value: string) => void;
  options: readonly SelectOption[];
  placeholder?: string;
  /** Cabeçalho do grupo dentro da lista. Omitido, a lista vem sem título. */
  groupLabel?: string;
  className?: string;
  contentClassName?: string;
  id?: string;
} & React.AriaAttributes
  & Omit<React.ComponentProps<typeof Select>, "value" | "onValueChange" | "children">) {
  return (
    <Select value={value} onValueChange={onChange} {...props}>
      <SelectTrigger
        id={id}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        aria-invalid={ariaInvalid}
        className={cn(
          "w-full rounded-xl border-border/60 bg-muted/40 px-3 shadow-none transition-all hover:bg-muted/70 focus-visible:ring-ring/20",
          className,
        )}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent position="popper" sideOffset={4} className={cn("rounded-xl border-border bg-popover p-1 shadow-lg", contentClassName)}>
        <SelectGroup>
          {groupLabel && <SelectLabel className="text-muted-foreground">{groupLabel}</SelectLabel>}
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value} className="rounded-lg">
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
