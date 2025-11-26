import { SITE_DATA } from "@/utils/data";
import { Mail, MapPin, Phone } from "lucide-react";

const LegalPageLayout = ({ children, icon: Icon, title }) => {
    return (
        <>
            {/* Content */}
            <main className="bg-white rounded-2xl shadow">
                <div className="p-5 md:p-10">
                    {children}
                </div>
            </main>

            {/* Contact Section */}
            <section className="my-10">
                <div className="bg-white rounded-2xl shadow p-5 md:p-10 border-t-2 border-green-600">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Contact Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-3">{SITE_DATA.legalName}</h3>
                            <div className="space-y-3 text-sm text-gray-700">
                                <div className="flex items-start space-x-3">
                                    <MapPin className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                    <span>{SITE_DATA.address.full}</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Phone className="w-5 h-5 text-green-600 flex-shrink-0" />
                                    <a href={`tel:${SITE_DATA.phone}`} className="hover:text-green-600 transition">
                                        {SITE_DATA.phone}
                                    </a>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Mail className="w-5 h-5 text-green-600 flex-shrink-0" />
                                    <a href={`mailto:${SITE_DATA.email}`} className="hover:text-green-600 transition">
                                        {SITE_DATA.email}
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-3">Legal Inquiries</h3>
                            <p className="text-sm text-gray-700 mb-4">
                                For privacy, terms, or legal questions, please contact us via email or phone during business hours.
                            </p>
                            <a
                                href={SITE_DATA.whatsapp}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium"
                            >
                                Contact via WhatsApp
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default LegalPageLayout