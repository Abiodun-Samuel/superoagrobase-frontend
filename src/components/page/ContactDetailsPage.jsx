'use client'

import { Mail, Phone, MapPin, Clock, Send, MessageSquare, Facebook, Twitter, Instagram, Globe, ArrowRight } from 'lucide-react';
import { SITE_DATA } from '@/utils/data';
import IconBadge from '../ui/IconBadge';
import InputForm from '../form/InputForm';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { ContactSchema } from '@/validation/schema';
import Button from '../ui/Button';
import TextareaForm from '../form/TextareaForm';
import { useContactForm } from '@/queries/contact.query';
import useAuth from '@/hooks/useAuth';

const ContactDetailsPage = () => {
    const { user } = useAuth()
    const { mutateAsync, isPending } = useContactForm();
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: yupResolver(ContactSchema),
        defaultValues: {
            name: user?.full_name || '',
            email: user?.email || ''
        }
    });

    const handleSubmitContact = async (data) => {
        try {
            await mutateAsync(data);
            reset();
        } catch (err) { }
    }


    const contactMethods = [
        {
            icon: Phone,
            title: 'Call Us',
            primary: SITE_DATA.phone,
            secondary: 'Mon-Sat, 8AM-6PM',
            action: `tel:${SITE_DATA.phone}`,
            color: 'emerald'
        },
        {
            icon: Mail,
            title: 'Email Us',
            primary: SITE_DATA.email,
            secondary: 'We reply within 24hrs',
            action: `mailto:${SITE_DATA.email}`,
            color: 'blue'
        },
        {
            icon: MessageSquare,
            title: 'WhatsApp',
            primary: 'Chat with us',
            secondary: 'Instant response',
            action: SITE_DATA.whatsapp,
            color: 'green'
        },
        {
            icon: MapPin,
            title: 'Visit Us',
            primary: `${SITE_DATA.address.city}, ${SITE_DATA.address.state}`,
            secondary: 'See location on map',
            action: '#map',
            color: 'orange'
        }
    ];

    const officeHours = [
        { day: 'Monday - Friday', time: '8:00 AM - 6:00 PM' },
        { day: 'Saturday', time: '9:00 AM - 4:00 PM' },
        { day: 'Sunday', time: 'Closed' }
    ];

    return (
        <>
            {/* Contact Methods Grid */}
            <div className="relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {contactMethods.map((method, index) => {
                        const Icon = method.icon;
                        return (
                            <a
                                key={index}
                                href={method.action}
                                target={method.action.startsWith('http') ? '_blank' : '_self'}
                                rel="noopener noreferrer"
                                className="group bg-white rounded-xl p-6 shadow border transition-all duration-300 hover:-translate-y-1"
                            >
                                <IconBadge className='mb-4' size='lg' color={method.color} icon={<Icon />} />
                                <h3 className="font-semibold text-gray-900 mb-1">{method.title}</h3>
                                <p className="text-sm text-gray-900 font-medium mb-1">{method.primary}</p>
                                <p className="text-xs text-gray-500">{method.secondary}</p>
                            </a>
                        );
                    })}
                </div>
            </div>

            {/* Main Content */}
            <div >
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow border p-6 sm:p-8">
                            <div className="mb-8">
                                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                                    Send us a Message
                                </h2>
                                <p className="text-gray-600">
                                    Fill out the form below and we'll respond as soon as possible
                                </p>
                            </div>

                            <form onSubmit={handleSubmit(handleSubmitContact)} className="space-y-5 relative">
                                <div className="grid sm:grid-cols-2 gap-6">
                                    <div>
                                        <InputForm
                                            label="Name"
                                            name="name"
                                            type="text"
                                            register={register}
                                            error={errors.name?.message}
                                            placeholder="Enter your name"
                                            required={true}
                                        />
                                    </div>
                                    <div>
                                        <InputForm
                                            label="Email Address"
                                            type="email"
                                            name="email"
                                            register={register}
                                            error={errors.email?.message}
                                            placeholder="john@example.com"
                                            required={true}
                                        />
                                    </div>
                                </div>

                                <div className="grid sm:grid-cols-2 gap-6">
                                    <div>
                                        <InputForm
                                            label="Phone Number"
                                            type="tel"
                                            name="phone"
                                            register={register}
                                            error={errors.phone?.message}
                                            placeholder="+234 800 000 0000"
                                        />
                                    </div>
                                    <div>
                                        <InputForm
                                            label="Subject"
                                            type="text"
                                            name="subject"
                                            register={register}
                                            error={errors.subject?.message}
                                            placeholder="Subject"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <TextareaForm
                                        label=" Your Message"
                                        name="message"
                                        register={register}
                                        error={errors.message?.message}
                                        placeholder="Tell us how we can help you..."
                                        required={true}
                                    />
                                </div>

                                <Button loading={isPending} type='submit' endIcon={<Send />}>
                                    Send Message
                                </Button>
                            </form>
                        </div>
                    </div>

                    {/* Sidebar Info */}
                    <div className="space-y-5">
                        {/* Office Hours */}
                        <div className="bg-white rounded-xl shadow border p-5">
                            <div className="flex items-center gap-3 mb-3">
                                <IconBadge color='blue' size='md' icon={<Clock />} />
                                <h3 className="font-bold text-lg text-gray-900">Office Hours</h3>
                            </div>

                            <div className="space-y-1">
                                {officeHours.map((hour, index) => (
                                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                                        <span className="text-sm text-gray-600">{hour.day}</span>
                                        <span className="text-sm font-medium text-gray-900">{hour.time}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Location */}
                        <div className="bg-white rounded-xl shadow border p-5">
                            <div className="flex items-center gap-3 mb-3">
                                <IconBadge color='orange' size='md' icon={<MapPin />} />
                                <h3 className="font-bold text-lg text-gray-900">Our Location</h3>
                            </div>

                            <p className="text-sm text-gray-600 mb-3">
                                {SITE_DATA.address.full}
                            </p>

                            <a
                                href="#map"
                                className="inline-flex items-center gap-2 text-sm font-medium text-emerald-600 hover:text-emerald-700"
                            >
                                View on map
                                <ArrowRight className="w-4 h-4" />
                            </a>
                        </div>

                        {/* Social Media */}
                        <div className="bg-white rounded-xl shadow border p-5">
                            <div className="flex items-center gap-3 mb-3.5">
                                <IconBadge color='purple' size='md' icon={<Globe />} />
                                <h3 className="font-bold text-lg text-gray-900">Follow Us</h3>
                            </div>

                            <div className="flex gap-5">
                                <IconBadge external href={SITE_DATA.social.facebook} color='blue' size='md' icon={<Facebook />} />
                                <IconBadge external href={SITE_DATA.social.twitter} color='sky' size='md' icon={<Twitter />} />
                                <IconBadge external href={SITE_DATA.social.instagram} color='pink' size='md' icon={<Instagram />} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Map Section */}
            <div id="map" >
                <div className="bg-white rounded-xl shadow border overflow-hidden">
                    <div className="aspect-[16/9] sm:aspect-[21/9] bg-gray-200">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.0474817867766!2d3.5053!3d6.6153!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMzYnNTUuMSJOIDPCsDMwJzE5LjAiRQ!5e0!3m2!1sen!2sng!4v1234567890"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="SuperoAgrobase Location"
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default ContactDetailsPage;