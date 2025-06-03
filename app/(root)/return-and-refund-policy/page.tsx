import React from 'react';

const ReturnAndRefundPolicyPage = () => {
    return (
        <div className="bg-white min-h-screen flex flex-col">
            <main className="flex-1 w-full max-w-7xl mx-auto px-2 md:px-8 py-8">
                <h2 className="text-base font-semibold mb-2">Return and Refund Policy</h2>
                <div className="space-y-6 text-sm">
                    <section>
                        <p>At Brand4Print, customer satisfaction is our top priority. If you are not entirely satisfied with your purchase, we’re here to help.</p>
                    </section>
                    <section>
                        <h3 className="font-bold mb-2">Return Conditions:</h3>
                        <ul className="list-disc ml-6 space-y-1">
                            <li>Products must be returned in their original condition, unused, and in the original packaging. Please inspect your purchase upon receipt and contact us immediately if the item is defective, damaged, or if you receive the wrong item.</li>
                            <li>Return requests must be made within 14 days of the delivery date. After this period, unfortunately, we cannot offer you a refund or exchange.</li>
                            <li>Personalized or custom orders are non-refundable unless there is a manufacturing defect or the product does not match the order.</li>
                        </ul>
                    </section>
                    <section>
                        <h3 className="font-bold mb-2">Return Process:</h3>
                        <ul className="list-disc ml-6 space-y-1">
                            <li>To initiate a return, please email us at <a href="mailto:info@brand4print.co.uk" className="text-[#7000fe] underline">info@brand4print.co.uk</a> or use the contact form on our website. Once your return request is received and approved, we will provide you with further instructions on how to proceed with your return.</li>
                            <li>Upon receipt of the returned item, we will inspect it and notify you of the status of your refund. If your return is approved, we will initiate a refund to your original method of payment within 14 business days.</li>
                            <li>Return shipping costs are the responsibility of the customer, except in cases where the return is due to a manufacturing defect or an error on our part.</li>
                        </ul>
                    </section>
                    <section>
                        <h3 className="font-bold mb-2">Contact Us:</h3>
                        <p>If you have any questions about our return and refund policy, please don’t hesitate to contact us.</p>
                        <div className="mt-2">
                            <div><b>Brand4Print Returns Department</b></div>
                            <div>Address: Unit 7, Rear of 151, Hertford Road, EN3 5JG</div>
                            <div>Email: <a href="mailto:info@brand4print.co.uk" className="text-[#7000fe] underline">info@brand4print.co.uk</a></div>
                            <div>Phone: <a href="tel:+442033029730" className="text-[#7000fe] underline">+44 20 3302 9730</a></div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default ReturnAndRefundPolicyPage;