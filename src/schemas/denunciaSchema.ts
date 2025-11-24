import { z } from "zod";

export const denunciaSchema = z.object({
  logradouro: z.string().min(1, "Logradouro é obrigatório"),
  numero: z.string().min(1, "Número é obrigatório"),
  complemento: z.string().optional(),
  cep: z.string().min(8, "CEP inválido"),
  bairro: z.string().min(1, "Bairro é obrigatório"),
  cidade: z.string().min(1, "Cidade é obrigatória"),
  estado: z
    .string()
    .length(2, "UF deve ter 2 letras")
    .transform((v) => v.toUpperCase()),
  pontoReferencia: z.string().optional(),
  existemObstaculos: z.boolean(),
  idProblemaAcessibilidade: z.number().int().nullable().optional(),
  motivosPedido: z.string().max(500).optional(),
  descricao: z.string().max(1000).optional(),

  // Aqui não vai o File direto, vai o base64
  arquivoFotoBase64: z.string().nullable().optional(),
});

export type DenunciaFormValues = z.infer<typeof denunciaSchema>;
