import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import * as THREE from 'three';

const Landing = () => {
  const canvasRef = useRef(null);
  const [calcAmount, setCalcAmount] = useState(1000);
  const [selectedPlan, setSelectedPlan] = useState('gold');

  useEffect(() => {
    // Three.js Background Animation
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current, 
      alpha: true, 
      antialias: true 
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // Create icosahedron (crystal)
    const geometry = new THREE.IcosahedronGeometry(2, 0);
    const material = new THREE.MeshStandardMaterial({
      color: 0xD4AF37,
      metalness: 1.0,
      roughness: 0.2,
      emissive: 0xD4AF37,
      emissiveIntensity: 0.2
    });
    
    const crystal = new THREE.Mesh(geometry, material);
    scene.add(crystal);
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);
    
    const pointLight1 = new THREE.PointLight(0xD4AF37, 1, 100);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0xffffff, 0.5, 100);
    pointLight2.position.set(-5, -5, -5);
    scene.add(pointLight2);
    
    camera.position.z = 5;
    
    // Animation loop
    let animationId;
    function animate() {
      animationId = requestAnimationFrame(animate);
      
      crystal.rotation.x += 0.001;
      crystal.rotation.y += 0.002;
      
      renderer.render(scene, camera);
    }
    
    animate();
    
    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  // Investment Plans Data
  const plans = {
    bronze: { name: 'Bronze', duration: 3, roi: 0.4 },
    silver: { name: 'Silver', duration: 6, roi: 0.6 },
    gold: { name: 'Gold', duration: 12, roi: 0.8 },
    platinum: { name: 'Platinum', duration: 18, roi: 1.0 },
    diamond: { name: 'Diamond', duration: 24, roi: 1.5 },
    elite: { name: 'Elite', duration: 36, roi: 2.0 }
  };

  // ROI Calculator based on selected plan
  const calculateROI = (amount, plan) => {
    const dailyRate = plans[plan].roi / 100;
    const daily = amount * dailyRate;
    const monthly = daily * 30;
    const duration = plans[plan].duration;
    const totalReturn = daily * (duration * 30);
    return { daily, monthly, totalReturn, duration };
  };

  const { daily, monthly, totalReturn, duration } = calculateROI(calcAmount, selectedPlan);

  return (
    <div className="bg-[#0B0C10] text-[#EAEAEA] overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;600&display=swap');
        
        body {
          font-family: 'Inter', sans-serif;
        }
        
        h1, h2, h3, h4, h5, h6 {
          font-family: 'Playfair Display', serif;
        }
        
        .gold-glow {
          text-shadow: 0 0 20px rgba(212, 175, 55, 0.5);
        }
        
        .glass-card {
          backdrop-filter: blur(24px);
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 1rem;
          transition: all 0.3s ease;
        }
        
        .glass-card:hover {
          transform: translateY(-6px);
          border-color: rgba(212, 175, 55, 0.6);
          box-shadow: 0 20px 40px rgba(212, 175, 55, 0.2);
        }
        
        .aurora {
          position: fixed;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 40vh;
          background: radial-gradient(ellipse at bottom, rgba(212, 175, 55, 0.15) 0%, transparent 60%);
          pointer-events: none;
          z-index: 0;
          animation: pulse 8s ease-in-out infinite;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        
        .marquee {
          animation: scroll 30s linear infinite;
        }
        
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        
        .gold-button {
          background: linear-gradient(135deg, #D4AF37 0%, #B8941F 100%);
          color: #0B0C10;
          font-weight: 600;
          padding: 0.75rem 2rem;
          border-radius: 0.5rem;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(212, 175, 55, 0.4);
          display: inline-block;
          text-decoration: none;
        }
        
        .gold-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(212, 175, 55, 0.6);
        }
        
        .outline-button {
          border: 2px solid #EAEAEA;
          color: #EAEAEA;
          padding: 0.75rem 2rem;
          border-radius: 0.5rem;
          transition: all 0.3s ease;
          background: transparent;
          display: inline-block;
          text-decoration: none;
        }
        
        .outline-button:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: #D4AF37;
          color: #D4AF37;
        }
        
        .timeline-step {
          position: relative;
          padding-left: 3rem;
        }
        
        .timeline-step::before {
          content: '';
          position: absolute;
          left: 0.75rem;
          top: 2.5rem;
          width: 2px;
          height: calc(100% + 2rem);
          background: linear-gradient(180deg, #D4AF37 0%, transparent 100%);
        }
        
        .timeline-step:last-child::before {
          display: none;
        }
        
        .pulse-glow {
          animation: pulse-animation 2s ease-in-out infinite;
        }
        
        @keyframes pulse-animation {
          0%, 100% {
            box-shadow: 0 0 20px rgba(212, 175, 55, 0.4);
          }
          50% {
            box-shadow: 0 0 40px rgba(212, 175, 55, 0.8);
          }
        }
        
        #three-canvas {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
        }
        
        .layer-card {
          background-size: cover;
          background-position: center;
          position: relative;
          overflow: hidden;
        }
        
        .layer-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(180deg, rgba(11, 12, 16, 0.7) 0%, rgba(11, 12, 16, 0.95) 100%);
        }
        
        .layer-card-content {
          position: relative;
          z-index: 1;
        }
      `}</style>

      {/* Three.js Canvas Background */}
      <canvas ref={canvasRef} id="three-canvas"></canvas>
      <div className="aurora"></div>
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/50 border-b border-white/10">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold gold-glow" style={{color: '#D4AF37'}}>CREDON</h1>
          <Link to="/login" className="gold-button">Enter the Vault</Link>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center px-6 pt-20 relative z-10">
        <h2 className="text-5xl md:text-7xl font-bold mb-6 gold-glow" style={{color: '#D4AF37'}}>
          Invest Intelligently.<br/>Grow Consistently.
        </h2>
        <p className="text-xl md:text-2xl mb-12 max-w-3xl text-gray-300">
          The next evolution of decentralized investment — simple, transparent, and rewarding.
        </p>
        <div className="flex gap-4 flex-wrap justify-center">
          <Link to="/register" className="gold-button">Start Investing</Link>
          <a href="#plans" className="outline-button">Explore Plans</a>
        </div>
      </section>
      
      {/* Ticker Section */}
      <section className="py-8 overflow-hidden bg-gradient-to-r from-black/80 via-gray-900/80 to-black/80 border-y border-white/10 relative z-10">
        <div className="marquee flex gap-12 whitespace-nowrap">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex gap-12">
              <span className="flex items-center gap-2">● Total Payouts: <span className="text-green-400 font-bold">$1,254,200</span></span>
              <span className="flex items-center gap-2">● Active Users: <span className="text-green-400 font-bold">12,340</span></span>
              <span className="flex items-center gap-2">● Daily Yield Avg: <span className="text-green-400 font-bold">1.2%</span></span>
            </div>
          ))}
        </div>
      </section>
      
      {/* Journey Section */}
      <section className="py-24 px-6 relative z-10">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16" style={{color: '#D4AF37'}}>
            Your Path to Growth
          </h2>
          <div className="space-y-8">
            {[
              { num: 1, title: 'Create Your Account', desc: 'Sign up in seconds with just your email. No complex forms.' },
              { num: 2, title: 'Deposit Funds', desc: 'Add US Dollar Tether securely to your wallet.' },
              { num: 3, title: 'Activate a Plan', desc: 'Choose from 6 fixed-term investment plans.' },
              { num: 4, title: 'Earn Daily Returns', desc: 'Watch your investment grow with daily ROI calculations and weekly withdrawals.' }
            ].map((step) => (
              <div key={step.num} className="timeline-step">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-black font-bold flex-shrink-0">
                    {step.num}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{step.title}</h3>
                    <p className="text-gray-400">{step.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Simple Explanation Section - Financial Skyscraper */}
      <section className="py-24 px-6 bg-black/20 relative z-10">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-6" style={{color: '#D4AF37'}}>
            How Credon Works
          </h2>
          <p className="text-xl text-center text-gray-400 mb-16 max-w-3xl mx-auto">
            The Simple Explanation
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-card p-8">
              <div className="text-5xl mb-4">🏗️</div>
              <h3 className="text-2xl font-bold mb-4" style={{color: '#D4AF37'}}>1. The Foundation</h3>
              <p className="text-lg font-semibold mb-2">Earth Layer</p>
              <p className="text-gray-400">Like the ground floor of a skyscraper, this is the solid base. We invest in real-world assets that generate steady, reliable income.</p>
            </div>
            
            <div className="glass-card p-8">
              <div className="text-5xl mb-4">🏢</div>
              <h3 className="text-2xl font-bold mb-4" style={{color: '#D4AF37'}}>2. The Main Floors</h3>
              <p className="text-lg font-semibold mb-2">Status Layer</p>
              <p className="text-gray-400">The middle floors hold valuable assets that appreciate over time. Think legendary items that become more precious as years pass.</p>
            </div>
            
            <div className="glass-card p-8">
              <div className="text-5xl mb-4">🚀</div>
              <h3 className="text-2xl font-bold mb-4" style={{color: '#D4AF37'}}>3. The Penthouse Lab</h3>
              <p className="text-lg font-semibold mb-2">Future Layer</p>
              <p className="text-gray-400">The top floor where innovation happens. High-risk, high-reward investments in cutting-edge technology and frontier markets.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Professional Explanation Section - Portfolio of Substance */}
      <section className="py-24 px-6 relative z-10">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-6" style={{color: '#D4AF37'}}>
            A Portfolio of Substance
          </h2>
          <p className="text-xl text-center text-gray-400 mb-16 max-w-3xl mx-auto">
            Your returns are generated through a diversified, three-layer investment strategy
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Earth Layer */}
            <div 
              className="layer-card glass-card p-8 min-h-[400px] flex flex-col justify-end"
              style={{
                backgroundImage: 'url(https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop)'
              }}
            >
              <div className="layer-card-content">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-4">
                  <span className="text-2xl">🌍</span>
                </div>
                <h3 className="text-2xl font-bold mb-3" style={{color: '#D4AF37'}}>The Earth Layer</h3>
                <p className="text-sm text-gray-400 mb-2 font-semibold">For Consistent Yield</p>
                <p className="text-gray-300">Stable, income-producing assets like real estate and sustainable energy projects. These generate consistent, real-world cash flow distributed as daily yield.</p>
              </div>
            </div>
            
            {/* Status Layer */}
            <div 
              className="layer-card glass-card p-8 min-h-[400px] flex flex-col justify-end"
              style={{
                backgroundImage: 'url(https://images.unsplash.com/photo-1563298723-dcfebaa392e3?w=800&h=600&fit=crop)'
              }}
            >
              <div className="layer-card-content">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mb-4">
                  <span className="text-2xl">👑</span>
                </div>
                <h3 className="text-2xl font-bold mb-3" style={{color: '#D4AF37'}}>The Status Layer</h3>
                <p className="text-sm text-gray-400 mb-2 font-semibold">For Value Appreciation</p>
                <p className="text-gray-300">Cultural icons and trophy assets that appreciate over time. Legendary supercars, fine art, and rare luxury watches that become more valuable.</p>
              </div>
            </div>
            
            {/* Future Layer */}
            <div 
              className="layer-card glass-card p-8 min-h-[400px] flex flex-col justify-end"
              style={{
                backgroundImage: 'url(https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop)'
              }}
            >
              <div className="layer-card-content">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center mb-4">
                  <span className="text-2xl">🔮</span>
                </div>
                <h3 className="text-2xl font-bold mb-3" style={{color: '#D4AF37'}}>The Future Layer</h3>
                <p className="text-sm text-gray-400 mb-2 font-semibold">For High Growth</p>
                <p className="text-gray-300">High-risk, high-reward frontier ventures. AI royalties, tokenized carbon credits, and space technology investments for exponential growth potential.</p>
              </div>
            </div>
          </div>
          
          <div className="mt-12 glass-card p-6 max-w-4xl mx-auto">
            <p className="text-center text-gray-300">
              <span className="font-bold" style={{color: '#D4AF37'}}>The Strategy:</span> Combine stable daily income from the Earth Layer with long-term appreciation from Status Layer assets and high-growth potential from Future Layer investments. Your returns represent a calculated blend of all three layers.
            </p>
          </div>
        </div>
      </section>
      
      {/* Investment Plans Section */}
      <section id="plans" className="py-24 px-6 bg-black/20 relative z-10">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16" style={{color: '#D4AF37'}}>
            Our Fixed-Term Plans
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: 'Bronze', duration: '3 Months', roi: '0.4%', totalYield: '36%', min: '$100', popular: false, key: 'bronze' },
              { name: 'Silver', duration: '6 Months', roi: '0.6%', totalYield: '108%', min: '$500', popular: false, key: 'silver' },
              { name: 'Gold', duration: '12 Months', roi: '0.8%', totalYield: '288%', min: '$1,000', popular: true, key: 'gold' },
              { name: 'Platinum', duration: '18 Months', roi: '1.0%', totalYield: '540%', min: '$2,500', popular: false, key: 'platinum' },
              { name: 'Diamond', duration: '24 Months', roi: '1.5%', totalYield: '1080%', min: '$5,000', popular: false, key: 'diamond' },
              { name: 'Elite', duration: '36 Months', roi: '2.0%', totalYield: '2160%', min: '$10,000', popular: false, key: 'elite' }
            ].map((plan) => (
              <div key={plan.name} className={`glass-card p-8 relative ${plan.popular ? 'border-2' : ''}`} style={plan.popular ? {borderColor: '#D4AF37'} : {}}>
                {plan.popular && (
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black text-xs font-bold px-3 py-1 rounded-full">
                    POPULAR
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-3xl font-bold mb-2" style={plan.popular ? {color: '#D4AF37'} : {}}>{plan.name}</h3>
                  <div className="text-gray-400 mb-4">{plan.duration}</div>
                  <div className="text-5xl font-bold mb-2" style={{color: '#D4AF37'}}>{plan.roi}</div>
                  <div className="text-sm text-gray-400">Daily ROI</div>
                </div>
                <div className="space-y-2 mb-6 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Yield:</span>
                    <span className="font-bold" style={{color: '#00C46C'}}>{plan.totalYield}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Min Investment:</span>
                    <span className="font-bold">{plan.min}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Duration:</span>
                    <span className="font-bold">{plan.duration}</span>
                  </div>
                </div>
                <Link to="/register" className="gold-button w-full text-center block">Select Plan</Link>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Calculator Section */}
      <section className="py-24 px-6 relative z-10">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16" style={{color: '#D4AF37'}}>
            Visualize Your Growth
          </h2>
          <div className="glass-card p-8 md:p-12">
            <div className="mb-8">
              <label className="block text-lg mb-4">Enter your investment ($)</label>
              <input 
                type="number" 
                value={calcAmount}
                onChange={(e) => setCalcAmount(Math.max(100, parseFloat(e.target.value) || 100))}
                min="100" 
                className="w-full p-4 bg-black/30 border border-white/20 rounded-lg text-white text-2xl focus:border-yellow-400 focus:outline-none"
              />
            </div>
            
            <div className="mb-8">
              <label className="block text-lg mb-4">Select Plan</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.keys(plans).map((key) => (
                  <button
                    key={key}
                    onClick={() => setSelectedPlan(key)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      selectedPlan === key 
                        ? 'border-yellow-400 bg-yellow-400/10' 
                        : 'border-white/20 bg-black/20 hover:border-white/40'
                    }`}
                  >
                    <div className="font-bold">{plans[key].name}</div>
                    <div className="text-xs text-gray-400">{plans[key].roi}% daily</div>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 bg-black/30 rounded-lg">
                <div className="text-gray-400 mb-2">Daily Profit</div>
                <div className="text-3xl font-bold" style={{color: '#00C46C'}}>${daily.toFixed(2)}</div>
              </div>
              <div className="text-center p-6 bg-black/30 rounded-lg">
                <div className="text-gray-400 mb-2">Monthly Profit</div>
                <div className="text-3xl font-bold" style={{color: '#00C46C'}}>${monthly.toFixed(2)}</div>
              </div>
              <div className="text-center p-6 bg-black/30 rounded-lg">
                <div className="text-gray-400 mb-2">Total Return ({duration} months)</div>
                <div className="text-3xl font-bold" style={{color: '#00C46C'}}>${totalReturn.toFixed(2)}</div>
              </div>
            </div>
            <div className="text-sm text-gray-500 text-center">
              Returns are calculated based on the {plans[selectedPlan].name} plan ({plans[selectedPlan].roi}% daily for {duration} months). Your principal remains locked until maturity, and you can withdraw weekly interest.
            </div>
          </div>
        </div>
      </section>
      
      {/* Referral Section */}
      <section className="py-24 px-6 bg-black/20 relative z-10">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-8xl mb-8">🤝</div>
            </div>
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{color: '#D4AF37'}}>
                3-Level Referral Program
              </h2>
              <p className="text-xl text-gray-400 mb-8">
                Earn from your network across three levels of referrals. Build a passive income stream instantly in US Dollar Tether.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-4 glass-card p-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-xl">
                    20%
                  </div>
                  <div>
                    <div className="font-bold">Level 1 - Direct Referrals</div>
                    <div className="text-sm text-gray-400">Earn 20% from your direct invites</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 glass-card p-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white font-bold text-xl">
                    15%
                  </div>
                  <div>
                    <div className="font-bold">Level 2 - Second Tier</div>
                    <div className="text-sm text-gray-400">Earn 15% from their referrals</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 glass-card p-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold text-xl">
                    10%
                  </div>
                  <div>
                    <div className="font-bold">Level 3 - Third Tier</div>
                    <div className="text-sm text-gray-400">Earn 10% from the extended network</div>
                  </div>
                </div>
              </div>
              <Link to="/register" className="gold-button">Get Started</Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Trust Section */}
      <section className="py-24 px-6 relative z-10">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16" style={{color: '#D4AF37'}}>
            Foundation of Trust
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '🔒', title: 'Audited & Secure', desc: 'Multi-layered security protocols ensure your funds are always protected with industry-leading standards.' },
              { icon: '📊', title: 'Transparent Operations', desc: 'Full visibility into our three-layer investment strategy. Real portfolio, real returns, real transparency.' },
              { icon: '🌱', title: 'Sustainable Growth', desc: 'Diversified portfolio across Earth, Status, and Future layers ensures long-term platform stability.' }
            ].map((item, i) => (
              <div key={i} className="glass-card p-8 text-center">
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Roadmap Section */}
      <section className="py-24 px-6 bg-black/20 relative z-10">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16" style={{color: '#D4AF37'}}>
            Roadmap
          </h2>
          <div className="space-y-8">
            {[
              { quarter: 'Q4 2024', title: 'Platform Launch', desc: 'Initial release with 6 investment plans and three-layer portfolio strategy.' },
              { quarter: 'Q1 2025', title: 'Web3 Integration', desc: 'Wallet connect, multi-chain support, and decentralized governance for Earth Layer assets.' },
              { quarter: 'Q2 2025', title: 'Portfolio Expansion', desc: 'Expand Status Layer with curated trophy assets and increase Future Layer AI investments.' },
              { quarter: 'Q3 2025', title: 'Global Expansion', desc: 'Multi-language support, institutional partnerships, and tokenized asset marketplace.' }
            ].map((item, i) => (
              <div key={i} className="flex gap-6">
                <div className="text-2xl font-bold" style={{color: '#D4AF37'}}>{item.quarter}</div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Final CTA */}
      <section className="py-24 px-6 text-center relative z-10">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-4xl md:text-6xl font-bold mb-8 gold-glow" style={{color: '#D4AF37'}}>
            The Future of Wealth Begins Here
          </h2>
          <Link to="/login" className="gold-button pulse-glow text-xl px-12 py-4">Enter the Vault</Link>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="border-t border-white/10 py-8 backdrop-blur-md bg-black/50 relative z-10">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500">&copy; 2025 Credon Protocol. All Rights Reserved.</p>
            <div className="flex items-center gap-6">
              <Link to="/announcements" className="text-gray-500 hover:text-yellow-400 transition-colors text-sm">
                Announcements
              </Link>
              <Link to="/about" className="text-gray-500 hover:text-yellow-400 transition-colors text-sm">
                About Us
              </Link>
              <Link to="/legal" className="text-gray-500 hover:text-yellow-400 transition-colors text-sm">
                Legal & Terms
              </Link>
              <Link to="/admin" className="text-gray-500 hover:text-yellow-400 transition-colors text-sm">
                Admin
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
