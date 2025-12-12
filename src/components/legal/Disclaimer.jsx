import { SITE_DATA } from "@/utils/data";
import CollapsibleSection from "./CollapsibleSection";

export const Disclaimer = () => {
    return (
        <div className="prose prose-green max-w-none">
            <div className="bg-red-50 border-l-4 border-red-600 p-4 mb-8 rounded">
                <p className="text-sm text-red-900 font-medium">
                    Please read this disclaimer carefully before using {SITE_DATA.name}. This disclaimer limits our liability
                    and sets forth important information about the use of our platform.
                </p>
            </div>

            <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">General Disclaimer</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                    The information provided on {SITE_DATA.name} is for general informational purposes only. While we strive to
                    ensure accuracy and quality, we make no representations or warranties of any kind, express or implied, about
                    the completeness, accuracy, reliability, suitability, or availability of products, services, or information
                    on our platform.
                </p>
                <p className="text-gray-700 leading-relaxed">
                    Your use of {SITE_DATA.name} and reliance on any information is strictly at your own risk.
                </p>
            </section>

            <CollapsibleSection title="1. Product Information Disclaimer" defaultOpen={true}>
                <h4 className="font-semibold text-gray-800 mb-2">Product Descriptions:</h4>
                <p className="text-gray-700 mb-3">
                    Product descriptions, images, and specifications are provided by manufacturers and verified suppliers.
                    While we require accurate information, we cannot guarantee:
                </p>
                <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                    <li>Complete accuracy of product descriptions or images</li>
                    <li>Product appearance may vary from images shown</li>
                    <li>Specifications are subject to change by manufacturers</li>
                    <li>Color accuracy may vary due to screen settings</li>
                </ul>

                <h4 className="font-semibold text-gray-800 mb-2">Agricultural Products:</h4>
                <p className="text-gray-700 mb-3">
                    Due to the nature of agricultural products:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                    <li>Size, weight, and appearance may vary naturally</li>
                    <li>Seasonal availability affects product quality and pricing</li>
                    <li>Perishable items have limited shelf life</li>
                    <li>Weather and environmental factors may affect product characteristics</li>
                </ul>
            </CollapsibleSection>

            <CollapsibleSection title="2. Pricing and Availability Disclaimer">
                <p className="text-gray-700 mb-3">
                    Prices and availability are subject to change without notice. We make every effort to ensure pricing
                    accuracy, however:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                    <li>Prices may change due to market conditions</li>
                    <li>Promotional prices are valid for limited periods</li>
                    <li>Product availability is not guaranteed until order confirmation</li>
                    <li>We reserve the right to cancel orders due to pricing errors</li>
                    <li>Agricultural commodity prices fluctuate based on harvest and demand</li>
                </ul>
                <p className="text-gray-700 mt-3">
                    If a pricing error is identified, we will notify you and provide the option to proceed at the correct price
                    or cancel your order with a full refund.
                </p>
            </CollapsibleSection>

            <CollapsibleSection title="3. Health and Safety Disclaimer">
                <p className="text-gray-700 mb-3">
                    For agricultural products, chemicals, fertilizers, and pesticides:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                    <li>Always read product labels and safety instructions</li>
                    <li>Follow manufacturer guidelines for application and use</li>
                    <li>Consult agricultural extension officers for specific advice</li>
                    <li>We are not responsible for misuse of agricultural products</li>
                    <li>Some products may be restricted or require licenses</li>
                </ul>
                <p className="text-gray-700 mt-3 font-semibold">
                    For food products: Check expiration dates and storage instructions. Individuals with allergies should review
                    ingredient lists carefully.
                </p>
            </CollapsibleSection>

            <CollapsibleSection title="4. Agricultural Advice Disclaimer">
                <p className="text-gray-700 mb-4">
                    Any agricultural information, tips, or recommendations provided on our platform are for educational purposes
                    only and should not be considered professional agricultural advice.
                </p>
                <p className="text-gray-700 mb-3">
                    We recommend consulting with:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                    <li>Licensed agronomists for crop management</li>
                    <li>Veterinarians for animal health issues</li>
                    <li>Agricultural extension services for regional guidance</li>
                    <li>Soil testing laboratories for land assessment</li>
                </ul>
                <p className="text-gray-700 mt-3">
                    We are not liable for decisions made based on information from our platform.
                </p>
            </CollapsibleSection>

            <CollapsibleSection title="5. Limitation of Liability">
                <p className="text-gray-700 mb-3">
                    To the fullest extent permitted by Nigerian law, {SITE_DATA.legalName} shall not be liable for:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                    <li>Any direct, indirect, incidental, or consequential damages</li>
                    <li>Loss of profits, revenue, data, or business opportunities</li>
                    <li>Damages arising from product use or misuse</li>
                    <li>Losses due to platform unavailability or errors</li>
                    <li>Third-party actions or conduct</li>
                    <li>Agricultural losses or crop failures</li>
                </ul>
            </CollapsibleSection>

            <CollapsibleSection title="6. Regional Variations">
                <p className="text-gray-700">
                    Agricultural practices, regulations, and product availability vary across Nigerian states and regions.
                    Information provided may not apply to your specific location. Always verify local regulations and best
                    practices with regional agricultural authorities.
                </p>
            </CollapsibleSection>

            <CollapsibleSection title="7. Changes to Disclaimer">
                <p className="text-gray-700">
                    We reserve the right to modify this disclaimer at any time. Material changes will be communicated through
                    our platform. Continued use after changes constitutes acceptance of the updated disclaimer.
                </p>
            </CollapsibleSection>

            <section className="mt-8 p-6 bg-green-50 rounded-xl border border-green-200">
                <p className="text-gray-700 text-sm italic">
                    By using {SITE_DATA.name}, you acknowledge that you have read, understood, and agree to this disclaimer.
                </p>
            </section>
        </div>
    );
};