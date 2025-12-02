'use client'

import React from 'react'
import Button from '../ui/Button';
import { ArrowRight, Headphones, ShoppingBag } from 'lucide-react';

const CTASection = () => (
    <div className="my-16 text-center">
        <div className="bg-[url('/images/bg/product-bg.jpg')] bg-cover bg-center rounded-3xl p-8 lg:p-12 shadow relative overflow-hidden">
            <div className="relative z-10 space-y-6">
                <h3 className="text-3xl lg:text-4xl font-bold text-gray-700">
                    Start Ordering Farm Supplies Today
                </h3>
                <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                    Join thousands of Nigerian farmers who buy quality agricultural products from our trusted platform
                </p>
                <div className="max-w-sm mx-auto flex flex-col w-fit sm:flex-row gap-4 justify-center items-center pt-4">
                    <Button
                        href="/products"
                        color='red'
                        variant='solid'
                        startIcon={<ShoppingBag />}
                        endIcon={<ArrowRight />}
                    >
                        <span>Shop Products</span>
                    </Button>

                    <Button
                        startIcon={<Headphones />}
                        endIcon={<ArrowRight />}
                        href="/contact"
                        variant='outline'
                        color='red'
                    >
                        <span>Contact Expert</span>
                    </Button>
                </div>
            </div>
        </div>
    </div>
);

export default CTASection