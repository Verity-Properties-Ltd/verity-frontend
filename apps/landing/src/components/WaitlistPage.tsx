import Navbar from './Navbar';
import Hero from './Hero';
import Footer from './Footer';
import TwoPaths from './TwoPaths';
import WhyUs from './Whyus';
import WaitlistForm from './WaitlistForm';

export default function WaitlistPage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <TwoPaths />
        <WhyUs />
        <WaitlistForm />
      </main>
      <Footer />
    </>
  );
}
