import * as Yup from 'yup'
import type { ContactField } from '@/types/landing'

const VOLUME_VALUES = ['1-100', '100-1000', '1000-10000', '10000+'] as const

/** Yup alineado con `ContactDemoDto` del backend */
export function buildContactDemoSchema(fields: ContactField[]) {
  const shape: Record<string, Yup.StringSchema> = {}

  for (const f of fields) {
    if (f.type === 'email') {
      shape[f.id] = Yup.string()
        .email('Email no válido')
        .required('El email es obligatorio')
        .max(254)
    } else if (f.type === 'select' && f.id === 'volume') {
      shape[f.id] = Yup.string()
        .oneOf([...VOLUME_VALUES], 'Selecciona un rango válido')
        .required('Selecciona un rango')
    } else if (f.type === 'select') {
      shape[f.id] = Yup.string().required('Selecciona una opción')
    } else if (f.id === 'company') {
      shape[f.id] = Yup.string()
        .trim()
        .min(1, 'La empresa es obligatoria')
        .max(200)
        .required('La empresa es obligatoria')
    } else if (f.id === 'name') {
      shape[f.id] = Yup.string()
        .trim()
        .min(2, 'Mínimo 2 caracteres')
        .max(120)
        .required('El nombre es obligatorio')
    } else {
      shape[f.id] = Yup.string()
        .trim()
        .min(1)
        .required('Este campo es obligatorio')
        .max(200)
    }
  }

  return Yup.object(shape)
}
