'use client'

import React, { useMemo, useEffect } from 'react';
import {
    CreditCard, Truck, Building2, ChevronRight, AlertCircle,
    CheckCircle2, ShoppingCart, User, Mail, Home,
    Package2Icon, ShoppingBag, Info
} from 'lucide-react';
import { Country, State } from 'country-state-city';
import { findShippingRate, formatCurrency } from '@/utils/helper';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { CheckoutSchema } from '@/validation/schema';
import PageHero from '../page/PageHero';
import InputForm from '../form/InputForm';
import SingleSelectForm from '../form/SingleSelectForm';
import SwitchForm from '../form/SwitchForm';
import CardRadioForm from '../form/CardRadioForm';
import IconBadge from '../ui/IconBadge';
import Button from '../ui/Button';
import useAuth from '@/hooks/useAuth';
import { useCart } from '@/queries/cart.query';
import { DELIVERY_OPTIONS, PAYMENT_OPTIONS, SITE_DATA } from '@/utils/data';
import EmptyState from '../common/EmptyState';
import CheckoutPageSkeleton from './CheckoutPageSkeleton';
import Alert from '../common/Alert';
import OrderSummary from './OrderSummary';
import CheckoutFormSection from './CheckoutFormSection';
import StockAvailabilityAlert from './StockAvailabilityAlert';
import { useCreateOrder } from '@/queries/orders.query';

