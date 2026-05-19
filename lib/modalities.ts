import type { Modality } from './types'

export interface ModalityConfig {
  label: string
  description: string
  icon: string
  colour: string
  textColour: string
  benefit: string
}

export const MODALITIES: Record<Modality, ModalityConfig> = {
  cryotherapy: {
    label: 'Cryotherapy',
    description: 'Whole-body cold exposure at -110°C for 3 minutes.',
    icon: 'Snowflake',
    colour: 'bg-cyan-500/20',
    textColour: 'text-cyan-400',
    benefit: 'Reduces inflammation',
  },
  infrared_sauna: {
    label: 'Infrared Sauna',
    description: 'Deep-penetrating infrared heat that warms tissue from within.',
    icon: 'Flame',
    colour: 'bg-amber-500/20',
    textColour: 'text-amber-400',
    benefit: 'Accelerates muscle recovery',
  },
  iv_therapy: {
    label: 'IV Therapy',
    description: 'Intravenous delivery of vitamins, minerals and amino acids.',
    icon: 'Droplets',
    colour: 'bg-purple-500/20',
    textColour: 'text-purple-400',
    benefit: 'Rapid nutrient replenishment',
  },
  float_tank: {
    label: 'Float Tank',
    description: 'Sensory deprivation in a buoyant Epsom salt solution.',
    icon: 'Waves',
    colour: 'bg-blue-500/20',
    textColour: 'text-blue-400',
    benefit: 'Activates parasympathetic recovery',
  },
  red_light: {
    label: 'Red Light Therapy',
    description: 'Photobiomodulation using 630–850nm wavelengths.',
    icon: 'Sun',
    colour: 'bg-red-500/20',
    textColour: 'text-red-400',
    benefit: 'Stimulates mitochondrial function',
  },
  cold_plunge: {
    label: 'Cold Plunge',
    description: 'Full-body immersion in water between 5–15°C.',
    icon: 'Thermometer',
    colour: 'bg-sky-500/20',
    textColour: 'text-sky-400',
    benefit: 'Clears lactate and reduces soreness',
  },
  contrast_therapy: {
    label: 'Contrast Therapy',
    description: 'Alternating hot and cold exposure to drive vascular flushing.',
    icon: 'ArrowLeftRight',
    colour: 'bg-teal-500/20',
    textColour: 'text-teal-400',
    benefit: 'Enhances circulation and recovery',
  },
  compression: {
    label: 'Compression Therapy',
    description: 'Sequential pneumatic compression to accelerate lymphatic drainage.',
    icon: 'Wind',
    colour: 'bg-green-500/20',
    textColour: 'text-green-400',
    benefit: 'Reduces swelling and leg fatigue',
  },
  hyperbaric_oxygen: {
    label: 'Hyperbaric Oxygen',
    description: 'Breathing pure oxygen at elevated atmospheric pressure.',
    icon: 'CircleDot',
    colour: 'bg-indigo-500/20',
    textColour: 'text-indigo-400',
    benefit: 'Accelerates tissue repair',
  },
  sports_massage: {
    label: 'Sports Massage',
    description: 'Targeted soft-tissue manipulation for performance and recovery.',
    icon: 'HandMetal',
    colour: 'bg-rose-500/20',
    textColour: 'text-rose-400',
    benefit: 'Releases fascia and improves mobility',
  },
}
