"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from "@/components/ui/accordion";

const ServicesPage = () => {

    return (
        <div className="bg-white min-h-screen">
            {/* Hero Section */}
            <section className="py-16 md:py-20 px-4 text-center bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-[#7000fe] uppercase tracking-wider text-sm font-medium mb-4">ABOUT PRINTING SERVICE</div>
                    <h1 className="mb-2 text-3xl md:text-5xl font-bold">
                        Special Stunning <span className="text-[#7000fe]">Services</span>
                    </h1>
                    <h2 className="mb-8 text-3xl md:text-4xl font-bold text-[#7000fe]">
                        For Your Business
                    </h2>
                    <p className="max-w-3xl mx-auto text-gray-600">
                        We have all the equipment, know-how and every thing you will need to receive fast, reliable printing services with high quality results. Chat live with us today to get things moving.
                    </p>
                </div>
            </section>

            {/* Services Grid */}
            <section className="py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">                        {/* Service Card 1 */}
                        <div className="text-center">
                            <div className="flex justify-center mb-6">                                <div className="w-[150px] h-[150px] bg-gray-50 rounded-full flex items-center justify-center shadow-sm">
                                <Image
                                    src="/icons/services/printing-service.svg"
                                    alt="Printing Services"
                                    width={80}
                                    height={80}
                                    className="object-contain"
                                />
                            </div>
                            </div>
                            <h3 className="text-xl font-bold mb-4">Printing services</h3>
                            <p className="text-gray-600 text-sm mb-4">
                                If you need print design concepts that will make your project shine, then it&apos;s worth investing in a quality graphic designer.
                            </p>
                        </div>

                        {/* Service Card 2 */}
                        <div className="text-center">
                            <div className="flex justify-center mb-6">                                <div className="w-[150px] h-[150px] bg-gray-50 rounded-full flex items-center justify-center shadow-sm">
                                <Image
                                    src="/icons/services/banner-design.svg"
                                    alt="Banner Design & Printing"
                                    width={80}
                                    height={80}
                                    className="object-contain"
                                />
                            </div>
                            </div>
                            <h3 className="text-xl font-bold mb-4">Banner Design & Printing</h3>
                            <p className="text-gray-600 text-sm mb-4">
                                If you need print design concepts that will make your project shine, then it&apos;s worth investing in a quality graphic designer.
                            </p>
                        </div>

                        {/* Service Card 3 */}
                        <div className="text-center">
                            <div className="flex justify-center mb-6">                                <div className="w-[150px] h-[150px] bg-gray-50 rounded-full flex items-center justify-center shadow-sm">
                                <Image
                                    src="/icons/services/book-cover.svg"
                                    alt="Book Cover Printing"
                                    width={80}
                                    height={80}
                                    className="object-contain"
                                />
                            </div>
                            </div>
                            <h3 className="text-xl font-bold mb-4">Book Cover Printing</h3>
                            <p className="text-gray-600 text-sm mb-4">
                                If you need book cover design concepts that will make your project shine, then it&apos;s worth investing in a quality graphic designer.
                            </p>
                        </div>

                        {/* Service Card 4 */}
                        <div className="text-center">
                            <div className="flex justify-center mb-6">                                <div className="w-[150px] h-[150px] bg-gray-50 rounded-full flex items-center justify-center shadow-sm">
                                <Image
                                    src="/icons/services/design-services.svg"
                                    alt="Design Services"
                                    width={80}
                                    height={80}
                                    className="object-contain"
                                />
                            </div>
                            </div>
                            <h3 className="text-xl font-bold mb-4">Design Services</h3>
                            <p className="text-gray-600 text-sm mb-4">
                                If you need design concepts that will make your project shine, then it&apos;s worth investing in a quality graphic designer.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            {/* Quality Printing Section */}
            <section className="py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-14">
                        <h2 className="mb-1 text-3xl md:text-4xl font-bold">
                            <span className="text-[#7000fe]">Quality printing</span> and outstanding
                        </h2>
                        <h3 className="mb-6 text-3xl md:text-4xl font-bold">
                            customer service
                        </h3>
                        <p className="max-w-3xl mx-auto text-gray-600">
                            The educational printing services offered by Print Design make us one of the most trusted and sought-after graphic design and printing companies around.
                        </p>
                    </div>

                    {/* Accordions with Shadcn */}
                    <div className="max-w-5xl mx-auto">
                        <Accordion type="single" collapsible className="bg-white w-full rounded-lg overflow-hidden shadow-sm">
                            <AccordionItem value="item-1" className="border-b border-gray-200">
                                <div className="grid grid-cols-1 md:grid-cols-4">
                                    <div className="bg-gray-50 p-6 flex items-center justify-center">
                                        <Image
                                            src="/icons/services/printing-service-flat.svg"
                                            alt="Printing Services"
                                            width={60}
                                            height={60}
                                            className="object-contain"
                                        />
                                    </div>
                                    <div className="col-span-3">
                                        <AccordionTrigger className="px-6 hover:no-underline font-semibold">
                                            Printing Services
                                        </AccordionTrigger>
                                        <AccordionContent className="px-6">
                                            <p className="text-gray-600">
                                                If you need print design concepts that will make your project shine, then it&apos;s worth investing in a quality graphic designer.
                                            </p>
                                        </AccordionContent>
                                    </div>
                                </div>
                            </AccordionItem>

                            <AccordionItem value="item-2" className="border-b border-gray-200">
                                <div className="grid grid-cols-1 md:grid-cols-4">
                                    <div className="bg-gray-50 p-6 flex items-center justify-center">
                                        <Image
                                            src="/icons/services/banner-design-flat.svg"
                                            alt="Banner Design & Printing"
                                            width={60}
                                            height={60}
                                            className="object-contain"
                                        />
                                    </div>
                                    <div className="col-span-3">
                                        <AccordionTrigger className="px-6 hover:no-underline font-semibold">
                                            Banner Design & Printing
                                        </AccordionTrigger>
                                        <AccordionContent className="px-6">
                                            <p className="text-gray-600">
                                                We provide full banner design and printing services, perfect for events, promotions, and business branding.
                                            </p>
                                        </AccordionContent>
                                    </div>
                                </div>
                            </AccordionItem>

                            <AccordionItem value="item-3" className="border-b border-gray-200">
                                <div className="grid grid-cols-1 md:grid-cols-4">
                                    <div className="bg-gray-50 p-6 flex items-center justify-center">
                                        <Image
                                            src="/icons/services/book-cover-flat.svg"
                                            alt="Book Cover Printing"
                                            width={60}
                                            height={60}
                                            className="object-contain"
                                        />
                                    </div>
                                    <div className="col-span-3">
                                        <AccordionTrigger className="px-6 hover:no-underline font-semibold">
                                            Book Cover Printing
                                        </AccordionTrigger>
                                        <AccordionContent className="px-6">
                                            <p className="text-gray-600">
                                                Professional book cover printing with a variety of finishes and materials to choose from.
                                            </p>
                                        </AccordionContent>
                                    </div>
                                </div>
                            </AccordionItem>

                            <AccordionItem value="item-4" className="border-b-0">
                                <div className="grid grid-cols-1 md:grid-cols-4">
                                    <div className="bg-gray-50 p-6 flex items-center justify-center">
                                        <Image
                                            src="/icons/services/design-services-flat.svg"
                                            alt="Design Services"
                                            width={60}
                                            height={60}
                                            className="object-contain"
                                        />
                                    </div>
                                    <div className="col-span-3">
                                        <AccordionTrigger className="px-6 hover:no-underline font-semibold">
                                            Design Services
                                        </AccordionTrigger>
                                        <AccordionContent className="px-6">
                                            <p className="text-gray-600">
                                                Our professional design services ensure your printed materials look stunning and represent your brand perfectly.
                                            </p>
                                        </AccordionContent>
                                    </div>
                                </div>
                            </AccordionItem>
                        </Accordion>
                    </div>
                </div>
            </section>            {/* Features Section */}
            <section className="py-16 px-4 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-[#7000fe] mb-2 uppercase font-medium text-sm text-center">FEATURE RICH</div>
                    <h2 className="mb-4 text-3xl md:text-4xl font-bold text-center">
                        What makes <span className="text-[#7000fe]">Printec</span> stand out
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto text-center mb-16">
                        Customized prints at all levels, good price to get started, and experienced staff who are here to help you at every step.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                        {/* Feature 1 */}
                        <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                            <div className="flex items-center mb-6">
                                <div className="mr-4">
                                    <Image
                                        src="/icons/features/local-fulfillment.svg"
                                        alt="Local fulfillment"
                                        width={80}
                                        height={80}
                                        className="object-contain"
                                    />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-1">Local fulfillment</h3>
                                    <div className="w-16 h-1 bg-[#7000fe] rounded-full"></div>
                                </div>
                            </div>
                            <p className="text-gray-600">
                                Get speed and convenience—our modern print equipment gives you quick turnaround times and consistent quality for all your printing needs.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                            <div className="flex items-center mb-6">
                                <div className="mr-4">
                                    <Image
                                        src="/icons/features/reliable-quality.svg"
                                        alt="Reliable quality"
                                        width={80}
                                        height={80}
                                        className="object-contain"
                                    />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-1">Reliable quality</h3>
                                    <div className="w-16 h-1 bg-[#7000fe] rounded-full"></div>
                                </div>
                            </div>
                            <p className="text-gray-600">
                                Enjoy a factory experience with equipment that delivers consistent, high-end premium materials. We&apos;re confident you&apos;ll love the results.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                            <div className="flex items-center mb-6">
                                <div className="mr-4">
                                    <Image
                                        src="/icons/features/smooth-automation.svg"
                                        alt="Smooth automation"
                                        width={80}
                                        height={80}
                                        className="object-contain"
                                    />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-1">Smooth automation</h3>
                                    <div className="w-16 h-1 bg-[#7000fe] rounded-full"></div>
                                </div>
                            </div>
                            <p className="text-gray-600">
                                When customers buy from you, we process orders automatically, so you can focus on growing your business without workflow interruptions.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Feature 4 */}
                        <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                            <div className="flex items-center mb-6">
                                <div className="mr-4">
                                    <Image
                                        src="/icons/features/custom-branding.svg"
                                        alt="Custom branding tools"
                                        width={80}
                                        height={80}
                                        className="object-contain"
                                    />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-1">Custom branding</h3>
                                    <div className="w-16 h-1 bg-[#7000fe] rounded-full"></div>
                                </div>
                            </div>
                            <p className="text-gray-600">
                                Add your brand to the platform—select a white-label portal, or create custom-branded invoices attached to your printed products.
                            </p>
                        </div>

                        {/* Feature 5 */}
                        <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                            <div className="flex items-center mb-6">
                                <div className="mr-4">
                                    <Image
                                        src="/icons/features/intuitive-design.svg"
                                        alt="Intuitive design tools"
                                        width={80}
                                        height={80}
                                        className="object-contain"
                                    />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-1">Intuitive design</h3>
                                    <div className="w-16 h-1 bg-[#7000fe] rounded-full"></div>
                                </div>
                            </div>
                            <p className="text-gray-600">
                                Take advantage of our design tools even with no design experience! Brand all your products with just a few clicks—our features make it seamless.
                            </p>
                        </div>

                        {/* Feature 6 */}
                        <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                            <div className="flex items-center mb-6">
                                <div className="mr-4">
                                    <Image
                                        src="/icons/features/no-order-minimums.svg"
                                        alt="No order minimums"
                                        width={80}
                                        height={80}
                                        className="object-contain"
                                    />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-1">No minimums</h3>
                                    <div className="w-16 h-1 bg-[#7000fe] rounded-full"></div>
                                </div>
                            </div>
                            <p className="text-gray-600">
                                Order products exactly how you want them—even just one piece. Products you sell are ordered one at a time with your customer placed in the production queue.
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-center mt-12">
                        <Link href="/features">
                            <button className="bg-[#7000fe] hover:bg-purple-800 text-white font-semibold py-3 px-6 rounded-full transition-colors duration-300">
                                View All Features
                            </button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Packaging Services Section */}
            <section className="py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center">
                        <div className="text-[#7000fe] uppercase tracking-wider text-sm font-medium mb-4">CUSTOM BOXES</div>
                        <h2 className="mb-6 text-3xl md:text-4xl font-bold">
                            Fast & reliable
                            <br />
                            <span className="text-[#7000fe]">packaging</span> services
                        </h2>
                        <p className="max-w-2xl mx-auto text-gray-600 mb-8">
                            Printec offers a variety of custom packaging solutions and project creation services with stunning printing on demand you&apos;ll love.
                        </p>
                    </div>                    {/* Features Icons */}
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-16">
                        <div className="text-center py-8 px-4 border rounded-md hover:shadow-md transition-shadow duration-300">
                            <div className="flex justify-center mb-4">
                                <Image
                                    src="/icons/packaging/pricing.svg"
                                    alt="Affordable Pricing"
                                    width={60}
                                    height={60}
                                    className="object-contain"
                                />
                            </div>
                            <div className="font-semibold">STARTING FROM</div>
                            <div className="text-xl font-bold">£100 BOXES</div>
                        </div>
                        <div className="text-center py-8 px-4 border rounded-md hover:shadow-md transition-shadow duration-300">
                            <div className="flex justify-center mb-4">
                                <Image
                                    src="/icons/packaging/turnaround.svg"
                                    alt="Turnaround Time"
                                    width={60}
                                    height={60}
                                    className="object-contain"
                                />
                            </div>
                            <div className="font-semibold">15 BUSINESS DAY</div>
                            <div className="text-xl font-bold">TURNAROUND</div>
                        </div>
                        <div className="text-center py-8 px-4 border rounded-md hover:shadow-md transition-shadow duration-300">
                            <div className="flex justify-center mb-4">
                                <Image
                                    src="/icons/packaging/custom-design.svg"
                                    alt="Free Custom Design"
                                    width={60}
                                    height={60}
                                    className="object-contain"
                                />
                            </div>
                            <div className="font-semibold">FREE CUSTOM</div>
                            <div className="text-xl font-bold">DESIGNING</div>
                        </div>
                        <div className="text-center py-8 px-4 border rounded-md hover:shadow-md transition-shadow duration-300">
                            <div className="flex justify-center mb-4">
                                <Image
                                    src="/icons/packaging/competitive-pricing.svg"
                                    alt="Competitive Pricing"
                                    width={60}
                                    height={60}
                                    className="object-contain"
                                />
                            </div>
                            <div className="font-semibold">BEST AND COMPETITIVE</div>
                            <div className="text-xl font-bold">PRICING</div>
                        </div>
                        <div className="text-center py-8 px-4 border rounded-md hover:shadow-md transition-shadow duration-300">
                            <div className="flex justify-center mb-4">
                                <Image
                                    src="/icons/packaging/quality-printing.svg"
                                    alt="High Quality Printing"
                                    width={60}
                                    height={60}
                                    className="object-contain"
                                />
                            </div>
                            <div className="font-semibold">HIGH QUALITY OFFSET</div>
                            <div className="text-xl font-bold">PRINTING</div>
                        </div>
                        <div className="text-center py-8 px-4 border rounded-md hover:shadow-md transition-shadow duration-300">
                            <div className="flex justify-center mb-4">
                                <Image
                                    src="/icons/packaging/low-minimums.svg"
                                    alt="Low Minimum Orders"
                                    width={60}
                                    height={60}
                                    className="object-contain"
                                />
                            </div>
                            <div className="font-semibold">LOW MINIMUMS</div>
                            <div className="text-xl font-bold">ORDERS</div>
                        </div>
                    </div>




                </div>
            </section>


        </div>
    );
};

export default ServicesPage;