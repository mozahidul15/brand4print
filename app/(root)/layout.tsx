import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import NewsletterSignup from "./(component)/newsletter-signup";
import { CartProvider } from "@/components/cart";
import { WishlistProvider } from "@/components/wishlist";
import { AuthProvider } from "@/components/auth";
import { OrderHistoryProvider } from "@/components/order-history/order-history-context";

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <AuthProvider>
            <CartProvider>
                <WishlistProvider>
                    <OrderHistoryProvider>
                        <main className="font-work-sans">
                            <Navbar />
                            {children}
                            <div className="px-4 my-16">
                                <NewsletterSignup />
                            </div>
                            <Footer />
                        </main>
                    </OrderHistoryProvider>
                </WishlistProvider>
            </CartProvider>
        </AuthProvider>
    )
}