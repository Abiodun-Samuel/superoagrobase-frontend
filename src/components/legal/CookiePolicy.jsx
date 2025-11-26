import { SITE_DATA } from "@/utils/data";
import CollapsibleSection from "./CollapsibleSection";

export const CookiePolicy = () => {
    return (
        <div className="prose prose-green max-w-none">
            <div className="bg-purple-50 border-l-4 border-purple-600 p-4 mb-8 rounded">
                <p className="text-sm text-purple-900 font-medium">
                    This Cookie Policy explains how {SITE_DATA.name} uses cookies and similar tracking technologies to enhance
                    your browsing experience and improve our services.
                </p>
            </div>

            <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">What Are Cookies?</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                    Cookies are small text files stored on your device when you visit our website. They help us recognize your
                    device, remember your preferences, and provide you with a personalized shopping experience.
                </p>
                <p className="text-gray-700 leading-relaxed">
                    Cookies do not contain personal information unless you have provided it to us. They cannot access other
                    information on your device or carry viruses.
                </p>
            </section>

            <CollapsibleSection title="1. Types of Cookies We Use" defaultOpen={true}>
                <h4 className="font-semibold text-gray-800 mb-2">Essential Cookies (Strictly Necessary):</h4>
                <p className="text-gray-700 mb-3">
                    These cookies are required for the basic functionality of our platform and cannot be disabled.
                </p>
                <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-1">
                    <li>Session management and authentication</li>
                    <li>Shopping cart functionality</li>
                    <li>Security and fraud prevention</li>
                    <li>Load balancing and performance</li>
                </ul>

                <h4 className="font-semibold text-gray-800 mb-2">Functional Cookies:</h4>
                <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-1">
                    <li>Remember your login details</li>
                    <li>Store your language and location preferences</li>
                    <li>Remember items in your shopping cart</li>
                    <li>Provide customized content based on your location</li>
                </ul>

                <h4 className="font-semibold text-gray-800 mb-2">Analytics Cookies:</h4>
                <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-1">
                    <li>Google Analytics for traffic analysis</li>
                    <li>Page view tracking and bounce rates</li>
                    <li>User journey and behavior analysis</li>
                    <li>Performance monitoring and optimization</li>
                </ul>

                <h4 className="font-semibold text-gray-800 mb-2">Marketing Cookies:</h4>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                    <li>Retargeting and remarketing campaigns</li>
                    <li>Social media advertising (Facebook, Instagram)</li>
                    <li>Conversion tracking and attribution</li>
                    <li>Interest-based advertising</li>
                </ul>
            </CollapsibleSection>

            <CollapsibleSection title="2. Third-Party Cookies">
                <p className="text-gray-700 mb-3">
                    We work with trusted third-party service providers who may place cookies on your device:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                    <li><strong>Payment Processors:</strong> Paystack, Flutterwave for secure transactions</li>
                    <li><strong>Analytics:</strong> Google Analytics for website performance</li>
                    <li><strong>Social Media:</strong> Facebook Pixel, Twitter conversion tracking</li>
                    <li><strong>Customer Support:</strong> Live chat and support tools</li>
                </ul>
            </CollapsibleSection>

            <CollapsibleSection title="3. Managing Your Cookie Preferences">
                <h4 className="font-semibold text-gray-800 mb-2">Browser Settings:</h4>
                <p className="text-gray-700 mb-3">
                    Most browsers allow you to control cookies through their settings. You can:
                </p>
                <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-1">
                    <li>Block all cookies</li>
                    <li>Accept only first-party cookies</li>
                    <li>Delete cookies after each session</li>
                    <li>Receive notifications when cookies are set</li>
                </ul>
                <p className="text-gray-700">
                    Note that disabling cookies may affect the functionality of our platform.
                </p>
            </CollapsibleSection>

            <CollapsibleSection title="4. Updates to Cookie Policy">
                <p className="text-gray-700">
                    We may update this Cookie Policy to reflect changes in our practices or legal requirements. Please review
                    this policy periodically.
                </p>
            </CollapsibleSection>
        </div>
    );
};