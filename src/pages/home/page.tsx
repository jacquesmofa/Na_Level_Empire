import HeroSection from './components/HeroSection';
import ServicesStrip from './components/ServicesStrip';
import ImpactBand from './components/ImpactBand';
import LatestWork from './components/LatestWork';

export default function Home() {
  return (
    <main className="min-h-screen" style={{ background: '#2C2C2E', color: '#FDFCF0' }}>
      <HeroSection />
      <ServicesStrip />
      <ImpactBand />
      <LatestWork />
    </main>
  );
}
