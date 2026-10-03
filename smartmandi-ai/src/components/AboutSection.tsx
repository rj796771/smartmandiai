import React from 'react';
import { Target, ShieldCheck, Phone, Mail, MapPin, HeartHandshake } from 'lucide-react';
import { AgriPlusLogo } from './AgriPlusLogo';
import { Language } from '../types';

interface AboutSectionProps {
  language: Language;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ language }) => {
  return (
    <div className="space-y-12 max-w-5xl mx-auto py-4">
      
      {/* Mission Header */}
      <div className="bg-[#FFFDF8] dark:bg-[#1E2D25] rounded-[2rem] border border-[#DDD9CF] dark:border-[#28513A]/80 p-8 sm:p-12 text-center card-shadow">
        <div className="inline-flex items-center justify-center mb-4">
          <AgriPlusLogo size="xl" showWordmark={true} showTagline={true} />
        </div>
        
        <p className="text-lg font-bold text-[#183A2B] dark:text-[#D99A2B] mt-2 font-['Manrope',sans-serif]">
          Smarter Markets. Better Decisions. Higher Returns.
        </p>

        <p className="mt-4 text-base text-[#667067] dark:text-[#B9C3BA] max-w-2xl mx-auto leading-relaxed font-medium">
          {language === 'mr'
            ? 'AgriPlus AI हे महाराष्ट्रातील शेतकरी आणि ग्रामीण उद्योजकांसाठी एक प्रगत निर्णय सहाय्य प्लॅटफॉर्म आहे. पिकांच्या प्रत्यक्ष बाजार भावाव्यतिरिक्त वाहतूक खर्च, मध्यस्थांचे कमिशन आणि हवामानाचा अंदाज यांचा विचार करून सर्वात जास्त निव्वळ नफा मिळवून देणे हा आमचा मुख्य उद्देश आहे.'
            : language === 'hi'
            ? 'AgriPlus AI महाराष्ट्र के किसानों और ग्रामीण उद्यमियों के लिए एक उन्नत निर्णय सहायता मंच है। केवल मंडी भाव दिखाने के बजाय यह आपको परिवहन लागत, मंडी कमीशन और मौसम पूर्वानुमान काटकर सबसे अधिक शुद्ध लाभ बताने का काम करता है।'
            : 'AgriPlus AI is an intelligent market decision support system designed specifically for farmers in Maharashtra. Instead of simply listing mandi prices, we calculate real net earnings after factoring in transport distance, freight rates, commission fees, and weather risks.'}
        </p>
      </div>

      {/* Core Philosophy Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-[2rem] bg-[#FFFDF8] dark:bg-[#1E2D25] border border-[#DDD9CF] dark:border-[#28513A]/80 card-shadow space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-[#F8F5ED] dark:bg-[#101814] text-[#183A2B] dark:text-[#D99A2B] flex items-center justify-center font-bold border border-[#DDD9CF] dark:border-[#28513A]">
            <Target className="w-5 h-5 text-[#D99A2B]" />
          </div>
          <h3 className="text-lg font-bold text-[#183A2B] dark:text-[#F5F2E9] font-['Manrope',sans-serif]">
            Where to Sell?
          </h3>
          <p className="text-xs text-[#667067] dark:text-[#B9C3BA] leading-relaxed font-medium">
            Evaluates 10+ nearby APMC mandis to pinpoint the destination giving maximum net cash in hand.
          </p>
        </div>

        <div className="p-6 rounded-[2rem] bg-[#FFFDF8] dark:bg-[#1E2D25] border border-[#DDD9CF] dark:border-[#28513A]/80 card-shadow space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-[#F8F5ED] dark:bg-[#101814] text-[#183A2B] dark:text-[#D99A2B] flex items-center justify-center font-bold border border-[#DDD9CF] dark:border-[#28513A]">
            <HeartHandshake className="w-5 h-5 text-[#D99A2B]" />
          </div>
          <h3 className="text-lg font-bold text-[#183A2B] dark:text-[#F5F2E9] font-['Manrope',sans-serif]">
            Sell or Wait?
          </h3>
          <p className="text-xs text-[#667067] dark:text-[#B9C3BA] leading-relaxed font-medium">
            Predicts price movements over 2 to 5 days using seasonal arrival data and AI forecasting.
          </p>
        </div>

        <div className="p-6 rounded-[2rem] bg-[#FFFDF8] dark:bg-[#1E2D25] border border-[#DDD9CF] dark:border-[#28513A]/80 card-shadow space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-[#F8F5ED] dark:bg-[#101814] text-[#183A2B] dark:text-[#D99A2B] flex items-center justify-center font-bold border border-[#DDD9CF] dark:border-[#28513A]">
            <ShieldCheck className="w-5 h-5 text-[#D99A2B]" />
          </div>
          <h3 className="text-lg font-bold text-[#183A2B] dark:text-[#F5F2E9] font-['Manrope',sans-serif]">
            Trusted Buyers
          </h3>
          <p className="text-xs text-[#667067] dark:text-[#B9C3BA] leading-relaxed font-medium">
            Connects farmers with APMC-licensed buyers holding 95%+ verified trust scores and instant UPI payments.
          </p>
        </div>
      </div>

      {/* Contact Form & Support Box */}
      <div className="bg-[#FFFDF8] dark:bg-[#1E2D25] rounded-[2rem] border border-[#DDD9CF] dark:border-[#28513A]/80 p-8 card-shadow">
        <h2 className="text-2xl font-extrabold text-[#183A2B] dark:text-[#F5F2E9] font-['Manrope',sans-serif] mb-6">
          Contact Farmer Support & Helpline
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4 text-sm text-[#667067] dark:text-[#B9C3BA]">
            <div className="flex items-center space-x-3 p-3.5 rounded-2xl bg-[#F8F5ED] dark:bg-[#101814] border border-[#DDD9CF] dark:border-[#28513A]">
              <Phone className="w-5 h-5 text-[#D99A2B]" />
              <div>
                <span className="font-bold text-[#183A2B] dark:text-[#F5F2E9] block">Toll-Free Helpline</span>
                <span>1800-266-9800 (Mon - Sat, 8 AM - 8 PM)</span>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3.5 rounded-2xl bg-[#F8F5ED] dark:bg-[#101814] border border-[#DDD9CF] dark:border-[#28513A]">
              <Mail className="w-5 h-5 text-[#D99A2B]" />
              <div>
                <span className="font-bold text-[#183A2B] dark:text-[#F5F2E9] block">Email Support</span>
                <span>support@agriplus.ai</span>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3.5 rounded-2xl bg-[#F8F5ED] dark:bg-[#101814] border border-[#DDD9CF] dark:border-[#28513A]">
              <MapPin className="w-5 h-5 text-[#D99A2B]" />
              <div>
                <span className="font-bold text-[#183A2B] dark:text-[#F5F2E9] block">Headquarters</span>
                <span>AgriTech Innovation Hub, APMC Market Yard, Nashik, Maharashtra 422003</span>
              </div>
            </div>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); alert('Thank you for reaching out! An AgriPlus representative will contact you shortly.'); }} className="space-y-3">
            <input
              type="text"
              required
              placeholder="Your Full Name / शेतकरी नाव"
              className="w-full px-4 py-2.5 rounded-xl border border-[#DDD9CF] dark:border-[#28513A] bg-[#F8F5ED] dark:bg-[#101814] text-sm focus:outline-none focus:ring-2 focus:ring-[#D99A2B] text-[#202522] dark:text-[#F5F2E9]"
            />
            <input
              type="tel"
              required
              placeholder="Mobile Number / मोबाइल नंबर"
              className="w-full px-4 py-2.5 rounded-xl border border-[#DDD9CF] dark:border-[#28513A] bg-[#F8F5ED] dark:bg-[#101814] text-sm focus:outline-none focus:ring-2 focus:ring-[#D99A2B] text-[#202522] dark:text-[#F5F2E9]"
            />
            <textarea
              rows={3}
              required
              placeholder="How can we help you? / संदेश"
              className="w-full px-4 py-2.5 rounded-xl border border-[#DDD9CF] dark:border-[#28513A] bg-[#F8F5ED] dark:bg-[#101814] text-sm focus:outline-none focus:ring-2 focus:ring-[#D99A2B] text-[#202522] dark:text-[#F5F2E9]"
            />
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#183A2B] hover:bg-[#10271D] text-[#FFFDF8] font-bold text-sm transition-colors shadow-md"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>

    </div>
  );
};

