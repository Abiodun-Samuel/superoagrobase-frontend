import { SITE_DATA } from "@/utils/data";
import CollapsibleSection from "./CollapsibleSection";

export const TermsOfService = () => {
    return (
        <div className="prose prose-green max-w-none">
            <div className="bg-amber-50 border-l-4 border-amber-600 p-4 mb-8 rounded">
                <p className="text-sm text-amber-900 font-medium">
                    Please read these terms carefully before using our platform. By accessing or using {SITE_DATA.name},
                    you agree to be bound by these terms and conditions.
                </p>
            </div>

            <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Agreement to Terms</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                    These Terms of Service constitute a legally binding agreement between you and {SITE_DATA.legalName} concerning
                    your access to and use of our agricultural ecommerce platform. By registering an account, making a purchase,
                    or using our services, you accept and agree to be bound by these terms.
                </p>
                <p className="text-gray-700 leading-relaxed">
                    If you do not agree with these terms, you must not access or use our platform.
                </p>
            </section>

            <CollapsibleSection title="1. Eligibility and Account Registration" defaultOpen={true}>
                <h4 className="font-semibold text-gray-800 mb-2">Eligibility:</h4>
                <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-1">
                    <li>You must be at least 18 years old to use our platform</li>
                    <li>You must provide accurate and complete registration information</li>
                    <li>You are responsible for maintaining the confidentiality of your account</li>
                    <li>You agree to notify us immediately of any unauthorized access</li>
                </ul>
            </CollapsibleSection>

            <CollapsibleSection title="2. Product Listings and Purchases">
                <h4 className="font-semibold text-gray-800 mb-2">Product Information:</h4>
                <p className="text-gray-700 mb-3">
                    We strive to provide accurate product descriptions, images, and pricing. However, we do not warrant that
                    product descriptions, images, or other content are accurate, complete, reliable, or error-free.
                </p>

                <h4 className="font-semibold text-gray-800 mb-2">Pricing and Payment:</h4>
                <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                    <li>All prices are displayed in Nigerian Naira (₦) and include applicable taxes</li>
                    <li>We reserve the right to change prices at any time</li>
                    <li>Payment must be made through our approved payment partners</li>
                    <li>We accept card payments, bank transfers, and mobile money</li>
                </ul>
            </CollapsibleSection>

            <CollapsibleSection title="3. Delivery and Fulfillment">
                <h4 className="font-semibold text-gray-800 mb-2">Delivery Terms:</h4>
                <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                    <li>Delivery timeframes are estimates and not guaranteed</li>
                    <li>You are responsible for providing accurate delivery information</li>
                    <li>Risk of loss passes to you upon delivery</li>
                    <li>Delivery fees are calculated based on location and order value</li>
                </ul>

                <h4 className="font-semibold text-gray-800 mb-2">Agricultural Product Considerations:</h4>
                <p className="text-gray-700">
                    Due to the nature of agricultural products, delivery times may vary based on harvest seasons, weather
                    conditions, and product availability. Perishable items require immediate collection upon delivery.
                </p>
            </CollapsibleSection>

            <CollapsibleSection title="4. Returns and Refunds">
                <h4 className="font-semibold text-gray-800 mb-2">Return Eligibility:</h4>
                <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                    <li>Non-perishable items may be returned within 7 days of delivery</li>
                    <li>Items must be unused and in original packaging</li>
                    <li>Perishable agricultural products cannot be returned unless defective</li>
                    <li>Return shipping costs are borne by the customer unless the item is defective</li>
                </ul>

                <h4 className="font-semibold text-gray-800 mb-2">Refund Process:</h4>
                <p className="text-gray-700">
                    Approved refunds will be processed within 14 business days to your original payment method. Refunds do not
                    include delivery fees unless the return is due to our error.
                </p>
            </CollapsibleSection>

            <CollapsibleSection title="5. Prohibited Activities">
                <p className="text-gray-700 mb-3">You agree not to:</p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                    <li>Use the platform for any illegal purpose</li>
                    <li>Sell counterfeit, stolen, or prohibited products</li>
                    <li>Manipulate prices or engage in anti-competitive practices</li>
                    <li>Harass, abuse, or harm other users</li>
                    <li>Circumvent or manipulate our systems or security features</li>
                    <li>Use automated tools to access the platform without permission</li>
                    <li>Infringe on intellectual property rights</li>
                </ul>
            </CollapsibleSection>

            <CollapsibleSection title="6. Intellectual Property Rights">
                <p className="text-gray-700 mb-3">
                    All content on our platform, including text, graphics, logos, images, and software, is owned by {SITE_DATA.legalName} or
                    our licensors and protected by Nigerian and international intellectual property laws.
                </p>
                <p className="text-gray-700">
                    You may not reproduce, distribute, modify, or create derivative works without our express written permission.
                </p>
            </CollapsibleSection>

            <CollapsibleSection title="7. Limitation of Liability">
                <p className="text-gray-700 mb-3">
                    To the maximum extent permitted by Nigerian law, {SITE_DATA.legalName} shall not be liable for:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                    <li>Indirect, incidental, special, or consequential damages</li>
                    <li>Loss of profits, revenue, or data</li>
                    <li>Damages arising from product quality issues</li>
                    <li>Delays or failures due to circumstances beyond our control</li>
                </ul>
                <p className="text-gray-700 mt-3">
                    Our total liability shall not exceed the amount you paid for the specific transaction giving rise to the claim.
                </p>
            </CollapsibleSection>

            <CollapsibleSection title="8. Dispute Resolution">
                <p className="text-gray-700 mb-3">
                    In case of disputes, we encourage good-faith negotiation. If unresolved:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                    <li>Disputes shall be resolved through mediation or arbitration in Lagos, Nigeria</li>
                    <li>These terms are governed by the laws of the Federal Republic of Nigeria</li>
                    <li>You retain the right to pursue claims through Nigerian courts</li>
                </ul>
            </CollapsibleSection>

            <CollapsibleSection title="9. Amendments">
                <p className="text-gray-700">
                    We may modify these terms at any time. We will provide notice of material changes through email or platform
                    notifications. Continued use after changes constitutes acceptance of the modified terms.
                </p>
            </CollapsibleSection>
        </div>
    );
};