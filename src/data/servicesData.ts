import { HealthcareService } from '../types';

export const MYRA_SERVICES: HealthcareService[] = [
  {
    id: 'srv-1',
    slug: 'injection',
    name: 'Injection',
    hindiName: 'इंजेक्शन',
    category: 'Specialized Procedures',
    shortDesc: 'Injection administration by an appropriately qualified professional when prescribed and suitable.',
    fullDesc: 'Safe in-home intramuscular (IM) and subcutaneous (SC) injection administration by registered clinical nurses following prescription guidelines.',
    features: [
      'Prescribed IM & SC injections',
      'Insulin administration & guidance',
      'Sterile syringe & sharp disposal',
      'Observation for adverse reactions'
    ],
    durationOptions: ['Single Visit', 'Daily Morning/Evening', 'Weekly Schedule'],
    startingPrice: 250,
    isAvailable24x7: true,
    isActive: true,
    icon: '💉',
    badge: 'Quick Visit'
  },
  {
    id: 'srv-2',
    slug: 'wound-dressing',
    name: 'Wound Dressing',
    hindiName: 'ड्रेसिंग',
    category: 'Specialized Procedures',
    shortDesc: 'Wound dressing and basic nursing support as clinically advised.',
    fullDesc: 'Aseptic cleansing, sterile gauze dressing, bed sore management, and surgical incision hygiene.',
    features: [
      'Sterile dressing change',
      'Surgical stitches monitoring',
      'Bed sore treatment',
      'Infection watch & antiseptic cleaning'
    ],
    durationOptions: ['Single Visit', 'Alternate Day Visits', 'Weekly Care'],
    startingPrice: 400,
    isAvailable24x7: true,
    isActive: true,
    icon: '🩹'
  },
  {
    id: 'srv-3',
    slug: 'nebulization',
    name: 'Nebulization',
    hindiName: 'नेबुलाइजेशन',
    category: 'Critical Care',
    shortDesc: 'Nebulization support as advised by a healthcare professional.',
    fullDesc: 'In-home compressor nebulization for asthma, bronchitis, COPD, and pediatric respiratory relief.',
    features: [
      'Bronchodilator medication delivery',
      'Mask fitting & airflow monitoring',
      'Chamber sanitization',
      'SpO2 oxygen saturation check'
    ],
    durationOptions: ['Single Session', 'Multi-dose Routine'],
    startingPrice: 300,
    isAvailable24x7: true,
    isActive: true,
    icon: '🌬️'
  },
  {
    id: 'srv-4',
    slug: 'blood-sample-collection',
    name: 'Blood Sample Collection',
    hindiName: 'ब्लड सैंपल कलेक्शन',
    category: 'General Nursing',
    shortDesc: 'Home sample collection and coordination with the relevant laboratory.',
    fullDesc: 'Doorstep phlebotomy for CBC, LFT, KFT, lipid profile, thyroid, and blood sugar tests with cold-chain transport.',
    features: [
      'Painless sterile venipuncture',
      'Barcoded vacutainer tubes',
      'Digital report delivery via WhatsApp',
      'Coordination with top NABL labs'
    ],
    durationOptions: ['Morning Fasting Slot', 'Emergency Collection'],
    startingPrice: 200,
    isAvailable24x7: true,
    isActive: true,
    icon: '🧪'
  },
  {
    id: 'srv-5',
    slug: 'patient-attendant-gda',
    name: 'Patient Care (GDA)',
    hindiName: 'पेशेंट केयर (जी.डी.ए.)',
    category: 'General Nursing',
    shortDesc: 'Assistance with daily care and patient support at home.',
    fullDesc: 'Dedicated General Duty Assistants for bedside support, bathing, personal hygiene, wheelchair mobility, and feeding.',
    features: [
      'Sponge bath & oral hygiene',
      'Assisted walking & transfers',
      'Diaper change & bed turning',
      'Meal assistance & routine tracking'
    ],
    durationOptions: ['12 Hours Day', '12 Hours Night', '24 Hours Resident'],
    startingPrice: 900,
    isAvailable24x7: true,
    isActive: true,
    icon: '🧑‍⚕️',
    badge: 'Popular'
  },
  {
    id: 'srv-6',
    slug: 'iv-cannula-care',
    name: 'IV & Cannula',
    hindiName: 'IV एवं कैनुला',
    category: 'Specialized Procedures',
    shortDesc: 'IV-related nursing support only when clinically ordered and safely appropriate.',
    fullDesc: 'Intravenous fluid saline infusions, IV antibiotic administration, cannula site dressing, and patency flushes.',
    features: [
      'Sterile IV cannulation',
      'Normal saline / RL drip infusion',
      'Heparin/saline flush',
      'Phlebitis prevention'
    ],
    durationOptions: ['Single Infusion Session', 'Twice Daily Schedule'],
    startingPrice: 450,
    isAvailable24x7: true,
    isActive: true,
    icon: '🩺'
  },
  {
    id: 'srv-7',
    slug: 'catheter-care',
    name: 'Catheter Insertion',
    hindiName: 'कैथेटर केयर',
    category: 'Specialized Procedures',
    shortDesc: 'Catheter-related care by qualified staff as clinically indicated.',
    fullDesc: 'Sterile urinary Foley catheterization, replacement, drainage bag maintenance, and bladder hygiene.',
    features: [
      'Foley catheter insertion & removal',
      'Urine bag drainage & hygiene',
      'Leakage & blockage resolution',
      'CAUTI infection prevention'
    ],
    durationOptions: ['Single Procedure Visit', 'Emergency Replacement'],
    startingPrice: 550,
    isAvailable24x7: true,
    isActive: true,
    icon: '➰'
  },
  {
    id: 'srv-8',
    slug: 'feeding-tube-care',
    name: 'Feeding Tube Care',
    hindiName: 'फीडिंग ट्यूब (राइल्स) देखभाल',
    category: 'Specialized Procedures',
    shortDesc: 'Feeding tube care and support according to the care plan.',
    fullDesc: 'Nasogastric (Ryle’s tube) insertion, position verification, flushing, feeding guidance, and PEG care.',
    features: [
      'Ryle’s tube placement & check',
      'Liquid diet feeding technique',
      'Anti-aspiration positioning',
      'Tube flush & blockage clearing'
    ],
    durationOptions: ['Single Insertion/Care Visit', 'Routine Feeding Shift'],
    startingPrice: 600,
    isAvailable24x7: true,
    isActive: true,
    icon: '🧴'
  },
  {
    id: 'srv-9',
    slug: 'post-operative-nursing',
    name: 'Post-Operative Nursing',
    hindiName: 'ऑपरेशन के बाद नर्सिंग',
    category: 'Critical Care',
    shortDesc: 'Support after hospital discharge, based on the treating team\'s instructions.',
    fullDesc: 'Intensive recovery support after cardiac, orthopedic, or general surgery in the comfort of your Patna home.',
    features: [
      'Surgical drain tracking',
      'Incision care & sterile dressing',
      'Pain management compliance',
      'Early mobilization assistance'
    ],
    durationOptions: ['12 Hours Shift', '24 Hours Continuity', 'Post-Op 7-Day Package'],
    startingPrice: 1400,
    isAvailable24x7: true,
    isActive: true,
    icon: '🛏️'
  },
  {
    id: 'srv-10',
    slug: 'elderly-care',
    name: 'Elderly Care',
    hindiName: 'बुजुर्ग देखभाल सेवा',
    category: 'General Nursing',
    shortDesc: 'Support for older adults, bedridden patients and people needing assistance at home.',
    fullDesc: 'Compassionate assistance for senior citizens living with dementia, Parkinson’s, arthritis, or age-related frailty.',
    features: [
      'Fall risk management',
      'Timely medication dispensing',
      'Emotional companionship',
      'Cognitive engagement activities'
    ],
    durationOptions: ['12 Hours Day', '24 Hours Resident', 'Monthly Retainer'],
    startingPrice: 1000,
    isAvailable24x7: true,
    isActive: true,
    icon: '👵',
    badge: 'Recommended'
  },
  {
    id: 'srv-11',
    slug: 'bp-check',
    name: 'BP Check',
    hindiName: 'ब्लड प्रेशर जांच',
    category: 'General Nursing',
    shortDesc: 'Blood pressure measurement and recording for care follow-up.',
    fullDesc: 'Accurate sphygmomanometer blood pressure monitoring with digital trend logging for hypertension control.',
    features: [
      'Resting BP charting',
      'Pulse & heart rate check',
      'Digital vitals log for doctor',
      'Hypertension lifestyle tips'
    ],
    durationOptions: ['Single Diagnostic Visit', 'Weekly Routine'],
    startingPrice: 150,
    isAvailable24x7: true,
    isActive: true,
    icon: '💓'
  },
  {
    id: 'srv-12',
    slug: 'blood-sugar-check',
    name: 'Blood Sugar Check',
    hindiName: 'ब्लड शुगर (ग्लूकोज) जांच',
    category: 'General Nursing',
    shortDesc: 'Blood glucose check and recording when requested.',
    fullDesc: 'Fasting and post-prandial capillary blood glucose testing with calibrated glucometer at home.',
    features: [
      'Fasting & PP glucose test',
      'Sterile lancet technique',
      'Glycemic trend recording',
      'Diabetic care consultation'
    ],
    durationOptions: ['Single Home Visit', 'Daily Schedule (Fasting/PP)'],
    startingPrice: 150,
    isAvailable24x7: true,
    isActive: true,
    icon: '🩸'
  },
  {
    id: 'srv-13',
    slug: 'ambulance-coordination',
    name: 'Ambulance Coordination',
    hindiName: 'एंबुलेंस समन्वय सेवा',
    category: 'Critical Care',
    shortDesc: 'Call to discuss ambulance coordination; availability and response time must be confirmed.',
    fullDesc: 'Assisting families in contacting and coordinating with licensed local BLS and ALS oxygen ambulance partners in Patna.',
    features: [
      'Oxygen & stretcher ambulance liaison',
      'Patient transfer assistance',
      'Hospital handover coordination',
      'Patna inter-city road transfer support'
    ],
    durationOptions: ['Immediate Dispatch Call', 'Scheduled Transfer'],
    startingPrice: 1200,
    isAvailable24x7: true,
    isActive: true,
    icon: '🚑'
  },
  {
    id: 'srv-14',
    slug: '12-24-hour-shifts',
    name: '12-Hour / 24-Hour Shifts',
    hindiName: '12 घंटे / 24 घंटे शिफ्ट ड्यूटी',
    category: 'General Nursing',
    shortDesc: 'Care attendant shift requests can be discussed with the manager.',
    fullDesc: 'Structured long-duration day and night nursing coverage by qualified male or female staff.',
    features: [
      '12 Hours Day Shift (8 AM - 8 PM)',
      '12 Hours Night Shift (8 PM - 8 AM)',
      '24 Hours In-House Resident Stay',
      'Continuous bedside observation'
    ],
    durationOptions: ['12h Day', '12h Night', '24h Resident'],
    startingPrice: 1200,
    isAvailable24x7: true,
    isActive: true,
    icon: '⏱️'
  },
  {
    id: 'srv-15',
    slug: 'male-female-staff',
    name: 'Male & Female Staff',
    hindiName: 'महिला एवं पुरुष नर्सिंग स्टाफ',
    category: 'General Nursing',
    shortDesc: 'Tell us your preference; assignment depends on staff availability.',
    fullDesc: 'Tailored staff selection ensuring complete cultural comfort, privacy, and personal preference for family members.',
    features: [
      'Gender-preferred caregiver assignment',
      'Mother & baby female nurses',
      'Male attendants for heavy mobility',
      'Verified police background checks'
    ],
    durationOptions: ['Per Shift Preference', 'Long-term Care'],
    startingPrice: 950,
    isAvailable24x7: true,
    isActive: true,
    icon: '🧑‍⚕️'
  },
  {
    id: 'srv-16',
    slug: 'lab-booking-reports',
    name: 'Lab Booking & Reports',
    hindiName: 'लैब बुकिंग एवं रिपोर्ट समन्वय',
    category: 'General Nursing',
    shortDesc: 'Ask about lab booking, sample collection and report delivery coordination.',
    fullDesc: 'End-to-end diagnostic test coordination with doorstep sample collection and PDF report delivery on WhatsApp.',
    features: [
      'Doctor prescription analysis',
      'NABL certified lab partner rates',
      'Home technician appointment',
      'WhatsApp digital report delivery'
    ],
    durationOptions: ['Same-Day Collection', 'Routine Health Checkup'],
    startingPrice: 200,
    isAvailable24x7: true,
    isActive: true,
    icon: '📋'
  }
];
