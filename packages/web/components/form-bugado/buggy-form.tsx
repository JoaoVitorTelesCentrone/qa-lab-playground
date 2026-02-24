"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2 } from "lucide-react";

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

// BUG 1: This regex is intentionally broken - accepts "user@" and "user@.com"
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@/.test(email);
}

interface FormData {
  nome: string;
  email: string;
  telefone: string;
  senha: string;
  confirmarSenha: string;
  aceitarTermos: boolean;
}

interface FormErrors {
  nome?: string;
  email?: string;
  telefone?: string;
  senha?: string;
  confirmarSenha?: string;
  aceitarTermos?: string;
}

export function BuggyForm() {
  const [formData, setFormData] = useState<FormData>({
    nome: "",
    email: "",
    telefone: "",
    senha: "",
    confirmarSenha: "",
    aceitarTermos: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  function validate(): FormErrors {
    const errs: FormErrors = {};

    // BUG 2: "nome" is marked as required in the label (has asterisk)
    // but we DON'T actually validate it here - it's missing from this check

    if (!formData.email) {
      errs.email = "Email e obrigatorio";
    } else if (!isValidEmail(formData.email)) {
      errs.email = "Email invalido";
    }

    if (!formData.telefone) {
      errs.telefone = "Telefone e obrigatorio";
    }

    if (!formData.senha) {
      errs.senha = "Senha e obrigatoria";
    } else if (formData.senha.length < 6) {
      errs.senha = "Senha deve ter pelo menos 6 caracteres";
    }

    if (formData.senha !== formData.confirmarSenha) {
      errs.confirmarSenha = "Senhas nao conferem";
    }

    if (!formData.aceitarTermos) {
      errs.aceitarTermos = "Voce precisa aceitar os termos";
    }

    return errs;
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target;

    if (name === "telefone") {
      // BUG 3: Only handles onChange (typing), does NOT handle onPaste
      // so pasting a phone number will NOT apply the mask
      setFormData((prev) => ({ ...prev, telefone: formatPhone(value) }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    // BUG 4: We set errors and show them, but we DON'T return early!
    // The form submits even if there are validation errors visible

    // BUG 5: We store a hardcoded/wrong email instead of the actual one
    setSubmittedEmail("usuario@exemplo.com.br");
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <Alert className="border-primary/30">
        <CheckCircle2 className="size-4 text-primary" />
        <AlertTitle>Cadastro realizado!</AlertTitle>
        <AlertDescription>
          {/* BUG 5: Shows wrong email */}
          Um email de confirmacao foi enviado para{" "}
          <strong>{submittedEmail}</strong>
        </AlertDescription>
        <Button
          variant="outline"
          size="sm"
          className="mt-3"
          onClick={() => {
            setSubmitted(false);
            setFormData({
              nome: "",
              email: "",
              telefone: "",
              senha: "",
              confirmarSenha: "",
              aceitarTermos: false,
            });
            setErrors({});
          }}
        >
          Fazer novo cadastro
        </Button>
      </Alert>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Nome - BUG 2: asterisk shown but not validated */}
      <div className="space-y-2">
        <Label htmlFor="nome">
          Nome completo <span className="text-red-400">*</span>
        </Label>
        <Input
          id="nome"
          name="nome"
          value={formData.nome}
          onChange={handleChange}
          placeholder="Seu nome completo"
        />
        {errors.nome && (
          <p className="text-xs text-red-400">{errors.nome}</p>
        )}
      </div>

      {/* Email - BUG 1: broken regex */}
      <div className="space-y-2">
        <Label htmlFor="email">
          Email <span className="text-red-400">*</span>
        </Label>
        <Input
          id="email"
          name="email"
          type="text"
          value={formData.email}
          onChange={handleChange}
          placeholder="seu@email.com"
        />
        {errors.email && (
          <p className="text-xs text-red-400">{errors.email}</p>
        )}
      </div>

      {/* Telefone - BUG 3: paste breaks mask */}
      <div className="space-y-2">
        <Label htmlFor="telefone">
          Telefone <span className="text-red-400">*</span>
        </Label>
        <Input
          id="telefone"
          name="telefone"
          value={formData.telefone}
          onChange={handleChange}
          placeholder="(11) 99999-0000"
        />
        {errors.telefone && (
          <p className="text-xs text-red-400">{errors.telefone}</p>
        )}
      </div>

      {/* Senha */}
      <div className="space-y-2">
        <Label htmlFor="senha">
          Senha <span className="text-red-400">*</span>
        </Label>
        <Input
          id="senha"
          name="senha"
          type="password"
          value={formData.senha}
          onChange={handleChange}
          placeholder="Minimo 6 caracteres"
        />
        {errors.senha && (
          <p className="text-xs text-red-400">{errors.senha}</p>
        )}
      </div>

      {/* Confirmar Senha */}
      <div className="space-y-2">
        <Label htmlFor="confirmarSenha">
          Confirmar Senha <span className="text-red-400">*</span>
        </Label>
        <Input
          id="confirmarSenha"
          name="confirmarSenha"
          type="password"
          value={formData.confirmarSenha}
          onChange={handleChange}
          placeholder="Repita a senha"
        />
        {errors.confirmarSenha && (
          <p className="text-xs text-red-400">{errors.confirmarSenha}</p>
        )}
      </div>

      {/* Termos */}
      <div className="flex items-start gap-2">
        <input
          id="aceitarTermos"
          name="aceitarTermos"
          type="checkbox"
          checked={formData.aceitarTermos}
          onChange={handleChange}
          className="mt-1 size-4 rounded border-input accent-primary"
        />
        <Label htmlFor="aceitarTermos" className="text-sm leading-relaxed">
          Li e aceito os{" "}
          <span className="text-primary underline">Termos de Uso</span> e a{" "}
          <span className="text-primary underline">Politica de Privacidade</span>
        </Label>
      </div>
      {errors.aceitarTermos && (
        <p className="text-xs text-red-400">{errors.aceitarTermos}</p>
      )}

      {/* BUG 4: Button is always enabled, even when errors are showing */}
      <Button type="submit" className="w-full">
        Cadastrar
      </Button>

      {Object.keys(errors).length > 0 && (
        <p className="text-center text-xs text-muted-foreground">
          Corrija os erros acima antes de continuar
        </p>
      )}
    </form>
  );
}
