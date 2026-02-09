import { SITE_DATA } from '@/utils/data'
import { Mail, MapPin, Phone, MessageCircle } from 'lucide-react'
import IconBadge from '@/components/ui/IconBadge'

const ContactCard = ({ Icon, title, content, link, external = false }) => {
    const CardContent = () => (
        <div className="flex items-center gap-3 p-4 rounded-lg bg-white border border-gray-100 hover:border-green-500 hover:shadow-sm transition-all duration-300 group h-full">
            <IconBadge
                icon={<Icon />}
                variant="light"
                color="green"
                size="lg"
                className="flex-shrink-0 group-hover:scale-105 transition-transform duration-300"
            />
            <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-800 text-sm mb-0.5">{title}</h3>
                <p className="text-sm text-gray-600 group-hover:text-green-600 transition-colors truncate">
                    {content}
                </p>
            </div>
        </div>
    )

    if (link) {
        return (
            <a
                href={link}
                target={external ? '_blank' : undefined}
                rel={external ? 'noopener noreferrer' : undefined}
                className="block h-full"
            >
                <CardContent />
            </a >
        )
    }

    return <CardContent />
}

const ContactSection = () => (
    <section className="my-8 border-t pt-10">
        <div className="rounded-xl border-t-4 border-green-600 bg-gradient-to-b from-gray-50 to-white p-6 shadow-sm">
            <div className="text-center mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
                    Get in Touch
                </h2>
                <p className="text-sm text-gray-600 max-w-xl mx-auto">
                    Our team is ready to help. Reach out and we'll respond quickly.
                </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <ContactCard
                    Icon={MessageCircle}
                    title="WhatsApp"
                    content="Chat instantly"
                    link={SITE_DATA.whatsapp}
                    external={true}
                />
                <ContactCard
                    Icon={Phone}
                    title="Call Us"
                    content={SITE_DATA.phone}
                    link={`tel:${SITE_DATA.phone}`}
                />
                <ContactCard
                    Icon={Mail}
                    title="Email"
                    content={SITE_DATA.email}
                    link={`mailto:${SITE_DATA.email}`}
                />
                <ContactCard
                    Icon={MapPin}
                    title="Visit Us"
                    content={SITE_DATA.address.full}
                    link={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SITE_DATA.address.full)}`}
                    external={true}
                />
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
                <p className="text-sm text-gray-600">
                    <span className="font-semibold text-gray-800">{SITE_DATA.legalName}</span>
                    {' · '}
                    Available during business hours. WhatsApp for quick responses anytime.
                </p>
            </div>
        </div>
    </section>
)

const PageLayout = ({ children, isHome = false }) => {
    return (
        <div className={`${isHome ? 'container' : 'max-w-7xl'} mx-auto px-3 sm:px-5 lg:px-7`}>
            {children}
            <ContactSection />
        </div>
    )
}

export default PageLayout