const CheckoutPageDetails = () => {
    const { user, sessionId } = useAuth();
    const { data: cartData, isLoading, isError, error } = useCart();
    const { mutate, isPending } = useCreateOrder()
    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(CheckoutSchema),
        mode: "onTouched",
        defaultValues: {
            first_name: user?.first_name || '',
            last_name: user?.last_name || '',
            email: user?.email || '',
            phone_number: user?.phone_number || '',
            whatsapp_number: '',
            address: user?.address || '',
            city: user?.city || '',
            state: user?.state || '',
            country: user?.country || '',
            delivery_method: '',
            payment_method: '',
            save_delivery_details: false,
        },
    });

    // Watch form values
    const deliveryMethod = watch('delivery_method');
    const paymentMethod = watch('payment_method');
    const selectedCountry = watch('country');
    const selectedState = watch('state');
    const selectedCity = watch('city');

    // Get location data
    const countries = Country.getAllCountries();
    const states = selectedCountry ? State.getStatesOfCountry(selectedCountry) : [];

    const countryOptions = countries.map(country => ({
        value: country.isoCode,
        text: country.name
    }));

    const stateOptions = states.map(state => ({
        value: state.isoCode,
        text: state.name
    }));

    const getStateName = (stateCode) => {
        const state = states.find(s => s.isoCode === stateCode);
        return state?.name || stateCode;
    };

    // Reset dependent fields when parent changes
    useEffect(() => {
        if (selectedCountry) {
            setValue('state', '');
            setValue('city', '');
        }
    }, [selectedCountry, setValue]);

    useEffect(() => {
        if (selectedState) {
            setValue('city', '');
        }
    }, [selectedState, setValue]);

    const shippingInfo = useMemo(() => {
        if (deliveryMethod === 'pickup') {
            return {
                cost: 0,
                isAvailable: true,
                requiresQuote: false,
                hasShippingRate: true
            };
        }

        if (!selectedState || !selectedCity) {
            return {
                cost: 0,
                isAvailable: false,
                requiresQuote: false,
                hasShippingRate: false
            };
        }

        const stateName = getStateName(selectedState);
        const shippingCost = findShippingRate(stateName, selectedCity);

        if (shippingCost !== null && shippingCost !== undefined) {
            return {
                cost: shippingCost,
                isAvailable: true,
                requiresQuote: false,
                hasShippingRate: true
            };
        }
        return {
            cost: 0,
            isAvailable: true,
            requiresQuote: true,
            hasShippingRate: false
        };
    }, [deliveryMethod, selectedState, selectedCity, states]);

    const calculatedValues = useMemo(() => {
        const subtotal = cartData?.summary?.total || 0;
        const tax = cartData?.summary?.tax || 0;
        const tax_rate = cartData?.summary?.tax_rate || 0;
        const shipping = shippingInfo.cost;
        const total = subtotal + tax + Number(shipping);

        return {
            subtotal,
            tax,
            tax_rate,
            shipping,
            total
        };
    }, [shippingInfo.cost, cartData?.summary]);

    const availablePaymentOptions = useMemo(() => {
        return PAYMENT_OPTIONS?.map(option => {
            if (option.value === 'online') {
                if (deliveryMethod === 'waybill' && shippingInfo.requiresQuote) {
                    return {
                        ...option,
                        disabled: true,
                        subtext: 'Available after shipping cost confirmation'
                    };
                }
                return option;
            }

            if (option.value === 'later') {
                if (deliveryMethod === 'waybill' && shippingInfo.hasShippingRate) {
                    return {
                        ...option,
                        disabled: true,
                        subtext: 'Only available for office pickup'
                    };
                }
                return option;
            }
            return option;
        });
    }, [deliveryMethod, shippingInfo.requiresQuote, shippingInfo.hasShippingRate]);

    useEffect(() => {
        if (deliveryMethod === 'waybill' && shippingInfo.requiresQuote) {
            if (paymentMethod !== 'later') {
                setValue('payment_method', 'later', { shouldValidate: true });
            }
        }
        if (deliveryMethod === 'waybill' && shippingInfo.hasShippingRate) {
            if (paymentMethod === 'later') {
                setValue('payment_method', 'online', { shouldValidate: true });
            }
        }
    }, [deliveryMethod, shippingInfo.requiresQuote, shippingInfo.hasShippingRate, paymentMethod, setValue]);

    const onSubmit = (data) => {
        const orderData = {
            session_id: sessionId,
            delivery_details: {
                first_name: data.first_name,
                last_name: data.last_name,
                email: data.email,
                phone_number: data.phone_number,
                whatsapp_number: data.whatsapp_number || null,
                ...(deliveryMethod === 'waybill' && {
                    address: data.address,
                    city: data.city,
                    state: getStateName(data.state),
                    country: countries.find(c => c.isoCode === data.country)?.name || data.country,
                })
            },
            items: cartData?.items?.map((item) => {
                return {
                    product_id: item?.product_id,
                    quantity: item?.quantity,
                    price_at_purchase: item?.current_price,
                    subtotal: item?.itemTotal,
                }
            }),
            delivery_method: data.delivery_method,
            payment_method: data.payment_method,
            save_delivery_details: data.save_delivery_details,

            pricing: {
                subtotal: calculatedValues.subtotal,
                tax: calculatedValues.tax,
                tax_rate: calculatedValues.tax_rate,
                shipping: calculatedValues.shipping,
                total: calculatedValues.total,
            }
        };
        mutate(orderData)
    };

    // Derived state for UI
    const hasItems = cartData?.items && cartData.items.length > 0;
    const hasIssues = cartData?.availability?.has_issues
    const itemCount = cartData?.items?.length || 0;
    const isPickupMethod = deliveryMethod === 'pickup';
    const isHomeDelivery = deliveryMethod === 'waybill';

    const getHeroDescription = () => {
        if (isLoading) return "Loading your cart...";
        if (isError) return "Something went wrong";
        if (!hasItems) return "Your cart is currently empty";
        return `${itemCount} ${itemCount === 1 ? 'item' : 'items'} in your cart. Complete your agricultural supplies order.`;
    };

    const renderContent = () => {
        // Loading state
        if (isLoading) {
            return <CheckoutPageSkeleton />;
        }

        // Error state
        if (isError) {
            return (
                <Alert
                    error={error}
                    actionButton={
                        <Button href={'/'} startIcon={<Home />}>
                            Home
                        </Button>
                    }
                />
            );
        }

        // Empty cart state
        if (!hasItems) {
            return (
                <EmptyState
                    iconBadge={
                        <IconBadge
                            className="mb-5"
                            color="red"
                            size="2xl"
                            shape="circle"
                            icon={<ShoppingCart />}
                        />
                    }
                    title="Your cart is empty"
                    description="Looks like you haven't added any items to your cart yet. Start shopping to fill it up!"
                    actionButton={
                        <Button href="/products" startIcon={<ShoppingBag />}>
                            Start Shopping
                        </Button>
                    }
                />
            );
        }

        return (
            <div className="min-h-screen mx-auto my-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-2 space-y-6">

                        {/* Personal Information */}
                        <CheckoutFormSection icon={User} title="Personal Information">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <InputForm
                                    label="First name"
                                    name="first_name"
                                    type="text"
                                    register={register}
                                    error={errors.first_name?.message}
                                    placeholder="Enter your first name"
                                    required
                                />
                                <InputForm
                                    label="Last name"
                                    name="last_name"
                                    type="text"
                                    register={register}
                                    error={errors.last_name?.message}
                                    placeholder="Enter your last name"
                                    required
                                />
                            </div>
                        </CheckoutFormSection>

                        {/* Contact Details */}
                        <CheckoutFormSection icon={Mail} title="Contact Details">
                            <div className="space-y-4">
                                <InputForm
                                    label="Email"
                                    name="email"
                                    type="email"
                                    register={register}
                                    error={errors.email?.message}
                                    placeholder="your.email@example.com"
                                    required
                                />
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <InputForm
                                        label="Phone number"
                                        name="phone_number"
                                        type="tel"
                                        register={register}
                                        error={errors.phone_number?.message}
                                        placeholder="08012345678"
                                        required
                                    />
                                    <InputForm
                                        label="WhatsApp number"
                                        name="whatsapp_number"
                                        type="tel"
                                        register={register}
                                        error={errors.whatsapp_number?.message}
                                        placeholder="08012345678 (optional)"
                                    />
                                </div>
                            </div>
                        </CheckoutFormSection>

                        {/* Delivery Method - Show before address */}
                        <div className="bg-white rounded-2xl shadow border p-5">
                            <div className="flex items-center gap-3 mb-5">
                                <IconBadge color="green" size="md" icon={<Truck />} />
                                <h2 className="text-lg font-semibold text-gray-700">Delivery Method</h2>
                            </div>

                            <CardRadioForm
                                control={control}
                                name="delivery_method"
                                options={DELIVERY_OPTIONS}
                                error={errors?.delivery_method?.message}
                                required
                                color="green"
                                layout="grid"
                            />

                            {/* Office Pickup Information */}
                            {isPickupMethod && (
                                <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                                    <div className="flex items-start gap-3">
                                        <Building2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="font-medium text-blue-900">Office Address</p>
                                            <p className="text-sm text-blue-700 mt-1">
                                                {SITE_DATA?.address?.full}
                                            </p>
                                            <p className="text-xs text-blue-600 mt-2">
                                                Available Mon-Fri: 9AM - 5PM
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Delivery Address - Only show for home delivery */}
                        {isHomeDelivery && (
                            <CheckoutFormSection icon={Home} title="Delivery Address">
                                <div className="space-y-4">
                                    <InputForm
                                        label="Street address"
                                        name="address"
                                        type="text"
                                        register={register}
                                        error={errors.address?.message}
                                        placeholder="House number and street name"
                                        required
                                    />

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <SingleSelectForm
                                            label="Country"
                                            name="country"
                                            register={register}
                                            setValue={setValue}
                                            options={countryOptions}
                                            error={errors.country?.message}
                                            placeholder="Select country"
                                            required
                                        />

                                        <SingleSelectForm
                                            label="State"
                                            name="state"
                                            register={register}
                                            setValue={setValue}
                                            options={stateOptions}
                                            error={errors.state?.message}
                                            placeholder="Select state"
                                            required
                                            disabled={!selectedCountry}
                                        />

                                        <InputForm
                                            label="City"
                                            name="city"
                                            register={register}
                                            error={errors.city?.message}
                                            placeholder="Enter city"
                                            required
                                        />
                                    </div>

                                    {/* Shipping Information Display */}
                                    {selectedCity && shippingInfo.hasShippingRate && !shippingInfo.requiresQuote && (
                                        <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                                            <div className="flex items-start gap-3">
                                                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="font-medium text-green-900">
                                                        Delivery to {selectedCity}, {getStateName(selectedState)}
                                                    </p>
                                                    <p className="text-sm text-green-700 mt-1">
                                                        Shipping cost: {formatCurrency(shippingInfo.cost)}
                                                    </p>
                                                    <p className="text-xs text-green-600 mt-1">
                                                        Estimated delivery: 3-5 business days
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Shipping Quote Required Notice */}
                                    {selectedCity && shippingInfo.requiresQuote && (
                                        <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                                            <div className="flex items-start gap-3">
                                                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="font-medium text-blue-900">
                                                        Shipping quote required for {selectedCity}, {getStateName(selectedState)}
                                                    </p>
                                                    <p className="text-sm text-blue-700 mt-1">
                                                        We'll contact you with the exact shipping cost. You can proceed with "Pay Later" option.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Save Shipping Details */}
                                    <div className="pt-4 border-t border-gray-200">
                                        <SwitchForm
                                            control={control}
                                            name="save_delivery_details"
                                            error={errors?.save_delivery_details?.message}
                                            description="Save for faster checkout next time"
                                            label="Save shipping details"
                                        />
                                    </div>
                                </div>
                            </CheckoutFormSection>
                        )}

                        {/* Payment Method */}
                        <div className="bg-white border rounded-2xl shadow p-5">
                            <div className="flex items-center gap-3 mb-5">
                                <IconBadge color="green" size="md" icon={<CreditCard />} />
                                <h2 className="text-lg font-semibold text-gray-700">Payment Method</h2>
                            </div>

                            <CardRadioForm
                                control={control}
                                name="payment_method"
                                options={availablePaymentOptions}
                                error={errors?.payment_method?.message}
                                required
                                color="green"
                                layout="grid"
                            />

                            {/* Payment Method Notices */}
                            {isHomeDelivery && shippingInfo.hasShippingRate && (
                                <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                    <p className="text-sm text-amber-800">
                                        Pay on delivery is only available for office pickup orders
                                    </p>
                                </div>
                            )}

                            {isHomeDelivery && shippingInfo.requiresQuote && (
                                <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200 flex items-start gap-3">
                                    <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                    <div className="text-sm text-blue-800">
                                        <p className="font-medium">Shipping cost confirmation required</p>
                                        <p className="mt-1">
                                            We'll confirm exact shipping cost before delivery. Select "Pay Later" to proceed.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Submit Button */}
                        <Button
                            loading={isPending}
                            type="submit"
                            className="w-full"
                            startIcon={<Package2Icon />}
                            endIcon={<ChevronRight />}
                        >
                            <span>
                                {shippingInfo.requiresQuote
                                    ? 'Complete Order (Shipping TBD)'
                                    : `Complete Order • ${formatCurrency(calculatedValues.total)}`
                                }
                            </span>
                        </Button>
                    </form>

                    {/* Order Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <OrderSummary
                            calculatedValues={calculatedValues}
                            items={cartData?.items}
                        />
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            <PageHero
                title="Secure Checkout"
                description={getHeroDescription()}
                badge="Shop"
                breadcrumbs={[
                    { label: 'Cart', href: '/cart' },
                    { label: 'Checkout', href: '/checkout' }
                ]}
            />
            {hasIssues ? <StockAvailabilityAlert availability={cartData?.availability} /> : null}
            {renderContent()}
        </>
    );
};

export default CheckoutPageDetails;