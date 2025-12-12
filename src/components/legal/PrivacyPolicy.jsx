import { SITE_DATA } from "@/utils/data";
import CollapsibleSection from "./CollapsibleSection";

export const PrivacyPolicy = () => {
    return (
        <div className="prose prose-green max-w-none">
            <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-8 rounded">
                <p className="text-sm text-blue-900 font-medium">
                    This Privacy Policy complies with the Nigeria Data Protection Regulation (NDPR) and demonstrates our commitment to protecting your personal information.
                </p>
            </div>

            <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Introduction</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                    Welcome to {SITE_DATA.name}. We respect your privacy and are committed to protecting your personal data.
                    This privacy policy explains how we collect, use, disclose, and safeguard your information when you visit
                    our agricultural ecommerce platform, purchase products, or engage with our services.
                </p>
                <p className="text-gray-700 leading-relaxed">
                    We comply with the Nigeria Data Protection Regulation (NDPR) 2019 and other applicable data protection laws.
                    By using our platform, you consent to the data practices described in this policy.
                </p>
            </section>

            <CollapsibleSection title="1. Information We Collect" defaultOpen={true}>
                <h4 className="font-semibold text-gray-800 mb-2">Personal Information:</h4>
                <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-1">
                    <li>Name, email address, phone number</li>
                    <li>Delivery address and billing information</li>
                    <li>Payment details (processed securely through our payment partners)</li>
                    <li>Account credentials and profile information</li>
                </ul>

                <h4 className="font-semibold text-gray-800 mb-2">Transaction Information:</h4>
                <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-1">
                    <li>Purchase history and order details</li>
                    <li>Products browsed and added to cart</li>
                    <li>Communication preferences</li>
                </ul>

                <h4 className="font-semibold text-gray-800 mb-2">Technical Information:</h4>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                    <li>IP address, browser type, and device information</li>
                    <li>Cookies and similar tracking technologies</li>
                    <li>Usage data and analytics</li>
                </ul>
            </CollapsibleSection>

            <CollapsibleSection title="2. How We Use Your Information">
                <p className="text-gray-700 mb-3">We use your information for the following purposes:</p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                    <li><strong>Order Processing:</strong> To process your orders, arrange delivery, and provide customer support</li>
                    <li><strong>Account Management:</strong> To create and manage your account, verify your identity</li>
                    <li><strong>Communication:</strong> To send order confirmations, updates, promotional offers, and newsletters</li>
                    <li><strong>Platform Improvement:</strong> To analyze usage patterns and improve our services</li>
                    <li><strong>Security:</strong> To detect and prevent fraud, protect against security threats</li>
                    <li><strong>Legal Compliance:</strong> To comply with Nigerian laws and regulations</li>
                </ul>
            </CollapsibleSection>

            <CollapsibleSection title="3. Legal Basis for Processing (NDPR Compliance)">
                <p className="text-gray-700 mb-3">Under the NDPR, we process your data based on:</p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                    <li><strong>Consent:</strong> You have given clear consent for us to process your personal data</li>
                    <li><strong>Contract Performance:</strong> Processing is necessary to fulfill our contract with you</li>
                    <li><strong>Legal Obligation:</strong> We must process your data to comply with Nigerian law</li>
                    <li><strong>Legitimate Interest:</strong> Processing is in our legitimate business interests while respecting your rights</li>
                </ul>
            </CollapsibleSection>

            <CollapsibleSection title="4. Data Sharing and Disclosure">
                <p className="text-gray-700 mb-3">We may share your information with:</p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                    <li><strong>Service Providers:</strong> Logistics partners, payment processors, and technology providers</li>
                    <li><strong>Agricultural Suppliers:</strong> Farmers and suppliers fulfilling your orders</li>
                    <li><strong>Legal Authorities:</strong> When required by Nigerian law or to protect our rights</li>
                    <li><strong>Business Transfers:</strong> In case of merger, acquisition, or asset sale</li>
                </ul>
                <p className="text-gray-700 mt-3">
                    We do not sell your personal information to third parties for marketing purposes.
                </p>
            </CollapsibleSection>

            <CollapsibleSection title="5. Data Security">
                <p className="text-gray-700 mb-3">
                    We implement appropriate technical and organizational measures to protect your personal data against
                    unauthorized access, alteration, disclosure, or destruction. These measures include:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                    <li>SSL encryption for data transmission</li>
                    <li>Secure server infrastructure</li>
                    <li>Regular security audits and updates</li>
                    <li>Access controls and authentication</li>
                    <li>Employee training on data protection</li>
                </ul>
            </CollapsibleSection>

            <CollapsibleSection title="6. Your Rights Under NDPR">
                <p className="text-gray-700 mb-3">As a Nigerian resident, you have the following rights:</p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                    <li><strong>Right to Access:</strong> Request copies of your personal data</li>
                    <li><strong>Right to Rectification:</strong> Correct inaccurate or incomplete data</li>
                    <li><strong>Right to Erasure:</strong> Request deletion of your personal data</li>
                    <li><strong>Right to Object:</strong> Object to processing of your data</li>
                    <li><strong>Right to Data Portability:</strong> Receive your data in a structured format</li>
                    <li><strong>Right to Withdraw Consent:</strong> Withdraw consent at any time</li>
                </ul>
                <p className="text-gray-700 mt-3">
                    To exercise these rights, contact us at{' '}
                    <a href={`mailto:${SITE_DATA.email}`} className="text-green-600 hover:underline">
                        {SITE_DATA.email}
                    </a>
                </p>
            </CollapsibleSection>

            <CollapsibleSection title="7. Data Retention">
                <p className="text-gray-700">
                    We retain your personal data only for as long as necessary to fulfill the purposes outlined in this policy,
                    comply with legal obligations, resolve disputes, and enforce our agreements. Typically, we retain transaction
                    data for seven years in compliance with Nigerian tax and accounting regulations.
                </p>
            </CollapsibleSection>

            <CollapsibleSection title="8. Children's Privacy">
                <p className="text-gray-700">
                    Our platform is not intended for children under 18. We do not knowingly collect personal information from
                    children. If you believe we have collected data from a child, please contact us immediately.
                </p>
            </CollapsibleSection>

            <CollapsibleSection title="9. Changes to This Policy">
                <p className="text-gray-700">
                    We may update this privacy policy periodically. We will notify you of significant changes by email or through
                    a prominent notice on our platform. Continued use of our services after changes constitutes acceptance of the
                    updated policy.
                </p>
            </CollapsibleSection>

            <section className="mt-8 p-6 bg-green-50 rounded-xl border border-green-200">
                <h3 className="text-xl font-bold text-gray-800 mb-3">Contact Our Data Protection Officer</h3>
                <p className="text-gray-700 mb-2">For any privacy-related inquiries or to exercise your NDPR rights:</p>
                <p className="text-gray-800">
                    <strong>Email:</strong>{' '}
                    <a href={`mailto:${SITE_DATA.email}`} className="text-green-600 hover:underline">
                        {SITE_DATA.email}
                    </a>
                </p>
                <p className="text-gray-800">
                    <strong>Phone:</strong>{' '}
                    <a href={`tel:${SITE_DATA.phone}`} className="text-green-600 hover:underline">
                        {SITE_DATA.phone}
                    </a>
                </p>
                <p className="text-gray-700 mt-3 text-sm">
                    You also have the right to lodge a complaint with the Nigeria Data Protection Commission (NDPC).
                </p>
            </section>
        </div>
    );
};