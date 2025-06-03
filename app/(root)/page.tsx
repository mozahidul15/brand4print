import Slider from "@/app/(root)/(component)/gallary-slider";
import FeaturesSection from "@/app/(root)/(component)/features-section";
import PrintingServices from "@/app/(root)/(component)/printing-services";
import BrandFeatures from "@/app/(root)/(component)/brand-features";
import HeroSection from "@/app/(root)/(component)/hero-section";
import ProductFeatures from "@/app/(root)/(component)/product-features";
import ProductListing from "@/app/(root)/(component)/product-listing";
import Banner from "./(component)/banner";

export default function Home() {
  return (
    <div className="font-[family-name:var(--font-geist-sans)]">
      <Banner />
      <FeaturesSection />
      <Slider />
      <ProductFeatures />
      <ProductListing />
      <PrintingServices />
      <HeroSection />
      <BrandFeatures />     
      
    </div>
  );
}
