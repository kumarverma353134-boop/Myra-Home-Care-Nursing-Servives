import { MYRA_SERVICES } from '../data/servicesData';
import { HealthcareService } from '../types';

export interface AssistantResponse {
  reply: string;
  suggestedActions?: string[];
  intent?: 'service_info' | 'booking_help' | 'payment_info' | 'cancellation' | 'emergency' | 'whatsapp' | 'greeting' | 'general';
  detectedService?: HealthcareService;
}

export class MyraAssistantEngine {
  public static getGreeting(): string {
    return 'Namaste! Welcome to MYRA Home Care Nursing Services. Main aapki Hindi aur English dono mein help kar sakta hoon. Aaj hum aapki kya madad karein?';
  }

  public static processQuery(rawInput: string): AssistantResponse {
    const input = rawInput.toLowerCase().trim();

    // 1. Emergency Check
    if (
      input.includes('emergency') || 
      input.includes('ambulance') || 
      input.includes('chest pain') || 
      input.includes('heart attack') || 
      input.includes('severe bleeding') ||
      input.includes('unconscious') ||
      input.includes('behoshi') ||
      input.includes('khun')
    ) {
      return {
        reply: '⚠️ **Emergency Notice**: MYRA Home Care supportive nursing and home attendance provide karta hai. Yeh emergency ambulance ya ICU hospital replacement nahi hai. Agar patient ki sthiti gambhir hai, kripya turant **108 Ambulance** par call karein ya nikat-tam hospital emergency room jayein. Supportive nurse ke liye aap hamare number 8893671162 par call kar sakte hain.',
        suggestedActions: ['Call 8893671162', 'View Services', 'Book Bedside Nurse'],
        intent: 'emergency'
      };
    }

    // 2. Greeting
    if (
      input === 'hi' || 
      input === 'hello' || 
      input === 'namaste' || 
      input === 'pranam' || 
      input.startsWith('hey')
    ) {
      return {
        reply: 'Namaste! Welcome to MYRA Home Care Patna. Hum 16+ verified home nursing services pradan karte hain jaise ICU Setup, 12/24 Hr Bedside Care, Elderly Care, Injection/IV, Physiotherapy aur Medical Equipment Rental. Aap kis service ke bare mein janna chahte hain?',
        suggestedActions: ['Book a Service', '12/24 Hr Nursing', 'ICU Setup at Home', 'Physiotherapy', 'Speak on WhatsApp'],
        intent: 'greeting'
      };
    }

    // 3. Match Specific Service
    const matchedService = MYRA_SERVICES.find(srv => {
      const name = srv.name.toLowerCase();
      const slug = srv.slug.toLowerCase();
      const hindi = srv.hindiName.toLowerCase();
      return (
        input.includes(name) || 
        input.includes(slug) || 
        input.includes(hindi) ||
        (name.includes('nursing') && input.includes('nurs')) ||
        (name.includes('icu') && input.includes('icu')) ||
        (name.includes('elderly') && (input.includes('elder') || input.includes('bujurg') || input.includes('old age'))) ||
        (name.includes('wound') && (input.includes('wound') || input.includes('ghav') || input.includes('dressing'))) ||
        (name.includes('physiotherapy') && (input.includes('physio') || input.includes('exercise') || input.includes('paralysis'))) ||
        (name.includes('injection') && (input.includes('injection') || input.includes('drip') || input.includes('iv infusion') || input.includes('suie'))) ||
        (name.includes('catheter') && (input.includes('catheter') || input.includes('peshab pipe') || input.includes('ryle'))) ||
        (name.includes('oxygen') && (input.includes('oxygen') || input.includes('bipap') || input.includes('cpap'))) ||
        (name.includes('equipment') && (input.includes('equipment') || input.includes('bed rental') || input.includes('wheelchair')))
      );
    });

    if (matchedService) {
      return {
        reply: `**${matchedService.name} (${matchedService.hindiName})**\n\n${matchedService.shortDesc}\n\n• **Shuruati Shulk**: ₹${matchedService.startingPrice}\n• **Upalabdhata**: ${matchedService.isAvailable24x7 ? '24×7 Patna' : 'Day Shifts'}\n• **Key Features**: ${matchedService.features.slice(0, 3).join('; ')}.\n\nKya aap is service ko book karna chahte hain ya quotation chahte hain?`,
        suggestedActions: [`Book ${matchedService.name}`, 'Check Patna Coverage', 'Contact Manager on WhatsApp'],
        intent: 'service_info',
        detectedService: matchedService
      };
    }

    // 4. Payment / UPI Queries
    if (
      input.includes('payment') || 
      input.includes('upi') || 
      input.includes('cash') || 
      input.includes('price') || 
      input.includes('fees') || 
      input.includes('kitna lagega') || 
      input.includes('paisa')
    ) {
      return {
        reply: 'MYRA HomeCare mein payment ke do aasan tareeqe hain: **1. Cash on Service** aur **2. UPI Payment (Google Pay / PhonePe / Paytm)**.\n\nManager se formal quotation aane ke baad customer dashboard mein verified UPI QR code aur UPI ID dikhta hai. Pay karne ke baad aap Transaction ID (UTR) enter kar sakte hain, jise Manager verify karta hai. Koi hidden fee ya advance platform charge nahi hai!',
        suggestedActions: ['View Pricing List', 'Request Quotation', 'UPI Details'],
        intent: 'payment_info'
      };
    }

    // 5. Booking / How to Book
    if (
      input.includes('book') || 
      input.includes('kaise book') || 
      input.includes('appointment') || 
      input.includes('chahiye') || 
      input.includes('request')
    ) {
      return {
        reply: 'Aap 3 aasan steps mein service book kar sakte hain:\n1. Hamari website ya Customer Dashboard mein **"Request Service"** par click karein.\n2. Patient details, shift (12 Hr / 24 Hr / Visit) aur Patna ka address select karein.\n3. Manager 15-30 minute ke andar availability check karke 72 ghante valid quotation bhejega. Accept karte hi verified staff assign ho jayenge!\n\nDocument ya prescription share karne ke liye WhatsApp button use karein.',
        suggestedActions: ['Open Booking Form', 'Share on WhatsApp', 'See Available Shifts'],
        intent: 'booking_help'
      };
    }

    // 6. Cancellation / Reschedule
    if (
      input.includes('cancel') || 
      input.includes('refund') || 
      input.includes('reschedule') || 
      input.includes('time change')
    ) {
      return {
        reply: '• **Reschedule**: Customer Dashboard mein "Request Reschedule" button se aap new date/time submit kar sakte hain. Manager turant schedule adjust kar dega.\n• **Cancellation**: Service start hone se 4 ghante pehle bina kisi penalty ke cancel kiya ja sakta hai. Advance payments manual bank verification ke baad return hoti hain.',
        suggestedActions: ['Reschedule My Booking', 'Talk to Manager', 'View Refund Policy'],
        intent: 'cancellation'
      };
    }

    // 7. Location / Patna Coverage
    if (
      input.includes('patna') || 
      input.includes('location') || 
      input.includes('kahan') || 
      input.includes('area') || 
      input.includes('kankarbagh') || 
      input.includes('boring road')
    ) {
      return {
        reply: 'MYRA HomeCare pure Patna nagar nigam aur aaspas ke kshetron mein sewayein deti hai, jisme Boring Road, Bailey Road, Kankarbagh, Rajendra Nagar, Patliputra, Ashiana Nagar, Danapur, Khagaul, Anisabad, Saguna More aur Phulwari Sharif shamil hain.',
        suggestedActions: ['Book in Patna', 'Call 8893671162', 'WhatsApp Location'],
        intent: 'general'
      };
    }

    // Default Fallback
    return {
      reply: 'Main aapki baat samajh raha hoon. MYRA Home Care par sabhi nursing services verified professionals dwara provide ki jati hain. Aap niche diye gaye options mein se chun sakte hain ya direct official WhatsApp par hamare Operations Manager se chat kar sakte hain.',
      suggestedActions: ['Book Nursing Care', 'View All 16 Services', 'Chat on WhatsApp: 8893671162', 'Emergency Guidance'],
      intent: 'general'
    };
  }
}
